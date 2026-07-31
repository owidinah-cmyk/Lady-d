// "use client" — needs state to toggle open/closed.
// Slide-in panel from the right with the full nav + account/cart.

"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu({ customer, cartCount }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button (visible only on mobile) */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden text-ink hover:text-clay transition-colors"
        aria-label="Open menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Slide-in panel */}
      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <nav className="absolute right-0 top-0 h-full w-72 bg-cream shadow-xl p-6 flex flex-col">
            <button
              onClick={() => setOpen(false)}
              className="self-end text-ink hover:text-terracotta mb-6"
              aria-label="Close menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>

            <div className="flex flex-col gap-4 text-lg">
              <Link
                href="/menu"
                onClick={() => setOpen(false)}
                className="text-ink hover:text-clay"
              >
                Menu
              </Link>
              <Link
                href="/events"
                onClick={() => setOpen(false)}
                className="text-ink hover:text-clay"
              >
                Events
              </Link>
              <Link
                href="/laditop"
                onClick={() => setOpen(false)}
                className="text-ink hover:text-clay"
              >
                Laditop
              </Link>
              <Link
                href={customer ? "/account" : "/checkout/login"}
                onClick={() => setOpen(false)}
                className="text-ink hover:text-clay"
              >
                {customer ? "Account" : "Sign in"}
              </Link>
              <Link
                href="/order"
                onClick={() => setOpen(false)}
                className="text-ink hover:text-clay"
              >
                Order {cartCount > 0 ? `(${cartCount})` : ""}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
