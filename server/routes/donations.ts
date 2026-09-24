import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

export const donationsRouter = Router();

// GET /api/donations (Admin - Super Admin only as per PRD RBAC)
donationsRouter.get('/', authenticateToken, requireRole(['SUPER_ADMIN']), async (req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const totalAmount = donations
      .filter(d => d.status === 'Completed')
      .reduce((sum, d) => sum + d.amount, 0);

    const recurringDonations = donations.filter(d => d.frequency === 'MONTHLY');
    const monthlyTotal = recurringDonations.reduce((sum, d) => sum + d.amount, 0);

    return res.json({
      donations,
      stats: {
        totalAmount,
        totalDonationsCount: donations.length,
        monthlyRecurringTotal: monthlyTotal,
        monthlyRecurringCount: recurringDonations.length
      }
    });
  } catch (error: any) {
    console.error('Fetch donations error:', error);
    return res.status(500).json({ error: 'Failed to retrieve donations.' });
  }
});

// POST /api/donations (Record Donation)
donationsRouter.post('/', async (req, res) => {
  try {
    const { donorName, email, amount, frequency, fund, stripeTxId } = req.body;

    if (!donorName || !email || !amount) {
      return res.status(400).json({ error: 'Donor name, email, and amount are required.' });
    }

    const validFrequency = frequency?.toUpperCase() === 'MONTHLY' ? 'MONTHLY' : 'ONE_TIME';

    const donation = await prisma.donation.create({
      data: {
        donorName,
        email,
        amount: parseFloat(amount),
        frequency: validFrequency,
        fund: fund || 'General Fund',
        status: 'Completed',
        stripeTxId: stripeTxId || null
      }
    });

    return res.status(201).json({
      message: 'Thank you for your generous Kingdom seed! Donation recorded.',
      donation
    });
  } catch (error: any) {
    console.error('Create donation error:', error);
    return res.status(500).json({ error: 'Failed to record donation.' });
  }
});
