import { randomBytes } from "node:crypto";

import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/lib/db";

import { SESSION_COOKIE_NAME } from "./constants";
import { createCookieValue, hashToken, parseCookieValue } from "./session-token";
import type { AuthUser } from "./types";

const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function setCookie(response: NextResponse, value: string): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function createSessionForUser(user: AuthUser): Promise<string> {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  await db.session.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  return createCookieValue(rawToken);
}

export function setSessionCookie(response: NextResponse, cookieValue: string): void {
  setCookie(response, cookieValue);
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function revokeSessionFromRequest(request: NextRequest): Promise<void> {
  const cookieValue = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!cookieValue) {
    return;
  }

  const rawToken = parseCookieValue(cookieValue);
  if (!rawToken) {
    return;
  }

  await db.session.deleteMany({
    where: {
      tokenHash: hashToken(rawToken),
    },
  });
}

export async function getSessionFromRequest(request: NextRequest): Promise<{
  user: AuthUser;
  sessionId: string;
} | null> {
  const cookieValue = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!cookieValue) {
    return null;
  }

  const rawToken = parseCookieValue(cookieValue);
  if (!rawToken) {
    return null;
  }

  const session = await db.session.findUnique({
    where: {
      tokenHash: hashToken(rawToken),
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() < Date.now()) {
    await db.session.delete({ where: { id: session.id } });
    return null;
  }

  return {
    sessionId: session.id,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    },
  };
}
