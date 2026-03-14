import express from 'express';
import cors from 'cors';
import { datacollectionRouter } from './routes/datacollection.routes';
import { employerRouter } from './routes/employer.routes';
import { analyticsRouter } from './routes/analytics.routes';
import { studentRouter } from './routes/student.routes';

const app = express();

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'skillsense-ai-backend' });
});

// Routes
app.use('/api/data-collection', datacollectionRouter);
app.use('/api/employer', employerRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/students', studentRouter);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[ERROR]', err.message);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

export default app;
