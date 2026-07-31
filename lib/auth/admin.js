// Business logic for admin authentication.
// Used by admin API route handlers (1.6) and Server Components.
// Does NOT touch cookies directly — that's the caller's job.

import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "./passwords";
import { generateSessionToken } from "./tokens";

const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

/**
 * Verify an admin's email + password.
 * Returns the admin record (without passwordHash) on success, or null.
 */
export async function verifyAdminCredentials(email, password) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !admin.passwordHash) return null;
  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) return null;
  return stripPasswordHash(admin);
}

/**
 * Create a session for an admin. Returns { token, expiresAt }.
 */
export async function createAdminSession(adminId) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.adminSession.create({
    data: { adminId, token, expiresAt },
  });
  return { token, expiresAt };
}

/**
 * Look up an admin by a session token. Returns the admin if the
 * session exists and hasn't expired, else null. Also prunes expired
 * sessions as a side effect (best-effort cleanup).
 */
export async function getAdminBySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { adminUser: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    // Best-effort cleanup; do not block the request on this.
    prisma.adminSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return stripPasswordHash(session.adminUser);
}

/**
 * Delete an admin session by token. No-op if token doesn't exist.
 */
export async function deleteAdminSession(token) {
  if (!token) return;
  await prisma.adminSession
    .delete({ where: { token } })
    .catch(() => {}); // Ignore "not found" — idempotent
}

/**
 * Delete ALL sessions for an admin. Used by "log out everywhere".
 */
export async function deleteAllAdminSessions(adminId) {
  await prisma.adminSession.deleteMany({ where: { adminId } });
}

/**
 * Strip the passwordHash field before returning an admin to the caller.
 * Prevents accidental leaks.
 */
function stripPasswordHash(admin) {
  if (!admin) return null;
  const { passwordHash, ...safe } = admin;
  return safe;
}
