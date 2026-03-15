import { Router } from 'express';
import { getProfile, updateProfile, uploadAvatar } from '../controllers/profile.controller';
import { protect } from '../middleware/auth.middleware';
import { uploadImage } from '../middleware/upload.middleware';

const router = Router();

// All routes are protected
router.use(protect);

router.get('/', getProfile);
router.put('/update', updateProfile);
router.post('/avatar', uploadImage.single('avatar'), uploadAvatar);

export default router;
