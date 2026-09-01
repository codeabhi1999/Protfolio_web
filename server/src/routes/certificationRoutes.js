import express from 'express';
import { getCertifications, createCertification, updateCertification, deleteCertification } from '../controllers/certificationController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCertifications);
router.post('/', authenticateAdmin, createCertification);
router.put('/:id', authenticateAdmin, updateCertification);
router.delete('/:id', authenticateAdmin, deleteCertification);

export default router;
