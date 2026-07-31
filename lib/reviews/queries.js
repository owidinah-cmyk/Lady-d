import { prisma } from "@/lib/db";

/**
 * Get the N most recent approved reviews.
 * Returns [] on DB error.
 */
export async function getApprovedReviews({ limit = 6 } = {}) {
  try {
    return await prisma.review.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        customer: { select: { name: true } },
        order: { select: { ref: true } },
      },
    });
  } catch (err) {
    console.error("[getApprovedReviews] DB error:", err.message);
    return [];
  }
}

/**
 * Get N random approved reviews.
 * Returns [] on DB error.
 */
export async function getRandomApprovedReviews({ limit = 3 } = {}) {
  try {
    const all = await prisma.review.findMany({
      where: { status: "APPROVED" },
      include: {
        customer: { select: { name: true } },
        order: { select: { ref: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all.slice(0, limit);
  } catch (err) {
    console.error("[getRandomApprovedReviews] DB error:", err.message);
    return [];
  }
}
