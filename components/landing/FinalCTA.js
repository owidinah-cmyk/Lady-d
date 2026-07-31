// /components/landing/FinalCTA.js
// Bottom-of-page call to action with WhatsApp deep link.

import Link from "next/link";

export default function FinalCTA() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : "#";

  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="font-serif text-4xl mb-3">Ready to order?</h2>
        <p className="text-muted text-lg mb-8">
          Browse the menu and place your order in under 2 minutes.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/menu"
            className="bg-clay hover:bg-clay-dark text-white font-medium px-6 py-3 rounded-md transition-colors"
          >
            View the menu
          </Link>
        </div>
        <p className="mt-6 text-sm text-muted">
          Or chat with us on WhatsApp{" "}
          <Link
            href={whatsappLink}
            className="text-clay hover:text-clay-dark underline underline-offset-2"
          >
            {whatsappNumber || "coming soon"}
          </Link>
        </p>
      </div>
    </section>
  );
}
