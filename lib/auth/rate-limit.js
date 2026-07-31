// In-memory rate limiter. Resets on server restart, which is fine
// for a single-instance app (Vercel serverless functions are short-lived
// but the limiter is per-invocation anyway). For multi-instance scale,
// we'd swap this for a Redis-backed implementation.

// Map<key, Array<timestamp>> — sliding window of recent attempts.
const store = new Map();

/**
 * Check if an action is allowed under a rate limit.
 *
 * @param {string} key - Identifier (e.g. "signup:1.2.3.4")
 * @param {number} maxAttempts - Max attempts allowed in the window
 * @param {number} windowMs - Window duration in milliseconds
 * @returns {{ allowed: boolean, retryAfterMs?: number }}
 */
export function checkRateLimit(key, maxAttempts, windowMs) {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get existing attempts and prune anything outside the window.
  const attempts = (store.get(key) || []).filter((t) => t > windowStart);

  if (attempts.length >= maxAttempts) {
    const oldest = attempts[0];
    const retryAfterMs = oldest + windowMs - now;
    return { allowed: false, retryAfterMs };
  }

  // Record this attempt and persist.
  attempts.push(now);
  store.set(key, attempts);

  return { allowed: true };
}

// Predefined limiters used across the auth endpoints.
export const LIMITS = {
  // 5 signup attempts per IP per 15 minutes
  SIGNUP: { maxAttempts: 5, windowMs: 15 * 60 * 1000 },
  // 10 login attempts per IP+email per 15 minutes
  LOGIN: { maxAttempts: 10, windowMs: 15 * 60 * 1000 },
  // 3 password-reset requests per IP per 15 minutes
  PASSWORD_RESET: { maxAttempts: 3, windowMs: 15 * 60 * 1000 },
  // 3 password-reset attempts (with a token) per IP per 15 minutes
  PASSWORD_RESET_CONFIRM: { maxAttempts: 3, windowMs: 15 * 60 * 1000 },
};

// Extract the client IP from a Next.js Request object. Handles
// x-forwarded-for (set by Vercel) and falls back to "unknown".
export function getClientIp(request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
