import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Configuration imports
import errorHandler from './middleware/errorMiddleware.js';
import { isSupabaseConfigured } from './config/supabase.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Setup environment variables
dotenv.config();

// Resolve paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB Connection
if (isSupabaseConfigured()) {
  console.log('⚡ [Database] Connected to Supabase Cloud PostgreSQL');
} else {
  console.warn('⚠️ [Database] Supabase credentials not found in .env. Configure DATABASE_URL in server/.env');
}

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allows cross-origin image requests
  })
);

// Standard CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile/curl), localhost, or any vercel.app deployment
      if (
        !origin ||
        allowedOrigins.indexOf(origin) !== -1 ||
        /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dependency-free Cookie Parser Middleware
app.use((req, res, next) => {
  req.cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      if (parts[0]) {
        req.cookies[parts[0].trim()] = parts[1]
          ? decodeURIComponent(parts[1].trim())
          : '';
      }
    });
  }
  next();
});

// Create uploads directory if it does not exist (safely handled for serverless environments)
const publicUploadsDir = path.join(__dirname, '../public/uploads');
try {
  if (!fs.existsSync(publicUploadsDir)) {
    fs.mkdirSync(publicUploadsDir, { recursive: true });
  }
} catch (e) {
  // In read-only serverless environments like AWS Lambda/Vercel, ignore local fs errors
}

// Serve file uploads statically
app.use('/uploads', express.static(publicUploadsDir));

// Rate Limiting Config
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 contact forms submissions per hour
  message: {
    success: false,
    message: 'Too many contact messages sent from this IP. Please try again after an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limits
app.use('/api', apiLimiter);
app.use('/api/contact', contactLimiter);

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Abhijeet Chavan Portfolio API Server',
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server locally (avoid starting listen loop on Vercel Serverless)
const PORT = process.env.PORT || 5001;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
