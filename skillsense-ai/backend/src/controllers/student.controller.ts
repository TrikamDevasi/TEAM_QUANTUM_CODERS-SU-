import { Request, Response, NextFunction } from 'express';
import Student from '../models/Student.model';
import Assessment from '../models/Assessment.model';
import * as aiService from '../services/ai.service';
import { buildApiResponse } from '../utils/pagination.utils';

export const getStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const student = await Student.findById(req.params.id).populate('userId', '-password -refreshToken');
    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Student not found', false));
      return;
    }
    res.status(200).json(buildApiResponse(student, 'Student retrieved'));
  } catch (err) { next(err); }
};

export const getStudentSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const student = await Student.findById(req.params.id).populate('skills.skillId', 'name domain nsqfLevel');
    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Student not found', false));
      return;
    }
    res.status(200).json(buildApiResponse(student.skills, 'Skills retrieved'));
  } catch (err) { next(err); }
};

export const getStudentPassport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const student = await Student.findById(req.params.id).select('passportHash');
    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Student not found', false));
      return;
    }
    res.status(200).json(buildApiResponse({ passportHash: student.passportHash }, 'Passport retrieved'));
  } catch (err) { next(err); }
};

export const submitAssessment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skillId, responses, score, adaptiveLevel } = req.body;

    // Create assessment record
    const assessment = await Assessment.create({
      studentId: req.params.id,
      skillId,
      responses,
      score,
      adaptiveLevel: adaptiveLevel ?? 1,
    });

    // Call AI service (stub or live)
    const skillScores = await aiService.extractSkills(responses ?? []);

    // Update student skill score
    const student = await Student.findById(req.params.id);
    if (student) {
      const skillIndex = student.skills.findIndex(
        (s) => String(s.skillId) === String(skillId)
      );
      if (skillIndex >= 0) {
        student.skills[skillIndex].score = score;
        student.skills[skillIndex].lastAssessed = new Date();
        student.skills[skillIndex].history.push({ score, date: new Date() });
      } else {
        student.skills.push({ skillId, score, lastAssessed: new Date(), history: [{ score, date: new Date() }] });
      }
      await student.save();
    }

    res.status(201).json(buildApiResponse({ assessment, skillScores }, 'Assessment submitted'));
  } catch (err) { next(err); }
};

export const getCareerPaths = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const prediction = await aiService.predictOutcome(String(req.params.id));
    res.status(200).json(buildApiResponse(prediction, 'Career paths retrieved'));
  } catch (err) { next(err); }
};

export const getInterventions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const student = await Student.findById(req.params.id).select('interventions');
    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Student not found', false));
      return;
    }
    res.status(200).json(buildApiResponse(student.interventions, 'Interventions retrieved'));
  } catch (err) { next(err); }
};
