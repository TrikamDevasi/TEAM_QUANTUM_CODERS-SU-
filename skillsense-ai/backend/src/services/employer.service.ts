import { v4 as uuid } from 'uuid';
import type { Employer, InternshipFeedback, PlacementRecord, SkillValidation } from '../models/Employer.model';

/* ─── In-Memory Storage ─── */
const employers: Employer[] = [];
const internshipFeedback: InternshipFeedback[] = [];
const placementRecords: PlacementRecord[] = [];
const skillValidations: SkillValidation[] = [];

/* ─── Employer Service ─── */
export const EmployerService = {
    getAll: () => employers,
    getById: (id: string) => employers.find(e => e.id === id),
    create: (data: Omit<Employer, 'id'>) => {
        const item: Employer = { ...data, id: `EMP${uuid().slice(0, 6).toUpperCase()}` };
        employers.push(item);
        return item;
    },
    update: (id: string, data: Partial<Employer>) => {
        const idx = employers.findIndex(e => e.id === id);
        if (idx === -1) throw new Error('Employer not found');
        employers[idx] = { ...employers[idx], ...data };
        return employers[idx];
    },
};

/* ─── Internship Feedback Service ─── */
export const InternshipFeedbackService = {
    getAll: () => internshipFeedback,
    getByEmployer: (employerId: string) => internshipFeedback.filter(f => f.employerId === employerId),
    getByStudent: (studentId: string) => internshipFeedback.filter(f => f.studentId === studentId),
    create: (data: Omit<InternshipFeedback, 'id' | 'submittedAt'>) => {
        const item: InternshipFeedback = { ...data, id: `IFB${uuid().slice(0, 6).toUpperCase()}`, submittedAt: new Date().toISOString() };
        internshipFeedback.push(item);
        return item;
    },
};

/* ─── Placement Record Service ─── */
export const PlacementRecordService = {
    getAll: () => placementRecords,
    getByEmployer: (employerId: string) => placementRecords.filter(r => r.employerId === employerId),
    getByStudent: (studentId: string) => placementRecords.filter(r => r.studentId === studentId),
    create: (data: Omit<PlacementRecord, 'id'>) => {
        const item: PlacementRecord = { ...data, id: `PLR${uuid().slice(0, 6).toUpperCase()}` };
        placementRecords.push(item);
        return item;
    },
    updateStatus: (id: string, status: PlacementRecord['status']) => {
        const idx = placementRecords.findIndex(r => r.id === id);
        if (idx === -1) throw new Error('Placement record not found');
        placementRecords[idx] = { ...placementRecords[idx], status };
        return placementRecords[idx];
    },
};

/* ─── Skill Validation Service ─── */
export const SkillValidationService = {
    getAll: () => skillValidations,
    getByEmployer: (employerId: string) => skillValidations.filter(v => v.employerId === employerId),
    getByStudent: (studentId: string) => skillValidations.filter(v => v.studentId === studentId),
    create: (data: Omit<SkillValidation, 'id'>) => {
        const item: SkillValidation = { ...data, id: `SVL${uuid().slice(0, 6).toUpperCase()}` };
        skillValidations.push(item);
        return item;
    },
};

/* ─── Employer Analytics ─── */
export const getEmployerAnalytics = () => {
    const totalEmployers = employers.filter(e => e.status === 'active').length;
    const totalPlacements = placementRecords.length;
    const totalValidations = skillValidations.filter(v => v.isVerified).length;
    const avgSalary = placementRecords.length
        ? Math.round(placementRecords.reduce((s, r) => s + r.salary, 0) / placementRecords.length)
        : 0;
    const hireRate = internshipFeedback.length
        ? Math.round((internshipFeedback.filter(f => f.wouldHire).length / internshipFeedback.length) * 100)
        : 0;

    return {
        totalEmployers,
        totalPlacements,
        totalValidations,
        avgSalary,
        hireRate,
        totalFeedback: internshipFeedback.length,
    };
};

export const getStudentJobReadinessScore = (studentId: string): number => {
    const validations = skillValidations.filter(v => v.studentId === studentId && v.isVerified);
    const feedback = internshipFeedback.filter(f => f.studentId === studentId);
    const placements = placementRecords.filter(r => r.studentId === studentId);

    let score = 0;
    // Verified skills contribute 40%
    score += Math.min(40, validations.length * 10);
    // Employer feedback contributes 30%
    const avgRating = feedback.length ? feedback.reduce((s, f) => s + f.overallRating, 0) / feedback.length : 0;
    score += Math.round((avgRating / 5) * 30);
    // Placement status contributes 30%
    if (placements.some(p => p.status === 'confirmed')) score += 30;
    else if (placements.some(p => p.status === 'probation')) score += 20;
    else if (placements.some(p => p.status === 'active')) score += 15;

    return Math.min(100, score);
};
