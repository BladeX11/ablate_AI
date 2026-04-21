import { NextResponse, type NextRequest } from "next/server";

import { unauthorized, badRequest, conflict } from "@/lib/auth/response";
import { requireUser } from "@/lib/auth/require-user";
import { createModelSchema } from "@/lib/auth/validators";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { user } = await requireUser(request);
  if (!user) {
    return unauthorized();
  }

  const models = await db.aIModel.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      _count: {
        select: {
          requests: true,
          reports: true,
        },
      },
    },
  });

  return NextResponse.json({ models });
}

export async function POST(request: NextRequest) {
  const { user } = await requireUser(request);
  if (!user) {
    return unauthorized();
  }

  const parsed = createModelSchema.safeParse(await request.json());
  if (!parsed.success) {
    return badRequest("Invalid model payload.");
  }

  try {
    const created = await db.aIModel.create({
      data: parsed.data,
    });

    return NextResponse.json({ model: created }, { status: 201 });
  } catch {
    return conflict("A model with this name and version already exists.");
  }
}
