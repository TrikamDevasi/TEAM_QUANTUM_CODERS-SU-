import { z } from 'zod';

/* ─── Assignment Model ─── */
export const AssignmentSchema = z.object({
    id: z.string(),
    studentId: z.string(),
    studentName: z.string(),
    title: z.string().min(1, 'Title is required'),
    course: z.string().min(1, 'Course is required'),
    submittedAt: z.string(),
    status: z.enum(['submitted', 'under-review', 'graded', 'resubmit']),
    score: z.number().min(0).max(100).optional(),
    maxScore: z.number().min(1).default(100),
    feedback: z.string().optional(),
    fileUrl: z.string().optional(),
    skills: z.array(z.string()),
});

export const CreateAssignmentSchema = AssignmentSchema.omit({ id: true, submittedAt: true }).extend({
    status: z.enum(['submitted', 'under-review', 'graded', 'resubmit']).default('submitted'),
});

export type Assignment = z.infer<typeof AssignmentSchema>;
export type CreateAssignment = z.infer<typeof CreateAssignmentSchema>;

/* ─── Project Evaluation Model ─── */
export const ProjectEvalSchema = z.object({
    id: z.string(),
    studentId: z.string(),
    studentName: z.string(),
    projectTitle: z.string().min(1),
    description: z.string(),
    technology: z.array(z.string()),
    submittedAt: z.string(),
    status: z.enum(['pending', 'evaluated', 'revision']),
    score: z.number().min(0).max(100).optional(),
    maxScore: z.number().default(100),
    evaluatorName: z.string().optional(),
    feedback: z.string().optional(),
    repoUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
});

export const CreateProjectSchema = ProjectEvalSchema.omit({ id: true, submittedAt: true });
export type ProjectEval = z.infer<typeof ProjectEvalSchema>;

/* ─── Practical Exam Model ─── */
export const PracticalExamSchema = z.object({
    id: z.string(),
    studentId: z.string(),
    studentName: z.string(),
    examTitle: z.string().min(1),
    skillTested: z.string(),
    conductedOn: z.string(),
    score: z.number().min(0).max(100),
    maxScore: z.number().default(100),
    grade: z.enum(['A+', 'A', 'B+', 'B', 'C', 'D', 'F']),
    evaluator: z.string(),
    remarks: z.string().optional(),
});

export type PracticalExam = z.infer<typeof PracticalExamSchema>;

/* ─── Employer Feedback Model ─── */
export const EmployerFeedbackSchema = z.object({
    id: z.string(),
    studentId: z.string(),
    studentName: z.string(),
    employerName: z.string(),
    companyName: z.string(),
    role: z.string(),
    period: z.string(),
    rating: z.number().min(1).max(5),
    technicalScore: z.number().min(0).max(100),
    softSkillScore: z.number().min(0).max(100),
    recommendation: z.enum(['hire', 'consider', 'not-recommended']),
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
    comments: z.string().optional(),
    submittedAt: z.string(),
});

export type EmployerFeedback = z.infer<typeof EmployerFeedbackSchema>;

/* ─── Skill Assessment Model ─── */
export const SkillAssessmentSchema = z.object({
    id: z.string(),
    studentId: z.string(),
    studentName: z.string(),
    assessmentTitle: z.string().min(1),
    skill: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    score: z.number().min(0).max(100),
    maxScore: z.number().default(100),
    percentile: z.number().min(0).max(100),
    completedAt: z.string(),
    duration: z.number().min(0),
    badge: z.string().optional(),
});

export type SkillAssessment = z.infer<typeof SkillAssessmentSchema>;
