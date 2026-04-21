import { NextResponse, type NextRequest } from "next/server";

import { badRequest, unauthorized } from "@/lib/auth/response";
import { requireUser } from "@/lib/auth/require-user";
import { createUnlearningRequestSchema } from "@/lib/auth/validators";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { user } = await requireUser(request);
  if (!user) {
    return unauthorized();
  }

  const requests = await db.unlearningRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      model: true,
      requestedBy: {
        select: { name: true, email: true },
      },
      jobs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return NextResponse.json({ requests });
}

export async function POST(request: NextRequest) {
  const { user } = await requireUser(request);
  if (!user) {
    return unauthorized();
  }

  const parsed = createUnlearningRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return badRequest("Invalid unlearning request payload.");
  }

  const model = await db.aIModel.findUnique({ where: { id: parsed.data.modelId } });
  if (!model) {
    return badRequest("Selected model does not exist.");
  }

  const created = await db.unlearningRequest.create({
    data: {
      requestedById: user.id,
      modelId: parsed.data.modelId,
      datasetRef: parsed.data.datasetRef,
      reason: parsed.data.reason,
      priority: parsed.data.priority,
      status: "pending",
    },
    include: {
      model: true,
      requestedBy: {
        select: { name: true, email: true },
      },
    },
  });

  await db.unlearningJob.create({
    data: {
      requestId: created.id,
      status: "queued",
      progress: 0,
      summary: "Job queued and awaiting worker pickup.",
    },
  });

  return NextResponse.json({ request: created }, { status: 201 });
}
