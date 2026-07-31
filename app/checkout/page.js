// /app/checkout/page.js
// The checkout page. Auth-gated. Resolves the cart, computes
// totals, renders the form. Uses the resilience pattern.

import { redirect } from "next/navigation";
import { readCart } from "@/lib/cart/cookie";
import { getCurrentCustomer } from "@/lib/auth/current-customer";
import { resolveCart } from "@/lib/menu/cart-resolution";
import { prisma } from "@/lib/db";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout — Lady D Kitchen",
};

export default async function CheckoutPage() {
  const customer = await getCurrentCustomer();
  if (!customer) {
    redirect("/checkout/login?next=/checkout");
  }

  const cart = readCart();
  const { lineItems, subtotal } = await resolveCart(cart.items);
  const available = lineItems.filter((i) => i.isAvailable);

  if (available.length === 0) {
    redirect("/order");
  }

  // Resolve zone for delivery fee summary.
  let deliveryFee = 0;
  let zoneName = null;
  if (cart.zoneId) {
    try {
      const zone = await prisma.zone.findUnique({
        where: { id: cart.zoneId },
        select: { name: true, deliveryFee: true, isActive: true },
      });
      if (zone && zone.isActive) {
        deliveryFee = zone.deliveryFee;
        zoneName = zone.name;
      }
    } catch (err) {
      console.error("[CheckoutPage] zone lookup error:", err.message);
    }
  }

  const total = subtotal + deliveryFee;

  const maxLeadTimeHours = lineItems.length > 0
    ? Math.max(...lineItems.map((i) => Number(i.dishLeadTimeHours ?? 0)))
    : 0;

  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-serif text-4xl mb-2">Checkout</h1>
        <p className="text-sm text-muted mb-8">
          Almost there. Confirm your details, then we&apos;ll open
          WhatsApp to finalize with our team.
        </p>

        <CheckoutForm
          customer={customer}
          savedAddress={cart.savedAddress}
          defaultZoneName={zoneName}
          itemCount={available.reduce((s, i) => s + i.quantity, 0)}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          maxLeadTimeHours={maxLeadTimeHours}
          initialLineItems={available}
        />
      </div>
    </main>
  );
}
