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
