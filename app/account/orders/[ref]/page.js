// /app/account/orders/[ref]/page.js
// Order detail page. Shows one order, with line items, totals,
// delivery details, and receipt placeholders. The /account
// layout already auth-gates, so we just need to ensure the
// order belongs to the current customer (no peeking at
// someone else's orders via URL guessing).

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/auth/current-customer";
import { formatPrice } from "@/lib/menu/dishes";
import ReceiptBlock from "@/components/account/ReceiptBlock";
import ReportIssueLink from "@/components/account/ReportIssueLink";
import ReorderButton from "./ReorderButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  return {
    title: `Order ${params.ref} — Lady D Kitchen`,
  };
}

const STATUS_LABELS = {
  NEW: "Awaiting confirmation",
  DEPOSIT_CONFIRMED: "Deposit confirmed",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED_PAID: "Delivered",
  DISPUTED: "Disputed",
};

const STATUS_COLORS = {
  NEW: "bg-cream text-muted",
  DEPOSIT_CONFIRMED: "bg-clay text-white",
  PREPARING: "bg-clay text-white",
  OUT_FOR_DELIVERY: "bg-clay text-white",
  DELIVERED_PAID: "bg-ink text-white",
  DISPUTED: "bg-terracotta text-white",
};

export default async function OrderDetailPage({ params }) {
  const ref = String(params.ref || "");
  const customer = await getCurrentCustomer();
  if (!customer) return null;

  let order = null;
  let dbError = false;
  try {
    order = await prisma.order.findUnique({
      where: { ref },
      include: {
        items: { orderBy: { id: "asc" } },
        receipts: { orderBy: { createdAt: "asc" } },
      },
    });
  } catch (err) {
    console.error("[OrderDetailPage] DB error:", err.message);
    dbError = true;
  }

  if (dbError) {
    return (
      <main className="min-h-screen bg-cream text-ink p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-serif text-3xl mb-3">We hit a snag</h1>
          <p className="text-muted">
            We couldn't load this order right now. Please try again in a moment.
          </p>
          <Link
            href="/account/orders"
            className="text-clay hover:underline mt-4 inline-block"
          >
            ← Back to your orders
          </Link>
        </div>
      </main>
    );
  }

  // Security: order must exist AND belong to the current customer.
  if (!order || order.customerId !== customer.id) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/account/orders"
        className="text-sm text-clay hover:underline mb-4 inline-block"
      >
        ← All orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-3xl mb-1">{order.ref}</h2>
          <p className="text-sm text-muted">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <span
          className={`text-xs uppercase tracking-wide px-2.5 py-1 rounded-full ${
            STATUS_COLORS[order.status] || "bg-cream text-muted"
          }`}
        >
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>

      {/* Items */}
      <section className="bg-white border border-hairline rounded-card p-6 mb-4">
        <h3 className="font-medium mb-4">Items</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {item.dishName}{" "}
                  <span className="text-muted font-normal">
                    ({item.variantSize})
                  </span>
                </p>
                <p className="text-xs text-muted font-mono">
                  {item.variantCode} · {formatPrice(item.unitPrice)} each
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-muted">× {item.quantity}</p>
                <p className="font-semibold">
                  {formatPrice(item.lineTotal)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-4 border-t border-hairline space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">
              Delivery ({order.zoneName})
            </span>
            <span>{formatPrice(order.deliveryFee)}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-hairline flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-clay">
              {formatPrice(order.total)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted pt-2">
            <span>Deposit (50%)</span>
            <span>{formatPrice(order.depositAmount)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted">
            <span>Balance on delivery</span>
            <span>{formatPrice(order.balanceAmount)}</span>
          </div>
        </div>
      </section>

      {/* Delivery details */}
      <section className="bg-white border border-hairline rounded-card p-6 mb-4">
        <h3 className="font-medium mb-3">Delivery</h3>
        <div className="text-sm space-y-1">
          <p>
            <span className="text-muted">Date/time:</span>{" "}
            {new Date(order.deliveryDate).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}{" "}
            at {order.deliveryTime}
          </p>
          <p>
            <span className="text-muted">Address:</span>{" "}
            {order.deliveryAddress}
          </p>
          <p>
            <span className="text-muted">Zone:</span>{" "}
            {order.zoneName}
          </p>
          {order.riderName && (
            <p>
              <span className="text-muted">Rider:</span>{" "}
              {order.riderName}
            </p>
          )}
        </div>
        {order.notes && (
          <div className="mt-4 pt-4 border-t border-hairline">
            <p className="text-xs text-muted mb-1">Notes</p>
            <p className="text-sm">{order.notes}</p>
          </div>
        )}
      </section>

      {/* Receipts */}
      <section className="mb-4">
        <h3 className="font-medium mb-3">Receipts</h3>
        {order.receipts.length === 0 ? (
          <div className="bg-cream border border-hairline rounded-card p-4 text-sm text-muted">
            Receipts will appear here after your deposit is confirmed
            and after delivery is completed.
          </div>
        ) : (
          <div className="space-y-3">
            {order.receipts.map((receipt) => (
              <ReceiptBlock key={receipt.id} receipt={receipt} />
            ))}
          </div>
        )}
      </section>

      <ReorderButton orderRef={order.ref} />

      {/* Report an issue */}
      <section className="mt-8 pt-6 border-t border-hairline">
        <p className="text-sm text-muted mb-3">
          Something wrong with this order?
        </p>
        <ReportIssueLink ref={order.ref} />
        <p className="text-xs text-muted mt-2">
          Please report within 2 hours of delivery.
        </p>
      </section>
    </div>
  );
}
