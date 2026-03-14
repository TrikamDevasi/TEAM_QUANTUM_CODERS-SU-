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
