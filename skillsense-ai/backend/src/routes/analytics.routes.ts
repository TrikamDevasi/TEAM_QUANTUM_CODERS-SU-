import { Router } from 'express';
import { getSkillGaps, getIndustryDemand, getPlacementTrendsCtrl, getNationalHeatmapCtrl, getPredictions, getFairness, getFundTargeting } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.get('/skill-gaps', authenticate, getSkillGaps);
router.get('/industry-demand', authenticate, getIndustryDemand);
router.get('/placement-trends', authenticate, getPlacementTrendsCtrl);
router.get('/national-heatmap', authenticate, getNationalHeatmapCtrl);
router.get('/predictions', authenticate, getPredictions);
router.get('/fairness', authenticate, requireRole('admin', 'government'), getFairness);
router.get('/fund-targeting', authenticate, requireRole('government', 'admin'), getFundTargeting);

export default router;
