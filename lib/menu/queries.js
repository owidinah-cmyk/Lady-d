// Server-side queries for the menu page. Wrapped in try/catch
// with graceful fallbacks per the resilience pattern from 2.1a.

import { prisma } from "@/lib/db";

/**
 * Get all categories present across active dishes. Returns an
 * array of unique category strings, alphabetized.
 */
export async function getCategories() {
  try {
    const dishes = await prisma.dish.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"],
    });
    return dishes
      .map((d) => d.category)
      .filter((c) => typeof c === "string" && c.length > 0)
      .sort();
  } catch (err) {
    console.error("[getCategories] DB error:", err.message);
    return [];
  }
}

/**
 * Get all active dishes, optionally filtered by category.
 * Includes active variants. Returns an empty array on DB error.
 */
export async function getDishesByCategory({ category } = {}) {
  try {
    return await prisma.dish.findMany({
      where: {
        isActive: true,
        ...(category && category !== "All" ? { category } : {}),
      },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { price: "asc" },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
    });
  } catch (err) {
    console.error("[getDishesByCategory] DB error:", err.message);
    return [];
  }
}

/**
 * Get all active zones. Used by the ZoneSelector.
 * Returns an empty array on DB error.
 */
export async function getActiveZones() {
  try {
    return await prisma.zone.findMany({
      where: { isActive: true },
      orderBy: [{ city: "asc" }, { name: "asc" }],
    });
  } catch (err) {
    console.error("[getActiveZones] DB error:", err.message);
    return [];
  }
}
