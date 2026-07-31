// Builds the T1 "new food order" pre-filled message and the
// corresponding wa.me deep link URL. The customer lands in
// WhatsApp with the entire order already typed.

import { formatPrice } from "@/lib/menu/dishes";

export function buildOrderMessage({ order, lineItems, customer, zone }) {
  const itemLines = lineItems
    .map((item) =>
      `• ${item.variantCode || ""} ${item.dishName} (${item.variantSize}) × ${item.quantity} — ${formatPrice(item.lineTotal)}`.trim()
    )
    .join("\n");

  const lines = [
    "Hello Lady D Kitchen 👋",
    "",
    "I'd like to place an order:",
    "",
    `Order ref: ${order.ref}`,
    "",
    "Items:",
    itemLines,
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Delivery (${zone.name}): ${formatPrice(order.deliveryFee)}`,
    `Total: ${formatPrice(order.total)}`,
    "",
    `Delivery to: ${customer.name}, ${order.deliveryAddress}`,
    `Delivery date/time: ${formatDate(order.deliveryDate)} at ${order.deliveryTime}`,
    `Phone: ${customer.phone || "—"}`,
    order.notes ? `\nNotes: ${order.notes}` : "",
    "",
    "Thanks!",
  ];

  return lines.filter(Boolean).join("\n");
}

export function buildWhatsAppUrl({ message, phoneNumber }) {
  const encoded = encodeURIComponent(message);
  if (phoneNumber) {
    const clean = String(phoneNumber).replace(/\D/g, "");
    return `https://wa.me/${clean}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}

function formatDate(date) {
  if (!(date instanceof Date)) date = new Date(date);
  if (isNaN(date.getTime())) return String(date);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
