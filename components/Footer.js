// Server Component. Renders the footer with site links, legal
// links, and a copyright line using the legal entity name.

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-hairline mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Brand + tagline */}
          <div>
            <Link href="/" aria-label="Lady D Kitchen — home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-light.svg"
                alt="Lady D Kitchen"
                className="h-6 w-auto"
              />
            </Link>
            <p className="text-sm text-muted mt-2">
              Catering Services · Abuja &amp; Port Harcourt
            </p>
          </div>

          {/* Service links */}
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <span className="text-muted uppercase tracking-wide text-xs">
                Services
              </span>
              <Link href="/menu" className="text-ink hover:text-clay">
                Menu
              </Link>
              <Link href="/events" className="text-ink hover:text-clay">
                Events
              </Link>
              <Link href="/laditop" className="text-ink hover:text-clay">
                Laditop
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-muted uppercase tracking-wide text-xs">
                Legal
              </span>
              <Link href="/terms" className="text-ink hover:text-clay">
                Terms
              </Link>
              <Link href="/privacy" className="text-ink hover:text-clay">
                Privacy
              </Link>
              <Link href="/refund-policy" className="text-ink hover:text-clay">
                Refund Policy
              </Link>
              <Link href="/about" className="text-ink hover:text-clay">
                About
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-hairline">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Lady D Kitchen Catering Services.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
