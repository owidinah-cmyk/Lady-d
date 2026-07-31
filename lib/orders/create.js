// Server-side: creates an Order + OrderItems in the DB, returns
// everything needed to build the WhatsApp message.

import { prisma } from "@/lib/db";
import { generateOrderRef } from "./ref";
import { resolveCart } from "@/lib/menu/cart-resolution";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function createOrder({
  customerId,
  zoneId,
  deliveryAddress,
  deliveryDate,
  deliveryTime,
  notes,
  cartItems,
}) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  // Validate date/time formats before any DB work.
  if (typeof deliveryDate !== "string" || !DATE_RE.test(deliveryDate)) {
    return { ok: false, error: "Invalid delivery date." };
  }
  const parsedDate = new Date(deliveryDate + "T00:00:00");
  if (isNaN(parsedDate.getTime())) {
    return { ok: false, error: "Invalid delivery date." };
  }
  if (typeof deliveryTime !== "string" || !TIME_RE.test(deliveryTime)) {
    return { ok: false, error: "Invalid delivery time." };
  }

  // Resolve the cart against the DB to get full line item details.
  const { lineItems, subtotal } = await resolveCart(cartItems);
  if (lineItems.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }
  const availableLineItems = lineItems.filter((i) => i.isAvailable);
  if (availableLineItems.length === 0) {
    return { ok: false, error: "All items in your cart are unavailable." };
  }

  // Fetch customer for snapshots.
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { id: true, name: true, email: true, phone: true },
  });
  if (!customer) return { ok: false, error: "Customer not found." };

  // Fetch zone for delivery fee + snapshot.
  const zone = await prisma.zone.findUnique({
    where: { id: zoneId },
    select: { id: true, name: true, city: true, deliveryFee: true, isActive: true },
  });
  if (!zone || !zone.isActive) {
    return { ok: false, error: "Selected delivery zone is not available." };
  }

  const deliveryFee = zone.deliveryFee;
  const total = subtotal + deliveryFee;
  const depositAmount = Math.round(total / 2);
  const balanceAmount = total - depositAmount;

  const ref = await generateOrderRef();

  let order;
  try {
    order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          ref,
          customerId,
          customerName: customer.name,
          customerPhone: customer.phone || "",
          customerEmail: customer.email,
          zoneId: zone.id,
          zoneName: zone.name,
          deliveryAddress,
          deliveryDate: parsedDate,
          deliveryTime,
          notes: notes || null,
          subtotal,
          deliveryFee,
          total,
          depositAmount,
          balanceAmount,
          status: "NEW",
        },
      });

      // Fetch all needed variant codes in one query.
      const variantIds = availableLineItems.map((i) => i.variantId);
      const variants = await tx.variant.findMany({
        where: { id: { in: variantIds } },
        select: { id: true, code: true, dish: { select: { code: true } } },
      });
      const variantById = new Map(variants.map((v) => [v.id, v]));

      // Create one OrderItem per available cart line.
      for (const item of availableLineItems) {
        const variant = variantById.get(item.variantId);
        const dishCode = variant?.dish?.code || "";
        const variantCode = variant?.code || "";
        await tx.orderItem.create({
          data: {
            orderId: created.id,
            variantId: item.variantId,
            dishCode,
            variantCode,
            dishName: item.dishName,
            variantSize: item.variantSize,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          },
        });
      }

      await tx.orderStatusLog.create({
        data: {
          orderId: created.id,
          fromStatus: null,
          toStatus: "NEW",
          changedBy: "system",
        },
      });

      return created;
    });
  } catch (err) {
    console.error("[createOrder] transaction error:", err.message);
    return { ok: false, error: "Could not create your order. Please try again." };
  }

  return {
    ok: true,
    order,
    lineItems: availableLineItems,
    customer,
    zone,
  };
}
