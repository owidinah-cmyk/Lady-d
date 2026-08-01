// /components/laditop/LaditopGallery.js
"use client";

import Link from "next/link";

export default function LaditopGallery() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="font-serif text-2xl sm:text-3xl mb-2 text-center">
        Photo gallery
      </h2>
      <p className="text-sm text-muted text-center max-w-xl mx-auto mb-6">
        Gallery coming soon — we&apos;re compiling photos of recent
        Laditop work. In the meantime, ask us on WhatsApp for examples of
        any specific item.
      </p>
      <div className="bg-white border border-dashed border-hairline rounded-card py-16 text-center text-muted text-sm">
        Photos coming soon
      </div>
    </section>
  );
}
