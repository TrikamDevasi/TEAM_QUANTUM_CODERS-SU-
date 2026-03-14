import { v4 as uuid } from 'uuid';
import type { Assignment, ProjectEval, PracticalExam, EmployerFeedback, SkillAssessment } from '../models/DataCollection.model';
import { CreateAssignmentSchema } from '../models/DataCollection.model';

/* ─── In-Memory Storage (replace with DB in production) ─── */
const assignments: Assignment[] = [];
const projects: ProjectEval[] = [];
const practicalExams: PracticalExam[] = [];
const employerFeedbacks: EmployerFeedback[] = [];
const skillAssessments: SkillAssessment[] = [];

/* ─── Assignment Service ─── */
export const AssignmentService = {
    getAll: () => assignments,
    getByStudent: (studentId: string) => assignments.filter(a => a.studentId === studentId),
    getById: (id: string) => assignments.find(a => a.id === id),
    create: (data: Omit<Assignment, 'id' | 'submittedAt'>) => {
        const item: Assignment = { ...data, id: `ASG${uuid().slice(0, 6).toUpperCase()}`, submittedAt: new Date().toISOString() };
        assignments.push(item);
        return item;
    },
    update: (id: string, data: Partial<Assignment>) => {
        const idx = assignments.findIndex(a => a.id === id);
        if (idx === -1) throw new Error('Assignment not found');
        assignments[idx] = { ...assignments[idx], ...data };
        return assignments[idx];
    },
    grade: (id: string, score: number, feedback: string) => {
        const idx = assignments.findIndex(a => a.id === id);
        if (idx === -1) throw new Error('Assignment not found');
        assignments[idx] = { ...assignments[idx], score, feedback, status: 'graded' };
        return assignments[idx];
    },
};

/* ─── Project Service ─── */
export const ProjectService = {
    getAll: () => projects,
    getByStudent: (studentId: string) => projects.filter(p => p.studentId === studentId),
    getById: (id: string) => projects.find(p => p.id === id),
    create: (data: Omit<ProjectEval, 'id' | 'submittedAt'>) => {
        const item: ProjectEval = { ...data, id: `PRJ${uuid().slice(0, 6).toUpperCase()}`, submittedAt: new Date().toISOString() };
        projects.push(item);
        return item;
    },
    evaluate: (id: string, score: number, feedback: string, evaluatorName: string) => {
        const idx = projects.findIndex(p => p.id === id);
        if (idx === -1) throw new Error('Project not found');
        projects[idx] = { ...projects[idx], score, feedback, evaluatorName, status: 'evaluated' };
        return projects[idx];
    },
};

/* ─── Practical Exam Service ─── */
export const PracticalExamService = {
    getAll: () => practicalExams,
    getByStudent: (studentId: string) => practicalExams.filter(p => p.studentId === studentId),
    create: (data: Omit<PracticalExam, 'id'>) => {
        const item: PracticalExam = { ...data, id: `PEX${uuid().slice(0, 6).toUpperCase()}` };
        practicalExams.push(item);
        return item;
    },
};

/* ─── Employer Feedback Service ─── */
export const EmployerFeedbackService = {
    getAll: () => employerFeedbacks,
    getByStudent: (studentId: string) => employerFeedbacks.filter(f => f.studentId === studentId),
    create: (data: Omit<EmployerFeedback, 'id' | 'submittedAt'>) => {
        const item: EmployerFeedback = { ...data, id: `EFB${uuid().slice(0, 6).toUpperCase()}`, submittedAt: new Date().toISOString() };
        employerFeedbacks.push(item);
        return item;
    },
};

/* ─── Skill Assessment Service ─── */
export const SkillAssessmentService = {
    getAll: () => skillAssessments,
    getByStudent: (studentId: string) => skillAssessments.filter(s => s.studentId === studentId),
    create: (data: Omit<SkillAssessment, 'id' | 'completedAt'>) => {
        const item: SkillAssessment = { ...data, id: `SKA${uuid().slice(0, 6).toUpperCase()}`, completedAt: new Date().toISOString() };
        skillAssessments.push(item);
        return item;
    },
};

/* ─── Analytics Helpers ─── */
export const getSubmissionStats = (studentId: string) => {
    const studentAssignments = assignments.filter(a => a.studentId === studentId);
    const studentProjects = projects.filter(p => p.studentId === studentId);
    const studentExams = practicalExams.filter(p => p.studentId === studentId);
    const studentFeedback = employerFeedbacks.filter(f => f.studentId === studentId);
    const studentAssessments = skillAssessments.filter(s => s.studentId === studentId);

    const gradedAssignments = studentAssignments.filter(a => a.status === 'graded' && a.score != null);
    const avgAssignmentScore = gradedAssignments.length
        ? Math.round(gradedAssignments.reduce((s, a) => s + (a.score ?? 0), 0) / gradedAssignments.length)
        : 0;

    const evaluatedProjects = studentProjects.filter(p => p.status === 'evaluated' && p.score != null);
    const avgProjectScore = evaluatedProjects.length
        ? Math.round(evaluatedProjects.reduce((s, p) => s + (p.score ?? 0), 0) / evaluatedProjects.length)
        : 0;

    const avgExamScore = studentExams.length
        ? Math.round(studentExams.reduce((s, e) => s + e.score, 0) / studentExams.length)
        : 0;

    const avgAssessmentScore = studentAssessments.length
        ? Math.round(studentAssessments.reduce((s, a) => s + a.score, 0) / studentAssessments.length)
        : 0;

    return {
        totalSubmissions: studentAssignments.length + studentProjects.length,
        avgAssignmentScore,
        avgProjectScore,
        avgExamScore,
        avgAssessmentScore,
        totalFeedback: studentFeedback.length,
        overallProgress: Math.round((avgAssignmentScore + avgProjectScore + avgExamScore + avgAssessmentScore) / 4),
    };
};
