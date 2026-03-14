import { Router } from 'express';
import {
  listStudents, getStudent, updateStudent,
  getStudentSkills, getStudentPassport,
  submitAssessment, getCareerPaths, getInterventions,
} from '../controllers/student.controller';
import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { aiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Admin: list all students
router.get('/', protect, requireRole('admin', 'government'), listStudents);
// Get / update a student profile
router.get('/:id', protect, getStudent);
router.put('/:id', protect, requireRole('student', 'admin'), updateStudent);
// Skills & passport
router.get('/:id/skills', protect, getStudentSkills);
router.get('/:id/passport', protect, getStudentPassport);
// Career paths
router.get('/:id/career-paths', protect, getCareerPaths);
// Assessments
router.post('/:id/assessments', protect, aiLimiter, submitAssessment);
// Interventions
router.get('/:id/interventions', protect, getInterventions);

export default router;
