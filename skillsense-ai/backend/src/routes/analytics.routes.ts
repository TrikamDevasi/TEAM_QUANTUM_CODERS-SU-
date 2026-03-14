import { Router } from 'express';
import { getSubmissionStats } from '../services/datacollection.service';
import { getStudentJobReadinessScore } from '../services/employer.service';

export const analyticsRouter = Router();

// Combined student analytics
analyticsRouter.get('/student/:studentId', (req, res) => {
    const { studentId } = req.params;
    const submissionStats = getSubmissionStats(studentId);
    const jobReadiness = getStudentJobReadinessScore(studentId);

    res.json({
        success: true,
        data: {
            studentId,
            ...submissionStats,
            jobReadinessScore: jobReadiness,
            skillGrowthTrend: 'positive',
            lastUpdated: new Date().toISOString(),
        },
    });
});

// Platform-wide analytics
analyticsRouter.get('/overview', (_req, res) => {
    res.json({
        success: true,
        data: {
            totalStudents: 20,
            totalSubmissions: 0,
            averageScore: 0,
            placementRate: 75,
            lastUpdated: new Date().toISOString(),
        },
    });
});
