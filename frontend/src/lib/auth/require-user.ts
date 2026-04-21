import type { NextRequest } from "next/server";

import type { AuthUser } from "./types";
import { getSessionFromRequest } from "./session";

export async function requireUser(request: NextRequest): Promise<{
  user: AuthUser | null;
}> {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return { user: null };
  }

  return { user: session.user };
}
