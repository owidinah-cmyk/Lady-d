// /app/admin/page.js
// The admin dashboard. Shows:
//   - Quick stats: total orders, orders awaiting confirmation,
//     orders in progress, delivered today, pending reviews,
//     new event inquiries, new merch inquiries
//   - Recent orders list (5 most recent)
//   - "Needs attention" list: orders that are NEW (awaiting
//     staff action), disputes, pending reviews

import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { formatPrice } from "@/lib/menu/dishes";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin(); // layout already guards, but explicit

  // Pull all the stats in parallel. Each helper tolerates DB
  // failure by returning 0; we don't try/catch here because
  // an unreachable DB on the admin dashboard is a different
  // failure mode and we want the build to fail loudly if so.
  // Actually — for resilience, use safeCount() below.
  const [
    totalOrders,
    awaitingConfirmation,
    inProgress,
    deliveredToday,
    pendingReviews,
    newEventInquiries,
    newMerchInquiries,
    recentOrders,
    newOrdersList,
  ] = await Promise.all([
    safeCount(() => prisma.order.count()),
    safeCount(() => prisma.order.count({ where: { status: "NEW" } })),
    safeCount(() => prisma.order.count({
      where: { status: { in: ["DEPOSIT_CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY"] } },
    })),
    safeCount(() => prisma.order.count({
      where: {
        status: "DELIVERED_PAID",
        deliveredAt: { gte: startOfToday() },
      },
    })),
    safeCount(() => prisma.review.count({ where: { status: "PENDING" } })),
    safeCount(() => prisma.eventInquiry.count({ where: { status: "NEW" } })),
    safeCount(() => prisma.merchInquiry.count({ where: { status: "NEW" } })),
    safeFindMany(() => prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        ref: true,
        customerName: true,
        status: true,
        total: true,
        createdAt: true,
      },
    })),
    safeFindMany(() => prisma.order.findMany({
      where: { status: "NEW" },
      orderBy: { createdAt: "asc" },
      take: 5,
      select: {
        ref: true,
        customerName: true,
        total: true,
        createdAt: true,
      },
    })),
  ]);

  const STATS = [
    { label: "Awaiting confirmation", value: awaitingConfirmation, href: "/admin/orders?status=NEW" },
    { label: "In progress", value: inProgress, href: "/admin/orders" },
    { label: "Delivered today", value: deliveredToday, href: "/admin/orders?status=DELIVERED_PAID" },
    { label: "Pending reviews", value: pendingReviews, href: "/admin/reviews" },
    { label: "New event inquiries", value: newEventInquiries, href: "/admin/events" },
    { label: "New merch inquiries", value: newMerchInquiries, href: "/admin/laditop" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-3xl mb-1">Dashboard</h1>
        <p className="text-sm text-[#A69A88]">
          {totalOrders} total order{totalOrders === 1 ? "" : "s"} to date.
        </p>
      </header>

      {/* Stats grid */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {STATS.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white border border-[#E8E2D5] rounded-card p-4 hover:border-[#D4AF5A] transition-colors"
            >
              <p className="text-xs text-[#A69A88] uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="font-serif text-3xl mt-1 text-[#1A1614]">
                {stat.value}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Needs attention */}
      <section>
        <h2 className="font-serif text-xl mb-3">Needs attention</h2>
        {newOrdersList.length === 0 ? (
          <p className="text-sm text-[#A69A88]">
            Nothing to do right now. Nice.
          </p>
        ) : (
          <div className="bg-white border border-[#7A2634] rounded-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F5F1] text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">Ref</th>
                  <th className="px-4 py-2 font-medium">Customer</th>
                  <th className="px-4 py-2 font-medium">Total</th>
                  <th className="px-4 py-2 font-medium">Placed</th>
                  <th className="px-4 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {newOrdersList.map((order) => (
                  <tr key={order.ref} className="border-t border-[#E8E2D5]">
                    <td className="px-4 py-2 font-mono">{order.ref}</td>
                    <td className="px-4 py-2">{order.customerName}</td>
                    <td className="px-4 py-2">{formatPrice(order.total)}</td>
                    <td className="px-4 py-2 text-[#A69A88]">
                      {timeAgo(order.createdAt)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/admin/orders/${order.ref}`}
                        className="text-[#D4AF5A] hover:underline"
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent orders */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-[#D4AF5A] hover:underline">
            View all →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-[#A69A88]">No orders yet.</p>
        ) : (
          <div className="bg-white border border-[#E8E2D5] rounded-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F5F1] text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">Ref</th>
                  <th className="px-4 py-2 font-medium">Customer</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Total</th>
                  <th className="px-4 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.ref} className="border-t border-[#E8E2D5]">
                    <td className="px-4 py-2 font-mono">{order.ref}</td>
                    <td className="px-4 py-2">{order.customerName}</td>
                    <td className="px-4 py-2 text-[#A69A88]">{order.status}</td>
                    <td className="px-4 py-2">{formatPrice(order.total)}</td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/admin/orders/${order.ref}`}
                        className="text-[#D4AF5A] hover:underline"
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <Link href="/admin/test-email" className="text-sm text-clay hover:underline">
          Send a test email →
        </Link>
      </section>
    </div>
  );
}

async function safeCount(fn) {
  try { return await fn(); } catch (err) { console.error("[admin dashboard] count failed:", err.message); return 0; }
}
async function safeFindMany(fn) {
  try { return await fn(); } catch (err) { console.error("[admin dashboard] findMany failed:", err.message); return []; }
}
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
