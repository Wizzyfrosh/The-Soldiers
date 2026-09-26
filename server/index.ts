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
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

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
