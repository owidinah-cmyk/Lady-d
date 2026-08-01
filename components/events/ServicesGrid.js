// /components/events/ServicesGrid.js
"use client";

const SERVICES = [
  {
    title: "Wedding catering",
    description: "Elegant menus for ceremonies, receptions, and after-parties.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: "Corporate events",
    description: "Professional setup for launches, dinners, and quarterly events.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    title: "Birthday & naming ceremonies",
    description: "Festive buffets and family-style spreads for special days.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: "Private dinners / small gatherings",
    description: "Intimate plated or buffet service for your home or venue.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11h18M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M7 11v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-7" />
      </svg>
    ),
  },
];

export default function ServicesGrid() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="font-serif text-2xl sm:text-3xl mb-6 sm:mb-8 text-center">
        What we do
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {SERVICES.map((service) => (
          <div
            key={service.title}
            className="bg-white border border-hairline rounded-card p-5 sm:p-6 hover:border-clay transition-colors"
          >
            <div className="text-clay mb-3">{service.icon}</div>
            <h3 className="font-medium text-ink mb-1">{service.title}</h3>
            <p className="text-sm text-muted">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
