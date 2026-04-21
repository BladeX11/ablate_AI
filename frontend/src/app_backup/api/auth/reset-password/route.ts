import { createHash } from "node:crypto";

import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/auth/password";
import { badRequest } from "@/lib/auth/response";
import { resetPasswordSchema } from "@/lib/auth/validators";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const parsed = resetPasswordSchema.safeParse(await request.json());
  if (!parsed.success) {
    return badRequest("Token and new password are required.");
  }

  const { token, newPassword } = parsed.data;
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const resetRecord = await db.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "Reset link is invalid or expired." }, { status: 400 });
  }

  const newHash = await hashPassword(newPassword);

  await db.$transaction([
    db.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash: newHash },
    }),
    db.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ message: "Password has been updated." });
}
