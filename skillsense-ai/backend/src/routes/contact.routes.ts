import express from 'express';
import { submitInquiry, getInquiries, updateInquiryStatus } from '../controllers/contact.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Public route to submit inquiry
router.post('/industry', submitInquiry);

// Admin only routes
router.get('/industry', protect, authorize('admin'), getInquiries);
router.put('/industry/:id', protect, authorize('admin'), updateInquiryStatus);

export default router;
