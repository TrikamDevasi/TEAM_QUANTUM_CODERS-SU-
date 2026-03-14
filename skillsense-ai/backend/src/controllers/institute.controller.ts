import { Request, Response, NextFunction } from 'express';
import Institution from '../models/Institution.model';
import Student from '../models/Student.model';
import { parseCSV } from '../services/upload.service';
import { anonymiseExport } from '../utils/anonymise.utils';
import { parsePagination, buildPaginatedResponse, buildApiResponse } from '../utils/pagination.utils';

export const getInstituteDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) {
      res.status(404).json(buildApiResponse(null, 'Institution not found', false));
      return;
    }

    const students = await Student.find({ institutionId: req.params.id });
    const placed = students.filter((s) => s.placementStatus === 'placed');

    const avgScore =
      students.length > 0
        ? Math.round(students.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) / students.length)
        : 0;

    // Program distribution
    const programMap: Record<string, number> = {};
    students.forEach((s) => {
      programMap[s.program] = (programMap[s.program] || 0) + 1;
    });
    const topPrograms = Object.entries(programMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([program, count]) => ({ program, count }));

    res.status(200).json(buildApiResponse({
      institution,
      stats: {
        studentCount: students.length,
        placedCount: placed.length,
        placementRate: students.length > 0 ? Math.round((placed.length / students.length) * 100) : 0,
        avgScore,
        topPrograms,
      },
    }, 'Dashboard data retrieved'));
  } catch (err) { next(err); }
};

export const getInstituteStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, limit, page } = parsePagination(req.query);
    const isAdmin = req.user?.role === 'admin';

    const [students, total] = await Promise.all([
      Student.find({ institutionId: req.params.id }).skip(skip).limit(limit),
      Student.countDocuments({ institutionId: req.params.id }),
    ]);

    const data = isAdmin ? students : anonymiseExport(students as any);
    res.status(200).json(buildPaginatedResponse(data, total, page, limit));
  } catch (err) { next(err); }
};

export const getPlacementTrend = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const trend = await Student.aggregate([
      { $match: { institutionId: req.params.id, placementStatus: 'placed', placedAt: { $exists: true } } },
      {
        $group: {
          _id: { year: { $year: '$placedAt' }, month: { $month: '$placedAt' } },
          count: { $sum: 1 },
          avgSalary: { $avg: '$salary' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    const formatted = trend.map((t) => ({
      month: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
      placed: t.count,
      avgSalary: Math.round(t.avgSalary || 0),
    }));

    res.status(200).json(buildApiResponse(formatted, 'Placement trend retrieved'));
  } catch (err) { next(err); }
};

export const getInstituteROI = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const institution = await Institution.findById(req.params.id).select('programRoiScores');
    if (!institution) {
      res.status(404).json(buildApiResponse(null, 'Institution not found', false));
      return;
    }
    res.status(200).json(buildApiResponse(institution.programRoiScores, 'ROI scores retrieved'));
  } catch (err) { next(err); }
};

export const uploadStudentCSV = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json(buildApiResponse(null, 'No file uploaded', false));
      return;
    }
    const result = await parseCSV(req.file.buffer, String(req.params.id));
    res.status(201).json(buildApiResponse(result, `Import complete: ${result.inserted} inserted, ${result.failed} failed`));
  } catch (err) { next(err); }
};

export const getInstituteReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) {
      res.status(404).json(buildApiResponse(null, 'Institution not found', false));
      return;
    }

    const students = await Student.find({ institutionId: req.params.id });
    const placed = students.filter((s) => s.placementStatus === 'placed');
    const avgSalary = placed.length
      ? Math.round(placed.reduce((s, st) => s + (st.salary || 0), 0) / placed.length)
      : 0;

    res.status(200).json(buildApiResponse({
      institutionName: institution.name,
      type: institution.type,
      state: institution.state,
      totalStudents: students.length,
      placedStudents: placed.length,
      placementRate: students.length ? Math.round((placed.length / students.length) * 100) : 0,
      avgSalary,
      programs: institution.programs,
      programRoiScores: institution.programRoiScores,
    }, 'Report generated'));
  } catch (err) { next(err); }
};
