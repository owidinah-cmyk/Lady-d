import Link from "next/link";
import { getFeaturedDishes } from "@/lib/menu/dishes";
import DishCard from "./DishCard";

export const dynamic = "force-dynamic";

export default async function FeaturedDishes() {
  let dishes = [];
  let dbError = false;

  try {
    dishes = await getFeaturedDishes({ limit: 4 });
  } catch (err) {
    console.error("[FeaturedDishes] DB error:", err.message);
    dbError = true;
  }

  if (dishes.length === 0) {
    return (
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="font-serif text-3xl mb-3">On the menu</h2>
          <p className="text-muted">
            {dbError
              ? "We're having trouble loading the menu right now. Please try again in a moment."
              : "Our menu is being prepared — check back soon."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl mb-2">On the menu</h2>
            <p className="text-sm text-muted">
              A few of our favourites.{" "}
              <Link
                href="/menu"
                className="text-clay hover:underline"
              >
                See the full menu
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
    </section>
  );
}
