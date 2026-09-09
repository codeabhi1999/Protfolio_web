import express from 'express';
import { loginAdmin, logoutAdmin, getMe, updateCredentials } from '../controllers/authController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', authenticateAdmin, logoutAdmin);
router.get('/me', authenticateAdmin, getMe);
router.put('/update-credentials', authenticateAdmin, updateCredentials);

export default router;
