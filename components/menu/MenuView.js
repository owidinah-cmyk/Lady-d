// /components/menu/MenuView.js
// "use client" — orchestrates the category filter and dish grid.
// When a category is clicked, we filter the dishes client-side
// (no server roundtrip). All dishes are passed in from the page.

"use client";

import { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import DishGrid from "./DishGrid";

export default function MenuView({ categories, dishes }) {
  const [selected, setSelected] = useState("All");
  const filtered =
    selected === "All"
      ? dishes
      : dishes.filter((d) => d.category === selected);

  return (
    <>
      <CategoryFilter
        categories={categories}
        selected={selected}
        onChange={setSelected}
      />
      <DishGrid dishes={filtered} />
    </>
  );
}
