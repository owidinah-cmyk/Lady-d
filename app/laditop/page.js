// /app/laditop/page.js
// Upgraded Laditop page with 9 sections.

import { getCurrentCustomer } from "@/lib/auth/current-customer";
import MerchInquiryForm from "./MerchInquiryForm";

import LaditopHero from "@/components/laditop/LaditopHero";
import CatalogGrid from "@/components/laditop/CatalogGrid";
import CapabilitiesList from "@/components/laditop/CapabilitiesList";
import LaditopProcess from "@/components/laditop/LaditopProcess";
import TurnaroundGuide from "@/components/laditop/TurnaroundGuide";
import LaditopGallery from "@/components/laditop/LaditopGallery";
import LaditopTestimonials from "@/components/laditop/LaditopTestimonials";
import LaditopFAQ from "@/components/laditop/LaditopFAQ";
import LaditopFinalCTA from "@/components/laditop/LaditopFinalCTA";

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
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <LaditopHero />

        <CatalogGrid />
        <CapabilitiesList />
        <LaditopProcess />
        <TurnaroundGuide />
        <LaditopGallery />
        <LaditopTestimonials />
        <LaditopFAQ />
        <LaditopFinalCTA />

        <section>
          <MerchInquiryForm customer={customer} />
        </section>
      </div>
    </main>
  );
}
