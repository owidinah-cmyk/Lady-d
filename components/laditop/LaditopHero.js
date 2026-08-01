// /components/laditop/LaditopHero.js
"use client";

import Link from "next/link";

export default function LaditopHero() {
  return (
    <section className="text-center mb-12 sm:mb-16">
      <p className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3">
        Laditop
      </p>
      <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto mb-6 sm:mb-8">
        Branded merchandise and event printing — bags, banners, gifts, and
        more. Made for your brand, your event, your audience.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <Link
          href="#inquiry"
          className="inline-flex items-center justify-center bg-clay hover:bg-clay-dark text-white font-medium px-6 py-3 rounded-md transition-colors min-h-[44px]"
        >
          Send inquiry via WhatsApp
        </Link>
        <Link
          href="#catalog"
          className="inline-flex items-center justify-center border border-hairline hover:border-clay text-ink font-medium px-6 py-3 rounded-md transition-colors min-h-[44px]"
        >
          See what we make
        </Link>
      </div>
    </section>
  );
}
