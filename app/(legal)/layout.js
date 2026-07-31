import Link from "next/link";

export default function LegalLayout({ children }) {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <article className="mx-auto max-w-3xl px-6 py-16">
        {children}
        <div className="mt-16 pt-8 border-t border-hairline">
          <p className="text-sm text-muted">
            Questions? Reach out to us on WhatsApp — we&apos;re happy to help.
          </p>
          <Link
            href="/"
            className="text-clay hover:text-clay-dark text-sm mt-2 inline-block"
          >
            ← Back to home
          </Link>
        </div>
      </article>
    </main>
  );
}
