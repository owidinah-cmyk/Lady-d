// Business logic for customer authentication.
// Used by API route handlers (1.5) and Server Components.
// Does NOT touch cookies directly — that's the caller's job.

import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "./passwords";
import { generateSessionToken } from "./tokens";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

/**
 * Create a new customer with email + password.
 * Returns the customer record (without passwordHash).
 * Throws on email collision.
 */
export async function createCustomerWithPassword({ name, email, phone, password }) {
  const passwordHash = await hashPassword(password);
  const customer = await prisma.customer.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash,
      authMethod: "email",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      authMethod: true,
      createdAt: true,
    },
  });
  return customer;
}

/**
 * Find a customer by email. Returns null if not found.
 * Used by login flow.
 */
export async function findCustomerByEmail(email) {
  return prisma.customer.findUnique({
    where: { email },
  });
}

/**
 * Verify a customer's email + password.
 * Returns the customer record (without passwordHash) on success, or null.
 */
export async function verifyCustomerCredentials(email, password) {
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !customer.passwordHash) return null;
  const ok = await verifyPassword(password, customer.passwordHash);
  if (!ok) return null;
  return stripPasswordHash(customer);
}

/**
 * Create a session for a customer. Returns { token, expiresAt }.
 */
export async function createCustomerSession(customerId) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.session.create({
    data: { customerId, token, expiresAt },
  });
  return { token, expiresAt };
}

/**
 * Look up a customer by a session token. Returns the customer if the
 * session exists and hasn't expired, else null. Also prunes expired
 * sessions as a side effect (best-effort cleanup).
 */
export async function getCustomerBySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { customer: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    // Best-effort cleanup; do not block the request on this.
    prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return stripPasswordHash(session.customer);
}

/**
 * Delete a session by token. No-op if token doesn't exist.
 */
export async function deleteCustomerSession(token) {
  if (!token) return;
  await prisma.session
    .delete({ where: { token } })
    .catch(() => {}); // Ignore "not found" — idempotent
}

/**
 * Delete ALL sessions for a customer. Used by "log out everywhere".
 */
export async function deleteAllCustomerSessions(customerId) {
  await prisma.session.deleteMany({ where: { customerId } });
}

/**
 * Strip the passwordHash field before returning a customer to the caller.
 * Prevents accidental leaks.
 */
function stripPasswordHash(customer) {
  if (!customer) return null;
  const { passwordHash, ...safe } = customer;
  return safe;
}
