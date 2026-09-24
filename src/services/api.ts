import { ChurchEvent, Donation, FormSubmission, Sermon, SiteContent, User, NewsItem, Testimony } from '../types';

const API_BASE = '/api';

function getAuthToken(): string | null {
  return localStorage.getItem('sjc_auth_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('sjc_auth_token', token);
  } else {
    localStorage.removeItem('sjc_auth_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Authentication
  auth: {
    login: async (email: string, password: string) => {
      const res = await request<{ message: string; token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setAuthToken(res.token);
      return res;
    },
    getMe: async () => {
      return request<{ user: User }>('/auth/me');
    },
    logout: () => {
      setAuthToken(null);
    }
  },

  // Sermons
  sermons: {
    getAll: async (params?: { series?: string; speaker?: string; search?: string; featured?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params?.series && params.series !== 'All') searchParams.set('series', params.series);
      if (params?.speaker && params.speaker !== 'All') searchParams.set('speaker', params.speaker);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.featured) searchParams.set('featured', 'true');
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return request<{ sermons: Sermon[] }>(`/sermons${query}`);
    },
    getById: async (id: string) => {
      return request<{ sermon: Sermon }>(`/sermons/${id}`);
    },
    create: async (data: Omit<Sermon, 'id'>) => {
      return request<{ message: string; sermon: Sermon }>('/sermons', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    update: async (id: string, data: Partial<Sermon>) => {
      return request<{ message: string; sermon: Sermon }>(`/sermons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    delete: async (id: string) => {
      return request<{ message: string }>(`/sermons/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // Events
  events: {
    getAll: async (params?: { category?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.category && params.category !== 'All') searchParams.set('category', params.category);
      if (params?.search) searchParams.set('search', params.search);
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return request<{ events: ChurchEvent[] }>(`/events${query}`);
    },
    getById: async (id: string) => {
      return request<{ event: ChurchEvent }>(`/events/${id}`);
    },
    create: async (data: Omit<ChurchEvent, 'id' | 'registrationsCount'>) => {
      return request<{ message: string; event: ChurchEvent }>('/events', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    update: async (id: string, data: Partial<ChurchEvent>) => {
      return request<{ message: string; event: ChurchEvent }>(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    delete: async (id: string) => {
      return request<{ message: string }>(`/events/${id}`, {
        method: 'DELETE'
      });
    },
    register: async (id: string, data: { name: string; email: string; phone?: string; guestsCount?: number }) => {
      return request<{ message: string; registration: any; event: ChurchEvent }>(`/events/${id}/register`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    getRegistrations: async (id: string) => {
      return request<{ registrations: any[] }>(`/events/${id}/registrations`);
    }
  },

  // Form Submissions (Prayer, Contact, Plan Visit)
  submissions: {
    create: async (data: { type: string; name: string; email: string; phone?: string; message: string; isPrivate?: boolean }) => {
      return request<{ message: string; submission: FormSubmission }>('/submissions', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    getAll: async (params?: { type?: string; unreadOnly?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params?.type && params.type !== 'ALL') searchParams.set('type', params.type);
      if (params?.unreadOnly) searchParams.set('unreadOnly', 'true');
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return request<{ submissions: FormSubmission[] }>(`/submissions${query}`);
    },
    toggleRead: async (id: string) => {
      return request<{ message: string; submission: FormSubmission }>(`/submissions/${id}/toggle-read`, {
        method: 'PATCH'
      });
    },
    delete: async (id: string) => {
      return request<{ message: string }>(`/submissions/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // Giving & Donations
  donations: {
    getAll: async () => {
      return request<{
        donations: Donation[];
        stats: {
          totalAmount: number;
          totalDonationsCount: number;
          monthlyRecurringTotal: number;
          monthlyRecurringCount: number;
        };
      }>('/donations');
    },
    record: async (data: { donorName: string; email: string; amount: number; frequency?: string; fund?: string }) => {
      return request<{ message: string; donation: Donation }>('/donations', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    }
  },

  // Stripe
  stripe: {
    createCheckoutSession: async (data: { amount: number; frequency: string; fund: string; donorName?: string; email?: string }) => {
      return request<{ url?: string; id?: string; mock?: boolean; donation?: Donation; message?: string }>('/stripe/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    }
  },

  // CMS Site Content
  content: {
    get: async () => {
      return request<{ content: SiteContent }>('/content');
    },
    update: async (data: Partial<SiteContent>) => {
      return request<{ message: string; content: SiteContent }>('/content', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    }
  },

  // Admin Users
  users: {
    getAll: async () => {
      return request<{ users: User[] }>('/users');
    },
    create: async (data: { name: string; email: string; password: string; role: string; avatarUrl?: string }) => {
      return request<{ message: string; user: User }>('/users', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    update: async (id: string, data: Partial<User & { password?: string }>) => {
      return request<{ message: string; user: User }>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    delete: async (id: string) => {
      return request<{ message: string }>(`/users/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // Admin Dashboard Stats
  stats: {
    get: async () => {
      return request<{
        stats: {
          totalDonationsThisMonth: number | null;
          donationsCount: number | null;
          upcomingEventsCount: number;
          unreadSubmissionsCount: number;
          totalSermonsCount: number;
        };
        recentSubmissions: FormSubmission[];
        recentEvents: ChurchEvent[];
      }>('/admin/stats');
    }
  },

  // Media / File Upload
  upload: {
    file: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return request<{ message: string; url: string; filename: string; size: number }>('/upload', {
        method: 'POST',
        body: formData
      });
    }
  },

  // Latest News
  news: {
    getAll: async (limit?: number) => {
      const query = limit ? `?limit=${limit}` : '';
      return request<{ news: NewsItem[] }>(`/news${query}`);
    },
    getById: async (id: string) => {
      return request<{ article: NewsItem }>(`/news/${id}`);
    },
    create: async (data: { title: string; content: string; image: string }) => {
      return request<{ message: string; article: NewsItem }>('/news', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    delete: async (id: string) => {
      return request<{ message: string }>(`/news/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // Testimonies
  testimonies: {
    getAll: async (limit?: number) => {
      const query = limit ? `?limit=${limit}` : '';
      return request<{ testimonies: Testimony[] }>(`/testimonies${query}`);
    },
    getById: async (id: string) => {
      return request<{ testimony: Testimony }>(`/testimonies/${id}`);
    },
    create: async (data: { title: string; content: string; image: string }) => {
      return request<{ message: string; testimony: Testimony }>('/testimonies', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    delete: async (id: string) => {
      return request<{ message: string }>(`/testimonies/${id}`, {
        method: 'DELETE'
      });
    }
  }
};
