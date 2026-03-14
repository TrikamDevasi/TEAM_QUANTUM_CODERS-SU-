import { Request, Response } from 'express';
import { AssignmentService, ProjectService, PracticalExamService, EmployerFeedbackService, SkillAssessmentService, getSubmissionStats } from '../services/datacollection.service';

/* ─── Assignments ─── */
export const getAllAssignments = (_req: Request, res: Response) => {
    res.json({ success: true, data: AssignmentService.getAll() });
};

export const getStudentAssignments = (req: Request, res: Response) => {
    res.json({ success: true, data: AssignmentService.getByStudent(req.params.studentId) });
};

export const createAssignment = (req: Request, res: Response) => {
    try {
        const item = AssignmentService.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
    }
};

export const gradeAssignment = (req: Request, res: Response) => {
    try {
        const { score, feedback } = req.body;
        const item = AssignmentService.grade(req.params.id, score, feedback);
        res.json({ success: true, data: item });
    } catch (err: any) {
        res.status(404).json({ success: false, error: err.message });
    }
};

/* ─── Projects ─── */
export const getAllProjects = (_req: Request, res: Response) => {
    res.json({ success: true, data: ProjectService.getAll() });
};

export const getStudentProjects = (req: Request, res: Response) => {
    res.json({ success: true, data: ProjectService.getByStudent(req.params.studentId) });
};

export const createProject = (req: Request, res: Response) => {
    try {
        const item = ProjectService.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
    }
};

export const evaluateProject = (req: Request, res: Response) => {
    try {
        const { score, feedback, evaluatorName } = req.body;
        const item = ProjectService.evaluate(req.params.id, score, feedback, evaluatorName);
        res.json({ success: true, data: item });
    } catch (err: any) {
        res.status(404).json({ success: false, error: err.message });
    }
};

/* ─── Practical Exams ─── */
export const getAllPracticalExams = (_req: Request, res: Response) => {
    res.json({ success: true, data: PracticalExamService.getAll() });
};

export const createPracticalExam = (req: Request, res: Response) => {
    try {
        const item = PracticalExamService.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
    }
};

/* ─── Employer Feedback ─── */
export const getAllEmployerFeedback = (_req: Request, res: Response) => {
    res.json({ success: true, data: EmployerFeedbackService.getAll() });
};

export const createEmployerFeedback = (req: Request, res: Response) => {
    try {
        const item = EmployerFeedbackService.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
    }
};

/* ─── Skill Assessments ─── */
export const getAllSkillAssessments = (_req: Request, res: Response) => {
    res.json({ success: true, data: SkillAssessmentService.getAll() });
};

export const createSkillAssessment = (req: Request, res: Response) => {
    try {
        const item = SkillAssessmentService.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
    }
};

/* ─── Student Submission Stats ─── */
export const getStudentStats = (req: Request, res: Response) => {
    const stats = getSubmissionStats(req.params.studentId);
    res.json({ success: true, data: stats });
};
