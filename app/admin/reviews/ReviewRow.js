"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { setReviewStatus } from "./actions";

const STATUS_COLORS = {
  PENDING: "bg-[#F7F5F1] text-[#A69A88]",
  APPROVED: "bg-[#D4AF5A] text-white",
  REJECTED: "bg-[#7A2634] text-white",
};

export default function ReviewRow({ review }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function setStatus(status) {
    setError(null);
    startTransition(async () => {
      const result = await setReviewStatus(review.id, status);
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <div className="bg-white border border-[#E8E2D5] rounded-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm">
            <strong>{review.customer.name}</strong> ·{" "}
            <Link href={`/admin/orders/${review.order.ref}`} className="font-mono text-[#D4AF5A] hover:underline">
              {review.order.ref}
            </Link>
          </p>
          <p className="text-xs text-[#A69A88]">
            {new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <span className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_COLORS[review.status]}`}>
          {review.status}
        </span>
      </div>
      <div className="text-[#D4AF5A] text-sm mb-1">
        {"★".repeat(review.rating)}<span className="text-[#E8E2D5]">{"★".repeat(5 - review.rating)}</span>
      </div>
      {review.comment && <p className="text-sm text-[#1A1614] mb-3">{review.comment}</p>}
      {error && <p className="text-sm text-[#7A2634] mb-2">{error}</p>}
      {review.status !== "APPROVED" && (
        <button onClick={() => setStatus("APPROVED")} disabled={isPending}
          className="text-sm bg-[#D4AF5A] hover:bg-[#B8933F] text-white px-3 py-1 rounded mr-2 disabled:opacity-50">
          Approve
        </button>
      )}
      {review.status !== "REJECTED" && (
        <button onClick={() => setStatus("REJECTED")} disabled={isPending}
          className="text-sm border border-[#7A2634] text-[#7A2634] hover:bg-[#7A2634] hover:text-white px-3 py-1 rounded transition-colors disabled:opacity-50">
          Reject
        </button>
      )}
    </div>
  );
}
