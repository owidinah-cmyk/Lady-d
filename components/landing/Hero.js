// /components/landing/Hero.js
// Enhanced hero section with wordmark, value prop, dual CTAs, and trust line.

import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 text-center">
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-ink">
          Lady D Kitchen
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted max-w-xl mx-auto">
          Home-style cooking in litre bowls, delivered across Abuja &amp; Port
          Harcourt
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/menu"
            className="bg-clay hover:bg-clay-dark text-white font-medium px-6 py-3 rounded-md transition-colors"
          >
            Browse menu
          </Link>
          <Link
            href="#how-it-works"
            className="border border-hairline text-ink hover:border-clay hover:text-clay font-medium px-6 py-3 rounded-md transition-colors"
          >
            How it works
          </Link>
        </div>
        <p className="mt-6 text-sm text-muted">
          ⭐ 4.8 from 200+ happy customers
        </p>
      </div>
    </section>
  );
}
