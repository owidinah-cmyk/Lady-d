export const dynamic = "force-dynamic";

// GET /api/auth/me
// - Read the customer session cookie
// - Look up the customer
// - Return 200 with { customer } if logged in
// - Return 200 with { customer: null } if not logged in

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getCustomerBySessionToken,
  COOKIE_NAMES,
} from "@/lib/auth";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAMES.customerSession)?.value;
  const customer = await getCustomerBySessionToken(token);
  return NextResponse.json({ customer });
}
