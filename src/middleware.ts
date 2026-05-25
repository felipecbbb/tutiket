import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Middleware ligero (Edge runtime): solo comprueba presencia de cookie
 * de sesión, sin tocar BD. La autorización por rol y validación real se
 * hacen en server components con `requireRole()`.
 */
export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request);
  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/mi/:path*", "/org/:path*", "/admin/:path*", "/validar/:path*"],
};
