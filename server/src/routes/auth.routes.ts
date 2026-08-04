import { Router } from 'express';
import { getMe, login, logout, signup } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
