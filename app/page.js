import Link from "next/link";
import FeaturedDishes from "@/components/FeaturedDishes";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 text-center">
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-ink">
            Lady D Kitchen
          </h1>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
            Home-style cooking, delivered. Litre-sized bowls, fresh
            ingredients, across Abuja and Port Harcourt.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/menu"
              className="bg-clay hover:bg-clay-dark text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              View menu
            </Link>
            <Link
              href="/about"
              className="text-ink hover:text-clay font-medium px-6 py-3 transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <FeaturedDishes />

      {/* How Lady D Kitchen works — trust section */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-serif text-3xl mb-8 text-center">
            How Lady D Kitchen works
          </h2>
          <ol className="space-y-6">
            <li className="flex gap-4">
              <span className="flex-none w-8 h-8 rounded-full bg-clay text-white font-semibold flex items-center justify-center text-sm">
                1
              </span>
              <div>
                <h3 className="font-medium text-lg">Browse the menu</h3>
                <p className="text-muted">
                  Pick what you&apos;d like. Every dish is sold in
                  litre-sized portions with clear prices.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-none w-8 h-8 rounded-full bg-clay text-white font-semibold flex items-center justify-center text-sm">
                2
              </span>
              <div>
                <h3 className="font-medium text-lg">Build your order</h3>
                <p className="text-muted">
                  Add multiple dishes and quantities. You&apos;ll
                  see your total update as you go.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-none w-8 h-8 rounded-full bg-clay text-white font-semibold flex items-center justify-center text-sm">
                3
              </span>
              <div>
                <h3 className="font-medium text-lg">Send it to us on WhatsApp</h3>
                <p className="text-muted">
                  At checkout, we open WhatsApp with your order
                  already typed. You don&apos;t retype anything.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-none w-8 h-8 rounded-full bg-clay text-white font-semibold flex items-center justify-center text-sm">
                4
              </span>
              <div>
                <h3 className="font-medium text-lg">Pay a deposit, we cook and deliver</h3>
                <p className="text-muted">
                  We confirm your order, you pay a 40–50% deposit
                  by bank transfer, we cook, and our rider delivers.
                  Balance on delivery.
                </p>
              </div>
            </li>
          </ol>

          <div className="mt-12 bg-white border border-hairline rounded-card p-6">
            <p className="text-sm text-ink">
              <strong>A note on payment safety:</strong> we will
              never post our bank details publicly. We share them
              only inside an active WhatsApp conversation, with
              you, after you place an order. If you receive
              payment details from any other source claiming to
              be us, please don&apos;t pay — and reach out to verify.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
