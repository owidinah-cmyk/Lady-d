import Link from "next/link";
import AnnouncementBar from "@/components/landing/AnnouncementBar";
import Hero from "@/components/landing/Hero";
import FeaturedDishes from "@/components/FeaturedDishes";
import HowItWorks from "@/components/landing/HowItWorks";
import PaymentSafety from "@/components/landing/PaymentSafety";
import ServicesOverview from "@/components/landing/ServicesOverview";
import ValuesStrip from "@/components/landing/ValuesStrip";
import Testimonials from "@/components/landing/Testimonials";
import ServiceArea from "@/components/landing/ServiceArea";
import FinalCTA from "@/components/landing/FinalCTA";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Hero />
      <FeaturedDishes />
      <HowItWorks />
      <PaymentSafety />
      <ServicesOverview />
      <ValuesStrip />
      <Testimonials />
      <ServiceArea />
      <FinalCTA />
    </>
  );
}
