// /components/menu/AddToCartButton.js
// "use client" — the button is interactive.
// Renders a floating circular "+" button. On click, opens a
// popover with the size selector and an "Add to order" button.

"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { addItem } from "@/lib/cart/actions";
import { formatPrice } from "@/lib/menu/dishes";

export default function AddToCartButton({ variants }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(variants[0]?.id || null);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState(null);
  const popoverRef = useRef(null);

  // Close on outside click.
  useEffect(() => {
    function onDocClick(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }
  }, [open]);

  // Auto-dismiss feedback after 1.5s.
  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(null), 1500);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  function onAdd() {
    if (!selected) return;
    startTransition(async () => {
      const result = await addItem({ variantId: selected, quantity: 1 });
      if (result.ok) {
        setFeedback("Added!");
        setOpen(false);
      } else {
        setFeedback(result.error || "Could not add");
      }
    });
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-clay hover:bg-clay-dark text-white text-xl font-semibold flex items-center justify-center shadow-md transition-colors"
        aria-label="Add to order"
      >
        +
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-30 w-[calc(100vw-2rem)] max-w-xs bg-white border border-hairline rounded-card shadow-lg p-4">
          <p className="text-xs text-muted uppercase tracking-wide mb-2">
            Choose size
          </p>
          <div className="space-y-2 mb-3">
            {variants.map((v) => (
              <label
                key={v.id}
                className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                  selected === v.id
                    ? "border-clay bg-cream"
                    : "border-hairline hover:border-clay"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="variant"
                    value={v.id}
                    checked={selected === v.id}
                    onChange={() => setSelected(v.id)}
                    className="accent-clay"
                  />
                  <span className="text-sm">{v.size}</span>
                </span>
                <span className="text-sm font-medium text-clay">
                  {formatPrice(v.price)}
                </span>
              </label>
            ))}
          </div>
          <button
            onClick={onAdd}
            disabled={isPending}
            className="w-full bg-clay hover:bg-clay-dark text-white font-medium py-2 rounded-md transition-colors disabled:opacity-50"
          >
            {isPending ? "Adding…" : "Add to order"}
          </button>
        </div>
      )}

      {feedback && (
        <div className="absolute right-0 top-12 z-30 bg-ink text-white text-xs px-3 py-1.5 rounded-md">
          {feedback}
        </div>
      )}
    </div>
  );
}
