import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Eager load critical above-the-fold components
import HeroSection from "@/components/HeroSection";
import ServiceMenuSection from "@/components/ServiceMenuSection";

// Lazy load below-the-fold components
const AirConditionerSection = lazy(() => import("@/components/AirConditionerSection"));
const HomeCleaningSection = lazy(() => import("@/components/HomeCleaningSection"));
const BusinessCleaningSection = lazy(() => import("@/components/BusinessCleaningSection"));
const PricingSection = lazy(() => import("@/components/PricingSection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const NoticeSection = lazy(() => import("@/components/NoticeSection"));
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const AdditionalSection = lazy(() => import("@/components/AdditionalSection"));

// Elegant loading fallback
const SectionLoader = () => (
  <div className="flex items-center justify-center py-24">
    <div className="relative">
      {/* Pulsing ring */}
      <div className="absolute inset-0 w-16 h-16 border-2 border-primary/20 rounded-full animate-ping" />
      {/* Static ring */}
      <div className="w-16 h-16 border-2 border-primary/30 rounded-full flex items-center justify-center">
        <div className="w-8 h-8 bg-primary/10 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

const OptimizedIndex = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <StructuredData />
      <Header />

      {/* Hero - Full viewport, immersive */}
      <HeroSection />

      {/* Services - Primary content */}
      <ServiceMenuSection />

      {/* Air Conditioner Services */}
      <Suspense fallback={<SectionLoader />}>
        <AirConditionerSection />
      </Suspense>

      {/* Home Cleaning */}
      <Suspense fallback={<SectionLoader />}>
        <HomeCleaningSection />
      </Suspense>

      {/* Business Cleaning */}
      <Suspense fallback={<SectionLoader />}>
        <BusinessCleaningSection />
      </Suspense>

      {/* Pricing */}
      <Suspense fallback={<SectionLoader />}>
        <PricingSection />
      </Suspense>

      {/* Reviews */}
      <Suspense fallback={<SectionLoader />}>
        <ReviewsSection />
      </Suspense>

      {/* Portfolio */}
      <Suspense fallback={<SectionLoader />}>
        <PortfolioSection />
      </Suspense>

      {/* Contact */}
      <Suspense fallback={<SectionLoader />}>
        <ContactSection />
      </Suspense>

      {/* Additional Services */}
      <Suspense fallback={<SectionLoader />}>
        <AdditionalSection />
      </Suspense>

      {/* Notice/FAQ */}
      <Suspense fallback={<SectionLoader />}>
        <NoticeSection />
      </Suspense>

      <Footer />
    </div>
  );
};

export default OptimizedIndex;
