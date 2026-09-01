import express from 'express';
import { getEducations, createEducation, updateEducation, deleteEducation } from '../controllers/educationController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEducations);
router.post('/', authenticateAdmin, createEducation);
router.put('/:id', authenticateAdmin, updateEducation);
router.delete('/:id', authenticateAdmin, deleteEducation);

export default router;
