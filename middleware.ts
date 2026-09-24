import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * NextAuth Middleware for Next.js 14
 *
 * Requirements:
 * 1. Protects ALL routes starting with /admin.
 * 2. Unauthenticated requests to /admin/* are intercepted and redirected to /admin/login.
 * 3. Authenticated users attempting to visit /admin/login are redirected to /admin/dashboard.
 * 4. Public-facing church pages are completely untouched.
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const isAuthenticated = !!token;

    // If user is already authenticated and visits /admin/login, redirect to /admin/dashboard
    if (pathname === "/admin/login" && isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public access to the login page so unauthenticated admins can authenticate
        if (pathname === "/admin/login") {
          return true;
        }

        // Require a valid JWT token for all other /admin routes
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
  // Matches /admin and all subpaths (/admin/dashboard, /admin/sermons, /admin/events, etc.)
  matcher: ["/admin/:path*"],
};
