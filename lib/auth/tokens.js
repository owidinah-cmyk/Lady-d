// Generates cryptographically random session tokens. We use Node's
// built-in crypto module — no external library needed.
import { randomBytes } from "node:crypto";

// 32 bytes = 64 hex characters. Long enough that brute-forcing the
// session table is computationally infeasible.
export function generateSessionToken() {
  return randomBytes(32).toString("hex");
}
