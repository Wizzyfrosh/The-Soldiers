import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL not set in .env");
  process.exit(1);
}

const sql = neon(dbUrl);

async function main() {
  console.log('⚡ Initializing Neon PostgreSQL Database tables & seeding production records...');

  // 1. Create Enums & Tables if not created
  await sql`
    CREATE TABLE IF NOT EXISTS "User" (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'EDITOR',
      "avatarUrl" TEXT,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "Event" (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT DEFAULT 'Worship',
      "registrationRequired" BOOLEAN DEFAULT true,
      capacity INT DEFAULT 300,
      "registrationsCount" INT DEFAULT 0,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "Sermon" (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      "youtubeId" TEXT NOT NULL,
      speaker TEXT NOT NULL,
      series TEXT NOT NULL,
      date TEXT NOT NULL,
      featured BOOLEAN DEFAULT false,
      description TEXT NOT NULL,
      scripture TEXT,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "FormSubmission" (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      "isRead" BOOLEAN DEFAULT false,
      "isPrivate" BOOLEAN DEFAULT false,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "Donation" (
      id TEXT PRIMARY KEY,
      "donorName" TEXT NOT NULL,
      email TEXT NOT NULL,
      amount DOUBLE PRECISION NOT NULL,
      frequency TEXT DEFAULT 'one-time',
      fund TEXT DEFAULT 'General Fund',
      status TEXT DEFAULT 'Completed',
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "SiteContent" (
      id TEXT PRIMARY KEY,
      "heroTitle" TEXT NOT NULL,
      "heroSubheadline" TEXT NOT NULL,
      "tickerMessage" TEXT NOT NULL,
      "seasonalTitle" TEXT NOT NULL,
      "seasonalSubheadline" TEXT NOT NULL,
      "seasonalBody" TEXT NOT NULL,
      "sundayServiceTime" TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log('✅ Created PostgreSQL Database tables on Neon!');

  // 2. Seed Admin Account
  await sql`
    INSERT INTO "User" (id, name, email, password, role, "avatarUrl")
    VALUES (
      'u-admin-1',
      'Pastor David Vance',
      'admin@soldiersofjesuschrist.org',
      '$2a$12$eW6Y0x8s2zRkL4q5T6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4',
      'SUPER_ADMIN',
      '/images/pastor.jpg'
    )
    ON CONFLICT (email) DO NOTHING;
  `;

  console.log('✅ Admin Account Initialized: admin@soldiersofjesuschrist.org');

  // 3. Seed Site Content Singleton
  await sql`
    INSERT INTO "SiteContent" (
      id, "heroTitle", "heroSubheadline", "tickerMessage",
      "seasonalTitle", "seasonalSubheadline", "seasonalBody",
      "sundayServiceTime", address, phone, email
    )
    VALUES (
      'singleton',
      'WELCOME TO SOLDIERS OF JESUS CHRIST',
      'A Church You Can Call Home. A Cause You Can Die For.',
      'EQUIPPING THE SAINTS FOR THE BATTLE • STANDING FIRM IN FAITH • WELCOME HOME',
      'What''s Summer & Fall @ The Soldiers All About?',
      'Going all-in on community, connection, and spiritual breakthrough every Sunday.',
      'This season, we are calling you back home—and into purpose. Discover where you fit in ministry. Get involved in small groups, prayer watch, and community outreach. Let''s grow stronger together as one family in Christ!',
      'SUNDAYS AT 10:00 AM',
      '1709 John Barrow Rd. Little Rock, AR 72204',
      '(501) 555-0199',
      'info@soldiersofjesuschrist.org'
    )
    ON CONFLICT (id) DO NOTHING;
  `;

  console.log('✅ Site Content Singleton Seeded!');

  // 4. Seed Events
  await sql`
    INSERT INTO "Event" (id, title, description, date, time, location, image, category, "registrationRequired", capacity, "registrationsCount")
    VALUES 
    ('ev-1', 'Night of Worship & Prophetic Fire', 'An explosive evening of immersive worship, personal prayer ministry, and powerful impartation.', '2026-09-27', '6:30 PM - 9:00 PM', 'Main Sanctuary', '/images/worship_hero.jpg', 'Worship', true, 400, 184),
    ('ev-2', 'Mighty Men Annual Brotherhood BBQ & Range Day', 'Fellowship, iron sharpening iron, powerful testimony, and steak dinner.', '2026-10-03', '9:00 AM - 2:00 PM', 'Soldiers Fellowship Grounds', '/images/mens.jpg', 'Men', true, 150, 92),
    ('ev-3', 'Women of Valor Fall Retreat: Crowned in Glory', 'A 2-day spiritual retreat empowering women to step into their divine identity.', '2026-10-16', '5:00 PM - 4:00 PM', 'Mountain Pines Lodge', '/images/womens.jpg', 'Women', true, 200, 145)
    ON CONFLICT (id) DO NOTHING;
  `;

  console.log('✅ Live Events Seeded!');

  // 5. Seed Sermons
  await sql`
    INSERT INTO "Sermon" (id, title, "youtubeId", speaker, series, date, featured, description, scripture)
    VALUES 
    ('ser-1', 'Putting On The Whole Armor of God', 'Lw8jG2nOQp8', 'Pastor David Vance', 'Spiritual Warfare 101', '2026-09-13', true, 'Discover how to stand firm against the schemes of the enemy by clothing yourself in truth, righteousness, and the Word of God.', 'Ephesians 6:10-18'),
    ('ser-2', 'Unshakable Faith in Troubled Times', 'kJQP7kiw5Fk', 'Pastor David Vance', 'Standing Firm', '2026-09-06', true, 'When the foundations are shaken, where do the righteous stand? Learn how covenant promises ground your soul.', 'Psalm 11:3, Hebrews 12:28')
    ON CONFLICT (id) DO NOTHING;
  `;

  console.log('✅ Live Sermons Seeded!');

  console.log('🎉 PRODUCTION NEON POSTGRESQL DATABASE IS 100% READY!');
}

main().catch(err => console.error('Seed Error:', err));
