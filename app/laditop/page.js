// /app/laditop/page.js
// Laditop merchandise/printing inquiry page.

import { getCurrentCustomer } from "@/lib/auth/current-customer";
import MerchInquiryForm from "./MerchInquiryForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Laditop — Lady D Kitchen",
  description:
    "Branded merchandise and event printing. Bags, cups, books, banners, flex banners, gift bags, party bags, gift boxes, pens, t-shirts, and more.",
};

export default async function LaditopPage() {
  const customer = await getCurrentCustomer();

  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-5xl tracking-tight mb-3">
          Laditop
        </h1>
        <p className="text-lg text-muted mb-12">
          Branded merchandise and event printing.
        </p>

        {/* Pitch */}
        <section className="space-y-4 mb-12 leading-relaxed">
          <p>
            Souvenirs, event giveaways, branded swag — we design and
            print it. Pick what you need, tell us a little about
            your project, and we&apos;ll come back with a quote.
          </p>
          <p className="text-sm text-muted">
            Common items: bags, cups, books, banners, flex banners,
            gift bags, party bags, gift boxes, pens, t-shirts. Don&apos;t
            see what you need? Pick &quot;Other&quot; and describe it.
          </p>
        </section>

        {/* Inquiry form */}
        <section>
          <h2 className="font-serif text-2xl mb-2">Tell us what you need</h2>
          <p className="text-sm text-muted mb-6">
            Pick the items, add notes, and we&apos;ll open WhatsApp
            to continue.
          </p>
          <MerchInquiryForm customer={customer} />
        </section>
      </div>
    </main>
  );
}
