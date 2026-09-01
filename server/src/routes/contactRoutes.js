import express from 'express';
import { submitMessage, getMessages, updateMessageStatus, deleteMessage } from '../controllers/contactController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitMessage);
router.get('/', authenticateAdmin, getMessages);
router.patch('/:id', authenticateAdmin, updateMessageStatus);
router.delete('/:id', authenticateAdmin, deleteMessage);

export default router;
