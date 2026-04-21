import { createHash, createHmac } from "node:crypto";

function getSecret(): string {
  return process.env.AUTH_SECRET ?? "dev-auth-secret-change-me";
}

function sign(rawToken: string): string {
  return createHmac("sha256", getSecret()).update(rawToken).digest("hex");
}

export function createCookieValue(rawToken: string): string {
  return `${rawToken}.${sign(rawToken)}`;
}

export function parseCookieValue(cookieValue: string): string | null {
  const [rawToken, signature] = cookieValue.split(".");
  if (!rawToken || !signature) {
    return null;
  }

  if (sign(rawToken) !== signature) {
    return null;
  }

  return rawToken;
}

export function hasValidSignedSessionCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue) {
    return false;
  }

  return parseCookieValue(cookieValue) !== null;
}

export function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}
