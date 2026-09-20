import { ChurchEvent, Donation, FormSubmission, Sermon, SiteContent, User } from '../types';

export const INITIAL_SERMONS: Sermon[] = [
  {
    id: 'sermon-1',
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
    id: 'sermon-2',
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
    id: 'sermon-3',
    title: 'The Sword of the Spirit: Operating in Authority',
    youtubeId: 'dQw4w9WgXcQ',
    speaker: 'Elder Marcus Thorne',
    series: 'Spiritual Warfare 101',
    date: '2026-08-30',
    featured: false,
    description: 'God\'s Word is not just a book—it is a living blade that cuts through darkness and releases Kingdom breakthrough.',
    scripture: 'Hebrews 4:12'
  },
  {
    id: 'sermon-4',
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

export const INITIAL_EVENTS: ChurchEvent[] = [
  {
    id: 'event-1',
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
    id: 'event-2',
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
    id: 'event-3',
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
    id: 'event-4',
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

export const INITIAL_SUBMISSIONS: FormSubmission[] = [
  {
    id: 'sub-1',
    type: 'PRAYER_REQUEST',
    name: 'Eleanor Vance',
    email: 'eleanor@example.com',
    phone: '(555) 234-5678',
    message: 'Please pray for my husband\'s upcoming heart procedure this Thursday. Believing for complete healing and peace.',
    isRead: false,
    isPrivate: true,
    createdAt: '2026-09-18T14:30:00Z'
  },
  {
    id: 'sub-2',
    type: 'PLAN_VISIT',
    name: 'Michael & Sarah Jenkins',
    email: 'mjenkins@example.com',
    phone: '(555) 876-5432',
    message: 'We recently moved to the area and plan to visit this Sunday with our two kids (ages 7 and 10). Would love VIP seating!',
    isRead: false,
    isPrivate: false,
    createdAt: '2026-09-17T09:15:00Z'
  },
  {
    id: 'sub-3',
    type: 'CONTACT',
    name: 'David Reynolds',
    email: 'dreynolds@example.com',
    phone: '(555) 432-1098',
    message: 'Interested in volunteering with the Outreach Food Bank team. What is the orientation process?',
    isRead: true,
    isPrivate: false,
    createdAt: '2026-09-15T16:45:00Z'
  }
];

export const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'don-1001',
    donorName: 'Robert Sterling',
    email: 'r.sterling@example.com',
    amount: 250.00,
    frequency: 'monthly',
    fund: 'General Fund',
    status: 'Completed',
    date: '2026-09-18'
  },
  {
    id: 'don-1002',
    donorName: 'Anonymous Soldier',
    email: 'donor@example.com',
    amount: 1000.00,
    frequency: 'one-time',
    fund: 'Missions & Outreach',
    status: 'Completed',
    date: '2026-09-16'
  },
  {
    id: 'don-1003',
    donorName: 'Patricia & Daniel Gomez',
    email: 'gomezfamily@example.com',
    amount: 100.00,
    frequency: 'monthly',
    fund: 'Building Fund',
    status: 'Completed',
    date: '2026-09-14'
  },
  {
    id: 'don-1004',
    donorName: 'Jessica Taylor',
    email: 'jtaylor@example.com',
    amount: 50.00,
    frequency: 'one-time',
    fund: 'Youth Ministry',
    status: 'Completed',
    date: '2026-09-12'
  }
];

export const INITIAL_SITE_CONTENT: SiteContent = {
  heroTitle: "WELCOME TO SOLDIERS OF JESUS CHRIST",
  heroSubheadline: "A Church You Can Call Home. A Cause You Can Die For.",
  tickerMessage: "EQUIPPING THE SAINTS FOR THE BATTLE • STANDING FIRM IN FAITH • WELCOME HOME FOR THE SUMMER / FALL SEASON",
  seasonalTitle: "What's Summer & Fall @ The Soldiers All About?",
  seasonalSubheadline: "Going all-in on community, connection, and spiritual breakthrough every single Sunday.",
  seasonalBody: "This season, we are calling you back home—and into purpose. Discover where you fit in ministry. Get involved in small groups, prayer watch, and community outreach. Let's grow stronger together as one family in Christ!",
  sundayServiceTime: "SUNDAYS AT 10:00 AM",
  address: "1709 John Barrow Rd. Little Rock, AR 72204",
  phone: "(501) 555-0199",
  email: "info@soldiersofjesuschrist.org"
};

export const MOCK_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Pastor David Vance',
    email: 'admin@soldiers.org',
    role: 'SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'u-2',
    name: 'Sarah Coleman (Media)',
    email: 'editor@soldiers.org',
    role: 'EDITOR',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'u-3',
    name: 'Elder Marcus Thorne',
    email: 'viewer@soldiers.org',
    role: 'VIEWER',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  }
];

