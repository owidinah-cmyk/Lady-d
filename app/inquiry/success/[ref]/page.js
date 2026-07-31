// /app/inquiry/success/[ref]/page.js
// Confirmation page after submitting an inquiry. The ref is
// shown so the customer has it for reference.

import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inquiry sent — Lady D Kitchen",
};

export default async function InquirySuccessPage({ params }) {
  const ref = String(params.ref || "");

  // Try to find the inquiry in either table. Best-effort.
  let inquiry = null;
  try {
    inquiry = await prisma.eventInquiry.findUnique({
      where: { ref },
      select: { ref: true, eventDate: true, status: true },
    });
    if (!inquiry) {
      inquiry = await prisma.merchInquiry.findUnique({
        where: { ref },
        select: { ref: true, neededByDate: true, status: true },
      });
    }
  } catch (err) {
    console.error("[InquirySuccessPage] DB error:", err.message);
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="mx-auto max-w-md px-6 py-16 sm:py-20 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 sm:mb-6 rounded-full bg-clay text-white text-2xl sm:text-3xl flex items-center justify-center">
          ✓
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl mb-3">Inquiry sent</h1>
        <p className="text-sm text-muted mb-6">
          We&apos;ve opened WhatsApp with your inquiry details. Send
          the message and our team will get back to you with a quote
          and next steps.
        </p>
        {inquiry && (
          <div className="bg-white border border-hairline rounded-card p-6 text-left mb-6">
            <p className="text-sm text-muted">Inquiry ref</p>
            <p className="font-mono text-lg mb-3">{inquiry.ref}</p>
            <p className="text-sm text-muted">Status</p>
            <p className="font-medium">Awaiting response</p>
          </div>
        )}
        <Link
          href="/"
          className="inline-block text-clay hover:underline"
        >
          Back to home →
        </Link>
      </div>
    </main>
  );
}
