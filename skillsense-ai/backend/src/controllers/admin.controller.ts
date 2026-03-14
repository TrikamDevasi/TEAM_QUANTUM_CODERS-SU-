import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import User from '../models/User.model';
import Institution from '../models/Institution.model';
import Student from '../models/Student.model';
import Assessment from '../models/Assessment.model';
import { parsePagination, buildPaginatedResponse, buildApiResponse } from '../utils/pagination.utils';

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['student', 'institute', 'industry', 'government', 'admin']),
});

const updateUserSchema = z.object({
  role: z.enum(['student', 'institute', 'industry', 'government', 'admin']).optional(),
  isActive: z.boolean().optional(),
  name: z.string().optional(),
});

// ────── USERS ──────

export const listUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, limit, page } = parsePagination(req.query);
    const filter: Record<string, unknown> = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).select('-password -refreshToken'),
      User.countDocuments(filter),
    ]);
    res.status(200).json(buildPaginatedResponse(users, total, page, limit, 'Users retrieved'));
  } catch (err) { next(err); }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = createUserSchema.parse(req.body);
    const user = await User.create(body);
    const userObj = user.toObject() as unknown as Record<string, unknown>;
    delete userObj.password;
    delete userObj.refreshToken;
    res.status(201).json(buildApiResponse(userObj, 'User created'));
  } catch (err) { next(err); }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = updateUserSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, body, { new: true }).select('-password -refreshToken');
    if (!user) { res.status(404).json(buildApiResponse(null, 'User not found', false)); return; }
    res.status(200).json(buildApiResponse(user, 'User updated'));
  } catch (err) { next(err); }
};

export const softDeleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-password -refreshToken');
    if (!user) { res.status(404).json(buildApiResponse(null, 'User not found', false)); return; }
    res.status(200).json(buildApiResponse(user, 'User deactivated'));
  } catch (err) { next(err); }
};

// ────── INSTITUTES ──────

export const listInstitutes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, limit, page } = parsePagination(req.query);
    const [institutions, total] = await Promise.all([
      Institution.find().skip(skip).limit(limit),
      Institution.countDocuments(),
    ]);
    res.status(200).json(buildPaginatedResponse(institutions, total, page, limit, 'Institutions retrieved'));
  } catch (err) { next(err); }
};

export const createInstitute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const institution = await Institution.create(req.body);
    res.status(201).json(buildApiResponse(institution, 'Institution created'));
  } catch (err) { next(err); }
};

export const verifyInstitute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const institution = await Institution.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!institution) { res.status(404).json(buildApiResponse(null, 'Institution not found', false)); return; }
    res.status(200).json(buildApiResponse(institution, 'Institution verified'));
  } catch (err) { next(err); }
};

// ────── SYSTEM REPORTS ──────

export const getSystemReports = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [userCount, studentCount, institutionCount, assessmentCount] = await Promise.all([
      User.countDocuments(),
      Student.countDocuments(),
      Institution.countDocuments(),
      Assessment.countDocuments(),
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const placementDist = await Student.aggregate([
      { $group: { _id: '$placementStatus', count: { $sum: 1 } } },
    ]);

    res.status(200).json(buildApiResponse({
      counts: { users: userCount, students: studentCount, institutions: institutionCount, assessments: assessmentCount },
      usersByRole,
      placementDistribution: placementDist,
    }, 'System reports retrieved'));
  } catch (err) { next(err); }
};

// ────── FAIRNESS DASHBOARD (stub) ──────

export const getFairnessDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Stub — delegates to fairness.service (Member 5)
    res.status(200).json(buildApiResponse(
      { message: 'Fairness dashboard — Member 5 AI integration pending', isFair: true, flags: [], recommendations: [] },
      'Fairness dashboard (stub)'
    ));
  } catch (err) { next(err); }
};
