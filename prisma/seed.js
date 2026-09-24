import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('⚡ Initializing & Seeding Neon PostgreSQL Database with Prisma Client...');

  // 1. Password Hashes
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const editorPasswordHash = await bcrypt.hash('editor123', 10);
  const viewerPasswordHash = await bcrypt.hash('viewer123', 10);

  // 2. Seed Users
  await prisma.user.upsert({
    where: { email: 'admin@soldiersofjesuschrist.org' },
    update: {
      password: adminPasswordHash,
      role: 'SUPER_ADMIN',
      name: 'Pastor David Vance',
      avatarUrl: '/images/pastor.jpg'
    },
    create: {
      id: 'u-admin-1',
      name: 'Pastor David Vance',
      email: 'admin@soldiersofjesuschrist.org',
      password: adminPasswordHash,
      role: 'SUPER_ADMIN',
      avatarUrl: '/images/pastor.jpg'
    }
  });

  await prisma.user.upsert({
    where: { email: 'editor@soldiersofjesuschrist.org' },
    update: {
      password: editorPasswordHash,
      role: 'EDITOR',
      name: 'Sarah Coleman (Media Director)',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
    },
    create: {
      id: 'u-editor-1',
      name: 'Sarah Coleman (Media Director)',
      email: 'editor@soldiersofjesuschrist.org',
      password: editorPasswordHash,
      role: 'EDITOR',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
    }
  });

  await prisma.user.upsert({
    where: { email: 'viewer@soldiersofjesuschrist.org' },
    update: {
      password: viewerPasswordHash,
      role: 'VIEWER',
      name: 'Elder Marcus Thorne',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    create: {
      id: 'u-viewer-1',
      name: 'Elder Marcus Thorne',
      email: 'viewer@soldiersofjesuschrist.org',
      password: viewerPasswordHash,
      role: 'VIEWER',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    }
  });
  console.log('✅ Admin Users Seeded (admin@soldiersofjesuschrist.org / admin123)');

  // 3. Seed Site Content Singleton
  await prisma.siteContent.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      heroTitle: 'WELCOME TO SOLDIERS OF JESUS CHRIST',
      heroSubheadline: 'A Church You Can Call Home. A Cause You Can Die For.',
      tickerMessage: 'EQUIPPING THE SAINTS FOR THE BATTLE • STANDING FIRM IN FAITH • WELCOME HOME FOR THE SUMMER / FALL SEASON',
      seasonalTitle: "What's Summer & Fall @ The Soldiers All About?",
      seasonalSubheadline: 'Going all-in on community, connection, and spiritual breakthrough every single Sunday.',
      seasonalBody: "This season, we are calling you back home—and into purpose. Discover where you fit in ministry. Get involved in small groups, prayer watch, and community outreach. Let's grow stronger together as one family in Christ!",
      sundayServiceTime: 'SUNDAYS AT 10:00 AM',
      address: '1709 John Barrow Rd. Little Rock, AR 72204',
      phone: '(501) 555-0199',
      email: 'info@soldiersofjesuschrist.org'
    }
  });
  console.log('✅ Site Content Singleton Seeded');

  // 4. Seed Events
  const eventsData = [
    {
      id: 'ev-1',
      title: 'Summer Strong Night of Worship & Prophetic Fire',
      description: 'An explosive evening of immersive worship, personal prayer ministry, and powerful impartation for the whole family.',
      date: '2026-09-27',
      time: '6:30 PM - 9:00 PM',
      location: 'Main Sanctuary',
      image: '/images/worship_hero.jpg',
      category: 'Worship',
      registrationRequired: true,
      capacity: 400,
      registrationsCount: 184
    },
    {
      id: 'ev-2',
      title: 'Mighty Men Annual Brotherhood BBQ & Range Day',
      description: 'Fellowship, iron sharpening iron, powerful testimony from Guest Speaker Col. John Miller, and a steak dinner.',
      date: '2026-10-03',
      time: '9:00 AM - 2:00 PM',
      location: 'Soldiers Fellowship Grounds',
      image: '/images/mens.jpg',
      category: 'Men',
      registrationRequired: true,
      capacity: 150,
      registrationsCount: 92
    },
    {
      id: 'ev-3',
      title: 'Women of Valor Fall Retreat: Crowned in Glory',
      description: 'A 2-day spiritual retreat empowering women to step into their divine identity, healing, and Kingdom destiny.',
      date: '2026-10-16',
      time: '5:00 PM (Fri) - 4:00 PM (Sat)',
      location: 'Mountain Pines Lodge',
      image: '/images/womens.jpg',
      category: 'Women',
      registrationRequired: true,
      capacity: 200,
      registrationsCount: 145
    },
    {
      id: 'ev-4',
      title: 'Youth & GenZ IGNITE Rally 2026',
      description: 'High-octane worship, live DJ, games, free food, and a life-changing gospel message for middle & high schoolers.',
      date: '2026-10-24',
      time: '6:00 PM - 9:30 PM',
      location: 'Student Ministry Center',
      image: '/images/youth.jpg',
      category: 'Youth',
      registrationRequired: false,
      capacity: 300,
      registrationsCount: 210
    }
  ];

  for (const ev of eventsData) {
    await prisma.event.upsert({
      where: { id: ev.id },
      update: ev,
      create: ev
    });
  }
  console.log('✅ Events Seeded');

  // 5. Seed Sermons
  const sermonsData = [
    {
      id: 'ser-1',
      title: 'Putting On The Whole Armor of God',
      youtubeId: 'Lw8jG2nOQp8',
      speaker: 'Pastor David Vance',
      series: 'Spiritual Warfare 101',
      date: '2026-09-13',
      featured: true,
      description: 'Discover how to stand firm against the schemes of the enemy by clothing yourself in truth, righteousness, and the Word of God.',
      scripture: 'Ephesians 6:10-18'
    },
    {
      id: 'ser-2',
      title: 'Unshakable Faith in Troubled Times',
      youtubeId: 'kJQP7kiw5Fk',
      speaker: 'Pastor David Vance',
      series: 'Standing Firm',
      date: '2026-09-06',
      featured: true,
      description: 'When the foundations are shaken, where do the righteous stand? Learn how covenant promises ground your soul.',
      scripture: 'Psalm 11:3, Hebrews 12:28'
    },
    {
      id: 'ser-3',
      title: 'The Sword of the Spirit: Operating in Authority',
      youtubeId: 'dQw4w9WgXcQ',
      speaker: 'Elder Marcus Thorne',
      series: 'Spiritual Warfare 101',
      date: '2026-08-30',
      featured: false,
      description: "God's Word is not just a book—it is a living blade that cuts through darkness and releases Kingdom breakthrough.",
      scripture: 'Hebrews 4:12'
    },
    {
      id: 'ser-4',
      title: 'Breakthrough Through Worship',
      youtubeId: '9bZkp7q19f0',
      speaker: 'Pastor Sarah Vance',
      series: 'Victorious Living',
      date: '2026-08-23',
      featured: false,
      description: 'Praise is your weapon before the battle is even won. See how Paul and Silas unlocked prison doors with praise.',
      scripture: 'Acts 16:25-26'
    }
  ];

  for (const s of sermonsData) {
    await prisma.sermon.upsert({
      where: { id: s.id },
      update: s,
      create: s
    });
  }
  console.log('✅ Sermons Seeded');

  // 6. Seed Sample Donations
  const donationsData = [
    {
      id: 'don-1001',
      donorName: 'Robert Sterling',
      email: 'r.sterling@example.com',
      amount: 250.0,
      frequency: 'MONTHLY',
      fund: 'General Fund',
      status: 'Completed'
    },
    {
      id: 'don-1002',
      donorName: 'Anonymous Soldier',
      email: 'donor@example.com',
      amount: 1000.0,
      frequency: 'ONE_TIME',
      fund: 'Missions & Outreach',
      status: 'Completed'
    },
    {
      id: 'don-1003',
      donorName: 'Patricia & Daniel Gomez',
      email: 'gomezfamily@example.com',
      amount: 100.0,
      frequency: 'MONTHLY',
      fund: 'Building Fund',
      status: 'Completed'
    },
    {
      id: 'don-1004',
      donorName: 'Jessica Taylor',
      email: 'jtaylor@example.com',
      amount: 50.0,
      frequency: 'ONE_TIME',
      fund: 'Youth Ministry',
      status: 'Completed'
    }
  ];

  for (const d of donationsData) {
    await prisma.donation.upsert({
      where: { id: d.id },
      update: d,
      create: d
    });
  }
  console.log('✅ Donations Seeded');

  // 7. Seed Sample Submissions
  const submissionsData = [
    {
      id: 'sub-1',
      type: 'PRAYER_REQUEST',
      name: 'Eleanor Vance',
      email: 'eleanor@example.com',
      phone: '(555) 234-5678',
      message: "Please pray for my husband's upcoming heart procedure this Thursday. Believing for complete healing and peace.",
      isRead: false,
      isPrivate: true
    },
    {
      id: 'sub-2',
      type: 'PLAN_VISIT',
      name: 'Michael & Sarah Jenkins',
      email: 'mjenkins@example.com',
      phone: '(555) 876-5432',
      message: 'We recently moved to the area and plan to visit this Sunday with our two kids (ages 7 and 10). Would love VIP seating!',
      isRead: false,
      isPrivate: false
    },
    {
      id: 'sub-3',
      type: 'CONTACT',
      name: 'David Reynolds',
      email: 'dreynolds@example.com',
      phone: '(555) 432-1098',
      message: 'Interested in volunteering with the Outreach Food Bank team. What is the orientation process?',
      isRead: true,
      isPrivate: false
    }
  ];

  for (const sub of submissionsData) {
    await prisma.formSubmission.upsert({
      where: { id: sub.id },
      update: sub,
      create: sub
    });
  }
  console.log('✅ Form Submissions Seeded');

  // 8. Seed News Items
  const newsData = [
    {
      id: 'news-1',
      title: 'Grand Opening of the Community Outreach Center',
      content: 'We are thrilled to announce the opening of our new Outreach Center at 1709 John Barrow Rd. Designed to serve families across Little Rock with emergency food distribution, clothes closet, and spiritual counseling. Join us this Saturday at 11:00 AM for the ribbon-cutting ceremony and thanksgiving worship!',
      image: '/images/worship_hero.jpg'
    },
    {
      id: 'news-2',
      title: 'Ignite Youth Conference 2026 Registration Now Open',
      content: "Calling all teenagers, college students, and young adults! The 2026 Ignite Conference is bringing together anointed worship, dynamic teaching, and breakout labs focused on science, arts, and spiritual warfare. Don't miss this life-changing weekend.",
      image: '/images/youth.jpg'
    },
    {
      id: 'news-3',
      title: 'Mighty Men Annual Brotherhood Range Day & Barbecue',
      content: "Iron sharpens iron! The Mighty Men Ministry invites all men ages 16 and older to a full day of fellowship, target range activities, testimony sharing, and prime rib BBQ. Guest speaker Col. Marcus Miller will be sharing on 'Enduring Hardness as a Good Soldier of Christ'.",
      image: '/images/mens.jpg'
    }
  ];

  for (const item of newsData) {
    await prisma.news.upsert({
      where: { id: item.id },
      update: item,
      create: item
    });
  }
  console.log('✅ News Articles Seeded');

  // 9. Seed Testimonies (Matching design reference)
  const testimoniesData = [
    {
      id: 'test-1',
      title: '15 Years Of Smoking Ended In One Prayer',
      content: 'For 15 long years, I was bound in chains to severe nicotine addiction. Cigarettes controlled my mornings, my nights, and my health. During the miracle and deliverance service, Pastor laid hands on my head and broke the yoke of addiction in Jesus name. Instantly the craving died! Today I am completely free, healthy, and singing the praises of our God!',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'test-2',
      title: 'Suddenly, The Kidnapper Returned My Son',
      content: 'My 8-year-old boy was abducted on his way from school. Panic attempted to swallow our family, but we immediately ran to the sanctuary altar. The brethren stood in the gap and prayed through the midnight hour. Miraculously, by 6:00 AM, the kidnapper himself brought my son back unharmed without demanding or collecting a single dime! What God cannot do does not exist!',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'test-3',
      title: "The Enemy's Verdict For Him Was Death, But God's Verdict Was Life",
      content: 'The medical report stated multiple organ collapse with less than 48 hours to live. The doctors asked us to prepare for the worst. But the church family sent prayer cloths soaked in prayer and declared life according to Psalm 118:17. On the third day, his vitals normalized and today he is walking and testifying of the resurrection power of Christ!',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'test-4',
      title: "Delivered from Death's Door: A Triple Victory",
      content: 'Within sixty days, I was targeted by armed robbers, survived a high-speed highway collision where the car was crushed, and overcame food poisoning. Through it all, the angels of the Lord shielded me from death. I am living proof that no weapon formed against a soldier of Jesus Christ shall ever prosper!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'test-5',
      title: 'Through Tithing And Obedience: Barrenness Gave Way To Breakthrough.',
      content: 'After 9 painful years of waiting, mockery, and dashed hopes from clinical specialists, my husband and I decided to honor God in radical obedience through our tithes and sacrificial covenant seeds. That same year, God answered by fire and blessed our home with healthy twins! We return all honor and thanksgiving to the King of Kings!',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800'
    }
  ];

  for (const item of testimoniesData) {
    await prisma.testimony.upsert({
      where: { id: item.id },
      update: item,
      create: item
    });
  }
  console.log('✅ Testimonies Seeded');

  console.log('🎉 Neon PostgreSQL is 100% seeded and ready for production!');
}

main()
  .catch(err => {
    console.error('Seed Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
