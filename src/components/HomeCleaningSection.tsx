import { useState, useCallback, memo, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Star, Shield, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceDetailModal from "./ServiceDetailModal";
import ServiceRequestModal from "./ServiceRequestModal";

// API 응답 타입
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

// 화면 표시용 타입
interface ServiceItem {
  productNo: number;
  serviceCd: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  popular: boolean;
}

interface SelectedService {
  serviceCd: string;
  title: string;
  productNo?: number;
}

interface HomeCleaningSectionProps {
  productList: ProductItem[];
  loading: boolean;
}

const HomeCleaningSection = ({ productList, loading }: HomeCleaningSectionProps) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null);

  // 가격 포맷팅 (80000 → "8만원~")
  const formatPrice = (price: number | null): string => {
    if (!price || price === 0) return "견적문의";
    const manWon = Math.floor(price / 10000);
    return `${manWon}만원~`;
  };

  // serviceCd가 "001"인 상품만 필터링
  const services = useMemo<ServiceItem[]>(() => {
    return productList
      .filter(item => item.serviceCd === "001")
      .map((item) => {
        // serviceIncludes JSON 파싱
        let features: string[] = [];
        if (item.serviceIncludes) {
          try {
            const parsed = JSON.parse(item.serviceIncludes);
            features = Array.isArray(parsed) ? parsed.slice(1) : [];
          } catch {
            features = [];
          }
        }

        // description 추출 (첫 번째 항목)
        let description = "";
        if (item.serviceIncludes) {
          try {
            const parsed = JSON.parse(item.serviceIncludes);
            description = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : item.productNm;
          } catch {
            description = item.productNm;
          }
        }

        return {
          productNo: item.productNo,
          serviceCd: item.serviceCd,
          title: item.productNm,
          description,
          features,
          price: formatPrice(item.salePrice),
          popular: item.popularYn === 'Y'
        };
      });
  }, [productList]);

  const openDetailModal = useCallback((serviceCd: string, serviceTitle: string, productNo: number) => {
    setSelectedService({ serviceCd, title: serviceTitle, productNo });
    setIsDetailModalOpen(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedService(null);
  }, []);

  const openRequestModal = useCallback((serviceCd: string, serviceTitle: string, productNo: number) => {
    setSelectedService({ serviceCd, title: serviceTitle, productNo });
    setIsRequestModalOpen(true);
  }, []);

  const closeRequestModal = useCallback(() => {
    setIsRequestModalOpen(false);
    setSelectedService(null);
  }, []);

  // 로딩 스켈레톤
  if (loading) {
    return (
      <section id="home-cleaning" className="py-20 bg-gradient-to-b from-white to-accent/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Home className="h-5 w-5 text-primary" />
              <span className="text-primary font-semibold">홈클리닝</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              당신의 공간을 새롭게, 깨끗하게
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-10 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="home-cleaning" className="py-20 bg-gradient-to-b from-white to-accent/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Home className="h-5 w-5 text-primary" />
              <span className="text-primary font-semibold">홈클리닝</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              당신의 공간을 새롭게, 깨끗하게
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              15년 전문 노하우로 완성하는 프리미엄 홈클리닝
              케어빌이 당신의 일상을 더욱 빛나게 만들어드립니다
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <Card
                key={service.productNo}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {service.popular && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-secondary text-white text-[11px] font-medium px-3 py-1.5 rounded-bl-xl flex items-center gap-1.5 shadow-md">
                      <Star className="w-3 h-3 fill-current" />
                      인기
                    </div>
                  </div>
                )}

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* 자세히 보기 버튼 */}
                  <button
                    onClick={() => openDetailModal(service.serviceCd, service.title, service.productNo)}
                    className="w-full flex items-center justify-center gap-2 py-2 mb-4 text-sm text-primary hover:text-primary-dark border border-primary/30 hover:border-primary rounded-lg transition-all hover:bg-primary/5"
                  >
                    <Eye className="w-4 h-4" />
                    자세히 보기
                  </button>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {service.price}
                    </span>
                    <Button
                      size="sm"
                      className="group bg-primary hover:bg-primary-dark px-3"
                      onClick={() => openRequestModal(service.serviceCd, service.title, service.productNo)}
                    >
                      서비스 신청
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <ServiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        productNo={selectedService?.productNo || null}
        serviceTitle={selectedService?.title || null}
      />
      <ServiceRequestModal
        isOpen={isRequestModalOpen}
        onClose={closeRequestModal}
        serviceCd={selectedService?.serviceCd || null}
        serviceName={selectedService?.title || null}
        productNo={selectedService?.productNo}
        category="홈클리닝"
      />
    </>
  );
};

export default memo(HomeCleaningSection);
