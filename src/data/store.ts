import { ChurchEvent, Donation, FormSubmission, Sermon, SiteContent, User, NewsItem, Testimony } from '../types';

export const INITIAL_SERMONS: Sermon[] = [];
export const INITIAL_EVENTS: ChurchEvent[] = [];
export const INITIAL_SUBMISSIONS: FormSubmission[] = [];
export const INITIAL_DONATIONS: Donation[] = [];


export const INITIAL_SITE_CONTENT: SiteContent = {
  heroTitle: "WELCOME TO SOLDIERS OF JESUS CHRIST",
  heroSubheadline: "A Church You Can Call Home. A Cause You Can Die For.",
  tickerMessage: "EQUIPPING THE SAINTS FOR THE BATTLE • STANDING FIRM IN FAITH • WELCOME HOME FOR THE SUMMER / FALL SEASON",
  seasonalTitle: "What's Summer & Fall @ The Soldiers All About?",
  seasonalSubheadline: "Going all-in on community, connection, and spiritual breakthrough every single Sunday.",
  seasonalBody: "This season, we are calling you back home—and into purpose. Discover where you fit in ministry. Get involved in small groups, prayer watch, and community outreach. Let's grow stronger together as one family in Christ!",
  sundayServiceTime: "SUNDAYS AT 10:00 AM",
  address: "Baltimore City, USA",
  phone: "(501) 555-0199",
  email: "info@soldiersofjesuschrist.org"
};

