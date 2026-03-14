import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { generalLimiter } from './middleware/rateLimit.middleware';
import errorHandler from './middleware/errorHandler.middleware';
import logger from './utils/logger';

import authRouter from './routes/auth.routes';
import studentRouter from './routes/student.routes';
import instituteRouter from './routes/institute.routes';
import industryRouter from './routes/industry.routes';
import analyticsRouter from './routes/analytics.routes';
import governanceRouter from './routes/governance.routes';
import adminRouter from './routes/admin.routes';
import contactRouter from './routes/contact.routes';

const app = express();

// ── Security & CORS ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// ── Body Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── HTTP Logging (Morgan → Winston) ───────────────────────────────────────
app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// ── Rate Limiting ──────────────────────────────────────────────────────────
app.use(generalLimiter);

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok', uptime: process.uptime() }, message: 'Server is healthy' });
});

// ── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/institutes', instituteRouter);
app.use('/api/v1/industry', industryRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/governance', governanceRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/contact', contactRouter);

// ── 404 Handler ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, data: null, message: 'Route not found' });
});

// ── Global Error Handler ───────────────────────────────────────────────────
app.use(errorHandler);

export default app;
