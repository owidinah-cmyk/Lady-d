// /app/account/page.js
// The /account overview. Shows the latest 3 orders as a teaser,
// and a "view all" link to /account/orders. Uses the resilience
// pattern — try/catch on all DB calls.

import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/auth/current-customer";
import { formatPrice } from "@/lib/menu/dishes";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your account — Lady D Kitchen",
};

export default async function AccountPage() {
  // Layout already auth-gates, but we re-check for type safety.
  const customer = await getCurrentCustomer();
  if (!customer) return null;

  let recentOrders = [];
  let orderCount = 0;
  try {
    [recentOrders, orderCount] = await Promise.all([
      prisma.order.findMany({
        where: { customerId: customer.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          ref: true,
          status: true,
          total: true,
          deliveryDate: true,
          createdAt: true,
        },
      }),
      prisma.order.count({ where: { customerId: customer.id } }),
    ]);
  } catch (err) {
    console.error("[AccountPage] DB error:", err.message);
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl">Recent orders</h2>
          {orderCount > 3 && (
            <Link
              href="/account/orders"
              className="text-sm text-clay hover:underline"
            >
              View all {orderCount} →
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
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
            {recentOrders.map((order) => (
              <OrderRow key={order.ref} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function OrderRow({ order }) {
  const statusLabels = {
    NEW: "Awaiting confirmation",
    DEPOSIT_CONFIRMED: "Deposit confirmed",
    PREPARING: "Preparing",
    OUT_FOR_DELIVERY: "Out for delivery",
    DELIVERED_PAID: "Delivered",
    DISPUTED: "Disputed",
  };
  return (
    <Link
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
  );
}
