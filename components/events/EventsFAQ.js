// /components/events/EventsFAQ.js
"use client";

const ITEMS = [
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 2–4 weeks in advance for standard events, and earlier for peak seasons or large guest counts.",
  },
  {
    q: "Do you provide waitstaff?",
    a: "Full-service waitstaff is available as an add-on. Tell us your needs during inquiry and we’ll include it in your quote.",
  },
  {
    q: "Can you accommodate dietary restrictions?",
    a: "Yes — vegetarian, halal, allergy-friendly, and custom dietary requests are common. We’ll confirm options during planning.",
  },
  {
    q: "What's your cancellation policy?",
    a: "Deposits are non-refundable within 14 days of the event. For details, see our refund policy.",
  },
  {
    q: "Do you handle venue setup?",
    a: "We set up the food station and basic serving layout. For full decor and layout, we can coordinate with your venue team.",
  },
];

export default function EventsFAQ() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="font-serif text-2xl sm:text-3xl mb-6 sm:mb-8 text-center">
        Frequently asked questions
      </h2>
      <div className="max-w-3xl mx-auto space-y-3">
        {ITEMS.map((item) => (
          <details
            key={item.q}
            className="bg-white border border-hairline rounded-card group"
          >
            <summary className="flex items-center justify-between p-4 sm:p-5 text-sm font-medium text-ink cursor-pointer list-none">
              <span>{item.q}</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted transition-transform group-open:rotate-180"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-muted leading-relaxed">
              {item.a}{" "}
              {item.q.includes("cancellation") && (
                <Link href="/refund-policy" className="text-clay hover:underline">
                  View refund policy →
                </Link>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
