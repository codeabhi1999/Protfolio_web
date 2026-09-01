import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProfile);
router.put('/', authenticateAdmin, updateProfile);

export default router;
