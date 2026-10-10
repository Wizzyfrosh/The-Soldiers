import { Router } from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { prisma } from '../db.js';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth.js';

export const twoFactorRouter = Router();

// Fallback in-memory 2FA store when DB is offline or for fallback admin
export const fallback2FAUsers = new Map<string, { twoFactorSecret: string | null; backupCodes: string[] }>();

async function getUser2FA(userId: string, email?: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, twoFactorSecret: true, backupCodes: true }
    });
    if (user) return user;
  } catch (err: any) {
    console.warn('Prisma 2FA query failed, using in-memory fallback:', err.message);
  }
  const mem = fallback2FAUsers.get(userId);
  return {
    id: userId,
    email: email || 'admin@soldiersofjesuschrist.org',
    twoFactorSecret: mem?.twoFactorSecret || null,
    backupCodes: mem?.backupCodes || []
  };
}

// ── Generate 2FA secret & QR code for enrollment ──────────────────
// POST /api/2fa/setup
twoFactorRouter.post('/setup', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const user = await getUser2FA(req.user.id, req.user.email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.twoFactorSecret) {
      return res.status(400).json({ error: '2FA is already enabled for this account.' });
    }

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `SJC Admin (${user.email})`,
      issuer: 'Soldiers of Jesus Christ',
      length: 20
    });

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    return res.json({
      message: 'Scan this QR code with your authenticator app',
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      otpauthUrl: secret.otpauth_url
    });
  } catch (error: any) {
    console.error('2FA setup error:', error);
    return res.status(500).json({ error: 'Failed to generate 2FA setup.' });
  }
});

// ── Verify TOTP code and save secret to DB ────────────────────────
// POST /api/2fa/verify-setup
twoFactorRouter.post('/verify-setup', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { secret, token } = req.body;
    if (!secret || !token) {
      return res.status(400).json({ error: 'Secret and verification code are required.' });
    }

    // Verify the TOTP token against the provided secret
    const isValid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: token.replace(/\s/g, ''),
      window: 2 // Allow ±2 time steps (60 seconds tolerance)
    });

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid verification code. Please try again.' });
    }

    // Generate backup codes
    const backupCodes: string[] = [];
    for (let i = 0; i < 8; i++) {
      backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }

    // Save the verified secret and backup codes to the database or fallback
    try {
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          twoFactorSecret: secret,
          backupCodes: backupCodes
        }
      });
    } catch (err: any) {
      console.warn('Prisma 2FA update failed, storing in memory fallback:', err.message);
    }

    fallback2FAUsers.set(req.user.id, {
      twoFactorSecret: secret,
      backupCodes: backupCodes
    });

    return res.json({
      message: '2FA has been successfully enabled!',
      backupCodes
    });
  } catch (error: any) {
    console.error('2FA verify-setup error:', error);
    return res.status(500).json({ error: 'Failed to verify 2FA setup.' });
  }
});

// ── Verify TOTP code during login ─────────────────────────────────
// POST /api/2fa/verify-login
twoFactorRouter.post('/verify-login', async (req, res) => {
  try {
    const { userId, token } = req.body;
    if (!userId || !token) {
      return res.status(400).json({ error: 'User ID and verification code are required.' });
    }

    const user = await getUser2FA(userId);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ error: '2FA is not enabled for this account.' });
    }

    const code = token.replace(/\s/g, '');

    // First, check TOTP code
    const isValidTotp = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2
    });

    if (isValidTotp) {
      return res.json({ verified: true, message: '2FA verification successful.' });
    }

    // If TOTP fails, check backup codes
    const upperCode = code.toUpperCase();
    if (user.backupCodes.includes(upperCode)) {
      const remainingCodes = user.backupCodes.filter(c => c !== upperCode);
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { backupCodes: remainingCodes }
        });
      } catch (err: any) {
        console.warn('Prisma update backup codes failed:', err.message);
      }

      fallback2FAUsers.set(user.id, {
        twoFactorSecret: user.twoFactorSecret,
        backupCodes: remainingCodes
      });

      return res.json({
        verified: true,
        message: '2FA verified using backup code.',
        usedBackupCode: true,
        remainingBackupCodes: remainingCodes.length
      });
    }

    return res.status(400).json({ error: 'Invalid verification code.' });
  } catch (error: any) {
    console.error('2FA verify-login error:', error);
    return res.status(500).json({ error: 'Failed to verify 2FA code.' });
  }
});

// ── Disable 2FA ───────────────────────────────────────────────────
// POST /api/2fa/disable
twoFactorRouter.post('/disable', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Verification code is required to disable 2FA.' });
    }

    const user = await getUser2FA(req.user.id);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ error: '2FA is not currently enabled.' });
    }

    // Verify the code before allowing disable
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token.replace(/\s/g, ''),
      window: 2
    });

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid verification code. Cannot disable 2FA.' });
    }

    try {
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          twoFactorSecret: null,
          backupCodes: []
        }
      });
    } catch (err: any) {
      console.warn('Prisma disable 2FA failed, resetting in memory fallback:', err.message);
    }

    fallback2FAUsers.set(req.user.id, {
      twoFactorSecret: null,
      backupCodes: []
    });

    return res.json({ message: '2FA has been disabled successfully.' });
  } catch (error: any) {
    console.error('2FA disable error:', error);
    return res.status(500).json({ error: 'Failed to disable 2FA.' });
  }
});

// ── Check 2FA status ──────────────────────────────────────────────
// GET /api/2fa/status
twoFactorRouter.get('/status', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const user = await getUser2FA(req.user.id);
    return res.json({
      enabled: !!user.twoFactorSecret,
      backupCodesCount: user.backupCodes?.length || 0
    });
  } catch (error: any) {
    console.error('2FA status error:', error);
    return res.status(500).json({ error: 'Failed to check 2FA status.' });
  }
});
