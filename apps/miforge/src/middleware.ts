import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require auth
const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/auth",
  "/miforge",
  "/factory",
  "/manifesto",
  "/contact",
  "/terms",
  "/privacy",
  "/refunds",
  "/api/auth",
  "/api/agents",
];

// Operator-only routes
const operatorPaths = ["/operator"];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function isOperatorPath(pathname: string): boolean {
  return operatorPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Public routes - allow through
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // In placeholder mode, check for mock session cookie/header
  // For real Supabase, this would verify the session cookie
  const mockSession = request.cookies.get("milyfe_mock_auth");

  // Protected routes - check auth
  if (!mockSession) {
    // In placeholder mode, auth is handled client-side via localStorage
    // Let the client-side AuthProvider handle redirects
    // Only truly block server-rendered protected content
    return NextResponse.next();
  }

  // Operator routes - check role
  if (isOperatorPath(pathname)) {
    try {
      const session = JSON.parse(mockSession.value);
      if (session.role !== "operator" && session.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