// Simple reactive LocalStorage backed store
class DataStore {
  private sermons: Sermon[];
  private events: ChurchEvent[];
  private submissions: FormSubmission[];
  private donations: Donation[];
  private siteContent: SiteContent;
  private currentUser: User | null = null;

  constructor() {
    this.sermons = this.load('sjc_sermons', INITIAL_SERMONS);
    this.events = this.load('sjc_events', INITIAL_EVENTS);
    this.submissions = this.load('sjc_submissions', INITIAL_SUBMISSIONS);
    this.donations = this.load('sjc_donations', INITIAL_DONATIONS);
    this.siteContent = this.load('sjc_content', INITIAL_SITE_CONTENT);
    this.currentUser = this.load<User | null>('sjc_current_user', MOCK_USERS[0]);
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private save(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage error', e);
    }
  }

  // Current User (Always active for immediate admin panel access)
  getCurrentUser(): User {
    if (!this.currentUser) {
      this.currentUser = MOCK_USERS[0];
      this.save('sjc_current_user', this.currentUser);
    }
    return this.currentUser;
  }
  setCurrentUser(user: User | null) {
    this.currentUser = user || MOCK_USERS[0];
    this.save('sjc_current_user', this.currentUser);
  }

  // Sermons
  getSermons() { return [...this.sermons]; }
  addSermon(sermon: Omit<Sermon, 'id'>) {
    const newSermon = { ...sermon, id: `sermon-${Date.now()}` };
    this.sermons = [newSermon, ...this.sermons];
    this.save('sjc_sermons', this.sermons);
    return newSermon;
  }
  deleteSermon(id: string) {
    this.sermons = this.sermons.filter(s => s.id !== id);
    this.save('sjc_sermons', this.sermons);
  }

  // Events
  getEvents() { return [...this.events]; }
  addEvent(event: Omit<ChurchEvent, 'id' | 'registrationsCount'>) {
    const newEvent: ChurchEvent = { ...event, id: `event-${Date.now()}`, registrationsCount: 0 };
    this.events = [newEvent, ...this.events];
    this.save('sjc_events', this.events);
    return newEvent;
  }
  registerForEvent(eventId: string) {
    this.events = this.events.map(ev => {
      if (ev.id === eventId) {
        return { ...ev, registrationsCount: ev.registrationsCount + 1 };
      }
      return ev;
    });
    this.save('sjc_events', this.events);
  }

  // Submissions
  getSubmissions() { return [...this.submissions]; }
  addSubmission(sub: Omit<FormSubmission, 'id' | 'createdAt' | 'isRead'>) {
    const newSub: FormSubmission = {
      ...sub,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    this.submissions = [newSub, ...this.submissions];
    this.save('sjc_submissions', this.submissions);
    return newSub;
  }
  toggleReadSubmission(id: string) {
    this.submissions = this.submissions.map(s => s.id === id ? { ...s, isRead: !s.isRead } : s);
    this.save('sjc_submissions', this.submissions);
  }

  // Donations
  getDonations() { return [...this.donations]; }
  addDonation(donation: Omit<Donation, 'id' | 'date' | 'status'>) {
    const newDon: Donation = {
      ...donation,
      id: `don-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    };
    this.donations = [newDon, ...this.donations];
    this.save('sjc_donations', this.donations);
    return newDon;
  }

  // Site Content
  getSiteContent() { return { ...this.siteContent }; }
  updateSiteContent(updated: Partial<SiteContent>) {
    this.siteContent = { ...this.siteContent, ...updated };
    this.save('sjc_content', this.siteContent);
  }
}

export const store = new DataStore();
