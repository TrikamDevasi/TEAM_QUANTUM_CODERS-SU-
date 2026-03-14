import { Router } from 'express';
import { register, login, refreshTokens, logout, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', authLimiter, refreshTokens);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
