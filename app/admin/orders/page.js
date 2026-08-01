import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { formatPrice } from "@/lib/menu/dishes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders — Admin" };

const STATUS_LABELS = {
  NEW: "Awaiting confirmation",
  DEPOSIT_CONFIRMED: "Deposit confirmed",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED_PAID: "Delivered",
  DISPUTED: "Disputed",
};

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "NEW", label: "Awaiting" },
  { value: "DEPOSIT_CONFIRMED", label: "Confirmed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { value: "DELIVERED_PAID", label: "Delivered" },
  { value: "DISPUTED", label: "Disputed" },
];

export default async function OrdersAdminPage({ searchParams }) {
  await requireAdmin();
  const filter = String(searchParams?.status || "");

  let orders = [];
  try {
    orders = await prisma.order.findMany({
      where: filter ? { status: filter } : {},
      orderBy: { createdAt: "desc" },
      include: {
        items: { select: { id: true } },
      },
    });
  } catch (err) {
    console.error("[OrdersAdminPage] DB error:", err.message);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl mb-1">Orders</h1>
        <p className="text-sm text-[#A69A88]">{orders.length} matching</p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = (filter || "") === f.value;
          const href = f.value ? `/admin/orders?status=${f.value}` : "/admin/orders";
          return (
            <Link
              key={f.value || "all"}
              href={href}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                active
                  ? "bg-[#1A1614] text-white"
                  : "bg-white text-[#1A1614] border border-[#E8E2D5] hover:border-[#D4AF5A]"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

      {orders.length === 0 ? (
        <p className="text-sm text-[#A69A88]">No orders match this filter.</p>
      ) : (
        <div className="overflow-x-auto">
        <div className="bg-white border border-[#E8E2D5] rounded-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F5F1] text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Ref</th>
                <th className="px-4 py-2 font-medium">Customer</th>
                <th className="px-4 py-2 font-medium">Items</th>
                <th className="px-4 py-2 font-medium">Total</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Placed</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-[#E8E2D5]">
                  <td className="px-4 py-2 font-mono">{o.ref}</td>
                  <td className="px-4 py-2">{o.customerName}</td>
                  <td className="px-4 py-2 text-[#A69A88]">{o.items.length}</td>
                  <td className="px-4 py-2">{formatPrice(o.total)}</td>
                  <td className="px-4 py-2 text-[#A69A88]">{STATUS_LABELS[o.status] || o.status}</td>
                  <td className="px-4 py-2 text-[#A69A88]">
                    {new Date(o.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/admin/orders/${o.ref}`} className="text-[#D4AF5A] hover:underline">Open →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          </div>
          )}
    </div>
  );
}
