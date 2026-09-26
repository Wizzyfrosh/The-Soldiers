# 🚀 Production Launch Checklist — Soldiers of Jesus Christ Platform

This comprehensive checklist details all steps required for a zero-downtime, secure, and performant production launch.

---

## 1. Environment Variables & Secret Management
- [ ] **NEXTAUTH_SECRET / JWT_SECRET**: Generate a strong 64-byte random string (`openssl rand -base64 32`). **Do NOT reuse development keys.**
- [ ] **No Public Secret Leaks**: Confirm no private API keys (`STRIPE_SECRET_KEY`, `SENDGRID_API_KEY`, `CLOUDINARY_API_SECRET`, `DATABASE_URL`) use prefixes like `NEXT_PUBLIC_` or `VITE_`.
- [ ] **Environment Injection**: Add all environment variables directly into Vercel Project Settings under **Production**.
- [ ] **Production Site URLs**: Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` to `https://soldiersofjesuschrist.org`.

---

## 2. Database Migrations & Resilience (Neon Postgres)
- [ ] **Production Connection String**: Obtain Neon's pooled connection string with `?sslmode=require`.
- [ ] **Direct URL**: Configure `DIRECT_URL` for direct schema migrations without connection pooling issues.
- [ ] **Automated Migration Script**: Ensure `npm run build` runs `prisma generate && prisma migrate deploy`.
- [ ] **Database Seeding**: Run production initial seeds (roles, baseline categories) safely without overwriting live user data.
- [ ] **Point-In-Time Recovery**: Confirm Neon automated daily branching and WAL backups are active.

---

## 3. Security Headers & Hardening
- [ ] **Content Security Policy (CSP)**: Restrict scripts, styles, frames, and connect targets to trusted origins (Stripe, Cloudinary, YouTube, Neon).
- [ ] **HTTP Strict Transport Security (HSTS)**: Enable HSTS with `max-age=63072000; includeSubDomains; preload`.
- [ ] **X-Frame-Options**: Set to `DENY` to prevent clickjacking attacks.
- [ ] **X-Content-Type-Options**: Set to `nosniff`.
- [ ] **Referrer-Policy**: Set to `strict-origin-when-cross-origin`.
- [ ] **Permissions-Policy**: Restrict access to camera, microphone, and geolocation unless explicitly needed.

---

## 4. Performance Optimization (Lighthouse 90+)
- [ ] **Next.js / Cloudinary Image Optimization**: Serve images in modern formats (AVIF/WebP) with `remotePatterns` configured.
- [ ] **Font Optimization**: Use `next/font` or standard Google Fonts with `display=swap`.
- [ ] **Dynamic Component Imports**: Lazy-load heavy components (e.g. video players, map embeds, interactive charts).
- [ ] **Asset Caching**: Cache static assets for 1 year (`Cache-Control: public, max-age=31536000, immutable`).

---

## 5. Search Engine Optimization (SEO)
- [ ] **Dynamic Sitemap**: Ensure `sitemap.xml` dynamically generates all public routes (`/`, `/about`, `/beliefs`, `/sermons`, `/events`, `/ministries`, `/contact`).
- [ ] **Robots.txt**: Serve `robots.txt` disallowing `/admin`, `/api/admin`, `/checkout` and pointing to `sitemap.xml`.
- [ ] **OpenGraph & Twitter Cards**: Add meta tags, title templates, and high-res share images (`og:image`).
- [ ] **Structured Data (JSON-LD)**: Embed `Church` schema structured markup for local SEO.

---

## 6. Error Handling & Monitoring
- [ ] **Global Error Boundary**: Provide user-friendly fallbacks for client-side crashes without leaking stack traces.
- [ ] **Sentry Integration**: Configure Sentry to capture unhandled backend exceptions and frontend errors.
- [ ] **Vercel Analytics & Web Vitals**: Enable real-time traffic monitoring and Core Web Vitals tracking.

---

## 7. Backup & Disaster Recovery Strategy
- [ ] **Neon Backup Verification**: Verify Neon automatically retains point-in-time recovery restore points for 14+ days.
- [ ] **Media Asset Backups**: Verify Cloudinary media assets are backed up in a secondary S3/GCS bucket.
- [ ] **Rollback Plan**: Test instantaneous Vercel deployment rollbacks via CLI or dashboard.
