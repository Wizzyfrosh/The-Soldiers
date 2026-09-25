import { Router } from 'express';
import { prisma } from '../db.js';

export const donationsRouter = Router();

// GET /api/donations (Admin Giving Ledger)
donationsRouter.get('/', async (req, res) => {
  try {
    const rawDonations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const donations = rawDonations.map(d => ({
      id: d.id,
      donorName: d.donorName,
      email: d.email,
      amount: d.amount,
      frequency: d.frequency === 'MONTHLY' ? 'monthly' : 'one-time',
      fund: d.fund,
      status: d.status,
      date: d.createdAt ? d.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }));

    const totalAmount = donations
      .filter(d => d.status === 'Completed')
      .reduce((sum, d) => sum + d.amount, 0);

    const recurringDonations = donations.filter(d => d.frequency === 'monthly');
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
      donation: {
        ...donation,
        date: donation.createdAt.toISOString().split('T')[0],
        frequency: donation.frequency === 'MONTHLY' ? 'monthly' : 'one-time'
      }
    });
  } catch (error: any) {
    console.error('Create donation error:', error);
    return res.status(500).json({ error: 'Failed to record donation.' });
  }
});

// PUT /api/donations/:id (Admin Update)
donationsRouter.put('/:id', async (req, res) => {
  try {
    const { donorName, email, amount, fund, status } = req.body;

    const donation = await prisma.donation.update({
      where: { id: req.params.id },
      data: {
        ...(donorName && { donorName }),
        ...(email && { email }),
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(fund && { fund }),
        ...(status && { status })
      }
    });

    return res.json({
      message: 'Donation updated successfully.',
      donation: {
        ...donation,
        date: donation.createdAt.toISOString().split('T')[0],
        frequency: donation.frequency === 'MONTHLY' ? 'monthly' : 'one-time'
      }
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Donation record not found in database.' });
    }
    console.error('Update donation error:', error);
    return res.status(500).json({ error: 'Failed to update donation.' });
  }
});

// DELETE /api/donations/:id (Admin Delete)
donationsRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.donation.delete({
      where: { id: req.params.id }
    });

    return res.json({ message: 'Donation deleted successfully.' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Record does not exist in DB or was already removed
      return res.json({ message: 'Donation removed successfully.' });
    }
    console.error('Delete donation error:', error);
    return res.status(500).json({ error: 'Failed to delete donation.' });
  }
});
