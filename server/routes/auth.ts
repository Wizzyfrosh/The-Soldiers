import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db.js';
import { authenticateToken, AuthenticatedRequest, generateToken } from '../middleware/auth.js';

export const authRouter = Router();

// ── In-memory login rate limiter (brute-force protection) ──────────────
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

function checkRateLimit(req: Request, res: Response): boolean {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record) {
    // Reset window if expired
    if (now - record.firstAttempt > WINDOW_MS) {
      loginAttempts.delete(ip);
    } else if (record.count >= MAX_ATTEMPTS) {
      const retryAfter = Math.ceil((record.firstAttempt + WINDOW_MS - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      res.status(429).json({
        error: `Too many login attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`
      });
      return false;
    }
  }
  return true;
}

function recordFailedAttempt(req: Request) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (record && now - record.firstAttempt <= WINDOW_MS) {
    record.count++;
  } else {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  }
}

function clearAttempts(req: Request) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  loginAttempts.delete(ip);
}

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    // Rate limit check
    if (!checkRateLimit(req, res)) return;

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    let targetUser: { id: string; name: string; email: string; role: string; avatarUrl?: string } | null = null;

    let userInDb: any = null;
    try {
      userInDb = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() }
      });
    } catch (dbErr) {
      console.warn('⚠️ Database query failed during login, checking environment fallback credentials:', dbErr);
    }

    if (userInDb) {
      const isMatch = await bcrypt.compare(password, userInDb.password);
      if (!isMatch) {
        recordFailedAttempt(req);
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      targetUser = {
        id: userInDb.id,
        name: userInDb.name,
        email: userInDb.email,
        role: userInDb.role,
        avatarUrl: userInDb.avatarUrl
      };
    } else {
      // Fallback check against environment seed credentials if DB is unseeded or offline
      const adminSeedPass = process.env.ADMIN_SEED_PASSWORD || 'Work4Jesus!';
      const normalizedEmail = email.toLowerCase().trim();

      const isAdminMatch = (normalizedEmail === 'admin@soldiersofjesuschrist.org' || normalizedEmail === 'admin@soldiers.org') && password === adminSeedPass;

      if (isAdminMatch) {
        targetUser = {
          id: 'admin-fallback-1',
          name: 'Prophet Ebelechukwu Elochukwu',
          email: 'admin@soldiersofjesuschrist.org',
          role: 'SUPER_ADMIN',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
        };
      } else {
        recordFailedAttempt(req);
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
    }

    // Success — clear rate limit record
    clearAttempts(req);

    const safeUser = targetUser;
    const token = generateToken(safeUser);

    return res.json({
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

// GET /api/auth/me
authRouter.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    return res.json({ user });
  } catch (error: any) {
    console.error('Get me error:', error);
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});
