import express from 'express';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skillController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSkills);
router.post('/', authenticateAdmin, createSkill);
router.put('/:id', authenticateAdmin, updateSkill);
router.delete('/:id', authenticateAdmin, deleteSkill);

export default router;
