import express from 'express';
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:idOrSlug', getProject);
router.post('/', authenticateAdmin, createProject);
router.put('/:id', authenticateAdmin, updateProject);
router.delete('/:id', authenticateAdmin, deleteProject);

export default router;
