// Pure validation functions. No external library. Each returns either
// { ok: true, value: <sanitized> } or { ok: false, error: <message> }.
// Messages are user-facing and safe to return in API responses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Nigerian phone numbers: accept +234..., 234..., or 0... formats,
// 10-14 digits total after stripping non-digits.
const PHONE_RE = /^\+?[0-9]{10,14}$/;

export function validateEmail(input) {
  if (typeof input !== "string") return { ok: false, error: "Email is required" };
  const trimmed = input.trim().toLowerCase();
  if (trimmed.length === 0) return { ok: false, error: "Email is required" };
  if (trimmed.length > 254) return { ok: false, error: "Email is too long" };
  if (!EMAIL_RE.test(trimmed)) return { ok: false, error: "Please enter a valid email address" };
  return { ok: true, value: trimmed };
}

export function validatePassword(input) {
  if (typeof input !== "string") return { ok: false, error: "Password is required" };
  if (input.length < 8) return { ok: false, error: "Password must be at least 8 characters" };
  if (input.length > 128) return { ok: false, error: "Password is too long" };
  return { ok: true, value: input };
}

export function validateName(input) {
  if (typeof input !== "string") return { ok: false, error: "Name is required" };
  const trimmed = input.trim();
  if (trimmed.length < 2) return { ok: false, error: "Please enter your full name" };
  if (trimmed.length > 100) return { ok: false, error: "Name is too long" };
  return { ok: true, value: trimmed };
}

export function validatePhone(input) {
  if (typeof input !== "string") return { ok: false, error: "Phone number is required" };
  // Strip spaces, dashes, parentheses. Keep + and digits.
  const cleaned = input.replace(/[\s\-()]/g, "");
  if (!PHONE_RE.test(cleaned)) {
    return { ok: false, error: "Please enter a valid phone number (e.g. 08012345678)" };
  }
  return { ok: true, value: cleaned };
}

// Optional phone — returns null if blank, else validates.
export function validateOptionalPhone(input) {
  if (typeof input !== "string" || input.trim().length === 0) {
    return { ok: true, value: null };
  }
  return validatePhone(input);
}
