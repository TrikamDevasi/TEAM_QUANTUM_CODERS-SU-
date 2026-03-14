import { Router, Request, Response } from 'express';
import passport from 'passport';
import { signAccessToken } from '../utils/jwt.utils';
import { register, login, refreshTokens, logout, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';
import { IUser } from '../models/User.model';

const router = Router();
const FRONTEND_URL = process.env.CORS_ORIGIN || 'http://localhost:3000';

// ── Local Auth ─────────────────────────────────────────────────────────────────
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

// ── Google OAuth ───────────────────────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/auth?error=google_failed` }),
  (req: Request, res: Response) => {
    const user = req.user as unknown as IUser;
    const token = signAccessToken(String(user._id), user.role);
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&provider=google`);
  }
);

// ── GitHub OAuth ───────────────────────────────────────────────────────────────
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND_URL}/auth?error=github_failed` }),
  (req: Request, res: Response) => {
    const user = req.user as unknown as IUser;
    const token = signAccessToken(String(user._id), user.role);
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&provider=github`);
  }
);

export default router;
