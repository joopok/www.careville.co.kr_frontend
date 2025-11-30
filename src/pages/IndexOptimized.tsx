import { lazy, Suspense, useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

// Lazy load components that are not immediately visible
const ServiceMenuSection = lazy(() => import("@/components/ServiceMenuSection"));
const HomeCleaningSection = lazy(() => import("@/components/HomeCleaningSection"));
const BusinessCleaningSection = lazy(() => import("@/components/BusinessCleaningSection"));
const SpecialCleaningSection = lazy(() => import("@/components/SpecialCleaningSection"));
const PricingSection = lazy(() => import("@/components/PricingSection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const NoticeSection = lazy(() => import("@/components/NoticeSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const AdditionalSection = lazy(() => import("@/components/AdditionalSection"));
const Footer = lazy(() => import("@/components/Footer"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Progressive loading component
const ProgressiveSection = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!isVisible) {
    return <div ref={sentinelRef} style={{ minHeight: '200px' }} />;
  }

  return <>{children}</>;
};

const IndexOptimized = () => {


  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      <Header />
      <HeroSection />

      <Suspense fallback={<LoadingSpinner />}>
        <ServiceMenuSection />
      </Suspense>

      {/* 1. 홈클리닝 */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProgressiveSection>
          <HomeCleaningSection />
        </ProgressiveSection>
      </Suspense>

      {/* 2. 사업장클리닝 */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProgressiveSection>
          <BusinessCleaningSection />
        </ProgressiveSection>
      </Suspense>

      {/* 3. 특수청소 */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProgressiveSection>
          <SpecialCleaningSection />
        </ProgressiveSection>
      </Suspense>

      {/* 4. 서비스가격 */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProgressiveSection>
          <PricingSection />
        </ProgressiveSection>
      </Suspense>

      {/* 5. 작업후기 */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProgressiveSection>
          <ReviewsSection />
        </ProgressiveSection>
      </Suspense>

      {/* 6. 시공사례 */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProgressiveSection>
          <PortfolioSection />
        </ProgressiveSection>
      </Suspense>

      {/* 7. CS 센터 */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProgressiveSection>
          <ContactSection />
        </ProgressiveSection>
      </Suspense>

      {/* 8. 부가서비스 */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProgressiveSection>
          <AdditionalSection />
        </ProgressiveSection>
      </Suspense>

      {/* 9. 질문 */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProgressiveSection>
          <NoticeSection />
        </ProgressiveSection>
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default IndexOptimized;