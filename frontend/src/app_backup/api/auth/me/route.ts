import { NextResponse } from "next/server";

import { unauthorized } from "@/lib/auth/response";
import { getSessionFromRequest } from "@/lib/auth/session";

export async function GET(request: import("next/server").NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return unauthorized();
  }

  return NextResponse.json({ user: session.user });
}
