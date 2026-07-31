"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "../actions";

const NEXT_STATUS = {
  NEW: "DEPOSIT_CONFIRMED",
  DEPOSIT_CONFIRMED: "PREPARING",
  PREPARING: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED_PAID",
  DELIVERED_PAID: null,
  DISPUTED: "DELIVERED_PAID",
};

const STATUS_LABELS = {
  DEPOSIT_CONFIRMED: "Confirm deposit",
  PREPARING: "Mark as preparing",
  OUT_FOR_DELIVERY: "Mark out for delivery",
  DELIVERED_PAID: "Mark as delivered & paid",
};

export default function OrderAdminControls({ orderId, currentStatus }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const next = NEXT_STATUS[currentStatus];

  function advance() {
    if (!next) return;
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, next);
      if (!result.ok) setError(result.error);
    });
  }

  function markDisputed() {
    if (!confirm("Mark this order as DISPUTED? Use this when the customer reports an issue.")) return;
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, "DISPUTED");
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <section className="bg-white border border-[#E8E2D5] rounded-card p-5 space-y-3">
      <h2 className="font-medium">Status</h2>
      <p className="text-sm text-[#A69A88]">Current: {currentStatus}</p>
      {next && (
        <button
          onClick={advance}
          disabled={isPending}
          className="w-full bg-[#D4AF5A] hover:bg-[#B8933F] text-white font-medium py-2 rounded text-sm disabled:opacity-50"
        >
          {isPending ? "…" : `→ ${STATUS_LABELS[next] || next}`}
        </button>
      )}
      {currentStatus === "DELIVERED_PAID" && (
        <button
          onClick={markDisputed}
          disabled={isPending}
          className="w-full border border-[#7A2634] text-[#7A2634] hover:bg-[#7A2634] hover:text-white font-medium py-2 rounded text-sm transition-colors disabled:opacity-50"
        >
          Mark as disputed
        </button>
      )}
      {error && <p className="text-sm text-[#7A2634]">{error}</p>}
    </section>
  );
}
