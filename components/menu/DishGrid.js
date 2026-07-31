// /components/menu/DishGrid.js
// "use client" — uses the AddToCartButton which is interactive.
// Renders a responsive grid of dish cards, each with the
// AddToCartButton overlay.

"use client";

import { formatPrice } from "@/lib/menu/dishes";
import AddToCartButton from "./AddToCartButton";

export default function DishGrid({ dishes }) {
  if (dishes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted">
          Nothing in this category yet — check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map((dish) => {
        const minPrice = dish.variants[0]?.price ?? 0;
        return (
          <div
            key={dish.id}
            className="bg-white border border-hairline rounded-card overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-[4/3] bg-cream flex items-center justify-center relative">
              {dish.photos && dish.photos.length > 0 ? (
                <img
                  src={dish.photos[0]}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-muted text-xs uppercase tracking-wide">
                  Photo coming soon
                </span>
              )}
              <div className="absolute bottom-3 right-3">
                <AddToCartButton variants={dish.variants} />
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-medium text-ink">
                  {dish.name}
                </h3>
                {dish.isFeatured && (
                  <span className="text-[10px] uppercase tracking-wide bg-clay text-white px-1.5 py-0.5 rounded">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-sm text-muted line-clamp-1 mb-2">
                {dish.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-clay">
                  from {formatPrice(minPrice)}
                </span>
                {dish.leadTimeHours > 0 && (
                  <span className="text-xs text-muted">
                    {dish.leadTimeHours}h notice
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
