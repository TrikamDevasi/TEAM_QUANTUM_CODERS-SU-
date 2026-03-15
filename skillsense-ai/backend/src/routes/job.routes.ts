import { Router } from 'express';
import { listJobs, getJob } from '../controllers/job.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All job routes protected for authenticated users
router.use(protect);

router.get('/', listJobs);
router.get('/:id', getJob);

export default router;
