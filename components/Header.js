// Server Component. Reads the current customer and cart count,
// renders the desktop nav + mobile hamburger trigger.

import Link from "next/link";
import { getCurrentCustomer } from "@/lib/auth/current-customer";
import { getCartItemCount } from "@/lib/cart/cookie";
import MobileMenu from "./MobileMenu";

export default async function Header() {
  const customer = await getCurrentCustomer();
  const cartCount = getCartItemCount();

  return (
    <header className="bg-cream border-b border-hairline sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" aria-label="Lady D Kitchen — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-light.svg"
            alt="Lady D Kitchen"
            className="h-7 md:h-8 w-auto"
          />
        </Link>

        {/* Desktop nav (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/menu"
            className="text-sm text-ink hover:text-clay transition-colors"
          >
            Menu
          </Link>
          <Link
            href="/events"
            className="text-sm text-ink hover:text-clay transition-colors"
          >
            Events
          </Link>
          <Link
            href="/laditop"
            className="text-sm text-ink hover:text-clay transition-colors"
          >
            Laditop
          </Link>
        </nav>

        {/* Right side: account + cart */}
        <div className="flex items-center gap-4">
          {/* Account link (desktop) */}
          <Link
            href={customer ? "/account" : "/checkout/login"}
            className="hidden md:inline text-sm text-ink hover:text-clay transition-colors"
          >
            {customer ? "Account" : "Sign in"}
          </Link>

          {/* Cart icon with badge */}
          <Link
            href="/order"
            className="relative text-ink hover:text-clay transition-colors"
            aria-label={`View order (${cartCount} items)`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-clay text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu trigger (client component) */}
          <MobileMenu customer={customer} cartCount={cartCount} />
        </div>
      </div>
    </header>
  );
}
