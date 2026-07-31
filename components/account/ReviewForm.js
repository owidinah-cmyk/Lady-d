// /components/account/ReviewForm.js
// "use client" — calls submitReview, handles loading + error
// + success states.

"use client";

import { useState, useTransition } from "react";
import { submitReview } from "@/app/account/reviews/actions";
import StarRating from "./StarRating";

export default function ReviewForm({ orderId, orderRef }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitReview(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div className="bg-cream border border-clay rounded-card p-4 text-sm">
        <p className="text-ink">
          Thanks for your review of {orderRef}! It&apos;ll appear
          publicly once our team approves it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input type="hidden" name="orderId" value={orderId} />
      <StarRating />
      <div>
        <label
          htmlFor={`comment-${orderId}`}
          className="block text-sm font-medium mb-1"
        >
          Comment <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          id={`comment-${orderId}`}
          name="comment"
          rows={3}
          maxLength={1000}
          placeholder="What did you think of your order?"
          className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay text-sm"
        />
      </div>
      {error && (
        <p className="text-sm text-terracotta">{error}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="bg-clay hover:bg-clay-dark text-white font-medium px-4 py-2 rounded-md transition-colors text-sm disabled:opacity-50"
      >
        {isPending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
