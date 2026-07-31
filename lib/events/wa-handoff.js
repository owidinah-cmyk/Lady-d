// Builds the T2 "event inquiry" pre-filled message and the
// wa.me deep link.

import { formatPrice } from "@/lib/menu/dishes";

export function buildEventInquiryMessage({ inquiry }) {
  const catList = inquiry.categories.join(", ");
  const lines = [
    "Hello Lady D Kitchen 👋",
    "",
    "I'd like to inquire about event catering:",
    "",
    `Inquiry ref: ${inquiry.ref}`,
    "",
    `Event type(s): ${catList || "—"}`,
    `Date: ${formatDate(inquiry.eventDate)}`,
    `Guest count: ${inquiry.guestCount}`,
    `Location: ${inquiry.location}`,
    `Package interest: ${inquiry.packageInterest || "unsure"}`,
    "",
    `Contact: ${inquiry.customerName} — ${inquiry.customerPhone}`,
    inquiry.customerEmail ? `Email: ${inquiry.customerEmail}` : null,
    inquiry.notes ? `\nNotes: ${inquiry.notes}` : null,
    "",
    "Thanks!",
  ].filter(Boolean);

  return lines.join("\n");
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
