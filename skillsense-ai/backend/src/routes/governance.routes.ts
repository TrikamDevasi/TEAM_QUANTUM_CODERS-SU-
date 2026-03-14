import { Router } from 'express';
import { getAuditLogs, getAnonymisedExport, getComplianceCheck } from '../controllers/governance.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.get('/audit-logs', authenticate, requireRole('admin', 'government'), getAuditLogs);
router.get('/anonymised-export', authenticate, requireRole('admin'), getAnonymisedExport);
router.post('/compliance-check', authenticate, requireRole('admin'), getComplianceCheck);

export default router;
