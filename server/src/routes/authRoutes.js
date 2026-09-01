import express from 'express';
import { loginAdmin, logoutAdmin, getMe } from '../controllers/authController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', authenticateAdmin, logoutAdmin);
router.get('/me', authenticateAdmin, getMe);

export default router;
