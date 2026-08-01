// /components/laditop/LaditopFAQ.js
"use client";

const ITEMS = [
  {
    q: "What's the minimum order?",
    a: "Minimums vary by product. For many items we start at 50 units; large-format print jobs may have different minimums. Ask us during inquiry.",
  },
  {
    q: "Can I bring my own design?",
    a: "Yes — bring your artwork or brand files and we’ll prepare them for production.",
  },
  {
    q: "Do you offer design help?",
    a: "Yes. We can help with layout, typography, and placement for an additional design fee.",
  },
  {
    q: "How long does production take?",
    a: "It depends on the item and quantity. Use the turnaround guide above, then confirm your date during inquiry.",
  },
  {
    q: "Do you ship outside Abuja and Port Harcourt?",
    a: "Yes, delivery is available outside the core cities for an additional logistics fee.",
  },
];

export default function LaditopFAQ() {
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
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
