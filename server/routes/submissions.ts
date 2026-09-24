import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

export const submissionsRouter = Router();

// POST /api/submissions (Public Form Submissions)
submissionsRouter.post('/', async (req, res) => {
  try {
    const { type, name, email, phone, message, isPrivate } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const validTypes = ['PRAYER_REQUEST', 'CONTACT', 'PLAN_VISIT', 'NEW_MEMBER'];
    const submissionType = validTypes.includes(type) ? type : 'CONTACT';

    const submission = await prisma.formSubmission.create({
      data: {
        type: submissionType,
        name,
        email,
        phone: phone || null,
        message,
        isPrivate: Boolean(isPrivate),
        isRead: false
      }
    });

    return res.status(201).json({
      message: 'Submission received successfully. Our team will review it shortly.',
      submission
    });
  } catch (error: any) {
    console.error('Submission error:', error);
    return res.status(500).json({ error: 'Failed to save submission.' });
  }
});

// GET /api/submissions (Admin Inbox)
submissionsRouter.get('/', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR', 'VIEWER']), async (req, res) => {
  try {
    const { type, unreadOnly } = req.query;

    const where: any = {};
    if (type && typeof type === 'string' && type !== 'ALL') {
      where.type = type;
    }
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const submissions = await prisma.formSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ submissions });
  } catch (error: any) {
    console.error('Fetch submissions error:', error);
    return res.status(500).json({ error: 'Failed to retrieve submissions.' });
  }
});

// PATCH /api/submissions/:id/toggle-read (Admin)
submissionsRouter.patch('/:id/toggle-read', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const existing = await prisma.formSubmission.findUnique({
      where: { id: req.params.id }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Submission not found.' });
    }

    const updated = await prisma.formSubmission.update({
      where: { id: req.params.id },
      data: { isRead: !existing.isRead }
    });

    return res.json({ message: 'Submission status updated.', submission: updated });
  } catch (error: any) {
    console.error('Toggle read error:', error);
    return res.status(500).json({ error: 'Failed to update submission status.' });
  }
});

// DELETE /api/submissions/:id (Super Admin only)
submissionsRouter.delete('/:id', authenticateToken, requireRole(['SUPER_ADMIN']), async (req, res) => {
  try {
    await prisma.formSubmission.delete({
      where: { id: req.params.id }
    });

    return res.json({ message: 'Submission deleted successfully.' });
  } catch (error: any) {
    console.error('Delete submission error:', error);
    return res.status(500).json({ error: 'Failed to delete submission.' });
  }
});
