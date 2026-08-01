// /app/events/page.js
// Upgraded events page with 10 sections.

import { getCurrentCustomer } from "@/lib/auth/current-customer";
import EventInquiryForm from "./EventInquiryForm";

import EventsHero from "@/components/events/EventsHero";
import ServicesGrid from "@/components/events/ServicesGrid";
import PackageTiers from "@/components/events/PackageTiers";
import SampleMenus from "@/components/events/SampleMenus";
import ProcessSteps from "@/components/events/ProcessSteps";
import IncludedList from "@/components/events/IncludedList";
import EventsGallery from "@/components/events/EventsGallery";
import EventsTestimonials from "@/components/events/EventsTestimonials";
import EventsFAQ from "@/components/events/EventsFAQ";
import EventsFinalCTA from "@/components/events/EventsFinalCTA";

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
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <EventsHero />

        <ServicesGrid />
        <PackageTiers />
        <SampleMenus />
        <ProcessSteps />
        <IncludedList />
        <EventsGallery />
        <EventsTestimonials />
        <EventsFAQ />
        <EventsFinalCTA />

        <section>
          <EventInquiryForm customer={customer} />
        </section>
      </div>
    </main>
  );
}
