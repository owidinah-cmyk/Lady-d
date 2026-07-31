// /app/events/page.js
// Event catering inquiry page.

import { getCurrentCustomer } from "@/lib/auth/current-customer";
import EventInquiryForm from "./EventInquiryForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events — Lady D Kitchen",
  description:
    "Large-scale catering for weddings, corporate events, birthdays, naming ceremonies, and anniversaries.",
};

export default async function EventsPage() {
  const customer = await getCurrentCustomer();

  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-5xl tracking-tight mb-3">
          Events
        </h1>
        <p className="text-lg text-muted mb-12">
          Large-scale catering for the moments that matter.
        </p>

        {/* Pitch */}
        <section className="space-y-4 mb-12 leading-relaxed">
          <p>
            From intimate gatherings to grand celebrations, we bring
            the same home-style cooking you know from our daily menu
            to events of every size. Weddings, corporate events,
            birthdays, naming ceremonies, anniversaries — if food is
            part of it, we&apos;re part of it.
          </p>
          <p>
            Tell us what you&apos;re planning. We&apos;ll put together
            a quote that fits your guest count, your venue, and your
            taste.
          </p>
        </section>

        {/* Packages (placeholder ranges; admin can refine later) */}
        <section className="bg-white border border-hairline rounded-card p-6 mb-12">
          <h2 className="font-serif text-2xl mb-4">Package tiers</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Standard</p>
              <p className="text-sm text-muted">
                Hearty buffet with rice dishes, proteins, and sides.
                <br />
                <span className="text-clay font-medium">From ₦3,500 per head</span>
              </p>
            </div>
            <div>
              <p className="font-medium">Premium</p>
              <p className="text-sm text-muted">
                Expanded menu, multiple proteins, dessert, and
                service staff.
                <br />
                <span className="text-clay font-medium">From ₦6,500 per head</span>
              </p>
            </div>
            <div>
              <p className="font-medium">Custom</p>
              <p className="text-sm text-muted">
                Tailored to your theme, dietary needs, and guest
                preferences.
                <br />
                <span className="text-muted">Quoted per event</span>
              </p>
            </div>
          </div>
        </section>

        {/* Inquiry form */}
        <section>
          <h2 className="font-serif text-2xl mb-2">Tell us about your event</h2>
          <p className="text-sm text-muted mb-6">
            Fill in the details below and we&apos;ll open WhatsApp to
            continue the conversation.
          </p>
          <EventInquiryForm customer={customer} />
        </section>
      </div>
    </main>
  );
}
