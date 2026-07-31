// /lib/auth/password-reset.js
// DB-backed password reset tokens. The previous in-memory
// Map was unsafe on Vercel serverless (multiple instances,
// ephemeral). Now stored in Postgres so any instance can
// validate any token.

import { prisma } from "@/lib/db";
import { randomBytes } from "node:crypto";

const TTL_MS = 15 * 60 * 1000; // 15 minutes
export const TOKEN_RE = /^[0-9a-f]{64}$/i;

export async function createResetToken(email) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TTL_MS);

  // Best-effort: clean up any existing tokens for this email.
  await prisma.passwordResetToken.deleteMany({ where: { email } });

  await prisma.passwordResetToken.create({
    data: { email, token, expiresAt },
  });

  return { token, expiresAt };
}

export async function consumeResetToken(token) {
  if (typeof token !== "string" || !TOKEN_RE.test(token)) {
    return null;
  }

  // Best-effort cleanup of expired tokens before lookup.
  await prisma.passwordResetToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  const entry = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  if (!entry) return null;

  // Delete immediately (single-use) regardless of validity.
  await prisma.passwordResetToken.delete({ where: { id: entry.id } });

  if (entry.expiresAt < new Date()) return null;
  return entry.email;
}

// Kept for backwards compat. Delegates to per-call cleanup above.
export async function pruneExpiredTokens() {
  // no-op
}
