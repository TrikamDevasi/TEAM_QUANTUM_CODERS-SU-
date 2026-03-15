import { Router } from 'express';
import {
  listUsers, createUser, updateUser, softDeleteUser,
  listInstitutes, createInstitute, verifyInstitute,
  getSystemReports, getFairnessDashboard,
  getStats, hardDeleteUser,
} from '../controllers/admin.controller';
import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { auditLog } from '../middleware/audit.middleware';

const router = Router();

// All admin routes require admin role
router.use(protect, requireRole('admin'));

// Users CRUD
router.get('/users', listUsers);
router.post('/users', createUser);
router.patch('/users/:id', auditLog('UPDATE_USER', 'user'), updateUser);
router.delete('/users/:id/soft', auditLog('DEACTIVATE_USER', 'user'), softDeleteUser);
router.delete('/users/:id', hardDeleteUser);

// Institutes
router.get('/institutes', listInstitutes);
router.post('/institutes', createInstitute);
router.patch('/institutes/:id/verify', auditLog('VERIFY_INSTITUTION', 'institution'), verifyInstitute);

// Reports
router.get('/reports', getSystemReports);
router.get('/stats', getStats);
router.get('/fairness-dashboard', getFairnessDashboard);

export default router;
