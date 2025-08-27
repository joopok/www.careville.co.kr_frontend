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
const SpecialCleaningSection = lazy(() => import("@/components/SpecialCleaningSection"));
const PricingSection = lazy(() => import("@/components/PricingSection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const NoticeSection = lazy(() => import("@/components/NoticeSection"));
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const AdditionalSection = lazy(() => import("@/components/AdditionalSection"));

// Loading fallback component
const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mx-auto"></div>
      <div className="h-4 w-64 bg-gray-200 rounded mx-auto mt-4"></div>
    </div>
  </div>
);

const OptimizedIndex = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      <Header />
      <HeroSection />
      <ServiceMenuSection />
      
      <Suspense fallback={<SectionLoader />}>
        <AirConditionerSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <HomeCleaningSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <BusinessCleaningSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <SpecialCleaningSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <PricingSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <ReviewsSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <NoticeSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <PortfolioSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <ContactSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <AdditionalSection />
      </Suspense>
      
      <Footer />
    </div>
  );
};

export default OptimizedIndex;