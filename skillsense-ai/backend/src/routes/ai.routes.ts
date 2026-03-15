// backend/src/routes/ai.routes.ts
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  chat,
  assessSkill,
  evaluateSkill,
  predictCareer,
  marketTrends,
  getChatHistory,
} from '../controllers/ai.controller';

const router = Router();

// All AI routes require authentication
router.use(protect);

// Chat
router.post('/chat', chat);
router.get('/history', getChatHistory);

// Skill Assessment
router.post('/assess-skill',          assessSkill);
router.post('/assess-skill/evaluate', evaluateSkill);

// Career Predictor
router.post('/predict-career', predictCareer);

// Market Intelligence (Perplexity)
router.get('/market-trends', marketTrends);

export default router;
