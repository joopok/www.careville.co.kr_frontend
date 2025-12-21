import { lazy, Suspense, useState, useRef, useEffect, memo } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { ConfigProvider } from "@/contexts/ConfigContext";

// Lazy load components that are not immediately visible
const ServiceMenuSection = lazy(() => import("@/components/ServiceMenuSection"));
const HomeCleaningSection = lazy(() => import("@/components/HomeCleaningSection"));
const BusinessCleaningSection = lazy(() => import("@/components/BusinessCleaningSection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const FaqSection = lazy(() => import("@/components/FaqSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));

// API 응답 타입
interface ApiResponse {
  productCdList: ProductItem[];
  serviceCdList: ServiceCdItem[];
  data: ReviewItem[];
}

interface ProductItem {
  serviceCd: string;
  serviceNm: string;
  productNo: number;
  productNm: string;
  serviceIncludes: string | null;
  originalPrice: number | null;
  salePrice: number | null;
  popularYn: string | null;
  displayOrder: number | null;
}

interface ServiceCdItem {
  serviceCd: string;
  serviceNm: string;
}

interface ReviewItem {
  serviceNm: string;
  reviewSeq: string;
  svcDate: string;
  dispYn: string;
  serviceCd: string;
  starRate: number;
  reviewNm: string;
  rgsDt: string;
  reviewCn: string;
}

// 시공사례 타입
interface CaseItem {
  caseSeq: number;
  serviceCd: string;
  serviceNm: string;
  caseSj: string;
  caseCn: string;
  hashtag: string;
  rgsDt: string;
  viewfileseq: number;
}

// FAQ 타입
interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display?: boolean;
  order?: number;
}

// Config 타입
interface ConfigItem {
  configKey: string;
  configValue: string;
  configGroup: string;
  description?: string;
}

// Memoized loading component
const LoadingSpinner = memo(() => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
));
LoadingSpinner.displayName = 'LoadingSpinner';

// Memoized progressive loading component
const ProgressiveSection = memo(({ children }: { children: React.ReactNode }) => {
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
    // Fallback: ensure render even if intersection doesn't fire (e.g., headless tests)
    const fallback = setTimeout(() => {
      setIsVisible((v) => v || true);
    }, 1200);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  if (!isVisible) {
    return <div ref={sentinelRef} style={{ minHeight: '200px' }} />;
  }

  return <>{children}</>;
});
ProgressiveSection.displayName = 'ProgressiveSection';

const IndexOptimized = () => {
  // 상품/리뷰 데이터
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [serviceCdList, setServiceCdList] = useState<ServiceCdItem[]>([]);
  const [reviewList, setReviewList] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // 시공사례 데이터
  const [portfolioList, setPortfolioList] = useState<CaseItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);

  // FAQ 데이터
  const [faqList, setFaqList] = useState<FaqItem[]>([]);
  const [faqLoading, setFaqLoading] = useState(true);

  // 모든 API 병렬 호출 (느린 것부터)
  // 환경설정은 ConfigProvider에서 별도 관리
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL;

    // 1. 리뷰/상품 API (가장 느림 - 먼저 시작)
    fetch(`${apiBase}/api/reviews/all`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch reviews');
        return res.json();
      })
      .then((data: ApiResponse) => {
        setProductList(data.productCdList || []);
        setServiceCdList(data.serviceCdList || []);
        setReviewList(data.data || []);
      })
      .catch(error => console.error('리뷰 데이터 조회 실패:', error))
      .finally(() => setReviewsLoading(false));

    // 2. 시공사례 API (중간 속도)
    fetch(`${apiBase}/caseList.do`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rowStrt: 0, rowLimit: 24 })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch cases');
        return res.json();
      })
      .then(data => {
        setPortfolioList(data.list || []);
      })
      .catch(error => console.error('시공사례 조회 실패:', error))
      .finally(() => setPortfolioLoading(false));

    // 3. FAQ API (가장 빠름)
    fetch(`${apiBase}/api/faqs`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch FAQs');
        return res.json();
      })
      .then(data => {
        setFaqList(data.data || data || []);
      })
      .catch(error => console.error('FAQ 조회 실패:', error))
      .finally(() => setFaqLoading(false));
  }, []);

  return (
    <ConfigProvider>
      <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
        <Header />
        <HeroSection />

        <Suspense fallback={<LoadingSpinner />}>
          <ServiceMenuSection />
        </Suspense>

        {/* 1. 홈클리닝 */}
        <Suspense fallback={<LoadingSpinner />}>
          <ProgressiveSection>
            <HomeCleaningSection productList={productList} loading={reviewsLoading} />
          </ProgressiveSection>
        </Suspense>

        {/* 2. 사업장클리닝 */}
        <Suspense fallback={<LoadingSpinner />}>
          <ProgressiveSection>
            <BusinessCleaningSection productList={productList} loading={reviewsLoading} />
          </ProgressiveSection>
        </Suspense>

        {/* 5. 작업후기 */}
        <Suspense fallback={<LoadingSpinner />}>
          <ProgressiveSection>
            <ReviewsSection reviewList={reviewList} serviceCdList={serviceCdList} loading={reviewsLoading} />
          </ProgressiveSection>
        </Suspense>

        {/* 6. 시공사례 */}
        <Suspense fallback={<LoadingSpinner />}>
          <ProgressiveSection>
            <PortfolioSection portfolioList={portfolioList} loading={portfolioLoading} />
          </ProgressiveSection>
        </Suspense>

        {/* 7. CS 센터 */}
        <Suspense fallback={<LoadingSpinner />}>
          <ProgressiveSection>
            <ContactSection />
          </ProgressiveSection>
        </Suspense>

        {/* 8. 자주 묻는 질문 */}
        <Suspense fallback={<LoadingSpinner />}>
          <ProgressiveSection>
            <FaqSection faqList={faqList} loading={faqLoading} />
          </ProgressiveSection>
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <Footer />
        </Suspense>
      </div>
    </ConfigProvider>
  );
};

export default IndexOptimized;
