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
function extractYoutubeId(input?: string): string | null {
  if (!input) return null;
  const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) return match[1];
  if (input.length === 11 && !input.includes('/')) return input;
  return null;
}

// POST /api/sermons (Admin)
sermonsRouter.post('/', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const { title, youtubeId, videoUrl, thumbnail, speaker, series, date, featured, description, scripture } = req.body;

    if (!title || (!youtubeId && !videoUrl) || !speaker || !series || !date) {
      return res.status(400).json({ error: 'Missing required sermon fields (Title, Video URL / YouTube ID, Speaker, Series, Date).' });
    }

    const resolvedYoutubeId = extractYoutubeId(youtubeId || videoUrl);

    const sermon = await prisma.sermon.create({
      data: {
        title,
        youtubeId: resolvedYoutubeId,
        videoUrl: videoUrl || null,
        thumbnail: thumbnail || (resolvedYoutubeId ? `https://img.youtube.com/vi/${resolvedYoutubeId}/maxresdefault.jpg` : null),
        speaker,
        series,
        date,
        featured: Boolean(featured),
        description: description || '',
        scripture: scripture || null
      }
    });

    return res.status(201).json({ message: 'Sermon published successfully.', sermon });
  } catch (error: any) {
    console.error('Create sermon error:', error);
    return res.status(500).json({ error: 'Failed to publish sermon.' });
  }
});

// PUT /api/sermons/:id (Admin)
sermonsRouter.put('/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const { title, youtubeId, videoUrl, thumbnail, speaker, series, date, featured, description, scripture } = req.body;

    const resolvedYoutubeId = (youtubeId || videoUrl) ? extractYoutubeId(youtubeId || videoUrl) : undefined;

    const sermon = await prisma.sermon.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(resolvedYoutubeId !== undefined && { youtubeId: resolvedYoutubeId }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(speaker && { speaker }),
        ...(series && { series }),
        ...(date && { date }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(description !== undefined && { description }),
        ...(scripture !== undefined && { scripture })
      }
    });

    return res.json({ message: 'Sermon updated successfully.', sermon });
  } catch (error: any) {
    console.error('Update sermon error:', error);
    return res.status(500).json({ error: 'Failed to update sermon.' });
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
    console.error('Delete sermon error:', error);
    return res.status(500).json({ error: 'Failed to delete sermon.' });
  }
});
