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
import { isPostgresConfigured, query } from './config/postgres.js';

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

// Trust reverse proxy (essential for Vercel, rate limiters, and secure cookies)
app.set('trust proxy', 1);

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allows cross-origin image requests
  })
);

// Resilient CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Never throw an unhandled Error that causes 500 crashes in Express
      callback(null, true);
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

// Rate Limiting Config (enabled only locally; Vercel platform manages edge rate limits)
if (!process.env.VERCEL) {
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    validate: false,
  });

  const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    validate: false,
  });

  app.use('/api', apiLimiter);
  app.use('/api/contact', contactLimiter);
}

// Mount API Routes (Both /api/* and /* supported for Vercel rewrite compatibility)
const registerRoutes = (prefix = '') => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/profile`, profileRoutes);
  app.use(`${prefix}/skills`, skillRoutes);
  app.use(`${prefix}/projects`, projectRoutes);
  app.use(`${prefix}/experience`, experienceRoutes);
  app.use(`${prefix}/education`, educationRoutes);
  app.use(`${prefix}/certifications`, certificationRoutes);
  app.use(`${prefix}/services`, serviceRoutes);
  app.use(`${prefix}/contact`, contactRoutes);
  app.use(`${prefix}/upload`, uploadRoutes);
};

registerRoutes('/api');
registerRoutes('');

// Base Health Check
app.get(['/', '/api'], (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Abhijeet Chavan Portfolio API Server',
    time: new Date().toISOString(),
  });
});

// Diagnostic Health Endpoint (Tests Database and Vercel Runtime Environment)
app.get(['/api/health', '/health'], async (req, res) => {
  let dbStatus = 'Not Connected';
  let adminCount = 0;
  let dbError = null;

  try {
    const dbTest = await query('SELECT count(*) as total FROM admin_users');
    dbStatus = 'Connected';
    adminCount = Number(dbTest.rows[0].total);
  } catch (err) {
    dbStatus = 'Error';
    dbError = err.message;
  }

  res.json({
    status: 'online',
    platform: process.env.VERCEL ? 'Vercel Serverless' : 'Local Node.js',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      adminCount,
      error: dbError,
    },
    env: {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
      hasAdminEmail: Boolean(process.env.ADMIN_EMAIL),
      nodeEnv: process.env.NODE_ENV,
    },
  });
});

// 404 JSON Catch-All
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: [${req.method}] ${req.originalUrl || req.url}`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server locally (avoid starting listen loop on Vercel Serverless or when imported)
const PORT = process.env.PORT || 5001;
if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const isDirectRun = process.argv[1] && (process.argv[1].includes('server.js') || process.argv[1].includes('nodemon'));
  if (isDirectRun) {
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  }
}

export default app;
