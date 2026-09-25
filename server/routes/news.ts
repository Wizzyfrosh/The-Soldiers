import { Router } from 'express';
import { prisma } from '../db.js';

export const newsRouter = Router();

// GET /api/news (Public list)
newsRouter.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      ...(limit && { take: limit })
    });

    return res.json({ news });
  } catch (error: any) {
    console.error('Fetch news error:', error);
    return res.status(500).json({ error: 'Failed to retrieve news items.' });
  }
});

// GET /api/news/:id (Public detail)
newsRouter.get('/:id', async (req, res) => {
  try {
    const article = await prisma.news.findUnique({
      where: { id: req.params.id }
    });

    if (!article) {
      return res.status(404).json({ error: 'News article not found.' });
    }

    return res.json({ article });
  } catch (error: any) {
    console.error('Fetch news article error:', error);
    return res.status(500).json({ error: 'Failed to retrieve news article.' });
  }
});

// POST /api/news (Create news - Admin)
newsRouter.post('/', async (req, res) => {
  try {
    const { title, content, image } = req.body;

    if (!title || !content || !image) {
      return res.status(400).json({ error: 'Title, content, and image are required.' });
    }

    const article = await prisma.news.create({
      data: {
        title,
        content,
        image
      }
    });

    return res.status(201).json({ message: 'News article published successfully.', article });
  } catch (error: any) {
    console.error('Create news error:', error);
    return res.status(500).json({ error: 'Failed to publish news article.' });
  }
});

// DELETE /api/news/:id (Delete news - Admin)
newsRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.news.delete({
      where: { id: req.params.id }
    });

    return res.json({ message: 'News article deleted successfully.' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.json({ message: 'News article removed successfully.' });
    }
    console.error('Delete news error:', error);
    return res.status(500).json({ error: 'Failed to delete news article.' });
  }
});
