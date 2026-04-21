import { createHash, randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { badRequest } from "@/lib/auth/response";
import { forgotPasswordSchema } from "@/lib/auth/validators";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const parsed = forgotPasswordSchema.safeParse(await request.json());
  if (!parsed.success) {
    return badRequest("Email is required.");
  }

  const { email } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });

  const payload: { message: string; resetToken?: string } = {
    message: "If an account exists, a reset link has been generated.",
  };

  if (!user) {
    return NextResponse.json(payload);
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db.passwordResetToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  if (process.env.NODE_ENV !== "production") {
    payload.resetToken = token;
  }

  return NextResponse.json(payload);
}
