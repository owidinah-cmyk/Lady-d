// /components/events/EventsTestimonials.js
"use client";

const ITEMS = [
  {
    quote:
      "The team catered our wedding for 200 guests. Everything was perfect.",
    author: "Mr. & Mrs. Adebayo",
    location: "Abuja",
  },
  {
    quote:
      "We use Lady D Kitchen for our quarterly corporate dinners. Reliable, professional, delicious.",
    author: "TechCorp",
    location: "Wuse",
  },
  {
    quote:
      "The food at my daughter's naming ceremony was beautiful. Guests are still talking about the jollof.",
    author: "Mrs. Okafor",
    location: "Port Harcourt",
  },
];

export default function EventsTestimonials() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="font-serif text-2xl sm:text-3xl mb-6 sm:mb-8 text-center">
        What our clients say
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {ITEMS.map((item) => (
          <blockquote
            key={item.author}
            className="bg-white border border-hairline rounded-card p-5 sm:p-6"
          >
            <p className="text-sm text-ink mb-4">&ldquo;{item.quote}&rdquo;</p>
            <footer className="text-xs text-muted">
              — {item.author}, {item.location}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
