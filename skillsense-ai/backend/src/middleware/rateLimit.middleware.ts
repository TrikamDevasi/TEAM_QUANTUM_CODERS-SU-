import rateLimit from 'express-rate-limit';

const rateLimitResponse = (message: string) => ({
  success: false,
  message,
  data: null,
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse('Too many requests. Please try again in 15 minutes.'),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse('Too many authentication attempts. Please try again in 15 minutes.'),
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse('AI rate limit exceeded. Please wait before making more AI requests.'),
});
