import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * NextAuth Middleware for Next.js 14
 * - Restricts all routes starting with /admin
 * - Unauthenticated users -> redirected to /admin/login
 * - Authenticated users visiting /admin/login -> redirected to /admin/dashboard
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const isAuthenticated = !!token;

    // If already authenticated and trying to access /admin/login, redirect to /admin/dashboard
    if (pathname === "/admin/login" && isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public access to the login page so users can sign in
        if (pathname === "/admin/login") {
          return true;
        }

        // Require authentication token for all other /admin routes
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
