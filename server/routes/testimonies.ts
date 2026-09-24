import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

export const testimoniesRouter = Router();

// GET /api/testimonies (Public list)
testimoniesRouter.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const testimonies = await prisma.testimony.findMany({
      orderBy: { createdAt: 'desc' },
      ...(limit && { take: limit })
    });

    return res.json({ testimonies });
  } catch (error: any) {
    console.error('Fetch testimonies error:', error);
    return res.status(500).json({ error: 'Failed to retrieve testimonies.' });
  }
});

// GET /api/testimonies/:id (Public detail)
testimoniesRouter.get('/:id', async (req, res) => {
  try {
    const testimony = await prisma.testimony.findUnique({
      where: { id: req.params.id }
    });

    if (!testimony) {
      return res.status(404).json({ error: 'Testimony not found.' });
    }

    return res.json({ testimony });
  } catch (error: any) {
    console.error('Fetch testimony error:', error);
    return res.status(500).json({ error: 'Failed to retrieve testimony.' });
  }
});

// POST /api/testimonies (Create testimony - Admin)
testimoniesRouter.post('/', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const { title, content, image } = req.body;

    if (!title || !content || !image) {
      return res.status(400).json({ error: 'Title, content, and image are required.' });
    }

    const testimony = await prisma.testimony.create({
      data: {
        title,
        content,
        image
      }
    });

    return res.status(201).json({ message: 'Testimony published successfully.', testimony });
  } catch (error: any) {
    console.error('Create testimony error:', error);
    return res.status(500).json({ error: 'Failed to publish testimony.' });
  }
});

// DELETE /api/testimonies/:id (Delete testimony - Admin)
testimoniesRouter.delete('/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR']), async (req, res) => {
  try {
    await prisma.testimony.delete({
      where: { id: req.params.id }
    });

    return res.json({ message: 'Testimony deleted successfully.' });
  } catch (error: any) {
    console.error('Delete testimony error:', error);
    return res.status(500).json({ error: 'Failed to delete testimony.' });
  }
});
