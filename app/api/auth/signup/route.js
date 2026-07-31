// POST /api/auth/signup
// Body: { name, email, phone, password }
// - Validate all fields
// - Check rate limit (key: "signup:<ip>")
// - Reject if email already in use
// - Hash password, create customer, create session, set cookie
// - Return 201 with safe customer data (no passwordHash)
// - On error: 400 with { error: <message> }

import { NextResponse } from "next/server";
import {
  validateEmail, validatePassword, validateName, validateOptionalPhone,
  checkRateLimit, LIMITS, getClientIp,
  createCustomerWithPassword, createCustomerSession,
  COOKIE_NAMES, cookieOptions,
} from "@/lib/auth";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`signup:${ip}`, LIMITS.SIGNUP.maxAttempts, LIMITS.SIGNUP.windowMs);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many signup attempts. Please try again later." },
      { status: 403 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const nameR = validateName(body.name);
  if (!nameR.ok) return NextResponse.json({ error: nameR.error }, { status: 400 });

  const emailR = validateEmail(body.email);
  if (!emailR.ok) return NextResponse.json({ error: emailR.error }, { status: 400 });

  const phoneR = validateOptionalPhone(body.phone);
  if (!phoneR.ok) return NextResponse.json({ error: phoneR.error }, { status: 400 });

  const passwordR = validatePassword(body.password);
  if (!passwordR.ok) return NextResponse.json({ error: passwordR.error }, { status: 400 });

  // Check for existing email.
  const existing = await prisma.customer.findUnique({
    where: { email: emailR.value },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists. Try logging in." },
      { status: 409 }
    );
  }

  let customer;
  try {
    customer = await createCustomerWithPassword({
      name: nameR.value,
      email: emailR.value,
      phone: phoneR.value,
      password: passwordR.value,
    });
  } catch (err) {
    console.error("signup: create customer failed", err);
    return NextResponse.json(
      { error: "Could not create your account. Please try again." },
      { status: 500 }
    );
  }

  const { token, expiresAt } = await createCustomerSession(customer.id);

  const res = NextResponse.json({ customer }, { status: 201 });
  res.cookies.set(COOKIE_NAMES.customerSession, token, {
    ...cookieOptions(),
    expires: expiresAt,
  });
  return res;
}