export const INITIAL_TESTIMONIES: Testimony[] = [
  {
    id: 'test-1',
    title: '15 Years Of Smoking Ended In One Prayer',
    content: 'For 15 long years, I was bound in chains to severe nicotine addiction. Cigarettes controlled my mornings, my nights, and my health. During the miracle and deliverance service, Pastor laid hands on my head and broke the yoke of addiction in Jesus name. Instantly the craving died! Today I am completely free, healthy, and singing the praises of our God!',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-10-01T10:00:00Z',
    name: 'Bro. Emmanuel & Family'
  },
  {
    id: 'test-2',
    title: 'Suddenly, The Kidnapper Returned My Son',
    content: 'My 8-year-old boy was abducted on his way from school. Panic attempted to swallow our family, but we immediately ran to the sanctuary altar. The brethren stood in the gap and prayed through the midnight hour. Miraculously, by 6:00 AM, the kidnapper himself brought my son back unharmed without demanding or collecting a single dime! What God cannot do does not exist!',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-09-28T14:30:00Z',
    name: 'Deacon John O.'
  },
  {
    id: 'test-3',
    title: "The Enemy's Verdict For Him Was Death, But God's Verdict Was Life",
    content: 'The medical report stated multiple organ collapse with less than 48 hours to live. The doctors asked us to prepare for the worst. But the church family sent prayer cloths soaked in prayer and declared life according to Psalm 118:17. On the third day, his vitals normalized and today he is walking and testifying of the resurrection power of Christ!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-09-22T08:15:00Z',
    name: 'Mr. & Mrs. Adebayo'
  },
  {
    id: 'test-4',
    title: "Delivered from Death's Door: A Triple Victory",
    content: 'Within sixty days, I was targeted by armed robbers, survived a high-speed highway collision where the car was crushed, and overcame food poisoning. Through it all, the angels of the Lord shielded me from death. I am living proof that no weapon formed against a soldier of Jesus Christ shall ever prosper!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-09-15T18:00:00Z',
    name: 'Elder Marcus T.'
  },
  {
    id: 'test-5',
    title: 'Through Tithing And Obedience: Barrenness Gave Way To Breakthrough.',
    content: 'After 9 painful years of waiting, mockery, and dashed hopes from clinical specialists, my husband and I decided to honor God in radical obedience through our tithes and sacrificial covenant seeds. That same year, God answered by fire and blessed our home with healthy twins! We return all honor and thanksgiving to the King of Kings!',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-10-02T12:00:00Z',
    name: 'Sis. Ginika Nwachukwu and Family'
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Prophet Ebelechukwu Elochukwu',
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

import { api } from '../services/api';

// Reactive Store with bidirectional Neon PostgreSQL backend syncing
class DataStore {
  private sermons: Sermon[];
  private events: ChurchEvent[];
  private submissions: FormSubmission[];
  private donations: Donation[];
  private siteContent: SiteContent;
  private news: NewsItem[];
  private testimonies: Testimony[];
  private currentUser: User | null = null;
  private listeners: Set<() => void> = new Set();
  private isSyncing = false;

  constructor() {
    this.sermons = this.load('sjc_sermons', INITIAL_SERMONS);

    // Purge legacy hardcoded dummy events from localStorage
    const savedEvents = this.load<ChurchEvent[]>('sjc_events', []);
    const hasLegacyDummy = Array.isArray(savedEvents) && savedEvents.some(e => 
      e.id === 'event-1' || e.id === 'event-2' || e.id === 'event-3' || e.id === 'event-4'
    );
    if (hasLegacyDummy) {
      try { localStorage.removeItem('sjc_events'); } catch {}
      this.events = [];
    } else {
      this.events = savedEvents;
    }

    // Purge legacy hardcoded dummy submissions from localStorage
    const savedSubmissions = this.load<FormSubmission[]>('sjc_submissions', []);
    const hasLegacySub = Array.isArray(savedSubmissions) && savedSubmissions.some(s =>
      s.id === 'sub-1' || s.id === 'sub-2' || s.id === 'sub-3'
    );
    if (hasLegacySub) {
      try { localStorage.removeItem('sjc_submissions'); } catch {}
      this.submissions = [];
    } else {
      this.submissions = savedSubmissions;
    }

    // Purge legacy hardcoded dummy donations from localStorage
    const savedDonations = this.load<Donation[]>('sjc_donations', []);
    const hasLegacyDon = Array.isArray(savedDonations) && savedDonations.some(d =>
      d.id === 'don-1' || d.id === 'don-2' || d.id === 'don-3' || d.id === 'don-4'
    );
    if (hasLegacyDon) {
      try { localStorage.removeItem('sjc_donations'); } catch {}
      this.donations = [];
    } else {
      this.donations = savedDonations;
    }

    this.siteContent = this.load('sjc_content', INITIAL_SITE_CONTENT);
    this.news = this.load('sjc_news', []);
    const savedTestimonies = this.load<Testimony[]>('sjc_testimonies', []);
    this.testimonies = savedTestimonies && savedTestimonies.length > 0 ? savedTestimonies : INITIAL_TESTIMONIES;
    // Only restore user if an auth token exists (i.e., they actually logged in)
    const hasToken = !!localStorage.getItem('sjc_auth_token');
    this.currentUser = hasToken ? this.load<User | null>('sjc_current_user', null) : null;

    // Asynchronously synchronize with backend database
    this.syncWithBackend();
  }

  // Subscribe to store updates for real-time reactivity
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (e) {
        console.error('Error in store listener:', e);
      }
    });
  }

  // Hydrate from Neon PostgreSQL backend API
  // CRITICAL: Always replace local data with backend truth, even if backend returns empty arrays.
  // This prevents "ghost" items from reappearing after deletion.
  async syncWithBackend() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    try {
      // 1. Fetch live sermons — always trust backend
      try {
        const sermonsRes = await api.sermons.getAll();
        if (sermonsRes.sermons) {
          this.sermons = sermonsRes.sermons;
          this.save('sjc_sermons', this.sermons);
        }
      } catch (err) {
        console.warn('Backend sermons sync offline, using cached/initial:', err);
      }

      // 2. Fetch live events — always trust backend
      try {
        const eventsRes = await api.events.getAll();
        if (eventsRes && Array.isArray(eventsRes.events)) {
          this.events = eventsRes.events;
          this.save('sjc_events', this.events);
        }
      } catch (err) {
        console.warn('Backend events sync offline, using cached/initial:', err);
      }

      // 3. Fetch live site content
      try {
        const contentRes = await api.content.get();
        if (contentRes.content) {
          this.siteContent = contentRes.content;
          this.save('sjc_content', this.siteContent);
        }
      } catch (err) {
        console.warn('Backend content sync offline, using cached/initial:', err);
      }

      // 4. Fetch admin inbox — always trust backend
      try {
        const subRes = await api.submissions.getAll();
        if (subRes.submissions) {
          this.submissions = subRes.submissions;
          this.save('sjc_submissions', this.submissions);
        }
      } catch {}

      // 5. Fetch donations — always trust backend
      try {
        const donRes = await api.donations.getAll();
        if (donRes && Array.isArray(donRes.donations)) {
          this.donations = donRes.donations.map((d: any) => ({
            id: d.id,
            donorName: d.donorName,
            email: d.email,
            amount: typeof d.amount === 'number' ? d.amount : parseFloat(d.amount || '0'),
            frequency: d.frequency ? (String(d.frequency).toLowerCase() === 'monthly' ? 'monthly' : 'one-time') : 'one-time',
            fund: d.fund || 'General Fund',
            status: d.status || 'Completed',
            date: d.date || (d.createdAt ? String(d.createdAt).split('T')[0] : new Date().toISOString().split('T')[0])
          }));
          this.save('sjc_donations', this.donations);
        }
      } catch (err) {
        console.warn('Backend donations sync offline, using cached/initial:', err);
      }

      // 6. Fetch live news — always trust backend
      try {
        const newsRes = await api.news.getAll();
        if (newsRes.news) {
          this.news = newsRes.news;
          this.save('sjc_news', this.news);
        }
      } catch {}

      // 7. Fetch live testimonies — always trust backend
      try {
        const testRes = await api.testimonies.getAll();
        if (testRes.testimonies) {
          this.testimonies = testRes.testimonies;
          this.save('sjc_testimonies', this.testimonies);
        }
      } catch {}

      this.notify();
    } catch (e) {
      console.warn('Backend sync completed with fallbacks:', e);
    } finally {
      this.isSyncing = false;
    }
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

  // Current User
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!localStorage.getItem('sjc_auth_token');
  }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
    if (user) {
      this.save('sjc_current_user', user);
    } else {
      try { localStorage.removeItem('sjc_current_user'); } catch {}
    }
    this.notify();
  }

  logout() {
    this.currentUser = null;
    try {
      localStorage.removeItem('sjc_current_user');
      localStorage.removeItem('sjc_auth_token');
    } catch {}
    this.notify();
  }

  // Sermons
  getSermons() { return [...this.sermons]; }

  async addSermon(sermon: Omit<Sermon, 'id'>) {
    const res = await api.sermons.create(sermon);
    if (res.sermon) {
      this.sermons = [res.sermon, ...this.sermons.filter(s => s.id !== res.sermon.id)];
      this.save('sjc_sermons', this.sermons);
      this.notify();
      return res.sermon;
    }
    throw new Error('Server returned empty response when publishing sermon.');
  }

  async updateSermon(id: string, data: Partial<Sermon>) {
    const res = await api.sermons.update(id, data);
    if (res.sermon) {
      this.sermons = this.sermons.map(s => s.id === id ? res.sermon : s);
      this.save('sjc_sermons', this.sermons);
      this.notify();
      return res.sermon;
    }
    throw new Error('Server returned empty response when updating sermon.');
  }

  async deleteSermon(id: string) {
    await api.sermons.delete(id);
    this.sermons = this.sermons.filter(s => s.id !== id);
    this.save('sjc_sermons', this.sermons);
    this.notify();
  }

  // Events
  getEvents() { return [...this.events]; }

  async addEvent(event: Omit<ChurchEvent, 'id' | 'registrationsCount'>) {
    const tempId = `event-${Date.now()}`;
    const newEvent: ChurchEvent = { ...event, id: tempId, registrationsCount: 0 };
    this.events = [newEvent, ...this.events];
    this.save('sjc_events', this.events);
    this.notify();

    try {
      const res = await api.events.create(event);
      if (res.event) {
        this.events = this.events.map(e => e.id === tempId ? res.event : e);
        this.save('sjc_events', this.events);
        this.notify();
        return res.event;
      }
    } catch (err) {
      console.warn('Failed to persist event to backend, cached locally:', err);
    }
    return newEvent;
  }

  async updateEvent(id: string, data: Partial<ChurchEvent>) {
    this.events = this.events.map(e => e.id === id ? { ...e, ...data } : e);
    this.save('sjc_events', this.events);
    this.notify();

    try {
      const res = await api.events.update(id, data);
      if (res.event) {
        this.events = this.events.map(e => e.id === id ? res.event : e);
        this.save('sjc_events', this.events);
        this.notify();
        return res.event;
      }
    } catch (err) {
      console.warn('Failed to update event on backend:', err);
    }
  }

  async deleteEvent(id: string) {
    this.events = this.events.filter(e => e.id !== id);
    this.save('sjc_events', this.events);
    this.notify();

    try {
      await api.events.delete(id);
    } catch (err) {
      console.warn('Failed to delete event from backend:', err);
    }
  }

  async registerForEvent(eventId: string, details?: { name: string; email: string; phone?: string; guestsCount?: number }) {
    this.events = this.events.map(ev => {
      if (ev.id === eventId) {
        const count = details?.guestsCount || 1;
        return { ...ev, registrationsCount: ev.registrationsCount + count };
      }
      return ev;
    });
    this.save('sjc_events', this.events);
    this.notify();

    if (details?.name && details?.email) {
      try {
        const res = await api.events.register(eventId, details);
        if (res.event) {
          this.events = this.events.map(e => e.id === eventId ? res.event : e);
          this.save('sjc_events', this.events);
          this.notify();
        }
      } catch (err) {
        console.warn('Failed to register RSVP on backend:', err);
      }
    }
  }

  // Submissions
  getSubmissions() { return [...this.submissions]; }

  async addSubmission(sub: Omit<FormSubmission, 'id' | 'createdAt' | 'isRead'>) {
    const tempId = `sub-${Date.now()}`;
    const newSub: FormSubmission = {
      ...sub,
      id: tempId,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    this.submissions = [newSub, ...this.submissions];
    this.save('sjc_submissions', this.submissions);
    this.notify();

    try {
      const res = await api.submissions.create(sub);
      if (res.submission) {
        this.submissions = this.submissions.map(s => s.id === tempId ? res.submission : s);
        this.save('sjc_submissions', this.submissions);
        this.notify();
        return res.submission;
      }
    } catch (err) {
      console.warn('Failed to send submission to backend:', err);
    }
    return newSub;
  }

  async toggleReadSubmission(id: string) {
    this.submissions = this.submissions.map(s => s.id === id ? { ...s, isRead: !s.isRead } : s);
    this.save('sjc_submissions', this.submissions);
    this.notify();

    try {
      await api.submissions.toggleRead(id);
    } catch (err) {
      console.warn('Failed to toggle read status on backend:', err);
    }
  }

  async deleteSubmission(id: string) {
    this.submissions = this.submissions.filter(s => s.id !== id);
    this.save('sjc_submissions', this.submissions);
    this.notify();

    try {
      await api.submissions.delete(id);
    } catch (err) {
      console.warn('Failed to delete submission from backend:', err);
    }
  }

  // Donations
  getDonations() { return [...this.donations]; }

  async addDonation(donation: Omit<Donation, 'id' | 'date' | 'status'>) {
    const tempId = `don-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDon: Donation = {
      ...donation,
      id: tempId,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    };
    this.donations = [newDon, ...this.donations];
    this.save('sjc_donations', this.donations);
    this.notify();

    try {
      const res = await api.donations.record({
        donorName: donation.donorName,
        email: donation.email,
        amount: donation.amount,
        frequency: donation.frequency,
        fund: donation.fund
      });
      if (res.donation) {
        this.donations = this.donations.map(d => d.id === tempId ? {
          id: res.donation.id,
          donorName: res.donation.donorName,
          email: res.donation.email,
          amount: res.donation.amount,
          frequency: String(res.donation.frequency).toUpperCase() === 'MONTHLY' ? 'monthly' : 'one-time',
          fund: res.donation.fund,
          status: 'Completed',
          date: new Date().toISOString().split('T')[0]
        } : d);
        this.save('sjc_donations', this.donations);
        this.notify();
      }
    } catch (err) {
      console.warn('Failed to save donation on backend:', err);
    }
    return newDon;
  }

  async deleteDonation(id: string) {
    this.donations = this.donations.filter(d => d.id !== id);
    this.save('sjc_donations', this.donations);
    this.notify();

    try {
      await api.donations.delete(id);
    } catch (err) {
      console.warn('Failed to delete donation from backend:', err);
    }
  }

  // Site Content
  getSiteContent() { return { ...this.siteContent }; }

  async updateSiteContent(updated: Partial<SiteContent>) {
    this.siteContent = { ...this.siteContent, ...updated };
    this.save('sjc_content', this.siteContent);
    this.notify();

    try {
      await api.content.update(updated);
    } catch (err) {
      console.warn('Failed to persist content updates on backend:', err);
    }
  }

  // News
  getNews() { return [...this.news]; }

  async addNews(article: { title: string; content: string; image: string }) {
    const tempId = `news-${Date.now()}`;
    const newArticle: NewsItem = {
      id: tempId,
      ...article,
      createdAt: new Date().toISOString()
    };
    this.news = [newArticle, ...this.news];
    this.save('sjc_news', this.news);
    this.notify();

    try {
      const res = await api.news.create(article);
      if (res.article) {
        this.news = this.news.map(n => n.id === tempId ? res.article : n);
        this.save('sjc_news', this.news);
        this.notify();
        return res.article;
      }
    } catch (err) {
      console.warn('Failed to save news to backend:', err);
    }
    return newArticle;
  }

  async deleteNews(id: string) {
    this.news = this.news.filter(n => n.id !== id);
    this.save('sjc_news', this.news);
    this.notify();

    try {
      await api.news.delete(id);
    } catch (err) {
      console.warn('Failed to delete news from backend:', err);
    }
  }

  // Testimonies
  getTestimonies() { return [...this.testimonies]; }

  async addTestimony(testimony: { title: string; content: string; image: string; name?: string }) {
    const tempId = `test-${Date.now()}`;
    const newTestimony: Testimony = {
      id: tempId,
      ...testimony,
      createdAt: new Date().toISOString()
    };
    this.testimonies = [newTestimony, ...this.testimonies];
    this.save('sjc_testimonies', this.testimonies);
    this.notify();

    try {
      const res = await api.testimonies.create(testimony);
      if (res.testimony) {
        this.testimonies = this.testimonies.map(t => t.id === tempId ? res.testimony : t);
        this.save('sjc_testimonies', this.testimonies);
        this.notify();
        return res.testimony;
      }
    } catch (err) {
      console.warn('Failed to save testimony to backend:', err);
    }
    return newTestimony;
  }

  async deleteTestimony(id: string) {
    this.testimonies = this.testimonies.filter(t => t.id !== id);
    this.save('sjc_testimonies', this.testimonies);
    this.notify();

    try {
      await api.testimonies.delete(id);
    } catch (err) {
      console.warn('Failed to delete testimony from backend:', err);
    }
  }
}

export const store = new DataStore();

