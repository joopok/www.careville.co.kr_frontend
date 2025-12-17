import { Skeleton } from "@/components/ui/skeleton";
import { useState, memo, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Star, Sparkles, AlertTriangle, ArrowRight, Clock, BadgePercent, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BookingModal from "@/components/BookingModal";

// JSON 파싱 캐시용 Map
const parseCache = new Map<string, string[]>();

const parseServiceIncludes = (jsonString: string | null | undefined): string[] => {
  if (!jsonString) return [];

  // 캐시된 결과가 있으면 반환
  if (parseCache.has(jsonString)) {
    return parseCache.get(jsonString)!;
  }

  try {
    const result = JSON.parse(jsonString);
    parseCache.set(jsonString, result);
    return result;
  } catch {
    return [];
  }
};

const PricingSection = () => {
  const [category, setCategory] = useState([]);
  const [pricingData, setPricingData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailService, setDetailService] = useState<any>(null);

  // Tab scroll functionality
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = useCallback(() => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [category, checkScrollButtons]);

  const scrollTabs = useCallback((direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200;
      tabsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      // onScroll 이벤트로 처리하므로 setTimeout 제거
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.DEV
          ? '/api/v1/category-products.do'
          : `${import.meta.env.VITE_API_URL}/api/v1/category-products.do`;

        const resp = await fetch(apiUrl, { method: 'GET' });

        if (!resp.ok) {
          if (resp.status === 502) {
            throw new Error('서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
          }
          throw new Error(`서버 오류가 발생했습니다 (${resp.status}). 관리자에게 문의해주세요.`);
        }

        const data = await resp.json();

        setCategory(data?.categories);

        // 캐싱된 파싱 함수 사용
        const processedProducts = data?.products?.map((item) => ({
          ...item,
          features: parseServiceIncludes(item?.serviceIncludes)
        }));
        setPricingData(processedProducts);

      } catch (error) {
        console.error('Error fetching products:', error);
        const errorMessage = error instanceof Error
          ? error.message
          : '데이터를 불러오는 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.';
        setError(errorMessage);
        setCategory([]);
        setPricingData([]);
      } finally {
        setSelectedCategory("001");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // useMemo로 필터링 결과 메모이제이션
  const displayData = useMemo(() =>
    pricingData.filter(item => item.serviceCd === selectedCategory),
    [selectedCategory, pricingData]
  );

  // 숫자 포맷 함수 메모이제이션
  const formatNumberComma = useCallback((value: number | string): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return "";
    }
    const [integerPart, decimalPart] = String(value).split('.');
    const formattedInteger = Number(integerPart).toLocaleString('ko-KR');
    if (decimalPart) {
      return `${formattedInteger}.${decimalPart}`;
    }
    return formattedInteger;
  }, []);

  return (
    <section id="pricing" className="section-padding bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-muted/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <BadgePercent className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">명확한 가격 정책</span>
          </div>

          <h2 className="text-headline mb-6">
            투명하고{" "}
            <span className="text-gradient">합리적인 가격</span>
          </h2>

          <p className="text-body-lg text-muted-foreground">
            추가 비용 걱정 없는 정직한 가격 정책으로 신뢰를 드립니다.
            모든 서비스 가격은 VAT 포함이며, 숨겨진 비용은 일체 없습니다.
          </p>
        </motion.div>

        {/* Category Tabs - Horizontal Scrollable */}
        <div className="relative max-w-5xl mx-auto mb-12">
          {/* Left Scroll Button */}
          <button
            onClick={() => scrollTabs('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-border/50 flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary ${
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Tabs Container */}
          <div
            ref={tabsContainerRef}
            onScroll={checkScrollButtons}
            className="flex gap-3 overflow-x-auto scrollbar-hide px-12 py-3 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {category?.map((item, index) => (
              <motion.button
                key={item?.serviceCd}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedCategory(item?.serviceCd)}
                className={`relative flex-shrink-0 px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === item?.serviceCd
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-white text-foreground/70 hover:bg-primary/5 hover:text-primary border border-border/50 hover:border-primary/30'
                }`}
              >
                {item?.serviceNm}
                {selectedCategory === item?.serviceCd && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scrollTabs('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-border/50 flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary ${
              canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Gradient Fade Indicators */}
          <div className={`absolute left-10 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute right-10 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        {/* Pricing Cards Grid - 4 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {error ? (
            <div className="col-span-full">
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-destructive mb-3">데이터 로드 실패</h3>
                      <p className="text-muted-foreground mb-6">{error}</p>
                      <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-white rounded-full px-6"
                      >
                        새로고침
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="h-full rounded-2xl border-border/50">
                <CardHeader className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <Skeleton className="h-10 w-1/2 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                  <Skeleton className="h-12 w-full mt-6 rounded-xl" />
                </CardContent>
              </Card>
            ))
          ) : displayData?.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-xl text-muted-foreground">해당하는 서비스가 없습니다.</p>
            </div>
          ) : (
            displayData?.map((item, index) => (
              <motion.div
                key={item.productNo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`group relative h-full rounded-2xl border-border/50 bg-card hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden`}>
                  {/* Discount Ribbon Badge - Top Right Corner */}
                  {item?.saleYn === 'Y' && (
                    <div className="discount-ribbon">
                      <div className="discount-ribbon-inner">
                        {item.discountRate}% OFF
                      </div>
                    </div>
                  )}

                  {/* Popular Badge - Only show if no discount */}
                  {item.popular && item?.saleYn !== 'Y' && (
                    <div className="absolute top-0 right-0 z-10">
                      <div className="bg-secondary text-white text-[11px] font-medium px-3 py-1.5 rounded-bl-xl flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-current" />
                        인기
                      </div>
                    </div>
                  )}

                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                      {item.productNm}
                    </CardTitle>
                    <CardDescription className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                      {item.productDesc}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 pt-0">
                    {/* Price */}
                    <div className="mb-4 pb-4 border-b border-border/50">
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {formatNumberComma(item.salePrice)}
                        </span>
                        <span className="text-sm text-muted-foreground">원</span>
                      </div>
                      {item?.saleYn === 'Y' && (
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground line-through">
                            {formatNumberComma(item.originalPrice)}원
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.serviceTime}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-5">
                      {item.features?.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-primary" />
                          </div>
                          <span className="text-xs text-foreground/80 line-clamp-1">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                      className="w-full h-11 rounded-xl bg-primary text-white hover:bg-primary-dark font-medium text-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20"
                      onClick={() => {
                        setSelectedService(item);
                        setIsModalOpen(true);
                      }}
                    >
                      예약하기
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedService={selectedService}
      />
    </section>
  );
};

export default memo(PricingSection);
