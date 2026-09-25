import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

export const sermonsRouter = Router();

// GET /api/sermons (Public)
sermonsRouter.get('/', async (req, res) => {
  try {
    const { series, speaker, search, featured } = req.query;

    const where: any = {};
    if (series && typeof series === 'string' && series !== 'All') {
      where.series = series;
    }
    if (speaker && typeof speaker === 'string' && speaker !== 'All') {
      where.speaker = speaker;
    }
    if (featured === 'true') {
      where.featured = true;
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { speaker: { contains: search, mode: 'insensitive' } },
        { series: { contains: search, mode: 'insensitive' } }
      ];
    }

    const sermons = await prisma.sermon.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    return res.json({ sermons });
  } catch (error: any) {
    console.error('Fetch sermons error:', error);
    return res.status(500).json({ error: 'Failed to retrieve sermons.' });
  }
});

// GET /api/sermons/:id (Public)
sermonsRouter.get('/:id', async (req, res) => {
  try {
    const sermon = await prisma.sermon.findUnique({
      where: { id: req.params.id }
    });

    if (!sermon) {
      return res.status(404).json({ error: 'Sermon not found.' });
    }

    return res.json({ sermon });
  } catch (error: any) {
    console.error('Get sermon error:', error);
    return res.status(500).json({ error: 'Failed to retrieve sermon.' });
  }
});

// Helper to extract YouTube ID from YouTube URL or ID
function extractYoutubeId(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?(?:.*&)?v=|live\/|shorts\/))([\w-]{11})/i);
  if (match && match[1]) return match[1];
  return null;
}

// POST /api/sermons (Admin)
sermonsRouter.post('/', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const { title, youtubeId, videoUrl, thumbnail, speaker, series, date, featured, description, scripture } = req.body;

    if (!title || !speaker || !series || !date) {
      return res.status(400).json({ error: 'Missing required sermon fields (Title, Speaker, Series, Date).' });
    }

    if (!youtubeId && !videoUrl) {
      return res.status(400).json({ error: 'Please provide either a valid YouTube link/ID or an uploaded video file.' });
    }

    const resolvedYoutubeId = youtubeId ? extractYoutubeId(youtubeId) : (videoUrl ? extractYoutubeId(videoUrl) : null);
    const defaultThumbnail = resolvedYoutubeId
      ? `https://img.youtube.com/vi/${resolvedYoutubeId}/hqdefault.jpg`
      : '/images/worship_hero.jpg';

    const sermon = await prisma.sermon.create({
      data: {
        title: title.trim(),
        youtubeId: resolvedYoutubeId,
        videoUrl: videoUrl || null,
        thumbnail: thumbnail?.trim() || defaultThumbnail,
        speaker: speaker.trim(),
        series: series.trim(),
        date,
        featured: Boolean(featured),
        description: description?.trim() || '',
        scripture: scripture?.trim() || null
      }
    });

    return res.status(201).json({ message: 'Sermon published successfully.', sermon });
  } catch (error: any) {
    console.error('Create sermon error:', error);
    return res.status(500).json({ error: error.message || 'Failed to publish sermon.' });
  }
});

// PUT /api/sermons/:id (Admin)
sermonsRouter.put('/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const { title, youtubeId, videoUrl, thumbnail, speaker, series, date, featured, description, scripture } = req.body;

    const resolvedYoutubeId = youtubeId !== undefined
      ? extractYoutubeId(youtubeId)
      : (videoUrl ? extractYoutubeId(videoUrl) : undefined);

    const defaultThumbnail = resolvedYoutubeId
      ? `https://img.youtube.com/vi/${resolvedYoutubeId}/hqdefault.jpg`
      : '/images/worship_hero.jpg';

    const sermon = await prisma.sermon.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(resolvedYoutubeId !== undefined && { youtubeId: resolvedYoutubeId }),
        ...(videoUrl !== undefined && { videoUrl: videoUrl || null }),
        ...(thumbnail !== undefined && { thumbnail: thumbnail?.trim() || defaultThumbnail }),
        ...(speaker !== undefined && { speaker: speaker.trim() }),
        ...(series !== undefined && { series: series.trim() }),
        ...(date !== undefined && { date }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(description !== undefined && { description: description?.trim() || '' }),
        ...(scripture !== undefined && { scripture: scripture?.trim() || null })
      }
    });

    return res.json({ message: 'Sermon updated successfully.', sermon });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Sermon record not found in database.' });
    }
    console.error('Update sermon error:', error);
    return res.status(500).json({ error: error.message || 'Failed to update sermon.' });
  }
});

// DELETE /api/sermons/:id (Admin)
sermonsRouter.delete('/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR']), async (req, res) => {
  try {
    await prisma.sermon.delete({
      where: { id: req.params.id }
    });

    return res.json({ message: 'Sermon deleted successfully.' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.json({ message: 'Sermon removed successfully.' });
    }
    console.error('Delete sermon error:', error);
    return res.status(500).json({ error: 'Failed to delete sermon.' });
  }
});
