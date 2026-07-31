// POST /api/admin/auth/logout
// - Read the admin session cookie
// - Delete the admin session row
// - Clear the admin cookie
// - Return 200 with { ok: true }
// - Idempotent.

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  deleteAdminSession,
  COOKIE_NAMES, clearCookieOptions,
} from "@/lib/auth";

export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAMES.adminSession)?.value;
  if (token) {
    await deleteAdminSession(token);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAMES.adminSession, "", clearCookieOptions());
  return res;
}
