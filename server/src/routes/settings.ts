import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.js';
import { authenticateToken, requireRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticateToken, requireRoles('Admin'), updateSettings);

export default router;

