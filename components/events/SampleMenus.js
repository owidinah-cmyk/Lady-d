// /components/events/SampleMenus.js
"use client";

const MENUS = [
  {
    title: "Nigerian classics",
    items: [
      "Jollof Rice",
      "Peppered Chicken",
      "Coleslaw",
      "Plantain",
      "Chapman",
    ],
  },
  {
    title: "Continental",
    items: [
      "Grilled Fish",
      "Roasted Potatoes",
      "Garden Salad",
      "Garlic Bread",
    ],
  },
  {
    title: "Mixed buffet",
    items: [
      "Jollof Rice",
      "Grilled Fish",
      "Peppered Chicken",
      "Coleslaw",
      "Plantain",
      "Chapman",
    ],
  },
];

export default function SampleMenus() {
  return (
    <section id="sample-menus" className="mb-12 sm:mb-16">
      <h2 className="font-serif text-2xl sm:text-3xl mb-2 text-center">
        Sample menus
      </h2>
      <p className="text-sm text-muted text-center mb-6 sm:mb-8">
        Sample menus — your menu is fully customizable.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {MENUS.map((menu) => (
          <div
            key={menu.title}
            className="bg-white border border-hairline rounded-card p-5 sm:p-6"
          >
            <h3 className="font-medium text-ink mb-3">{menu.title}</h3>
            <ul className="space-y-2">
              {menu.items.map((item) => (
                <li
                  key={item}
                  className="text-sm text-muted flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-clay flex-none" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
