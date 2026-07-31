// Server-side data helpers. Used by the landing page, /menu, and
// (later) the admin panel.

import { prisma } from "@/lib/db";

/**
 * Get the dishes to show on the landing page "featured" strip.
 * Returns up to 4 dishes, each with its variants, in stable order.
 *
 * Logic:
 *   1. Prefer dishes with isFeatured = true, ordered by createdAt asc
 *      (so the admin can control ordering by setting featured
 *      flags in a specific sequence, but we don't expose an
 *      explicit "display order" field yet).
 *   2. If no featured dishes exist, fall back to the 4 most
 *      recently added dishes.
 *   3. If no dishes exist at all, return an empty array.
 *
 * Only active dishes (isActive = true) are returned.
 * Only variants with isActive = true are returned.
 */
export async function getFeaturedDishes({ limit = 4 } = {}) {
  try {
    const featured = await prisma.dish.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { price: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
      take: limit,
    });

    if (featured.length > 0) return featured;

    return prisma.dish.findMany({
      where: { isActive: true },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { price: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch (err) {
    throw new Error(
      "getFeaturedDishes: could not load dishes from the database. " +
        "Original error: " + err.message
    );
  }
}

/**
 * Format a kobo price (integer) as a Nigerian Naira string.
 *   formatPrice(18500) === "₦18,500"
 *   formatPrice(0) === "₦0"
 *   formatPrice(50) === "₦0.50"  (uses 2 decimal places only
 *                                  when there's a remainder)
 */
export function formatPrice(kobo) {
  const naira = kobo / 100;
  if (Number.isInteger(naira)) {
    return "₦" + naira.toLocaleString("en-NG");
  }
  return "₦" + naira.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
