import { Router } from 'express';
import { getStudent, getStudentSkills, getStudentPassport, submitAssessment, getCareerPaths, getInterventions } from '../controllers/student.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { aiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.get('/:id', authenticate, requireRole('student', 'admin'), getStudent);
router.get('/:id/skills', authenticate, getStudentSkills);
router.get('/:id/passport', authenticate, getStudentPassport);
router.post('/:id/assessment', authenticate, aiLimiter, submitAssessment);
router.get('/:id/career-paths', authenticate, getCareerPaths);
router.get('/:id/interventions', authenticate, getInterventions);

export default router;
