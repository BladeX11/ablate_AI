import { NextResponse, type NextRequest } from "next/server";

import { unauthorized } from "@/lib/auth/response";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { user } = await requireUser(request);
  if (!user) {
    return unauthorized();
  }

  const jobs = await db.unlearningJob.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      request: {
        include: {
          model: true,
          requestedBy: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });

  return NextResponse.json({ jobs });
}
