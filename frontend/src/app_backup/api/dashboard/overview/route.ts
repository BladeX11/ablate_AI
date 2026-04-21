import { NextResponse, type NextRequest } from "next/server";

import { unauthorized } from "@/lib/auth/response";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { user } = await requireUser(request);
  if (!user) {
    return unauthorized();
  }

  const [modelsCount, requestsCount, runningJobsCount, latestRisk] = await Promise.all([
    db.aIModel.count(),
    db.unlearningRequest.count(),
    db.unlearningJob.count({ where: { status: "running" } }),
    db.riskMetric.findFirst({ orderBy: { recordedAt: "desc" } }),
  ]);

  const latestRequests = await db.unlearningRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      model: true,
      jobs: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      requestedBy: {
        select: { name: true, email: true },
      },
    },
  });

  return NextResponse.json({
    summary: {
      modelsCount,
      requestsCount,
      runningJobsCount,
      leakageRisk: latestRisk?.leakageRisk ?? 0,
      piiExposure: latestRisk?.piiExposure ?? 0,
      biasScore: latestRisk?.biasScore ?? 0,
    },
    latestRequests,
    viewer: user,
  });
}
