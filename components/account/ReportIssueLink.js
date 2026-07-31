// /components/account/ReportIssueLink.js
// "use client" — opens WhatsApp with the T5 "report an issue"
// message pre-filled with the order ref.

"use client";

export default function ReportIssueLink({ ref }) {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const message = `Hello, I have an issue with my order:\n\nOrder ref: ${ref}\n\nIssue: `;
  const encoded = encodeURIComponent(message);
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const url = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block border border-terracotta text-terracotta hover:bg-terracotta hover:text-white font-medium px-4 py-2 rounded-md transition-colors text-sm"
    >
      Report an issue on WhatsApp →
    </a>
  );
}
