import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { sermonsRouter } from './routes/sermons.js';
import { eventsRouter } from './routes/events.js';
import { submissionsRouter } from './routes/submissions.js';
import { donationsRouter } from './routes/donations.js';
import { stripeRouter } from './routes/stripe.js';
import { contentRouter } from './routes/content.js';
import { usersRouter } from './routes/users.js';
import { statsRouter } from './routes/stats.js';
import { uploadRouter } from './routes/upload.js';
import { newsRouter } from './routes/news.js';
import { testimoniesRouter } from './routes/testimonies.js';
import { twoFactorRouter } from './routes/two-factor.js';
import { liveStreamRouter } from './routes/livestream.js';
import { prisma } from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Auto-sync missing columns and tables safely on startup (Vercel serverless + local)
async function syncDatabaseSchema() {
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Testimony" ADD COLUMN IF NOT EXISTS "name" TEXT;
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorSecret" TEXT;
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "backupCodes" TEXT[] DEFAULT ARRAY[]::TEXT[];
      CREATE TABLE IF NOT EXISTS "LiveStream" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
        "title" TEXT NOT NULL DEFAULT 'Sunday Worship Service - Live',
        "streamKey" TEXT,
        "playbackId" TEXT,
        "isLive" BOOLEAN NOT NULL DEFAULT false,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Database schema verified and synchronized.');
  } catch (err: any) {
    console.warn('⚠️ Non-fatal DB schema auto-sync notice:', err.message);
  }
}

syncDatabaseSchema();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve uploads statically
const uploadStaticDir = path.resolve(__dirname, '../public/uploads');
app.use('/uploads', express.static(uploadStaticDir));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Soldiers of Jesus Christ API',
    database: 'Neon PostgreSQL',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/sermons', sermonsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/donations', donationsRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/content', contentRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin/stats', statsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/news', newsRouter);
app.use('/api/testimonies', testimoniesRouter);
app.use('/api/2fa', twoFactorRouter);
app.use('/api/livestream', liveStreamRouter);

// 404 for unhandled API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
  }
  next();
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'An unexpected internal server error occurred.',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Soldiers of Jesus Christ Backend API running at http://localhost:${PORT}`);
    console.log(`📡 Connected to Neon PostgreSQL Database via Prisma`);
  });
}

export default app;
