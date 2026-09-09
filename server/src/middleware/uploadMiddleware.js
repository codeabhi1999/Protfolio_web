import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Ensure upload directories exist safely for both local and serverless environments
const uploadDir = process.env.VERCEL ? path.join(os.tmpdir(), 'uploads') : './public/uploads';
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  // Safe ignore for serverless read-only filesystem
}

// Storage engine configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (e) {}
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique name: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// File filter validation
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.pdf', '.docx', '.doc'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (.png, .jpg, .jpeg, .webp) and documents (.pdf, .doc, .docx) are allowed'), false);
  }
};

// Limits: max file size of 5MB
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
