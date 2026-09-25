import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * NextAuth Middleware (src/middleware.ts)
 * Placed inside src/ so Next.js 14 correctly detects and executes it.
 *
 * Requirements:
 * 1. Blocks unauthenticated users from ALL /admin routes (including /admin/dashboard, /admin).
 * 2. Redirects unauthenticated users to /admin/login.
 * 3. Redirects authenticated users from /admin/login to /admin/dashboard.
 * 4. Public-facing pages are never intercepted.
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const isAuthenticated = !!token;

    // Server-side debugging probe to verify middleware execution
    console.log(
      `🛡️ [NextAuth Middleware PROBE] Path: ${pathname} | Authenticated: ${isAuthenticated} | User: ${token?.email || "anonymous"}`
    );

    // If authenticated user attempts to access /admin/login, bounce to /admin/dashboard
    if (pathname === "/admin/login" && isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public access to the admin login page
        if (pathname === "/admin/login") {
          return true;
        }

        // Require authentication token for /admin, /admin/dashboard, and all /admin/* subpaths
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  // Matches /admin, /admin/dashboard, and any nested route under /admin
  matcher: ["/admin", "/admin/:path*"],
};
