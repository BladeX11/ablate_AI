import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/auth/password";
import { badRequest, conflict, internalError } from "@/lib/auth/response";
import { createSessionForUser, setSessionCookie } from "@/lib/auth/session";
import { signupSchema } from "@/lib/auth/validators";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const parsed = signupSchema.safeParse(await request.json());
  if (!parsed.success) {
    return badRequest("Name, email, and password are required.");
  }

  const { name, email, password } = parsed.data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return conflict("An account already exists for this email.");
  }

  const passwordHash = await hashPassword(password);

  try {
    const createdUser = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "member",
      },
    });

    const user = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
    };

    const cookieValue = await createSessionForUser(user);
    const response = NextResponse.json({ user }, { status: 201 });
    setSessionCookie(response, cookieValue);
    return response;
  } catch {
    return internalError("Could not create account.");
  }
}
