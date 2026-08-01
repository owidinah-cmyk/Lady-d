// /components/events/EventsGallery.js
"use client";

import Link from "next/link";

export default function EventsGallery() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="font-serif text-2xl sm:text-3xl mb-2 text-center">
        Photo gallery
      </h2>
      <p className="text-sm text-muted text-center max-w-xl mx-auto mb-6">
        Gallery coming soon — we&apos;re putting together photos from
        recent events. In the meantime, see our daily menu at{" "}
        <Link href="/menu" className="text-clay hover:underline">/menu</Link>{" "}
        to get a sense of our food.
      </p>
      <div className="bg-white border border-dashed border-hairline rounded-card py-16 text-center text-muted text-sm">
        Photos coming soon
      </div>
    </section>
  );
}
