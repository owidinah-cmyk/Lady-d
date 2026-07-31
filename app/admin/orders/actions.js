"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";

const VALID_STATUSES = [
  "NEW",
  "DEPOSIT_CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED_PAID",
  "DISPUTED",
];

export async function updateOrderStatus(orderId, newStatus) {
  await requireAdmin();
  if (!VALID_STATUSES.includes(newStatus)) {
    return { ok: false, error: "Invalid status." };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true, ref: true },
    });
    if (!order) return { ok: false, error: "Order not found." };

    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      }),
      prisma.orderStatusLog.create({
        data: {
          orderId,
          fromStatus: order.status,
          toStatus: newStatus,
          changedBy: "admin",
        },
      }),
    ]);

    revalidatePath("/admin/orders");
    revalidatePath("/admin/orders/" + orderId);
    revalidatePath("/admin");
    revalidatePath("/account/orders/" + order.ref);
    return { ok: true };
  } catch (err) {
    console.error("[updateOrderStatus] error:", err.message);
    return { ok: false, error: "Could not update the status. Please try again." };
  }
}

export async function assignRider(orderId, riderId) {
  await requireAdmin();
  if (!riderId) {
    return { ok: false, error: "No rider selected." };
  }
  try {
    const rider = await prisma.rider.findUnique({
      where: { id: riderId },
      select: { name: true, isActive: true },
    });
    if (!rider) return { ok: false, error: "Rider not found." };
    if (!rider.isActive) return { ok: false, error: "Rider is not active." };

    await prisma.order.update({
      where: { id: orderId },
      data: { riderId, riderName: rider.name },
    });
    revalidatePath("/admin/orders/" + orderId);
    return { ok: true };
  } catch (err) {
    console.error("[assignRider] error:", err.message);
    return { ok: false, error: "Could not assign the rider. Please try again." };
  }
}

export async function generateDepositReceipt(orderId) {
  await requireAdmin();

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { orderBy: { id: "asc" } },
        receipts: { where: { type: "DEPOSIT" }, select: { id: true } },
        rider: { select: { name: true, code: true } },
      },
    });
    if (!order) return { ok: false, error: "Order not found." };
    if (order.receipts.length > 0) {
      return { ok: false, error: "A deposit receipt has already been issued for this order." };
    }

    const content = {
      type: "DEPOSIT",
      orderRef: order.ref,
      customerName: order.customerName,
      items: order.items.map((i) => ({
        name: i.dishName,
        size: i.variantSize,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        lineTotal: i.lineTotal,
      })),
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      depositAmount: order.depositAmount,
      balanceAmount: order.balanceAmount,
      issuedAt: new Date().toISOString(),
      riderName: order.rider?.name || null,
      riderCode: order.rider?.code || null,
    };

    await prisma.$transaction([
      prisma.receipt.create({
        data: { type: "DEPOSIT", orderId, content },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: "DEPOSIT_CONFIRMED" },
      }),
      prisma.orderStatusLog.create({
        data: {
          orderId,
          fromStatus: "NEW",
          toStatus: "DEPOSIT_CONFIRMED",
          changedBy: "admin:receipt",
        },
      }),
    ]);

    revalidatePath("/admin/orders");
    revalidatePath("/admin/orders/" + order.ref);
    revalidatePath("/admin");
    revalidatePath("/account/orders/" + order.ref);
    revalidatePath("/account/orders");
    return { ok: true };
  } catch (err) {
    console.error("[generateDepositReceipt] error:", err.message);
    return { ok: false, error: "Could not generate the receipt. Please try again." };
  }
}

export async function generateFinalReceipt(orderId) {
  await requireAdmin();

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { orderBy: { id: "asc" } },
        receipts: { where: { type: "FINAL" }, select: { id: true } },
        rider: { select: { name: true, code: true } },
      },
    });
    if (!order) return { ok: false, error: "Order not found." };
    if (order.receipts.length > 0) {
      return { ok: false, error: "A final receipt has already been issued for this order." };
    }
    if (order.status !== "OUT_FOR_DELIVERY" && order.status !== "DELIVERED_PAID") {
      return { ok: false, error: "Order must be out for delivery before issuing a final receipt." };
    }

    const content = {
      type: "FINAL",
      orderRef: order.ref,
      customerName: order.customerName,
      items: order.items.map((i) => ({
        name: i.dishName,
        size: i.variantSize,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        lineTotal: i.lineTotal,
      })),
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      amountCollected: order.balanceAmount,
      issuedAt: new Date().toISOString(),
      riderName: order.rider?.name || null,
      riderCode: order.rider?.code || null,
    };

    const fromStatus = order.status;
    await prisma.$transaction([
      prisma.receipt.create({
        data: { type: "FINAL", orderId, content },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: "DELIVERED_PAID", deliveredAt: new Date() },
      }),
      prisma.orderStatusLog.create({
        data: {
          orderId,
          fromStatus,
          toStatus: "DELIVERED_PAID",
          changedBy: "admin:receipt",
        },
      }),
    ]);

    revalidatePath("/admin/orders");
    revalidatePath("/admin/orders/" + order.ref);
    revalidatePath("/admin");
    revalidatePath("/account/orders/" + order.ref);
    revalidatePath("/account/orders");
    return { ok: true };
  } catch (err) {
    console.error("[generateFinalReceipt] error:", err.message);
    return { ok: false, error: "Could not generate the receipt. Please try again." };
  }
}
