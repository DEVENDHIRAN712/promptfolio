import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';
import { validateResult, registerValidation, loginValidation } from '../middleware/validate';

const router = Router();

router.post('/register', registerValidation, validateResult, register);
router.post('/login', loginValidation, validateResult, login);
router.get('/me', authMiddleware, getMe);
router.post('/logout', authMiddleware, logout);

export default router;
