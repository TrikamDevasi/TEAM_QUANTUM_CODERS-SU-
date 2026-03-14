import { Router } from 'express';

export const studentRouter = Router();

// Placeholder for future student-specific API routes
studentRouter.get('/', (_req, res) => {
    res.json({ success: true, message: 'Student routes available', endpoints: ['/api/students'] });
});
