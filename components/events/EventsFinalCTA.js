// /components/events/EventsFinalCTA.js
"use client";

import Link from "next/link";

export default function EventsFinalCTA() {
  return (
    <section id="inquiry" className="mb-12 sm:mb-16">
      <div className="bg-white border border-hairline rounded-card p-6 sm:p-8 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl mb-2">
          Ready to plan your event?
        </h2>
        <p className="text-sm text-muted mb-6 max-w-xl mx-auto">
          Send us the details and we&apos;ll get back to you within 24 hours.
        </p>
      </div>
    </section>
  );
}
