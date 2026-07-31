// Central cookie name registry + shared cookie config.
// Customer and admin use SEPARATE cookies so a customer session
// can never authenticate as admin and vice versa.
export const COOKIE_NAMES = {
  customerSession: "auth_customer_session",
  adminSession: "auth_admin_session",
};

// Cookie options. httpOnly is mandatory (no JS access).
// Secure is enabled in production only.
// sameSite: "lax" allows top-level navigation (e.g. clicking through
// from a WhatsApp message or an admin link).
// Path is "/" so the cookie is sent on every route.
export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };
}

// Same as cookieOptions() but for "clear" — only path is needed to
// overwrite; everything else is ignored when clearing.
export function clearCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  };
}
