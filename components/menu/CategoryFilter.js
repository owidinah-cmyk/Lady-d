// /components/menu/CategoryFilter.js
// "use client" — the filter is interactive.
// Renders a row of chips: "All", then each category.
// The selected chip uses the gold underline indicator.

"use client";

export default function CategoryFilter({ categories, selected, onChange }) {
  const allCategories = ["All", ...categories];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {allCategories.map((cat) => {
        const isActive = cat === selected;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              isActive
                ? "bg-ink text-white"
                : "bg-white text-ink border border-hairline hover:border-clay"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
