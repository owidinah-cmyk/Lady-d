// /components/order/OrderSummary.js
// Server Component. Renders the totals block: subtotal, delivery
// fee (if zone is set), total, and a "Proceed to checkout" CTA.
// The CTA links to /checkout.

import Link from "next/link";
import { formatPrice } from "@/lib/menu/dishes";

export default function OrderSummary({ subtotal, deliveryFee, zoneName, itemCount }) {
  const total = subtotal + (deliveryFee || 0);
  const canCheckout = itemCount > 0;

  return (
    <div className="bg-white border border-hairline rounded-card p-6 sticky top-20">
      <h2 className="font-serif text-xl mb-4">Order summary</h2>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-muted">
            Subtotal {itemCount > 0 && `(${itemCount} item${itemCount === 1 ? "" : "s"})`}
          </span>
          <span className="text-ink">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">
            Delivery {zoneName ? `(${zoneName})` : "(zone not selected)"}
          </span>
          <span className="text-ink">
            {deliveryFee !== null ? formatPrice(deliveryFee) : "—"}
          </span>
        </div>
        <div className="pt-2 mt-2 border-t border-hairline flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-clay">{formatPrice(total)}</span>
        </div>
      </div>

      {!zoneName && (
        <p className="text-xs text-terracotta bg-cream border border-hairline rounded-md p-3 mb-4">
          Please pick a delivery zone on the{" "}
          <Link href="/menu" className="underline">
            menu page
          </Link>{" "}
          before checkout.
        </p>
      )}

      <Link
        href={canCheckout ? "/checkout" : "/menu"}
        className={`block text-center font-medium py-3 rounded-md transition-colors ${
          canCheckout
            ? "bg-clay hover:bg-clay-dark text-white"
            : "bg-hairline text-muted cursor-not-allowed"
        }`}
      >
        {canCheckout ? "Proceed to checkout" : "Add items first"}
      </Link>

      <p className="text-[11px] text-muted mt-3 text-center">
        Next step: confirm your details and we&apos;ll open WhatsApp
        to finalize with our team.
      </p>
    </div>
  );
}
