// /components/landing/Testimonials.js
// Placeholder testimonials. Replace quotes with real customer reviews later.

export default function Testimonials() {
  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-serif text-3xl mb-10 text-center">
          What customers say
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "Best jollof rice in Abuja, hands down. The portions are generous and the delivery was right on time.",
              name: "Adaeze O.",
              location: "Maitama",
            },
            {
              quote:
                "Ordered for a 50-person corporate lunch. The team was professional, the food was hot, and everyone asked for the number.",
              name: "Chinedu A.",
              location: "Wuse",
            },
            {
              quote:
                "The Laditop branded bags for my sister's wedding were beautiful. The whole experience from inquiry to delivery was smooth.",
              name: "Fatima B.",
              location: "Garki",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="bg-white border border-hairline rounded-card p-6"
            >
              <p className="text-ink italic font-serif mb-4">
                “{item.quote}”
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted">{item.location}</p>
                </div>
                <div className="text-clay text-sm" aria-label="5 star rating">
                  ★★★★★
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/about"
            className="text-sm text-clay hover:text-clay-dark font-medium"
          >
            Read more reviews →
          </Link>
        </div>
      </div>
    </section>
  );
}
