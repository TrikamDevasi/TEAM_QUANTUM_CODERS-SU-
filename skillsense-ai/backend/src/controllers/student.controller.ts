import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Student from '../models/Student.model';
import Assessment from '../models/Assessment.model';
import { aiService } from '../services/ai.service';
import { buildApiResponse, parsePagination, buildPaginatedResponse } from '../utils/pagination.utils';

export const listStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, limit, page } = parsePagination(req.query);
    const filter: Record<string, unknown> = {};
    if (req.query.state) filter.state = req.query.state;
    if (req.query.program) filter.program = req.query.program;
    if (req.query.placementStatus) filter.placementStatus = req.query.placementStatus;
    if (req.query.institutionId) filter.institutionId = req.query.institutionId;

    const [students, total] = await Promise.all([
      Student.find(filter).skip(skip).limit(limit).select('-skills.history'),
      Student.countDocuments(filter),
    ]);
    res.status(200).json(buildPaginatedResponse(students, total, page, limit, 'Students retrieved'));
  } catch (err) { next(err); }
};

const updateStudentSchema = z.object({
  phone: z.string().optional(),
  state: z.string().optional(),
  program: z.string().optional(),
  nsqfLevel: z.number().int().min(1).max(8).optional(),
  placementStatus: z.enum(['seeking', 'placed', 'not_seeking']).optional(),
}).strict().partial();

export const updateStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updates = updateStudentSchema.parse(req.body);
    const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!student) { res.status(404).json(buildApiResponse(null, 'Student not found', false)); return; }
    res.status(200).json(buildApiResponse(student, 'Student updated'));
  } catch (err) { next(err); }
};


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

    // Call AI service to extract skill scores from responses
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
    const student = await Student.findById(req.params.id)
      .populate('skills.skillId', 'name domain')
      .select('skills program nsqfLevel state gender');
    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Student not found', false));
      return;
    }
    const skills = student.skills.map((s: any) => ({
      skill: (s.skillId as any)?.name ?? String(s.skillId),
      score: s.score,
    }));
    const prediction = await aiService.matchCareerPaths({
      skills,
      program: student.program,
      nsqfLevel: student.nsqfLevel,
      overallScore: student.overallScore ?? 50,
      state: student.state,
      gender: student.gender as 'male' | 'female',
    });
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
