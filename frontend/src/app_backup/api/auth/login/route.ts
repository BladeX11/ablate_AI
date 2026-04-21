import { NextResponse } from "next/server";

import { verifyPassword } from "@/lib/auth/password";
import { badRequest, unauthorized } from "@/lib/auth/response";
import { createSessionForUser, setSessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/auth/validators";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return badRequest("Email and password are required.");
  }

  const { email, password } = parsed.data;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return unauthorized("Invalid email or password.");
  }

  const validPassword = await verifyPassword(password, existingUser.passwordHash);
  if (!validPassword) {
    return unauthorized("Invalid email or password.");
  }

  const user = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
  };

  const cookieValue = await createSessionForUser(user);
  const response = NextResponse.json({ user });
  setSessionCookie(response, cookieValue);
  return response;
}
