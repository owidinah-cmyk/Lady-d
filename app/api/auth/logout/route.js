export const dynamic = "force-dynamic";

// POST /api/auth/logout
// - Read the customer session cookie
// - Delete the session row
// - Clear the cookie
// - Return 200 with { ok: true }
// - Idempotent: succeeds even if no session exists.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  deleteCustomerSession,
  COOKIE_NAMES, clearCookieOptions,
} from "@/lib/auth";

export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAMES.customerSession)?.value;
  if (token) {
    await deleteCustomerSession(token);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAMES.customerSession, "", clearCookieOptions());
  return res;
}
