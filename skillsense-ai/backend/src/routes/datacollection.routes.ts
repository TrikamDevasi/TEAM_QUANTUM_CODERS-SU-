import { Router } from 'express';
import * as ctrl from '../controllers/datacollection.controller';

export const datacollectionRouter = Router();

// Assignments
datacollectionRouter.get('/assignments', ctrl.getAllAssignments);
datacollectionRouter.get('/assignments/student/:studentId', ctrl.getStudentAssignments);
datacollectionRouter.post('/assignments', ctrl.createAssignment);
datacollectionRouter.patch('/assignments/:id/grade', ctrl.gradeAssignment);

// Projects
datacollectionRouter.get('/projects', ctrl.getAllProjects);
datacollectionRouter.get('/projects/student/:studentId', ctrl.getStudentProjects);
datacollectionRouter.post('/projects', ctrl.createProject);
datacollectionRouter.patch('/projects/:id/evaluate', ctrl.evaluateProject);

// Practical Exams
datacollectionRouter.get('/practical-exams', ctrl.getAllPracticalExams);
datacollectionRouter.post('/practical-exams', ctrl.createPracticalExam);

// Employer Feedback
datacollectionRouter.get('/employer-feedback', ctrl.getAllEmployerFeedback);
datacollectionRouter.post('/employer-feedback', ctrl.createEmployerFeedback);

// Skill Assessments
datacollectionRouter.get('/skill-assessments', ctrl.getAllSkillAssessments);
datacollectionRouter.post('/skill-assessments', ctrl.createSkillAssessment);

// Stats
datacollectionRouter.get('/stats/:studentId', ctrl.getStudentStats);
