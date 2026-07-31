// Server Component. Renders a fixed bar at the bottom of the
// viewport when the cart has items. Returns null when cart is empty.
// A small gold "View order" pill, fixed to the bottom-center.

import Link from "next/link";
import { getCartItemCount } from "@/lib/cart/cookie";

export default function FloatingCartBar() {
  const count = getCartItemCount();
  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-30 flex justify-center px-6 pointer-events-none">
      <Link
        href="/order"
        className="pointer-events-auto bg-clay hover:bg-clay-dark text-white font-medium px-6 py-3 rounded-full shadow-lg transition-colors flex items-center gap-2"
      >
        <span>View order ({count})</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </div>
  );
}
