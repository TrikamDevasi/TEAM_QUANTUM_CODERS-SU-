import { Router } from 'express';
import { createContactRequest, listContactRequests } from '../controllers/contact.controller';
import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.post('/', createContactRequest);
router.get('/', protect, requireRole('admin'), listContactRequests);

export default router;
