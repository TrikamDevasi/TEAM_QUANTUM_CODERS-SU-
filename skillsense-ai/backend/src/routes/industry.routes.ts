import { Router } from 'express';
import { getTalentPool, getDemandSignals, getForecast, getCampusConnect } from '../controllers/industry.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.get('/talent-pool', authenticate, requireRole('industry', 'admin'), getTalentPool);
router.get('/demand-signals', authenticate, getDemandSignals);
router.get('/forecast', authenticate, getForecast);
router.get('/campus-connect', authenticate, getCampusConnect);

export default router;
