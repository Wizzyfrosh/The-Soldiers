import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

export const statsRouter = Router();

// GET /api/admin/stats
statsRouter.get('/', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR', 'VIEWER']), async (req, res) => {
  try {
    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN';

    // 1. Upcoming events count
    const today = new Date().toISOString().split('T')[0];
    const upcomingEventsCount = await prisma.event.count({
      where: { date: { gte: today } }
    });

    // 2. Unread submissions count
    const unreadSubmissionsCount = await prisma.formSubmission.count({
      where: { isRead: false }
    });

    // 3. Sermons count
    const totalSermonsCount = await prisma.sermon.count();

    // 4. Donations (Visible only to SUPER_ADMIN per PRD RBAC)
    let totalDonationsThisMonth = 0;
    let donationsCount = 0;

    if (isSuperAdmin) {
      const donations = await prisma.donation.findMany({
        where: { status: 'Completed' }
      });
      totalDonationsThisMonth = donations.reduce((sum, d) => sum + d.amount, 0);
      donationsCount = donations.length;
    }

    // 5. Recent Submissions (Inbox snippet)
    const recentSubmissions = await prisma.formSubmission.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    // 6. Recent / Upcoming Events
    const recentEvents = await prisma.event.findMany({
      take: 4,
      orderBy: { date: 'asc' }
    });

    return res.json({
      stats: {
        totalDonationsThisMonth: isSuperAdmin ? totalDonationsThisMonth : null,
        donationsCount: isSuperAdmin ? donationsCount : null,
        upcomingEventsCount,
        unreadSubmissionsCount,
        totalSermonsCount
      },
      recentSubmissions,
      recentEvents
    });
  } catch (error: any) {
    console.error('Fetch stats error:', error);
    return res.status(500).json({ error: 'Failed to retrieve admin dashboard stats.' });
  }
});
