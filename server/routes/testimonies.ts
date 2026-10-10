import { Router } from 'express';
import { prisma } from '../db.js';

export const testimoniesRouter = Router();

let schemaChecked = false;

// Self-healing: ensure 'name' column exists in Testimony table
async function ensureTestimonySchema() {
  if (schemaChecked) return;
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Testimony" ADD COLUMN IF NOT EXISTS "name" TEXT;`);
    schemaChecked = true;
  } catch (err: any) {
    console.warn('Auto-migration for Testimony.name failed (will use fallback):', err.message);
  }
}

// GET /api/testimonies (Public list)
testimoniesRouter.get('/', async (req, res) => {
  try {
    await ensureTestimonySchema();
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    let testimonies: any[];
    try {
      testimonies = await prisma.testimony.findMany({
        orderBy: { createdAt: 'desc' },
        ...(limit && { take: limit })
      });
    } catch (dbErr: any) {
      if (dbErr.message?.includes('name') && dbErr.message?.includes('column')) {
        // Attempt ALTER TABLE and retry
        try {
          await prisma.$executeRawUnsafe(`ALTER TABLE "Testimony" ADD COLUMN IF NOT EXISTS "name" TEXT;`);
          schemaChecked = true;
          testimonies = await prisma.testimony.findMany({
            orderBy: { createdAt: 'desc' },
            ...(limit && { take: limit })
          });
        } catch (retryErr) {
          // Fall back to querying without the name column so data is never lost
          const rawLimit = limit ? `LIMIT ${limit}` : '';
          const rawRows: any = await prisma.$queryRawUnsafe(
            `SELECT "id", "title", "content", "image", "createdAt" FROM "Testimony" ORDER BY "createdAt" DESC ${rawLimit}`
          );
          testimonies = rawRows.map((r: any) => ({ ...r, name: null }));
        }
      } else {
        throw dbErr;
      }
    }

    return res.json({ testimonies });
  } catch (error: any) {
    console.error('Fetch testimonies error:', error);
    return res.status(500).json({ error: 'Failed to retrieve testimonies.' });
  }
});

// GET /api/testimonies/:id (Public detail)
testimoniesRouter.get('/:id', async (req, res) => {
  try {
    let testimony: any;
    try {
      testimony = await prisma.testimony.findUnique({
        where: { id: req.params.id }
      });
    } catch (err: any) {
      if (err.message?.includes('name') && err.message?.includes('column')) {
        const rows: any = await prisma.$queryRawUnsafe(
          `SELECT "id", "title", "content", "image", "createdAt" FROM "Testimony" WHERE "id" = $1 LIMIT 1`,
          req.params.id
        );
        testimony = rows[0] ? { ...rows[0], name: null } : null;
      } else {
        throw err;
      }
    }

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
testimoniesRouter.post('/', async (req, res) => {
  try {
    const { title, content, image, name } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    const defaultImage = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400';

    await ensureTestimonySchema();

    let testimony: any;
    try {
      testimony = await prisma.testimony.create({
        data: {
          title: String(title).trim(),
          content: String(content).trim(),
          image: (image && String(image).trim()) || defaultImage,
          name: name ? String(name).trim() : null
        }
      });
    } catch (createErr: any) {
      if (createErr.message?.includes('name') && createErr.message?.includes('column')) {
        // 1. Attempt ALTER TABLE and retry prisma.create
        try {
          await prisma.$executeRawUnsafe(`ALTER TABLE "Testimony" ADD COLUMN IF NOT EXISTS "name" TEXT;`);
          schemaChecked = true;
          testimony = await prisma.testimony.create({
            data: {
              title: String(title).trim(),
              content: String(content).trim(),
              image: (image && String(image).trim()) || defaultImage,
              name: name ? String(name).trim() : null
            }
          });
        } catch (retryErr: any) {
          // 2. If ALTER TABLE fails, insert with raw SQL omitting the missing column
          const cuid = 'c' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
          await prisma.$executeRawUnsafe(
            `INSERT INTO "Testimony" ("id", "title", "content", "image", "createdAt") VALUES ($1, $2, $3, $4, NOW())`,
            cuid,
            String(title).trim(),
            String(content).trim(),
            (image && String(image).trim()) || defaultImage
          );
          testimony = {
            id: cuid,
            title: String(title).trim(),
            content: String(content).trim(),
            image: (image && String(image).trim()) || defaultImage,
            name: name ? String(name).trim() : null,
            createdAt: new Date()
          };
        }
      } else {
        throw createErr;
      }
    }

    return res.status(201).json({ message: 'Testimony published successfully.', testimony });
  } catch (error: any) {
    console.error('Create testimony error:', error);
    return res.status(500).json({ error: error.message || 'Failed to publish testimony.' });
  }
});

// DELETE /api/testimonies/:id (Delete testimony - Admin)
testimoniesRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.testimony.delete({
      where: { id: req.params.id }
    });

    return res.json({ message: 'Testimony deleted successfully.' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.json({ message: 'Testimony removed successfully.' });
    }
    console.error('Delete testimony error:', error);
    return res.status(500).json({ error: 'Failed to delete testimony.' });
  }
});
