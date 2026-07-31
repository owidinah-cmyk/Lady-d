import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { formatPrice } from "@/lib/menu/dishes";
import OrderAdminControls from "./OrderAdminControls";
import RiderAssigner from "./RiderAssigner";
import ReceiptGenerator from "./ReceiptGenerator";

export const dynamic = "force-dynamic";

const STATUS_LABELS = {
  NEW: "Awaiting confirmation",
  DEPOSIT_CONFIRMED: "Deposit confirmed",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED_PAID: "Delivered",
  DISPUTED: "Disputed",
};

export default async function OrderAdminDetailPage({ params }) {
  await requireAdmin();
  const ref = String(params.ref);

  let order = null;
  try {
    order = await prisma.order.findUnique({
      where: { ref },
      include: {
        items: { orderBy: { id: "asc" } },
        receipts: { orderBy: { createdAt: "asc" } },
        statusLog: { orderBy: { changedAt: "asc" } },
      },
    });
  } catch (err) {
    console.error("[OrderAdminDetailPage] DB error:", err.message);
  }
  if (!order) notFound();

  let riders = [];
  try {
    riders = await prisma.rider.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, code: true, phone: true },
    });
  } catch {}

  return (
    <div className="max-w-4xl space-y-6">
      <header>
        <Link href="/admin/orders" className="text-sm text-[#D4AF5A] hover:underline mb-2 inline-block">← All orders</Link>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl">{order.ref}</h1>
          <span className="text-sm text-[#A69A88]">{STATUS_LABELS[order.status] || order.status}</span>
        </div>
        <p className="text-sm text-[#A69A88] mt-1">
          {order.customerName} · {order.customerPhone || "—"} · {order.customerEmail || "—"}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <section className="bg-white border border-[#E8E2D5] rounded-card p-5">
            <h2 className="font-medium mb-3">Items</h2>
            <div className="space-y-2 text-sm">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="truncate mr-2">
                    {item.dishName} ({item.variantSize}) × {item.quantity}
                  </span>
                  <span>{formatPrice(item.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-[#E8E2D5] space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-[#A69A88]">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-[#A69A88]">Delivery</span><span>{formatPrice(order.deliveryFee)}</span></div>
              <div className="flex justify-between font-semibold pt-1"><span>Total</span><span className="text-[#D4AF5A]">{formatPrice(order.total)}</span></div>
            </div>
          </section>

          <section className="bg-white border border-[#E8E2D5] rounded-card p-5">
            <h2 className="font-medium mb-3">Delivery</h2>
            <div className="text-sm space-y-1">
              <p><span className="text-[#A69A88]">Date/time:</span> {new Date(order.deliveryDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} at {order.deliveryTime}</p>
              <p><span className="text-[#A69A88]">Address:</span> {order.deliveryAddress}</p>
              <p><span className="text-[#A69A88]">Zone:</span> {order.zoneName}</p>
              {order.riderName && <p><span className="text-[#A69A88]">Rider:</span> {order.riderName}</p>}
            </div>
            {order.notes && (
              <div className="mt-3 pt-3 border-t border-[#E8E2D5]">
                <p className="text-xs text-[#A69A88] mb-1">Notes</p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}
          </section>

          {order.receipts.length > 0 && (
            <section className="bg-white border border-[#D4AF5A] rounded-card p-5">
              <h2 className="font-medium mb-3">Receipts</h2>
              <div className="space-y-2 text-sm">
                {order.receipts.map((r) => (
                  <p key={r.id} className="flex justify-between">
                    <span>{r.type === "DEPOSIT" ? "Deposit" : "Final"} receipt</span>
                    <span className="text-[#A69A88]">{new Date(r.createdAt).toLocaleString("en-GB")}</span>
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-4">
          <OrderAdminControls orderId={order.id} currentStatus={order.status} />
          <RiderAssigner orderId={order.id} currentRiderId={order.riderId} riders={riders} />
          <ReceiptGenerator orderId={order.id} status={order.status} hasDepositReceipt={order.receipts.some((r) => r.type === "DEPOSIT")} hasFinalReceipt={order.receipts.some((r) => r.type === "FINAL")} />
        </div>
      </div>

      <section className="bg-white border border-[#E8E2D5] rounded-card p-5">
        <h2 className="font-medium mb-3">Status log</h2>
        <div className="space-y-2 text-sm">
          {order.statusLog.map((log) => (
            <div key={log.id} className="flex justify-between text-[#A69A88]">
              <span>{log.fromStatus || "—"} → {log.toStatus}</span>
              <span>{new Date(log.changedAt).toLocaleString("en-GB")} · {log.changedBy}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
