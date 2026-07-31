// /app/account/reviews/page.js
// The reviews page. Shows:
//   - "Your reviews" — reviews already submitted, with status
//   - "Leave a review" — Delivered/Paid orders without a review

import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/auth/current-customer";
import ReviewForm from "@/components/account/ReviewForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reviews — Lady D Kitchen",
};

const STATUS_LABELS = {
  PENDING: "Awaiting approval",
  APPROVED: "Published",
  REJECTED: "Not published",
};

const STATUS_COLORS = {
  PENDING: "bg-cream text-muted",
  APPROVED: "bg-clay text-white",
  REJECTED: "bg-terracotta text-white",
};

export default async function ReviewsPage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;

  let submittedReviews = [];
  let eligibleOrders = [];
  try {
    [submittedReviews, eligibleOrders] = await Promise.all([
      prisma.review.findMany({
        where: { customerId: customer.id },
        orderBy: { createdAt: "desc" },
        include: {
          order: {
            select: { ref: true },
          },
        },
      }),
      prisma.order.findMany({
        where: {
          customerId: customer.id,
          status: "DELIVERED_PAID",
          review: null,
        },
        orderBy: { deliveredAt: "desc" },
        select: {
          id: true,
          ref: true,
          deliveredAt: true,
          total: true,
        },
      }),
    ]);
  } catch (err) {
    console.error("[ReviewsPage] DB error:", err.message);
  }

  return (
    <div className="max-w-3xl space-y-10">
      {/* Your reviews */}
      <section>
        <h2 className="font-serif text-2xl mb-4">Your reviews</h2>
        {submittedReviews.length === 0 ? (
          <p className="text-sm text-muted">
            You haven&apos;t left any reviews yet.
          </p>
        ) : (
          <div className="space-y-3">
            {submittedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-hairline rounded-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Link
                      href={`/account/orders/${review.order.ref}`}
                      className="font-mono text-sm text-clay hover:underline"
                    >
                      {review.order.ref}
                    </Link>
                    <p className="text-xs text-muted">
                      {new Date(review.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      STATUS_COLORS[review.status] || "bg-cream text-muted"
                    }`}
                  >
                    {STATUS_LABELS[review.status] || review.status}
                  </span>
                </div>
                <div className="text-clay text-sm mb-2">
                  {"★".repeat(review.rating)}
                  <span className="text-hairline">
                    {"★".repeat(5 - review.rating)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-ink">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Leave a review */}
      <section>
        <h2 className="font-serif text-2xl mb-4">Leave a review</h2>
        {eligibleOrders.length === 0 ? (
          <p className="text-sm text-muted">
            No delivered orders waiting for a review right now.
            Once an order is delivered, you can leave a review here.
          </p>
        ) : (
          <div className="space-y-4">
            {eligibleOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-hairline rounded-card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <Link
                    href={`/account/orders/${order.ref}`}
                    className="font-mono text-sm text-clay hover:underline"
                  >
                    {order.ref}
                  </Link>
                  <span className="text-xs text-muted">
                    Delivered{" "}
                    {order.deliveredAt
                      ? new Date(order.deliveredAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "recently"}
                  </span>
                </div>
                <ReviewForm orderId={order.id} orderRef={order.ref} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
