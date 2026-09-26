export interface RobotsRule {
  userAgent?: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
}

export interface RobotsConfig {
  rules: RobotsRule | RobotsRule[];
  sitemap?: string | string[];
  host?: string;
}

export default function robots(): RobotsConfig {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://soldiersofjesuschrist.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/admin/*',
          '/checkout/*',
          '/private/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
