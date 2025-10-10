import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";

  // Protected routes (only allow if logged in)
  const protectedPaths = [
    "/dashboard",
    "/ingredient",
    "/planner",
    "/symptom-checker",
    "/medicine",
  ];

  // Auth pages we want to prevent when already logged in
  const authPaths = ["/auth/signin", "/auth/signup"];

  const pathname = req.nextUrl.pathname;

  // If trying to access protected route and not logged in -> redirect to signin
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!isLoggedIn) {
      const signinUrl = new URL("/auth/signin", req.url);
      return NextResponse.redirect(signinUrl);
    }
  }

  // If logged in and trying to access signin/signup -> redirect to dashboard
  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (isLoggedIn) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/ingredient/:path*",
    "/planner/:path*",
    "/symptom-checker/:path*",
    "/medicine/:path*",
    "/auth/:path*",
  ],
};