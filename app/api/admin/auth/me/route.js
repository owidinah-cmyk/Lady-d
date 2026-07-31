// GET /api/admin/auth/me
// - Read the admin session cookie
// - Return 200 with { admin } if logged in
// - Return 200 with { admin: null } if not logged in

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getAdminBySessionToken,
  COOKIE_NAMES,
} from "@/lib/auth";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAMES.adminSession)?.value;
  const admin = await getAdminBySessionToken(token);
  return NextResponse.json({ admin });
}
