import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth.js';

export const liveStreamRouter = Router();

// Fallback in-memory singleton if database connection is unavailable
let fallbackStream = {
  id: 'singleton',
  title: 'Sunday Worship Service - Live',
  streamKey: null as string | null,
  playbackId: (process.env.NEXT_PUBLIC_MUX_PLAYBACK_ID || null) as string | null,
  isLive: false,
  updatedAt: new Date()
};

// ── Get live stream config (public) ───────────────────────────────
// GET /api/livestream
liveStreamRouter.get('/', async (_req, res) => {
  try {
    let stream = await prisma.liveStream.findUnique({ where: { id: 'singleton' } });
    
    if (!stream) {
      stream = await prisma.liveStream.create({
        data: {
          id: 'singleton',
          title: 'Sunday Worship Service - Live',
          isLive: false
        }
      });
    }

    // Public endpoint: only expose what viewers need
    return res.json({
      stream: {
        title: stream.title,
        playbackId: stream.playbackId,
        isLive: stream.isLive
      }
    });
  } catch (error: any) {
    console.warn('Livestream DB unavailable, using fallback:', error.message);
    return res.json({
      stream: {
        title: fallbackStream.title,
        playbackId: fallbackStream.playbackId,
        isLive: fallbackStream.isLive
      }
    });
  }
});

// ── Get full live stream config (admin) ───────────────────────────
// GET /api/livestream/admin
liveStreamRouter.get('/admin', authenticateToken, requireRole(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res) => {
  try {
    let stream = await prisma.liveStream.findUnique({ where: { id: 'singleton' } });
    
    if (!stream) {
      stream = await prisma.liveStream.create({
        data: {
          id: 'singleton',
          title: 'Sunday Worship Service - Live',
          isLive: false
        }
      });
    }

    return res.json({ stream });
  } catch (error: any) {
    console.warn('Admin livestream DB unavailable, using fallback:', error.message);
    return res.json({ stream: fallbackStream });
  }
});

// ── Update live stream config (admin) ─────────────────────────────
// PUT /api/livestream/admin
liveStreamRouter.put('/admin', authenticateToken, requireRole(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res) => {
  try {
    const { title, streamKey, playbackId, isLive } = req.body;

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (streamKey !== undefined) data.streamKey = streamKey;
    if (playbackId !== undefined) data.playbackId = playbackId;
    if (isLive !== undefined) data.isLive = Boolean(isLive);

    const stream = await prisma.liveStream.upsert({
      where: { id: 'singleton' },
      update: data,
      create: {
        id: 'singleton',
        title: title || 'Sunday Worship Service - Live',
        streamKey: streamKey || null,
        playbackId: playbackId || null,
        isLive: isLive || false,
        ...data
      }
    });

    return res.json({
      message: 'Live stream settings updated successfully.',
      stream
    });
  } catch (error: any) {
    console.warn('Update livestream DB unavailable, using fallback:', error.message);
    const { title, streamKey, playbackId, isLive } = req.body;
    if (title !== undefined) fallbackStream.title = title;
    if (streamKey !== undefined) fallbackStream.streamKey = streamKey;
    if (playbackId !== undefined) fallbackStream.playbackId = playbackId;
    if (isLive !== undefined) fallbackStream.isLive = Boolean(isLive);
    fallbackStream.updatedAt = new Date();
    return res.json({
      message: 'Live stream settings updated successfully (in-memory mode).',
      stream: fallbackStream
    });
  }
});

// ── Toggle live status (admin) ────────────────────────────────────
// POST /api/livestream/toggle
liveStreamRouter.post('/toggle', authenticateToken, requireRole(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res) => {
  try {
    const stream = await prisma.liveStream.findUnique({ where: { id: 'singleton' } });
    if (!stream) {
      return res.status(404).json({ error: 'Live stream config not found. Please save settings first.' });
    }

    const updated = await prisma.liveStream.update({
      where: { id: 'singleton' },
      data: { isLive: !stream.isLive }
    });

    return res.json({
      message: updated.isLive ? 'Stream is now LIVE!' : 'Stream has been stopped.',
      stream: updated
    });
  } catch (error: any) {
    console.warn('Toggle livestream DB unavailable, toggling fallback:', error.message);
    fallbackStream.isLive = !fallbackStream.isLive;
    fallbackStream.updatedAt = new Date();
    return res.json({
      message: fallbackStream.isLive ? 'Stream is now LIVE!' : 'Stream has been stopped.',
      stream: fallbackStream
    });
  }
});
