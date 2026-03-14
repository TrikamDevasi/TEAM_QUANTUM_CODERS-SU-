import { Router } from 'express';
import { createContactRequest } from '../controllers/contact.controller';

const router = Router();

router.post('/', createContactRequest);

export default router;
