// /components/landing/Testimonials.js
// Real approved reviews when available; otherwise placeholder testimonials.

import Link from "next/link";

const PLACEHOLDERS = [
  {
    name: "Adaeze O.",
    location: "Maitama",
    rating: 5,
    comment:
      "Best jollof rice in Abuja, hands down. The portions are generous and the delivery was right on time.",
  },
  {
    name: "Chinedu A.",
    location: "Wuse",
    rating: 5,
    comment:
      "Ordered for a 50-person corporate lunch. The team was professional, the food was hot, and everyone asked for the number.",
  },
  {
    name: "Fatima B.",
    location: "Garki",
    rating: 5,
    comment:
      "The Laditop branded bags for my sister's wedding were beautiful. The whole experience from inquiry to delivery was smooth.",
  },
];

export default function Testimonials({ reviews = [] }) {
  const items = reviews.length > 0 ? reviews : PLACEHOLDERS;
  const isPlaceholder = reviews.length === 0;

  return (
    <section className="bg-cream border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl mb-2">What our customers say</h2>
          <p className="text-sm text-muted">
            {isPlaceholder
              ? "Reviews from customers will appear here once they're approved."
              : "Real reviews from real customers."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.slice(0, 6).map((r, i) => (
            <div
              key={r.id || i}
              className="bg-white border border-hairline rounded-card p-6"
            >
              <div className="text-clay text-sm mb-3">
                {"★".repeat(r.rating)}
                <span className="text-hairline">{"★".repeat(5 - r.rating)}</span>
              </div>
              <p className="font-serif italic text-ink mb-4 leading-relaxed">
                &ldquo;{r.comment}&rdquo;
              </p>
              <p className="text-sm">
                <strong>{r.customer?.name || r.name}</strong>
                {r.location && (
                  <span className="text-muted"> · {r.location}</span>
                )}
              </p>
              {!isPlaceholder && r.order && (
                <p className="text-xs text-muted mt-1">
                  <Link
                    href={`/account/orders/${r.order.ref}`}
                    className="hover:text-clay"
                  >
                    {r.order.ref}
                  </Link>
                </p>
              )}
            </div>
          ))}
        </div>

        {reviews.length > 6 && (
          <div className="text-center mt-8">
            <Link href="/reviews" className="text-clay hover:underline">
              See all {reviews.length} reviews →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
