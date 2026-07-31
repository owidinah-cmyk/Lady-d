// Thin wrappers around bcryptjs. Centralised so we can swap the
// cost factor or the library later in one place.
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(plain) {
  if (typeof plain !== "string" || plain.length === 0) {
    throw new Error("hashPassword: plain must be a non-empty string");
  }
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain, hash) {
  if (typeof plain !== "string" || typeof hash !== "string") {
    return false;
  }
  return bcrypt.compare(plain, hash);
}
