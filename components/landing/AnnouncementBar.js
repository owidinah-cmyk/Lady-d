// /components/landing/AnnouncementBar.js
// Top announcement strip, terracotta text on cream tinted background.
// Hidden on small screens via responsive classes.

import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="hidden sm:block bg-cream border-b border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-2 text-center text-sm text-terracotta">
        <span>Now delivering in Abuja &amp; Port Harcourt — </span>
        <Link href="/menu" className="underline underline-offset-2 hover:text-terracotta">
          Order via WhatsApp
        </Link>
        <span className="ml-1">→</span>
      </div>
    </div>
  );
}
