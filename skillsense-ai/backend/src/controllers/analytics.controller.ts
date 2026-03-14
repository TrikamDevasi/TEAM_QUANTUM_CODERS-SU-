import { Request, Response, NextFunction } from 'express';
import {
  getSkillGapData,
  getPlacementTrends,
  getNationalHeatmap,
} from '../services/analytics.service';
import Skill from '../models/Skill.model';
import { get, set } from '../utils/cache.utils';
import { buildApiResponse } from '../utils/pagination.utils';

export const getSkillGaps = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getSkillGapData();
    res.status(200).json(buildApiResponse(data, 'Skill gap data retrieved'));
  } catch (err) { next(err); }
};

export const getIndustryDemand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'analytics:industry-demand';
    const cached = await get<unknown>(cacheKey);
    if (cached) { res.status(200).json(buildApiResponse(cached, 'Industry demand retrieved (cached)')); return; }

    const skills = await Skill.find().sort({ industryDemandScore: -1 }).select('name domain industryDemandScore nsqfLevel');
    await set(cacheKey, skills, 600);
    res.status(200).json(buildApiResponse(skills, 'Industry demand retrieved'));
  } catch (err) { next(err); }
};

export const getPlacementTrendsCtrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getPlacementTrends();
    res.status(200).json(buildApiResponse(data, 'Placement trends retrieved'));
  } catch (err) { next(err); }
};

export const getNationalHeatmapCtrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getNationalHeatmap();
    res.status(200).json(buildApiResponse(data, 'National heatmap retrieved'));
  } catch (err) { next(err); }
};

export const getPredictions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'analytics:predictions';
    const cached = await get<unknown>(cacheKey);
    if (cached) { res.status(200).json(buildApiResponse(cached, 'Predictions retrieved (cached)')); return; }

    // Stub — Member 5 will implement fairness.service integration
    const stub = { message: 'Predictions powered by AI — Member 5 implementation pending', data: [] };
    await set(cacheKey, stub, 300);
    res.status(200).json(buildApiResponse(stub, 'Predictions retrieved'));
  } catch (err) { next(err); }
};

export const getFairness = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Stub — Member 5 to implement fairness analysis
    res.status(200).json(buildApiResponse(
      { isFair: true, flags: [], recommendations: [] },
      'Fairness report (stub — Member 5 pending)'
    ));
  } catch (err) { next(err); }
};

export const getFundTargeting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { default: Institution } = await import('../models/Institution.model');
    const { default: Student } = await import('../models/Student.model');

    const institutions = await Institution.find().lean();
    const results = await Promise.all(
      institutions.map(async (inst) => {
        const students = await Student.find({ institutionId: inst._id });
        const placed = students.filter((s) => s.placementStatus === 'placed').length;
        const placementRate = students.length ? placed / students.length : 0;
        const improvementNeeded = 1 - placementRate;
        const priorityScore = improvementNeeded * students.length;
        return { ...inst, studentCount: students.length, placementRate: Math.round(placementRate * 100), priorityScore: Math.round(priorityScore) };
      })
    );
    results.sort((a, b) => b.priorityScore - a.priorityScore);
    res.status(200).json(buildApiResponse(results, 'Fund targeting data retrieved'));
  } catch (err) { next(err); }
};

// ── NEW: Dashboard summary ────────────────────────────────────────────────────
export const getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'analytics:dashboard';
    const cached = await get<unknown>(cacheKey);
    if (cached) { res.status(200).json(buildApiResponse(cached, 'Dashboard data retrieved (cached)')); return; }

    const { default: Student } = await import('../models/Student.model');
    const { default: Institution } = await import('../models/Institution.model');

    const [totalStudents, totalInstitutions, placedStudents, skillGaps, placementTrends] = await Promise.all([
      Student.countDocuments(),
      Institution.countDocuments({ isVerified: true }),
      Student.countDocuments({ placementStatus: 'placed' }),
      getSkillGapData(),
      getPlacementTrends(),
    ]);

    const dashboard = {
      totalStudents,
      totalInstitutions,
      placedStudents,
      overallPlacementRate: totalStudents ? Math.round((placedStudents / totalStudents) * 100) : 0,
      topSkillGaps: (skillGaps as Array<{ name: string; gap: number }>).slice(0, 5),
      recentPlacementTrends: placementTrends,
    };

    await set(cacheKey, dashboard, 300);
    res.status(200).json(buildApiResponse(dashboard, 'Dashboard data retrieved'));
  } catch (err) { next(err); }
};

// ── NEW: Per-student skill gap analysis (AI powered) ─────────────────────────
export const getStudentSkillGaps = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentId } = req.params;
    const cacheKey = `analytics:skill-gaps:${studentId}`;
    const cached = await get<unknown>(cacheKey);
    if (cached) { res.status(200).json(buildApiResponse(cached, 'Skill gap analysis retrieved (cached)')); return; }

    const { default: Student } = await import('../models/Student.model');
    const student = await Student.findById(studentId);
    if (!student) { res.status(404).json(buildApiResponse(null, 'Student not found', false)); return; }

    const { aiService } = await import('../services/ai.service');
    const analysis = await aiService.analyzeSkillGaps({
      studentId: String(student._id),
      studentName: student.enrollmentNumber,  // use enrollment number as identifier
      program: student.program,
      nsqfLevel: student.nsqfLevel,
      skills: student.skills.map((s) => ({ skill: String(s.skillId), score: s.score })),
    });

    await set(cacheKey, analysis, 600);
    res.status(200).json(buildApiResponse(analysis, 'Skill gap analysis complete'));
  } catch (err) { next(err); }
};

// ── NEW: Per-student career path matching (AI powered) ───────────────────────
export const getStudentCareerPaths = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentId } = req.params;
    const cacheKey = `analytics:career-paths:${studentId}`;
    const cached = await get<unknown>(cacheKey);
    if (cached) { res.status(200).json(buildApiResponse(cached, 'Career paths retrieved (cached)')); return; }

    const { default: Student } = await import('../models/Student.model');
    const student = await Student.findById(studentId);
    if (!student) { res.status(404).json(buildApiResponse(null, 'Student not found', false)); return; }

    const { aiService } = await import('../services/ai.service');
    const paths = await aiService.matchCareerPaths({
      program: student.program,
      nsqfLevel: student.nsqfLevel,
      overallScore: student.overallScore ?? 0,
      state: student.state,
      gender: (student.gender as 'male' | 'female') ?? 'male',
      skills: student.skills.map((s) => ({ skill: String(s.skillId), score: s.score })),
    });

    await set(cacheKey, paths, 600);
    res.status(200).json(buildApiResponse(paths, 'Career path analysis complete'));
  } catch (err) { next(err); }
};

// ── NEW: Industry demand by domain (Perplexity powered) ───────────────────────
export const getIndustryDemandByDomain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawDomain = req.params.domain || req.query.domain;
    const domain = typeof rawDomain === 'string' ? rawDomain
      : Array.isArray(rawDomain) ? String(rawDomain[0])
      : 'technology';
    const cacheKey = `analytics:industry-demand:${domain}`;
    const cached = await get<unknown>(cacheKey);
    if (cached) { res.status(200).json(buildApiResponse(cached, `Industry demand for ${domain} (cached)`)); return; }

    const { aiService } = await import('../services/ai.service');
    const data = await aiService.researchIndustryDemand(domain);
    await set(cacheKey, data, 900); // 15 min cache for Perplexity data
    res.status(200).json(buildApiResponse(data, `Industry demand for ${domain} retrieved`));
  } catch (err) { next(err); }
};
