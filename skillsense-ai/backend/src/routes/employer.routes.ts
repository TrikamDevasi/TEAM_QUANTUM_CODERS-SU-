import { Router } from 'express';
import * as ctrl from '../controllers/employer.controller';

export const employerRouter = Router();

// Employers
employerRouter.get('/', ctrl.getAllEmployers);
employerRouter.get('/:id', ctrl.getEmployerById);
employerRouter.post('/', ctrl.createEmployer);

// Internship Feedback
employerRouter.get('/feedback/all', ctrl.getAllInternshipFeedback);
employerRouter.get('/feedback/employer/:employerId', ctrl.getEmployerFeedback);
employerRouter.post('/feedback', ctrl.submitInternshipFeedback);

// Placements
employerRouter.get('/placements/all', ctrl.getAllPlacements);
employerRouter.post('/placements', ctrl.createPlacement);
employerRouter.patch('/placements/:id/status', ctrl.updatePlacementStatus);

// Skill Validations
employerRouter.get('/validations/all', ctrl.getAllValidations);
employerRouter.get('/validations/student/:studentId', ctrl.getStudentValidations);
employerRouter.post('/validations', ctrl.createValidation);

// Analytics
employerRouter.get('/analytics/overview', ctrl.getAnalytics);
employerRouter.get('/analytics/job-readiness/:studentId', ctrl.getJobReadiness);
