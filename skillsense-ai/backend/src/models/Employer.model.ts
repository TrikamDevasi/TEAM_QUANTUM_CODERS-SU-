import { z } from 'zod';

/* ─── Employer Model ─── */
export const EmployerSchema = z.object({
    id: z.string(),
    companyName: z.string().min(1),
    industry: z.string(),
    contactPerson: z.string(),
    email: z.string().email(),
    phone: z.string(),
    location: z.string(),
    partnerSince: z.string(),
    openPositions: z.number().min(0),
    studentsHired: z.number().min(0),
    avgRating: z.number().min(0).max(5),
    status: z.enum(['active', 'inactive']),
    verifiedSkills: z.number().min(0),
});

export type Employer = z.infer<typeof EmployerSchema>;

/* ─── Internship Feedback Model ─── */
export const InternshipFeedbackSchema = z.object({
    id: z.string(),
    employerId: z.string(),
    companyName: z.string(),
    studentId: z.string(),
    studentName: z.string(),
    role: z.string(),
    department: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    status: z.enum(['ongoing', 'completed', 'terminated']),
    overallRating: z.number().min(1).max(5),
    technicalRating: z.number().min(1).max(5),
    communicationRating: z.number().min(1).max(5),
    teamworkRating: z.number().min(1).max(5),
    punctualityRating: z.number().min(1).max(5),
    supervisorName: z.string(),
    strengths: z.array(z.string()),
    areasOfImprovement: z.array(z.string()),
    wouldHire: z.boolean(),
    feedback: z.string(),
    submittedAt: z.string(),
});

export type InternshipFeedback = z.infer<typeof InternshipFeedbackSchema>;

/* ─── Placement Record Model ─── */
export const PlacementRecordSchema = z.object({
    id: z.string(),
    studentId: z.string(),
    studentName: z.string(),
    employerId: z.string(),
    companyName: z.string(),
    role: z.string(),
    department: z.string(),
    joiningDate: z.string(),
    salary: z.number().min(0),
    location: z.string(),
    type: z.enum(['full-time', 'contract', 'part-time']),
    source: z.enum(['campus-drive', 'referral', 'direct-application', 'off-campus']),
    status: z.enum(['active', 'probation', 'resigned', 'confirmed']),
    verifiedAt: z.string().optional(),
});

export type PlacementRecord = z.infer<typeof PlacementRecordSchema>;

/* ─── Skill Validation Log Model ─── */
export const SkillValidationSchema = z.object({
    id: z.string(),
    employerId: z.string(),
    companyName: z.string(),
    studentId: z.string(),
    studentName: z.string(),
    skill: z.string(),
    claimedLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    validatedLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    isVerified: z.boolean(),
    verifiedAt: z.string(),
    verifierName: z.string(),
    notes: z.string().optional(),
    method: z.enum(['interview', 'project-review', 'practical-test', 'reference-check']),
});

export type SkillValidation = z.infer<typeof SkillValidationSchema>;
