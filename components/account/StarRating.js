// /components/account/StarRating.js
// "use client" — interactive 5-star rating input.
// Hidden form input mirrors the current rating so the form
// submission carries the value.

"use client";

import { useState } from "react";

export default function StarRating({ name = "rating", defaultValue = 0 }) {
  const [rating, setRating] = useState(defaultValue);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hover || rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="text-2xl leading-none focus:outline-none"
            aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
          >
            <span
              className={
                isActive ? "text-clay" : "text-hairline"
              }
            >
              ★
            </span>
          </button>
        );
      })}
      <input type="hidden" name={name} value={rating} />
      {rating > 0 && (
        <span className="text-xs text-muted ml-2">
          {rating} / 5
        </span>
      )}
    </div>
  );
}
