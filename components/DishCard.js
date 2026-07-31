import Link from "next/link";
import { formatPrice } from "@/lib/menu/dishes";

export default function DishCard({ dish }) {
  const minPrice = dish.variants[0]?.price ?? 0;
  const sizeBadges = dish.variants.map((v) => v.size).join(" · ");

  return (
    <Link
      href={`/menu/${dish.slug}`}
      className="group block bg-white border border-hairline rounded-card overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Photo placeholder. Real photos in 2.2. */}
      <div className="aspect-[4/3] bg-cream flex items-center justify-center">
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
      </div>

      <div className="p-4">
        <h3 className="font-medium text-ink mb-1">
          {dish.name}
        </h3>
        <p className="text-sm text-muted line-clamp-1 mb-3">
          {dish.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-clay">
              {formatPrice(minPrice)}
            </p>
            <p className="text-xs text-muted mt-0.5">
              {sizeBadges}
            </p>
          </div>
          <span className="text-xs text-muted group-hover:text-clay transition-colors">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
