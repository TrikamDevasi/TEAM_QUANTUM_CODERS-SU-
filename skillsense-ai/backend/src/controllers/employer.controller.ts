import { Request, Response } from 'express';
import { EmployerService, InternshipFeedbackService, PlacementRecordService, SkillValidationService, getEmployerAnalytics, getStudentJobReadinessScore } from '../services/employer.service';

/* ─── Employers ─── */
export const getAllEmployers = (_req: Request, res: Response) => {
    res.json({ success: true, data: EmployerService.getAll() });
};

export const getEmployerById = (req: Request, res: Response) => {
    const employer = EmployerService.getById(req.params.id);
    if (!employer) return res.status(404).json({ success: false, error: 'Employer not found' });
    res.json({ success: true, data: employer });
};

export const createEmployer = (req: Request, res: Response) => {
    try {
        const item = EmployerService.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
    }
};

/* ─── Internship Feedback ─── */
export const getAllInternshipFeedback = (_req: Request, res: Response) => {
    res.json({ success: true, data: InternshipFeedbackService.getAll() });
};

export const getEmployerFeedback = (req: Request, res: Response) => {
    res.json({ success: true, data: InternshipFeedbackService.getByEmployer(req.params.employerId) });
};

export const submitInternshipFeedback = (req: Request, res: Response) => {
    try {
        const item = InternshipFeedbackService.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
    }
};

/* ─── Placement Records ─── */
export const getAllPlacements = (_req: Request, res: Response) => {
    res.json({ success: true, data: PlacementRecordService.getAll() });
};

export const createPlacement = (req: Request, res: Response) => {
    try {
        const item = PlacementRecordService.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
    }
};

export const updatePlacementStatus = (req: Request, res: Response) => {
    try {
        const item = PlacementRecordService.updateStatus(req.params.id, req.body.status);
        res.json({ success: true, data: item });
    } catch (err: any) {
        res.status(404).json({ success: false, error: err.message });
    }
};

/* ─── Skill Validations ─── */
export const getAllValidations = (_req: Request, res: Response) => {
    res.json({ success: true, data: SkillValidationService.getAll() });
};

export const getStudentValidations = (req: Request, res: Response) => {
    res.json({ success: true, data: SkillValidationService.getByStudent(req.params.studentId) });
};

export const createValidation = (req: Request, res: Response) => {
    try {
        const item = SkillValidationService.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
    }
};

/* ─── Analytics ─── */
export const getAnalytics = (_req: Request, res: Response) => {
    res.json({ success: true, data: getEmployerAnalytics() });
};

export const getJobReadiness = (req: Request, res: Response) => {
    const score = getStudentJobReadinessScore(req.params.studentId);
    res.json({ success: true, data: { studentId: req.params.studentId, jobReadinessScore: score } });
};
