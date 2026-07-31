// /app/account/orders/page.js
// Full order history. Lists all orders, most recent first.
// Same row UI as the dashboard teaser, but no "view all" link.

import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/auth/current-customer";
import { formatPrice } from "@/lib/menu/dishes";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your orders — Lady D Kitchen",
};

export default async function OrdersPage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;

  let orders = [];
  try {
    orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: "desc" },
      select: {
        ref: true,
        status: true,
        total: true,
        deliveryDate: true,
        createdAt: true,
      },
    });
  } catch (err) {
    console.error("[OrdersPage] DB error:", err.message);
  }

  const statusLabels = {
    NEW: "Awaiting confirmation",
    DEPOSIT_CONFIRMED: "Deposit confirmed",
    PREPARING: "Preparing",
    OUT_FOR_DELIVERY: "Out for delivery",
    DELIVERED_PAID: "Delivered",
    DISPUTED: "Disputed",
  };

  return (
    <div>
      <h2 className="font-serif text-2xl mb-4">All orders</h2>

      {orders.length === 0 ? (
        <div className="bg-white border border-hairline rounded-card p-6 text-center">
          <p className="text-muted mb-4">
            You haven&apos;t placed any orders yet.
          </p>
          <Link
            href="/menu"
            className="inline-block bg-clay hover:bg-clay-dark text-white font-medium px-5 py-2 rounded-md transition-colors"
          >
            Browse the menu
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <Link
              key={order.ref}
              href={`/account/orders/${order.ref}`}
              className="flex items-center justify-between p-4 bg-white border border-hairline rounded-card hover:border-clay transition-colors"
            >
              <div>
                <p className="font-mono text-sm">{order.ref}</p>
                <p className="text-xs text-muted mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {statusLabels[order.status] || order.status}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-ink">
                  {formatPrice(order.total)}
                </p>
                <p className="text-xs text-clay mt-0.5">View →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
