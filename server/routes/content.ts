import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

export const contentRouter = Router();

// GET /api/content (Public)
contentRouter.get('/', async (req, res) => {
  try {
    let content = await prisma.siteContent.findUnique({
      where: { id: 'singleton' }
    });

    if (!content) {
      content = await prisma.siteContent.create({
        data: {
          id: 'singleton',
          heroTitle: 'WELCOME TO SOLDIERS OF JESUS CHRIST',
          heroSubheadline: 'A Church You Can Call Home. A Cause You Can Die For.',
          tickerMessage: 'EQUIPPING THE SAINTS FOR THE BATTLE • STANDING FIRM IN FAITH • WELCOME HOME',
          seasonalTitle: "What's Summer & Fall @ The Soldiers All About?",
          seasonalSubheadline: 'Going all-in on community, connection, and spiritual breakthrough every single Sunday.',
          seasonalBody: "This season, we are calling you back home—and into purpose. Discover where you fit in ministry. Get involved in small groups, prayer watch, and community outreach. Let's grow stronger together as one family in Christ!",
          sundayServiceTime: 'SUNDAYS AT 10:00 AM',
          address: 'Baltimore City, USA',
          phone: '(501) 555-0199',
          email: 'info@soldiersofjesuschrist.org'
        }
      });
    }

    return res.json({ content });
  } catch (error: any) {
    console.error('Fetch content error:', error);
    return res.status(500).json({ error: 'Failed to retrieve site content.' });
  }
});

// PUT /api/content (Admin)
contentRouter.put('/', authenticateToken, requireRole(['SUPER_ADMIN', 'EDITOR']), async (req, res) => {
  try {
    const {
      heroTitle,
      heroSubheadline,
      tickerMessage,
      seasonalTitle,
      seasonalSubheadline,
      seasonalBody,
      sundayServiceTime,
      address,
      phone,
      email
    } = req.body;

    const content = await prisma.siteContent.upsert({
      where: { id: 'singleton' },
      update: {
        ...(heroTitle && { heroTitle }),
        ...(heroSubheadline && { heroSubheadline }),
        ...(tickerMessage && { tickerMessage }),
        ...(seasonalTitle && { seasonalTitle }),
        ...(seasonalSubheadline && { seasonalSubheadline }),
        ...(seasonalBody && { seasonalBody }),
        ...(sundayServiceTime && { sundayServiceTime }),
        ...(address && { address }),
        ...(phone && { phone }),
        ...(email && { email })
      },
      create: {
        id: 'singleton',
        heroTitle: heroTitle || 'WELCOME TO SOLDIERS OF JESUS CHRIST',
        heroSubheadline: heroSubheadline || 'A Church You Can Call Home. A Cause You Can Die For.',
        tickerMessage: tickerMessage || 'EQUIPPING THE SAINTS FOR THE BATTLE',
        seasonalTitle: seasonalTitle || 'Summer & Fall Season',
        seasonalSubheadline: seasonalSubheadline || 'Join us this season',
        seasonalBody: seasonalBody || 'Welcome home to the Soldiers family.',
        sundayServiceTime: sundayServiceTime || 'SUNDAYS AT 10:00 AM',
        address: address || 'Baltimore City, USA',
        phone: phone || '(501) 555-0199',
        email: email || 'info@soldiersofjesuschrist.org'
      }
    });

    return res.json({ message: 'Site content updated successfully.', content });
  } catch (error: any) {
    console.error('Update content error:', error);
    return res.status(500).json({ error: 'Failed to update site content.' });
  }
});
