import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "cart";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must be set and at least 32 characters long. " +
        "Add it to your .env file."
    );
  }
  return secret;
}

function b64urlEncode(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return Buffer.from(str, "base64");
}

function sign(payload) {
  const secret = getSecret();
  const json = JSON.stringify(payload);
  const b64 = b64urlEncode(json);
  const sig = b64urlEncode(
    createHmac("sha256", secret).update(b64).digest()
  );
  return `${b64}.${sig}`;
}

function verify(token) {
  const secret = getSecret();
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const expectedSig = b64urlEncode(
    createHmac("sha256", secret).update(b64).digest()
  );
  // timingSafeEqual requires equal-length buffers.
  if (sig.length !== expectedSig.length) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (!timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(b64urlDecode(b64).toString("utf-8"));
  } catch {
    return null;
  }
}

/**
 * Read the cart payload from the request cookies. Returns the
 * default empty cart if no cookie, invalid signature, or parse
 * error. Never throws.
 */
export function readCart() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return emptyCart();
  const payload = verify(token);
  if (!payload) return emptyCart();
  return {
    items: Array.isArray(payload.items) ? payload.items : [],
    zoneId: typeof payload.zoneId === "string" ? payload.zoneId : undefined,
    savedAddress:
      payload.savedAddress && typeof payload.savedAddress.address === "string"
        ? payload.savedAddress
        : undefined,
    lastViewedCategory:
      typeof payload.lastViewedCategory === "string"
        ? payload.lastViewedCategory
        : undefined,
  };
}

/**
 * Write a cart payload. Sets the cookie with HMAC signature.
 * Returns the cookie name so callers can also set the cookie
 * from a route handler if needed.
 */
export function writeCart(payload) {
  const token = sign(payload);
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export function clearCart() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getCartItemCount() {
  const cart = readCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

function emptyCart() {
  return { items: [], zoneId: undefined, savedAddress: undefined, lastViewedCategory: undefined };
}
