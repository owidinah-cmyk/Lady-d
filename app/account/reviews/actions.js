// /app/account/reviews/actions.js
// Server Action: creates a Review for a specific order.
// Validates: the order belongs to the customer, the order
// is DELIVERED_PAID, and no review exists yet for that order.

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/auth/current-customer";

const MIN_RATING = 1;
const MAX_RATING = 5;
const MAX_COMMENT_LENGTH = 1000;

export async function submitReview(formData) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return { ok: false, error: "You must be signed in." };
  }

  const orderId = String(formData.get("orderId") || "").trim();
  if (!orderId) {
    return { ok: false, error: "Missing order reference." };
  }

  const rating = Number(formData.get("rating"));
  if (!Number.isInteger(rating) || rating < MIN_RATING || rating > MAX_RATING) {
    return { ok: false, error: "Please pick a rating from 1 to 5 stars." };
  }

  const comment = String(formData.get("comment") || "").trim();
  if (comment.length > MAX_COMMENT_LENGTH) {
    return { ok: false, error: `Comment is too long (max ${MAX_COMMENT_LENGTH} characters).` };
  }

  // Validate the order: must belong to customer, must be
  // DELIVERED_PAID, must not already have a review.
  let order;
  try {
    order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        customerId: true,
        status: true,
        review: { select: { id: true } },
      },
    });
  } catch (err) {
    console.error("[submitReview] DB error:", err.message);
    return { ok: false, error: "Could not submit your review. Please try again." };
  }

  if (!order || order.customerId !== customer.id) {
    return { ok: false, error: "Order not found." };
  }
  if (order.status !== "DELIVERED_PAID") {
    return { ok: false, error: "You can only review delivered orders." };
  }
  if (order.review) {
    return { ok: false, error: "You've already reviewed this order." };
  }

  try {
    await prisma.review.create({
      data: {
        customerId: customer.id,
        orderId: order.id,
        rating,
        comment: comment || null,
        status: "PENDING",
      },
    });
  } catch (err) {
    console.error("[submitReview] create error:", err.message);
    return { ok: false, error: "Could not submit your review. Please try again." };
  }

  revalidatePath("/account/reviews");
  return { ok: true };
}
