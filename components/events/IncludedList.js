// /components/events/IncludedList.js
"use client";

export default function IncludedList() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="font-serif text-2xl sm:text-3xl mb-6 sm:mb-8 text-center">
        What&apos;s included vs not included
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white border border-hairline rounded-card p-5 sm:p-6">
          <h3 className="font-medium text-ink mb-3">Included</h3>
          <ul className="space-y-2 text-sm text-muted">
            {["Menu planning", "Ingredient sourcing", "Cooking", "Food warming/holding", "Basic serving setup"].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-clay flex-none mt-0.5"><path d="M20 6L9 17l-5-5" /></svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-hairline rounded-card p-5 sm:p-6">
          <h3 className="font-medium text-ink mb-3">Not included</h3>
          <ul className="space-y-2 text-sm text-muted">
            {[
              "Venue rental",
              "Full-service waitstaff (available as add-on)",
              "Decor",
              "Drinks (available as add-on)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted flex-none mt-0.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
