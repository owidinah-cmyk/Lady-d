"use client";

import { useTransition, useState } from "react";
import { generateDepositReceipt, generateFinalReceipt } from "../actions";

export default function ReceiptGenerator({ orderId, status, hasDepositReceipt, hasFinalReceipt }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function onDeposit() {
    setError(null);
    startTransition(async () => {
      const result = await generateDepositReceipt(orderId);
      if (!result.ok) setError(result.error);
    });
  }

  function onFinal() {
    setError(null);
    startTransition(async () => {
      const result = await generateFinalReceipt(orderId);
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <section className="bg-white border border-[#D4AF5A] rounded-card p-5 space-y-3">
      <h2 className="font-medium">Receipts</h2>
      <p className="text-xs text-[#A69A88]">
        Full receipt generation is wired in 5.5. Buttons are live
        now; the underlying action will be implemented next.
      </p>
      <button
        onClick={onDeposit}
        disabled={isPending || hasDepositReceipt}
        className="w-full bg-[#D4AF5A] hover:bg-[#B8933F] text-white font-medium py-2 rounded text-sm disabled:opacity-50"
      >
        {hasDepositReceipt ? "✓ Deposit receipt issued" : (isPending ? "…" : "Generate deposit receipt")}
      </button>
      <button
        onClick={onFinal}
        disabled={isPending || hasFinalReceipt || status !== "DELIVERED_PAID"}
        className="w-full border border-[#D4AF5A] text-[#D4AF5A] hover:bg-[#D4AF5A] hover:text-white font-medium py-2 rounded text-sm transition-colors disabled:opacity-50"
      >
        {hasFinalReceipt ? "✓ Final receipt issued" : "Generate final receipt"}
      </button>
      {error && <p className="text-sm text-[#7A2634]">{error}</p>}
    </section>
  );
}
