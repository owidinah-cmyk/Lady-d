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
import { getRandomApprovedReviews } from "@/lib/reviews/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const reviews = await getRandomApprovedReviews({ limit: 3 });

  return (
    <>
      <AnnouncementBar />
      <Hero />
      <FeaturedDishes />
      <HowItWorks />
      <PaymentSafety />
      <ServicesOverview />
      <ValuesStrip />
      <Testimonials reviews={reviews} />
      <ServiceArea />
      <FinalCTA />
    </>
  );
}
