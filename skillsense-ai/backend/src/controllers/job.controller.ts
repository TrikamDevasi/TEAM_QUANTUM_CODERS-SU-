import { Request, Response, NextFunction } from 'express';
import Job from '../models/Job.model';
import logger from '../utils/logger';

/**
 * @desc    Get all jobs
 * @route   GET /api/v1/jobs
 * @access  Private
 */
export const listJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, type } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (type) filter.type = type;

    const jobs = await Job.find(filter).sort({ postedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    logger.error('Error fetching jobs:', err);
    next(err);
  }
};

/**
 * @desc    Get single job
 * @route   GET /api/v1/jobs/:id
 * @access  Private
 */
export const getJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};
