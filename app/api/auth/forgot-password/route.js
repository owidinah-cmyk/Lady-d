// POST /api/auth/forgot-password
// Body: { email }
// - Validate email
// - Check rate limit (key: "pwreset:<ip>")
// - Look up customer; if not found, return success anyway (no enumeration)
// - If found, create a reset token, email it via Brevo
// - Return 200 with { ok: true } ALWAYS

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  validateEmail,
  checkRateLimit,
  LIMITS,
  getClientIp,
  createResetToken,
  pruneExpiredTokens,
} from "@/lib/auth";
import { sendEmail } from "@/lib/email/send";
import { buildPasswordResetEmail } from "@/lib/email/templates";

export async function POST(request) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(
    `pwreset:${ip}`,
    LIMITS.PASSWORD_RESET.maxAttempts,
    LIMITS.PASSWORD_RESET.windowMs
  );
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many reset requests. Please try again later." },
      { status: 403 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const emailR = validateEmail(body.email);
  if (!emailR.ok) return NextResponse.json({ error: emailR.error }, { status: 400 });

  // Prune expired tokens before creating a new one.
  await pruneExpiredTokens();

  const customer = await prisma.customer.findUnique({
    where: { email: emailR.value },
    select: { id: true, name: true, email: true },
  });

  // Same response regardless of whether the email exists.
  if (customer && customer.email) {
    const { token } = await createResetToken(customer.email);
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    if (process.env.NODE_ENV === "production" && !siteUrl) {
      console.error("[forgot-password] NEXT_PUBLIC_SITE_URL is not set");
    }
    if (!siteUrl) siteUrl = "http://localhost:3000";
    const resetUrl = `${siteUrl}/reset-password?token=${token}`;

    const email = buildPasswordResetEmail({
      name: customer.name,
      resetUrl,
    });

    await sendEmail({
      to: customer.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
  }

  return NextResponse.json({
    ok: true,
    message: "If that email is registered, we've sent a reset link.",
  });
}
