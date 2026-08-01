// /components/events/PackageTiers.js
"use client";

const TIERS = [
  {
    name: "Standard",
    price: "From ₦3,500/head",
    items: ["Rice dishes", "Proteins", "Sides"],
  },
  {
    name: "Premium",
    price: "From ₦6,500/head",
    items: [
      "Expanded menu",
      "Multiple proteins",
      "Dessert",
      "Service staff",
    ],
  },
  {
    name: "Custom",
    price: "Quoted per event",
    items: [
      "Tailored theme",
      "Dietary needs",
      "Guest preferences",
    ],
  },
];

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-clay flex-none"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function PackageTiers() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="font-serif text-2xl sm:text-3xl mb-6 sm:mb-8 text-center">
        Package tiers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="bg-white border border-hairline rounded-card p-5 sm:p-6 flex flex-col"
          >
            <div className="mb-4">
              <h3 className="font-serif text-xl mb-1">{tier.name}</h3>
              <p className="text-sm text-clay font-medium">{tier.price}</p>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {tier.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#inquiry"
              className="mt-auto inline-flex items-center justify-center bg-clay hover:bg-clay-dark text-white font-medium px-4 py-2.5 rounded-md transition-colors min-h-[44px] text-sm"
            >
              Inquire about this package
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
