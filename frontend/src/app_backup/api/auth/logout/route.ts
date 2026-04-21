import { NextResponse } from "next/server";

import { clearSessionCookie, revokeSessionFromRequest } from "@/lib/auth/session";

export async function POST(request: import("next/server").NextRequest) {
  await revokeSessionFromRequest(request);
  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  return response;
}
