// /components/order/OrderLineItem.js
// "use client" — quantity stepper and remove button are interactive.

"use client";

import { useTransition, useState } from "react";
import { setQuantity, removeItem } from "@/lib/cart/actions";
import { formatPrice } from "@/lib/menu/dishes";

export default function OrderLineItem({ item }) {
  const [isPending, startTransition] = useTransition();
  const [localQty, setLocalQty] = useState(item.quantity);

  if (!item.isAvailable) {
    return (
      <div className="flex items-center gap-4 p-4 bg-cream border border-terracotta rounded-card">
        <div className="flex-1">
          <p className="font-medium text-terracotta">
            {item.dishName}
          </p>
          <p className="text-sm text-muted">
            This item is no longer available. Please remove it from
            your order.
          </p>
        </div>
        <button
          onClick={() =>
            startTransition(() => removeItem({ variantId: item.variantId }))
          }
          disabled={isPending}
          className="text-sm text-terracotta hover:underline disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    );
  }

  function updateQty(newQty) {
    if (newQty < 0 || newQty > 99) return;
    setLocalQty(newQty);
    startTransition(() => setQuantity({ variantId: item.variantId, quantity: newQty }));
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-hairline rounded-card">
      {/* Photo */}
      <div className="w-20 h-20 bg-cream rounded-md flex-none overflow-hidden">
        {item.photo ? (
          <img
            src={item.photo}
            alt={item.dishName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-[10px]">
            No photo
          </div>
        )}
      </div>

      {/* Name + size + line total */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-ink truncate">
          {item.dishName}
        </p>
        <p className="text-sm text-muted">
          {item.variantSize} · {formatPrice(item.unitPrice)} each
        </p>
      </div>

      {/* Quantity stepper */}
      <div className="flex items-center border border-hairline rounded-md">
        <button
          onClick={() => updateQty(localQty - 1)}
          disabled={isPending}
          className="w-8 h-8 flex items-center justify-center text-ink hover:bg-cream disabled:opacity-50"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-medium">
          {localQty}
        </span>
        <button
          onClick={() => updateQty(localQty + 1)}
          disabled={isPending}
          className="w-8 h-8 flex items-center justify-center text-ink hover:bg-cream disabled:opacity-50"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Line total */}
      <div className="text-right w-24">
        <p className="font-semibold text-ink">
          {formatPrice(item.lineTotal)}
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={() =>
          startTransition(() => removeItem({ variantId: item.variantId }))
        }
        disabled={isPending}
        className="text-muted hover:text-terracotta disabled:opacity-50"
        aria-label={`Remove ${item.dishName} from order`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>
    </div>
  );
}
