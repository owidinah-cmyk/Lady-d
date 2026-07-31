// Server Component. Renders the footer with site links, legal
// links, operating hours, and attribution.

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-hairline mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid md:grid-cols-4 gap-8">
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
              12, St 5 · Catering Services
            </p>
          </div>

          {/* Services */}
          <div>
            <span className="text-muted uppercase tracking-wide text-xs">
              Services
            </span>
            <div className="mt-2 flex flex-col gap-2 text-sm">
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
          </div>

          {/* Company */}
          <div>
            <span className="text-muted uppercase tracking-wide text-xs">
              Company
            </span>
            <div className="mt-2 flex flex-col gap-2 text-sm">
              <Link href="/about" className="text-ink hover:text-clay">
                About
              </Link>
              <Link href="/terms" className="text-ink hover:text-clay">
                Terms
              </Link>
              <Link href="/privacy" className="text-ink hover:text-clay">
                Privacy
              </Link>
              <Link href="/refund-policy" className="text-ink hover:text-clay">
                Refund Policy
              </Link>
            </div>
          </div>

          {/* Hours */}
          <div>
            <span className="text-muted uppercase tracking-wide text-xs">
              Hours
            </span>
            <div className="mt-2 text-sm text-ink">
              <p>Mon – Sat: 9am – 8pm</p>
              <p>Sun: closed</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-hairline text-center">
          <p className="text-xs text-muted">
            Abuja &amp; Port Harcourt · WhatsApp{" "}
            {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+234 ..."}
          </p>
          <p className="text-xs text-muted mt-2">
            © {new Date().getFullYear()} Lady D Kitchen Catering Services.
            All rights reserved.
          </p>
          <p className="text-[11px] text-muted italic mt-2">
            Crafted with care in Abuja. Powered by Legacy LM.
          </p>
        </div>
      </div>
    </footer>
  );
}
