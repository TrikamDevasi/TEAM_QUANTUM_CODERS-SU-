import { Router } from 'express';
import {
  getInstituteDashboard, getInstituteStudents, getPlacementTrend,
  getInstituteROI, uploadStudentCSV, getInstituteReport
} from '../controllers/institute.controller';
import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { uploadCSV } from '../middleware/upload.middleware';
import { auditLog } from '../middleware/audit.middleware';

const router = Router();

router.get('/:id/dashboard', protect, requireRole('institute', 'admin'), auditLog('VIEW_DASHBOARD', 'institution'), getInstituteDashboard);
router.get('/:id/students', protect, requireRole('institute', 'admin'), getInstituteStudents);
router.get('/:id/placement', protect, requireRole('institute', 'admin'), getPlacementTrend);
router.get('/:id/roi', protect, requireRole('institute', 'admin'), getInstituteROI);
router.post('/:id/upload', protect, requireRole('institute', 'admin'), uploadCSV.single('file'), uploadStudentCSV);
router.get('/:id/report', protect, requireRole('institute', 'admin'), getInstituteReport);

export default router;
