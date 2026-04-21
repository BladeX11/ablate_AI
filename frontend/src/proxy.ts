import { NextResponse, type NextRequest } from "next/server";

import {
  AUTH_ROUTES,
  DEFAULT_POST_LOGIN_REDIRECT,
  PROTECTED_ROUTE_PREFIXES,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/constants";
import { hasValidSignedSessionCookie } from "@/lib/auth/session-token";

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAuthPath(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname as (typeof AUTH_ROUTES)[number]);
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSessionCookie = hasValidSignedSessionCookie(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (isProtectedPath(pathname) && !hasSessionCookie) {
    const redirectUrl = new URL("/login", request.url);
    const nextPath = `${pathname}${search}`;
    redirectUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthPath(pathname) && hasSessionCookie) {
    return NextResponse.redirect(new URL(DEFAULT_POST_LOGIN_REDIRECT, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/forgot-password", "/reset-password"],
};
