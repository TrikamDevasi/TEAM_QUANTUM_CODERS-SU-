import { Router } from 'express';
import {
  listUsers, createUser, updateUser, softDeleteUser,
  listInstitutes, createInstitute, verifyInstitute,
  getSystemReports, getFairnessDashboard,
} from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { auditLog } from '../middleware/audit.middleware';

const router = Router();

// All admin routes require admin role
router.use(authenticate, requireRole('admin'));

// Users CRUD
router.get('/users', listUsers);
router.post('/users', createUser);
router.patch('/users/:id', auditLog('UPDATE_USER', 'user'), updateUser);
router.delete('/users/:id', auditLog('DEACTIVATE_USER', 'user'), softDeleteUser);

// Institutes
router.get('/institutes', listInstitutes);
router.post('/institutes', createInstitute);
router.patch('/institutes/:id/verify', auditLog('VERIFY_INSTITUTION', 'institution'), verifyInstitute);

// Reports
router.get('/reports', getSystemReports);
router.get('/fairness-dashboard', getFairnessDashboard);

export default router;
