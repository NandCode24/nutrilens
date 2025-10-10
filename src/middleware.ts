import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value;

  // Protect dashboard and other private routes
  const protectedPaths = ["/dashboard", "/ingredient", "/planner", "/symptom-checker", "/medicine"];

  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    if (!isLoggedIn) {
      const signinUrl = new URL("/auth/signin", req.url);
      return NextResponse.redirect(signinUrl);
    }
  }

  return NextResponse.next();
}

// Define which routes this middleware applies to
export const config = {
  matcher: ["/dashboard/:path*", "/ingredient/:path*", "/planner/:path*", "/symptom-checker/:path*", "/medicine/:path*"],
};