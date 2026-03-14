import { Router } from 'express';
import {
  getInstituteDashboard, getInstituteStudents, getPlacementTrend,
  getInstituteROI, uploadStudentCSV, getInstituteReport
} from '../controllers/institute.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { uploadCSV } from '../middleware/upload.middleware';
import { auditLog } from '../middleware/audit.middleware';

const router = Router();

router.get('/:id/dashboard', authenticate, requireRole('institute', 'admin'), auditLog('VIEW_DASHBOARD', 'institution'), getInstituteDashboard);
router.get('/:id/students', authenticate, requireRole('institute', 'admin'), getInstituteStudents);
router.get('/:id/placement', authenticate, requireRole('institute', 'admin'), getPlacementTrend);
router.get('/:id/roi', authenticate, requireRole('institute', 'admin'), getInstituteROI);
router.post('/:id/upload', authenticate, requireRole('institute', 'admin'), uploadCSV.single('file'), uploadStudentCSV);
router.get('/:id/report', authenticate, requireRole('institute', 'admin'), getInstituteReport);

export default router;
