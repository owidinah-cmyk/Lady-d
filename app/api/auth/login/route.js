export const dynamic = "force-dynamic";

// POST /api/auth/login
// Body: { email, password }
// - Validate
// - Check rate limit (key: "login:<ip>:<email>")
// - verifyCustomerCredentials returns the safe customer or null
// - Create session, set cookie
// - Return 200 with safe customer data

import { NextResponse } from "next/server";
import {
  validateEmail, validatePassword,
  checkRateLimit, LIMITS, getClientIp,
  verifyCustomerCredentials, createCustomerSession,
  COOKIE_NAMES, cookieOptions,
} from "@/lib/auth";

export async function POST(request) {
  const ip = getClientIp(request);
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const emailR = validateEmail(body.email);
  if (!emailR.ok) return NextResponse.json({ error: emailR.error }, { status: 400 });

  const limit = checkRateLimit(
    `login:${ip}:${emailR.value}`,
    LIMITS.LOGIN.maxAttempts,
    LIMITS.LOGIN.windowMs
  );
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 403 }
    );
  }

  const passwordR = validatePassword(body.password);
  if (!passwordR.ok) return NextResponse.json({ error: passwordR.error }, { status: 400 });

  const customer = await verifyCustomerCredentials(emailR.value, passwordR.value);
  if (!customer) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const { token, expiresAt } = await createCustomerSession(customer.id);

  const res = NextResponse.json({ customer });
  res.cookies.set(COOKIE_NAMES.customerSession, token, {
    ...cookieOptions(),
    expires: expiresAt,
  });
  return res;
}
