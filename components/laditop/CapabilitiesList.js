// /components/laditop/CapabilitiesList.js
"use client";

const ITEMS = [
  "Single-color to full-color printing",
  "Small batches (50+) to large runs (10,000+)",
  "Custom sizes and shapes",
  "Design help available (or bring your own)",
  "Logo placement, name personalization, event-specific designs",
];

export default function CapabilitiesList() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="font-serif text-2xl sm:text-3xl mb-6 sm:mb-8 text-center">
        Capabilities
      </h2>
      <div className="bg-white border border-hairline rounded-card p-5 sm:p-6 max-w-3xl mx-auto">
        <ul className="space-y-3">
          {ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-clay flex-none mt-0.5"><path d="M20 6L9 17l-5-5" /></svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
