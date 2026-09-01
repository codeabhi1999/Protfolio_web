import express from 'express';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../controllers/experienceController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getExperiences);
router.post('/', authenticateAdmin, createExperience);
router.put('/:id', authenticateAdmin, updateExperience);
router.delete('/:id', authenticateAdmin, deleteExperience);

export default router;
