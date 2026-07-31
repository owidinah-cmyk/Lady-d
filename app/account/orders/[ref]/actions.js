"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/auth/current-customer";
import { readCart, writeCart } from "@/lib/cart/cookie";

export async function reorderFromPastOrder(orderRef) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return { ok: false, error: "Sign in to reorder." };
  }

  // Look up the past order.
  const order = await prisma.order.findUnique({
    where: { ref: orderRef },
    include: { items: true },
  });
  if (!order || order.customerId !== customer.id) {
    return { ok: false, error: "Order not found." };
  }

  // Build a cart from the past items, skipping any variants
  // that have since been deactivated.
  const variantIds = order.items.map((i) => i.variantId);
  const activeVariants = await prisma.variant.findMany({
    where: { id: { in: variantIds }, isActive: true, dish: { isActive: true } },
    select: { id: true },
  });
  const activeSet = new Set(activeVariants.map((v) => v.id));

  const cart = readCart();
  const newItems = order.items
    .filter((i) => activeSet.has(i.variantId))
    .map((i) => ({ variantId: i.variantId, quantity: i.quantity }));

  // Merge with any existing cart items (sum quantities, cap at 99).
  const merged = new Map();
  for (const i of cart.items) merged.set(i.variantId, i.quantity);
  for (const i of newItems) {
    const cur = merged.get(i.variantId) || 0;
    merged.set(i.variantId, Math.min(99, cur + i.quantity));
  }
  cart.items = Array.from(merged.entries()).map(([variantId, quantity]) => ({ variantId, quantity }));

  // Preserve the zone from the past order (if still active).
  const zone = await prisma.zone.findUnique({
    where: { id: order.zoneId },
    select: { id: true, isActive: true },
  });
  if (zone && zone.isActive) {
    cart.zoneId = zone.id;
  }

  // Write the cart.
  writeCart(cart);
  revalidatePath("/", "layout");
  revalidatePath("/order");

  return { ok: true };
}
