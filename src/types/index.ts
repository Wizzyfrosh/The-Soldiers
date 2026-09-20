export type Role = 'SUPER_ADMIN' | 'EDITOR' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export type SubmissionType = 'PRAYER_REQUEST' | 'CONTACT' | 'PLAN_VISIT' | 'NEW_MEMBER';

export interface FormSubmission {
  id: string;
  type: SubmissionType;
  name: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  isPrivate?: boolean;
  createdAt: string;
}

export interface Sermon {
  id: string;
  title: string;
  youtubeId: string;
  speaker: string;
  series: string;
  date: string;
  featured: boolean;
  description: string;
  scripture?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  guestsCount: number;
  registeredAt: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: 'Worship' | 'Youth' | 'Community' | 'Men' | 'Women' | 'Conference';
  registrationRequired: boolean;
  capacity?: number;
  registrationsCount: number;
}

export interface Donation {
  id: string;
  donorName: string;
  email: string;
  amount: number;
  frequency: 'one-time' | 'monthly';
  fund: 'General Fund' | 'Missions & Outreach' | 'Building Fund' | 'Youth Ministry';
  status: 'Completed' | 'Processing' | 'Failed';
  date: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubheadline: string;
  tickerMessage: string;
  seasonalTitle: string;
  seasonalSubheadline: string;
  seasonalBody: string;
  sundayServiceTime: string;
  address: string;
  phone: string;
  email: string;
}
