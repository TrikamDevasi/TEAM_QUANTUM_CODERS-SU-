import { Request, Response, NextFunction } from 'express';
import AuditLog from '../models/AuditLog.model';
import Student from '../models/Student.model';
import Institution from '../models/Institution.model';
import { anonymiseExport } from '../utils/anonymise.utils';
import { parsePagination, buildPaginatedResponse, buildApiResponse } from '../utils/pagination.utils';
import { getNationalHeatmap } from '../services/analytics.service';
import { get, set } from '../utils/cache.utils';

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, limit, page } = parsePagination(req.query);
    const filter: Record<string, unknown> = {};
    if (req.query.resource) filter.resource = req.query.resource;
    if (req.query.userId) filter.userId = req.query.userId;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(filter),
    ]);

    res.status(200).json(buildPaginatedResponse(logs, total, page, limit, 'Audit logs retrieved'));
  } catch (err) { next(err); }
};

export const getAnonymisedExport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const students = await Student.find().lean();
    const anonymised = anonymiseExport(students as any);
    res.status(200).json(buildApiResponse(anonymised, `Anonymised export: ${anonymised.length} records`));
  } catch (err) { next(err); }
};

export const getComplianceCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const institutions = await Institution.find({ isVerified: true }).select('name nsqfAffiliation programs type state');
    const totalStudents = await Student.countDocuments();
    const nsqfDistribution = await Student.aggregate([
      { $group: { _id: '$nsqfLevel', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(buildApiResponse({
      verifiedInstitutions: institutions.length,
      totalStudents,
      nsqfDistribution,
      compliance: {
        nsqfCoverage: nsqfDistribution.length >= 5 ? 'adequate' : 'needs_improvement',
        institutionVerificationRate: `${institutions.length} verified institutions`,
      },
    }, 'Compliance check complete'));
  } catch (err) { next(err); }
};

// ── Governance: National Heatmap ──────────────────────────────────────────────
export const getNationalHeatmapGov = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getNationalHeatmap();
    res.status(200).json(buildApiResponse(data, 'National heatmap data retrieved'));
  } catch (err) { next(err); }
};

// ── Governance: Fund Targeting ────────────────────────────────────────────────
export const getFundTargetingGov = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'governance:fund-targeting';
    const cached = await get<unknown>(cacheKey);
    if (cached) { res.status(200).json(buildApiResponse(cached, 'Fund targeting data (cached)')); return; }

    const institutions = await Institution.find({ isVerified: true }).lean();
    const results = await Promise.all(
      institutions.map(async (inst) => {
        const studentCount = await Student.countDocuments({ institutionId: inst._id });
        const placedCount = await Student.countDocuments({ institutionId: inst._id, placementStatus: 'placed' });
        const placementRate = studentCount ? Math.round((placedCount / studentCount) * 100) : 0;
        const priorityScore = studentCount * (1 - placementRate / 100);
        return {
          institutionId: inst._id, name: inst.name, state: inst.state, type: inst.type,
          studentCount, placementRate, priorityScore: Math.round(priorityScore),
          recommendedFunding: priorityScore > 50 ? 'high' : priorityScore > 20 ? 'medium' : 'low',
        };
      })
    );
    results.sort((a, b) => b.priorityScore - a.priorityScore);
    await set(cacheKey, results, 600);
    res.status(200).json(buildApiResponse(results, 'Fund targeting analysis complete'));
  } catch (err) { next(err); }
};
