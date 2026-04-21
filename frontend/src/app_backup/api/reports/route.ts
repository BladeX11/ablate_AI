import { NextResponse, type NextRequest } from "next/server";

import { unauthorized } from "@/lib/auth/response";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { user } = await requireUser(request);
  if (!user) {
    return unauthorized();
  }

  const reports = await db.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      model: true,
    },
  });

  return NextResponse.json({ reports });
}
