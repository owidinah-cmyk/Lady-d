// /components/landing/ServicesOverview.js
// Three side-by-side cards for Catering, Events, Laditop.

import Link from "next/link";

const services = [
  {
    title: "Catering",
    description:
      "Daily litre-bowl meals, browse and order from the menu.",
    href: "/menu",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clay">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
  {
    title: "Events",
    description:
      "Weddings, corporate, birthdays, naming ceremonies — inquire privately.",
    href: "/events",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clay">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    title: "Laditop",
    description:
      "Branded merch and event printing — bags, books, banners, and more.",
    href: "/laditop",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clay">
        <rect x="3" y="8" width="18" height="13" rx="2" />
        <path d="M12 8V21" />
        <path d="M3 12h18" />
      </svg>
    ),
  },
];

export default function ServicesOverview() {
  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-serif text-3xl mb-10 text-center">
          What we do
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white border border-hairline rounded-card p-6 transition hover:-translate-y-1 hover:border-clay"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="font-medium text-lg mb-2">{service.title}</h3>
              <p className="text-muted text-sm mb-4">{service.description}</p>
              <Link
                href={service.href}
                className="text-sm text-clay hover:text-clay-dark font-medium"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
