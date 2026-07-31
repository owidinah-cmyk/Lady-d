// POST /api/auth/reset-password
// Body: { token, password }
// - Validate token format
// - Check rate limit (key: "pwreset_confirm:<ip>")
// - consumeResetToken returns the email or null
// - If valid, hash the new password, update the customer
// - Delete ALL existing sessions for that customer
// - Return 200 with { ok: true }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  validatePassword,
  checkRateLimit, LIMITS, getClientIp,
  consumeResetToken, hashPassword, deleteAllCustomerSessions,
  TOKEN_RE,
} from "@/lib/auth";

export async function POST(request) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(
    `pwreset_confirm:${ip}`,
    LIMITS.PASSWORD_RESET_CONFIRM.maxAttempts,
    LIMITS.PASSWORD_RESET_CONFIRM.windowMs
  );
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 403 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body.token !== "string" || !TOKEN_RE.test(body.token)) {
    return NextResponse.json(
      { error: "Invalid or expired reset link." },
      { status: 400 }
    );
  }

  const passwordR = validatePassword(body.password);
  if (!passwordR.ok) return NextResponse.json({ error: passwordR.error }, { status: 400 });

  const email = await consumeResetToken(body.token);
  if (!email) {
    return NextResponse.json(
      { error: "Invalid or expired reset link." },
      { status: 400 }
    );
  }

  const customer = await prisma.customer.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!customer) {
    return NextResponse.json(
      { error: "Invalid or expired reset link." },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(passwordR.value);
  await prisma.customer.update({
    where: { id: customer.id },
    data: { passwordHash },
  });

  // Force-logout on all devices.
  await deleteAllCustomerSessions(customer.id);

  return NextResponse.json({ ok: true });
}
