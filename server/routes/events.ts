import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

export const eventsRouter = Router();

// GET /api/events (Public & Admin filtering)
eventsRouter.get('/', async (req, res) => {
  try {
    const { category, search, tab = 'upcoming', all, status } = req.query;

    const now = new Date();
    const where: any = {};

    // 1. Admin mode vs Public mode
    if (all === 'true') {
      // Admin requests all events with optional status filter
      if (status && typeof status === 'string' && status !== 'ALL') {
        if (status === 'UPCOMING') {
          where.endDate = { gte: now };
          where.status = { not: 'DRAFT' };
        } else if (status === 'PAST') {
          where.endDate = { lt: now };
          where.status = { not: 'DRAFT' };
        } else {
          where.status = status;
        }
      }
    } else {
      // Public mode: only show PUBLISHED events
      where.status = 'PUBLISHED';

      if (tab === 'past') {
        // Past query: status: PUBLISHED, endDate < now
        where.endDate = { lt: now };
      } else {
        // Upcoming query: status: PUBLISHED, endDate >= now
        where.endDate = { gte: now };
      }
    }

    if (category && typeof category === 'string' && category !== 'All') {
      where.category = category;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ];
    }

    const orderBy = (tab === 'past' && all !== 'true') ? { endDate: 'desc' as const } : { startDate: 'asc' as const };
    const take = (tab === 'past' && all !== 'true') ? 50 : undefined;

    const events = await prisma.event.findMany({
      where,
      orderBy,
      take
    });

    return res.json({ events });
  } catch (error: any) {
    console.error('Fetch events error:', error);
    return res.status(500).json({ error: 'Failed to retrieve events.' });
  }
});

// GET /api/events/:id (Public)
eventsRouter.get('/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        registrations: {
          select: {
            id: true,
            name: true,
            guestsCount: true,
            registeredAt: true
          }
        }
      }
    });

    // Return 404 only for events that don't exist or have status === "DRAFT"
    if (!event || event.status === 'DRAFT') {
      return res.status(404).json({ error: 'Event not found.' });
    }

    return res.json({ event });
  } catch (error: any) {
    console.error('Get event error:', error);
    return res.status(500).json({ error: 'Failed to retrieve event.' });
  }
});

// POST /api/events (Admin)
eventsRouter.post('/', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const { title, description, date, startDate, endDate, status, time, location, image, category, registrationRequired, capacity } = req.body;

    if (!title || !description || !date || !time || !location) {
      return res.status(400).json({ error: 'Missing required event fields.' });
    }

    const parsedStartDate = startDate ? new Date(startDate) : new Date(date);
    const parsedEndDate = endDate ? new Date(endDate) : new Date(parsedStartDate.getTime() + 2 * 60 * 60 * 1000);

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date,
        startDate: isNaN(parsedStartDate.getTime()) ? new Date() : parsedStartDate,
        endDate: isNaN(parsedEndDate.getTime()) ? new Date(Date.now() + 2 * 60 * 60 * 1000) : parsedEndDate,
        status: status || 'PUBLISHED',
        time,
        location,
        image: image || null,
        category: category || 'Worship',
        registrationRequired: registrationRequired !== undefined ? Boolean(registrationRequired) : true,
        capacity: capacity ? parseInt(capacity, 10) : 300,
        registrationsCount: 0
      }
    });

    return res.status(201).json({ message: 'Event created successfully.', event });
  } catch (error: any) {
    console.error('Create event error:', error);
    return res.status(500).json({ error: 'Failed to create event.' });
  }
});

// PUT /api/events/:id (Admin)
eventsRouter.put('/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const { title, description, date, startDate, endDate, status, time, location, image, category, registrationRequired, capacity } = req.body;

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(status && { status }),
        ...(time && { time }),
        ...(location && { location }),
        ...(image && { image }),
        ...(category && { category }),
        ...(registrationRequired !== undefined && { registrationRequired: Boolean(registrationRequired) }),
        ...(capacity !== undefined && { capacity: parseInt(capacity, 10) })
      }
    });

    return res.json({ message: 'Event updated successfully.', event });
  } catch (error: any) {
    console.error('Update event error:', error);
    return res.status(500).json({ error: 'Failed to update event.' });
  }
});

// DELETE /api/events/:id (Admin)
eventsRouter.delete('/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR']), async (req, res) => {
  try {
    await prisma.event.delete({
      where: { id: req.params.id }
    });

    return res.json({ message: 'Event deleted successfully.' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.json({ message: 'Event removed successfully.' });
    }
    console.error('Delete event error:', error);
    return res.status(500).json({ error: 'Failed to delete event.' });
  }
});

// POST /api/events/:id/register (Public RSVP)
eventsRouter.post('/:id/register', async (req, res) => {
  try {
    const { name, email, phone, guestsCount } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required for registration.' });
    }

    const event = await prisma.event.findUnique({
      where: { id: req.params.id }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const count = guestsCount ? Math.max(1, parseInt(guestsCount, 10)) : 1;

    // Check capacity
    if (event.capacity && event.registrationsCount + count > event.capacity) {
      return res.status(400).json({ error: 'Sorry, this event has reached maximum capacity.' });
    }

    // Create registration and increment count in a transaction
    const [registration, updatedEvent] = await prisma.$transaction([
      prisma.eventRegistration.create({
        data: {
          eventId: event.id,
          name,
          email,
          phone: phone || null,
          guestsCount: count
        }
      }),
      prisma.event.update({
        where: { id: event.id },
        data: {
          registrationsCount: { increment: count }
        }
      })
    ]);

    return res.status(201).json({
      message: `Registration confirmed for ${name}!`,
      registration,
      event: updatedEvent
    });
  } catch (error: any) {
    console.error('Event registration error:', error);
    return res.status(500).json({ error: 'Failed to complete registration.' });
  }
});

// GET /api/events/:id/registrations (Admin)
eventsRouter.get('/:id/registrations', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: req.params.id },
      orderBy: { registeredAt: 'desc' }
    });

    return res.json({ registrations });
  } catch (error: any) {
    console.error('Fetch registrations error:', error);
    return res.status(500).json({ error: 'Failed to retrieve registrations.' });
  }
});
