// /app/order/success/[ref]/page.js
// The page customers land on after placing an order.
// Confirms the order ref and shows a "we'll be in touch on
// WhatsApp" message. Links to view all orders in their account.

import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order placed — Lady D Kitchen",
};

export default async function OrderSuccessPage({ params }) {
  const ref = String(params.ref || "");

  let order = null;
  try {
    order = await prisma.order.findUnique({
      where: { ref },
      select: {
        ref: true,
        status: true,
        total: true,
        deliveryDate: true,
        deliveryTime: true,
        createdAt: true,
      },
    });
  } catch (err) {
    console.error("[OrderSuccessPage] DB error:", err.message);
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 sm:mb-6 rounded-full bg-clay text-white text-2xl sm:text-3xl flex items-center justify-center">
          ✓
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl mb-3">Order placed</h1>
        <p className="text-sm text-muted mb-6">
          We&apos;ve opened WhatsApp with your order details. Send
          the message and our team will confirm your order and
          share payment details.
        </p>
        {order && (
          <div className="bg-white border border-hairline rounded-card p-6 text-left mb-6">
            <p className="text-sm text-muted">Order ref</p>
            <p className="font-mono text-lg mb-3">{order.ref}</p>
            <p className="text-sm text-muted">Status</p>
            <p className="font-medium mb-3">Awaiting confirmation</p>
            <p className="text-sm text-muted">Delivery</p>
            <p className="font-medium">
              {new Date(order.deliveryDate).toLocaleDateString("en-GB", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}{" "}
              at {order.deliveryTime}
            </p>
          </div>
        )}
        <Link
          href="/account/orders"
          className="inline-block text-clay hover:underline"
        >
          View all your orders →
        </Link>
      </div>
    </main>
  );
}
