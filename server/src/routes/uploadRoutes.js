import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Upload file/image (Protected)
// @route   POST /api/upload
// @access  Private
router.post('/', authenticateAdmin, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please select a file to upload');
    }

    // Return the relative url to access the file statically
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      url: fileUrl,
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
