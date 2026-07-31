"use server";

import { revalidatePath } from "next/cache";
import { readCart, writeCart, clearCart } from "./cookie";

const MAX_QUANTITY = 99;

function sanitizeVariantId(input) {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > 50) return null;
  return trimmed;
}

function sanitizeQuantity(input) {
  const n = Number(input);
  if (!Number.isInteger(n) || n < 0 || n > MAX_QUANTITY) return null;
  return n;
}

/**
 * Add an item to the cart. If the variant is already in the cart,
 * the quantity is INCREMENTED by the given amount.
 */
export async function addItem({ variantId, quantity = 1 }) {
  const vid = sanitizeVariantId(variantId);
  const qty = sanitizeQuantity(quantity);
  if (!vid || qty === null || qty === 0) {
    return { ok: false, error: "Invalid variant or quantity" };
  }

  const cart = readCart();
  const existing = cart.items.find((i) => i.variantId === vid);
  if (existing) {
    existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + qty);
  } else {
    cart.items.push({ variantId: vid, quantity: qty });
  }
  writeCart(cart);
  revalidatePath("/", "layout");
  revalidatePath("/order");
  return { ok: true, cart };
}

/**
 * Set the quantity of an item in the cart. quantity === 0 removes
 * the item entirely.
 */
export async function setQuantity({ variantId, quantity }) {
  const vid = sanitizeVariantId(variantId);
  const qty = sanitizeQuantity(quantity);
  if (!vid || qty === null) {
    return { ok: false, error: "Invalid variant or quantity" };
  }

  const cart = readCart();
  const idx = cart.items.findIndex((i) => i.variantId === vid);
  if (qty === 0) {
    if (idx !== -1) cart.items.splice(idx, 1);
  } else {
    if (idx === -1) {
      cart.items.push({ variantId: vid, quantity: qty });
    } else {
      cart.items[idx].quantity = qty;
    }
  }
  writeCart(cart);
  revalidatePath("/", "layout");
  revalidatePath("/order");
  return { ok: true, cart };
}

/**
 * Remove an item from the cart.
 */
export async function removeItem({ variantId }) {
  const vid = sanitizeVariantId(variantId);
  if (!vid) return { ok: false, error: "Invalid variant" };

  const cart = readCart();
  cart.items = cart.items.filter((i) => i.variantId !== vid);
  writeCart(cart);
  revalidatePath("/", "layout");
  revalidatePath("/order");
  return { ok: true, cart };
}

/**
 * Set the delivery zone (customer's selected delivery zone).
 * Persists across sessions.
 */
export async function setZone({ zoneId }) {
  const cart = readCart();
  if (typeof zoneId === "string" && zoneId.length > 0) {
    cart.zoneId = zoneId;
  } else {
    cart.zoneId = undefined;
  }
  writeCart(cart);
  revalidatePath("/", "layout");
  revalidatePath("/order");
  return { ok: true, cart };
}

/**
 * Save the delivery address (called when customer opts in to
 * "remember this address" at checkout). Only the address string
 * is stored — no precise location, no PII beyond what the customer
 * typed.
 */
export async function setSavedAddress({ address }) {
  const cart = readCart();
  if (typeof address === "string" && address.trim().length > 0) {
    cart.savedAddress = { address: address.trim() };
  } else {
    cart.savedAddress = undefined;
  }
  writeCart(cart);
  revalidatePath("/", "layout");
  return { ok: true, cart };
}

/**
 * Clear the saved address (customer opts out).
 */
export async function clearSavedAddress() {
  const cart = readCart();
  cart.savedAddress = undefined;
  writeCart(cart);
  revalidatePath("/", "layout");
  return { ok: true, cart };
}

/**
 * Track the last category the customer viewed (for personalization).
 */
export async function setLastViewedCategory({ category }) {
  const cart = readCart();
  if (typeof category === "string" && category.length > 0) {
    cart.lastViewedCategory = category;
  } else {
    cart.lastViewedCategory = undefined;
  }
  writeCart(cart);
  revalidatePath("/", "layout");
  return { ok: true };
}

/**
 * Clear the entire cart (used after a successful checkout, or if
 * the customer starts over).
 */
export async function resetCart() {
  clearCart();
  revalidatePath("/", "layout");
  revalidatePath("/order");
  return { ok: true };
}
