// Resolves a cart cookie payload (variantId + quantity pairs)
// into a fully-detailed order preview by joining with the DB.

import { prisma } from "@/lib/db";

/**
 * Resolve a cart into display-ready line items.
 *
 * @param {Array<{variantId: string, quantity: number}>} cartItems
 * @returns {{
 *   lineItems: Array<{
 *     variantId: string,
 *     dishId: string,
 *     dishName: string,
 *     variantSize: string,
 *     photo: string | null,
 *     unitPrice: number,
 *     quantity: number,
 *     lineTotal: number,
 *     isAvailable: boolean,
 *   }>,
 *   subtotal: number,  // in kobo, only available items
 *   unavailableCount: number,
 * }}
 */
export async function resolveCart(cartItems) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { lineItems: [], subtotal: 0, unavailableCount: 0 };
  }

  const variantIds = cartItems.map((i) => i.variantId);

  let variants;
  try {
    variants = await prisma.variant.findMany({
      where: { id: { in: variantIds } },
      include: {
        dish: {
          select: {
            id: true,
            name: true,
            photos: true,
            isActive: true,
          },
        },
      },
    });
  } catch (err) {
    // If we can't reach the DB, return the cart as-is with
    // all items marked unavailable so the page can render an
    // honest error state.
    console.error("[resolveCart] DB error:", err.message);
    return {
      lineItems: cartItems.map((i) => ({
        variantId: i.variantId,
        dishId: null,
        dishName: "Unknown item",
        variantSize: "—",
        photo: null,
        unitPrice: 0,
        quantity: i.quantity,
        lineTotal: 0,
        isAvailable: false,
      })),
      subtotal: 0,
      unavailableCount: cartItems.length,
    };
  }

  // Index variants by id for fast lookup.
  const variantById = new Map(variants.map((v) => [v.id, v]));

  const lineItems = [];
  let subtotal = 0;
  let unavailableCount = 0;

  for (const cartItem of cartItems) {
    const variant = variantById.get(cartItem.variantId);
    const quantity = cartItem.quantity;

    if (!variant || !variant.isActive || !variant.dish.isActive) {
      lineItems.push({
        variantId: cartItem.variantId,
        dishId: variant?.dish?.id || null,
        dishName: variant?.dish?.name || "Unavailable item",
        variantSize: variant?.size || "—",
        photo: variant?.dish?.photos?.[0] || null,
        unitPrice: 0,
        quantity,
        lineTotal: 0,
        isAvailable: false,
      });
      unavailableCount++;
      continue;
    }

    const lineTotal = variant.price * quantity;
    subtotal += lineTotal;

    lineItems.push({
      variantId: variant.id,
      dishId: variant.dish.id,
      dishName: variant.dish.name,
      variantSize: variant.size,
      photo: variant.dish.photos?.[0] || null,
      unitPrice: variant.price,
      quantity,
      lineTotal,
      isAvailable: true,
    });
  }

  return { lineItems, subtotal, unavailableCount };
}
