"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";

export async function setReviewStatus(reviewId, newStatus) {
  await requireAdmin();
  if (!["PENDING", "APPROVED", "REJECTED"].includes(newStatus)) {
    return { ok: false, error: "Invalid status." };
  }
  try {
    await prisma.review.update({ where: { id: reviewId }, data: { status: newStatus } });
    revalidatePath("/admin/reviews");
    return { ok: true };
  } catch (err) {
    console.error("[setReviewStatus] error:", err.message);
    return { ok: false, error: "Could not update the review. Please try again." };
  }
}
