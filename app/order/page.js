// /app/order/page.js
// The cart review page. Resolves the cart cookie against the DB,
// renders line items + summary. Resilience pattern: force-dynamic,
// try/catch in the resolution helper.

import Link from "next/link";
import { readCart } from "@/lib/cart/cookie";
import { resolveCart } from "@/lib/menu/cart-resolution";
import { prisma } from "@/lib/db";
import OrderLineItem from "@/components/order/OrderLineItem";
import OrderSummary from "@/components/order/OrderSummary";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your order — Lady D Kitchen",
  description: "Review your order before checkout.",
};

export default async function OrderPage() {
  const cart = readCart();
  const { lineItems, subtotal, unavailableCount } = await resolveCart(cart.items);
  const availableLineItems = lineItems.filter((i) => i.isAvailable);
  const availableItemCount = availableLineItems.reduce((s, i) => s + i.quantity, 0);

  // Resolve the zone for the delivery fee.
  let deliveryFee = null;
  let zoneName = null;
  if (cart.zoneId) {
    try {
      const zone = await prisma.zone.findUnique({
        where: { id: cart.zoneId },
        select: { deliveryFee: true, name: true, isActive: true },
      });
      if (zone && zone.isActive) {
        deliveryFee = zone.deliveryFee;
        zoneName = zone.name;
      }
    } catch (err) {
      console.error("[OrderPage] zone lookup error:", err.message);
    }
  }

  // Empty cart state.
  if (lineItems.length === 0) {
    return (
      <main className="min-h-screen bg-cream text-ink">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="font-serif text-4xl mb-4">Your order is empty</h1>
          <p className="text-muted mb-8">
            Browse our menu and add a few dishes to get started.
          </p>
          <Link
            href="/menu"
            className="inline-block bg-clay hover:bg-clay-dark text-white font-medium px-6 py-3 rounded-md transition-colors"
          >
            View menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-4xl mb-2">Your order</h1>
        <p className="text-sm text-muted mb-8">
          Review your items, adjust quantities, then proceed to checkout.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Line items */}
          <div className="lg:col-span-2 space-y-3">
            {unavailableCount > 0 && (
              <div className="bg-cream border border-terracotta rounded-card p-4 mb-4">
                <p className="text-sm text-terracotta">
                  {unavailableCount} item{unavailableCount === 1 ? "" : "s"} in
                  your order {unavailableCount === 1 ? "is" : "are"} no longer
                  available. Please remove {unavailableCount === 1 ? "it" : "them"}{" "}
                  below to continue.
                </p>
              </div>
            )}
            {lineItems.map((item) => (
              <OrderLineItem key={item.variantId} item={item} />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              zoneName={zoneName}
              itemCount={availableItemCount}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
