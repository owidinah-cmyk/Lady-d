// Builds the T3 "merch inquiry" pre-filled message and the
// wa.me deep link.

export function buildMerchInquiryMessage({ inquiry }) {
  const itemLines = inquiry.items
    .map((item) => {
      const parts = [item.itemType];
      if (item.customLabel) parts.push(`"${item.customLabel}"`);
      if (item.quantity) parts.push(`× ${item.quantity}`);
      const header = `• ${parts.join(" ")}`;
      return item.notes ? `${header}\n    ${item.notes}` : header;
    })
    .join("\n");

  const lines = [
    "Hello Lady D Kitchen 👋",
    "",
    "I'd like to inquire about Laditop merchandise:",
    "",
    `Inquiry ref: ${inquiry.ref}`,
    "",
    "Items:",
    itemLines,
    "",
    `Needed by: ${formatDate(inquiry.neededByDate)}`,
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
