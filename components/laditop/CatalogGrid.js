// /components/laditop/CatalogGrid.js
"use client";

const GROUPS = [
  {
    title: "Paper & print",
    items: [
      { name: "Books", desc: "Softcover and hardcover event books and programs." },
      { name: "Banners", desc: "Vinyl banners for backdrops and directional signage." },
      { name: "Flex Banners", desc: "Lightweight flex material for quick setups." },
    ],
  },
  {
    title: "Bags & boxes",
    items: [
      { name: "Bags", desc: "Branded tote bags for events and retail." },
      { name: "Gift Bags", desc: "Curated gift-ready bags with custom printing." },
      { name: "Party Bags", desc: "Fun, themed party favor bags." },
      { name: "Gift Boxes", desc: "Structured gift boxes with logo or event artwork." },
    ],
  },
  {
    title: "Drinkware & apparel",
    items: [
      { name: "Cups", desc: "Branded disposable or reusable cups." },
      { name: "Pens", desc: "Custom-printed pens for giveaways." },
      { name: "T-Shirts", desc: "Custom-printed tees, all sizes, multiple fabric options." },
    ],
  },
];

export default function CatalogGrid() {
  return (
    <section id="catalog" className="mb-12 sm:mb-16">
      <h2 className="font-serif text-2xl sm:text-3xl mb-2 text-center">
        What we can make
      </h2>
      <p className="text-sm text-muted text-center mb-6 sm:mb-8">
        Pick a category to explore common items.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {GROUPS.map((group) => (
          <div
            key={group.title}
            className="bg-white border border-hairline rounded-card p-5 sm:p-6"
          >
            <h3 className="font-medium text-ink mb-3">{group.title}</h3>
            <ul className="space-y-3">
              {group.items.map((item) => (
                <li key={item.name}>
                  <p className="text-sm text-ink">{item.name}</p>
                  <p className="text-xs text-muted">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
