import { NextResponse, type NextRequest } from "next/server";

import { unauthorized } from "@/lib/auth/response";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { user } = await requireUser(request);
  if (!user) {
    return unauthorized();
  }

  const metrics = await db.riskMetric.findMany({
    orderBy: { recordedAt: "desc" },
    take: 50,
    include: {
      model: true,
    },
  });

  return NextResponse.json({ metrics });
}
