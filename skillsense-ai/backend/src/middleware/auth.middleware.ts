import { RequestHandler } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils';
import logger from '../utils/logger';

export const authenticate: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized', data: null });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (err) {
    logger.warn('Invalid access token:', err);
    res.status(401).json({ success: false, message: 'Unauthorized', data: null });
  }
};
