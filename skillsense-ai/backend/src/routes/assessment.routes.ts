import { Router } from 'express';
import { getAssessmentHistory } from '../controllers/assessment.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/history', protect, getAssessmentHistory);

export default router;
