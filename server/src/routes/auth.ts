import { Router } from 'express';
import { login, me, logout } from '../controllers/auth.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/login', asyncHandler(login));
router.get('/me', authenticateToken, me);
router.post('/logout', logout);

export default router;

