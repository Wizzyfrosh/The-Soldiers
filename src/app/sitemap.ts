export interface SitemapItem {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export default async function sitemap(): Promise<SitemapItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://soldiersofjesuschrist.org';

  const routes = [
    '',
    '/about',
    '/beliefs',
    '/sermons',
    '/events',
    '/ministries',
    '/ministries/youth',
    '/ministries/children',
    '/plan-a-visit',
    '/prayer',
    '/give',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: (route === '' ? 'daily' : 'weekly') as SitemapItem['changeFrequency'],
    priority: route === '' ? 1.0 : route === '/sermons' || route === '/events' ? 0.9 : 0.8,
  }));

  return routes;
}
