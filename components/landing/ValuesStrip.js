// /components/landing/ValuesStrip.js
// Three short trust-building bullets with icons.

const values = [
  {
    title: "Cooked fresh to order",
    body: "No reheated food — every order is made the day of delivery.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clay">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: "Transparent pricing",
    body: "The price you see is the price you pay — no surprise fees.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clay">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12M9 9h6M9 15h6" />
      </svg>
    ),
  },
  {
    title: "Real human contact",
    body: "Every order is confirmed by a real person on WhatsApp before cooking.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clay">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function ValuesStrip() {
  return (
    <section className="border-t border-hairline bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-serif text-3xl mb-10 text-center">
          Why Lady D Kitchen
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value) => (
            <div key={value.title} className="flex gap-3">
              <span className="flex-none mt-0.5">{value.icon}</span>
              <div>
                <h3 className="font-medium mb-1">{value.title}</h3>
                <p className="text-muted text-sm">{value.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
