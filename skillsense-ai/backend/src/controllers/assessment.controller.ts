import { Request, Response } from 'express';
import Assessment from '../models/Assessment.model';

export const getAssessmentHistory = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const assessments = await Assessment.find({ studentId: userId })
    .sort({ completedAt: -1 })
    .limit(10);
  res.json({ success: true, data: assessments });
};

export const submitAssessment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { category, score, totalQuestions, aiAnalysis } = req.body;

    const assessment = await Assessment.create({
      studentId: userId,
      category,
      score,
      totalQuestions,
      aiAnalysis,
    });

    res.status(201).json({ success: true, data: assessment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit assessment' });
  }
};
