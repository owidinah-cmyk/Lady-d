import Link from "next/link";

export const metadata = {
  title: "About — Lady D Kitchen",
  description:
    "Lady D Kitchen Catering Services — home-style cooking and delivery in Abuja and Port Harcourt.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <header className="mb-8 sm:mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3">
            About Lady D Kitchen
          </h1>
          <p className="text-sm text-muted">
            A home-style catering service in Abuja and Port Harcourt
          </p>
        </header>

        <div className="space-y-6 leading-relaxed">
          <p>
            Lady D Kitchen Catering Services is a home-style cooking
            and delivery business. We cook in litre-sized covered
            bowls and deliver across Abuja and Port Harcourt — for
            homes, small gatherings, offices, and everything in
            between.
          </p>
          <p>
            We also run two related services:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Events</strong> — large-scale catering for
              weddings, corporate events, birthdays, naming
              ceremonies, and anniversaries.
            </li>
            <li>
              <strong>Laditop</strong> — branded merchandise and
              event printing. Bags, cups, books, banners, flex
              banners, gift bags, party bags, gift boxes, pens,
              t-shirts, and more.
            </li>
          </ul>
          <p>
            We don&apos;t take payments on the website. You place an
            order, we confirm it on WhatsApp, you pay a deposit by
            bank transfer, and we cook and deliver. The full process
            is described in our{" "}
            <Link href="/terms" className="text-clay hover:underline">
              Terms of Service
            </Link>
            .
          </p>
          <p>
            Questions, a custom order, or just want to chat? Reach
            out to us on WhatsApp — we&apos;re happy to help.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-hairline flex flex-col gap-2">
          <Link
            href="/"
            className="text-clay hover:text-clay-dark text-sm"
          >
            ← Back to home
          </Link>
          <p className="text-[11px] text-muted italic">
            Crafted with care in Abuja. Powered by Legacy LM.
          </p>
        </div>
      </article>
    </main>
  );
}
