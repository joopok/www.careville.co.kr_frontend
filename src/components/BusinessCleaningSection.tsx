import { useState, useCallback, memo, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, Briefcase, CheckCircle2, Clock, Phone, Shield, Sparkles, Wind, Eye, Star } from "lucide-react";
import { motion } from "framer-motion";
import { handlePhoneCall } from "@/lib/utils";
import { siteConfig, getTelLink } from "@/config/site";
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
  icon: React.ComponentType<{ className?: string }>;
  price: string;
  popular: boolean;
}

interface SelectedService {
  serviceCd: string;
  title: string;
  productNo?: number;
}

interface BusinessCleaningSectionProps {
  productList: ProductItem[];
  loading: boolean;
}

// 아이콘 매핑 (productNm 기반)
const getIconForProduct = (productNm: string) => {
  const name = productNm.toLowerCase();
  if (name.includes('에어컨') || name.includes('air')) return Wind;
  if (name.includes('사무실') || name.includes('office')) return Briefcase;
  if (name.includes('상가') || name.includes('매장')) return Building2;
  if (name.includes('입주') || name.includes('이사')) return Users;
  return Building2; // 기본 아이콘
};

// 가격 포맷팅 - 사업장 클리닝은 항상 별도협의
const formatPrice = (): string => {
  return "금액별도협의";
};

const BusinessCleaningSection = ({ productList, loading }: BusinessCleaningSectionProps) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null);

  // serviceCd가 "002"인 상품만 필터링 (사업장 클리닝)
  const services = useMemo<ServiceItem[]>(() => {
    return productList
      .filter(item => item.serviceCd === "002")
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
          icon: getIconForProduct(item.productNm),
          price: formatPrice(),
          popular: item.popularYn === 'Y'
        };
      });
  }, [productList]);

  const openDetailModal = useCallback((serviceCd: string, serviceTitle: string) => {
    setSelectedService({ serviceCd, title: serviceTitle });
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

  const benefits = [
    { icon: CheckCircle2, text: "전문 청소 인력 파견" },
    { icon: Clock, text: "24시간 긴급 출동" },
    { icon: Shield, text: "청소 품질 보증" },
    { icon: Building2, text: "대형 건물 전문" }
  ];

  // 로딩 스켈레톤
  if (loading) {
    return (
      <section id="business-cleaning" className="py-20 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-muted/30 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">사업장 클리닝</span>
            </div>
            <h2 className="text-headline mb-6">
              성공적인 비즈니스를 위한 <span className="text-gradient">전문 케어</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden rounded-2xl">
                <CardHeader className="pt-6">
                  <Skeleton className="h-14 w-14 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2.5 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-10 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-12 w-1/2" />
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
    <section id="business-cleaning" className="py-20 bg-background relative overflow-hidden">
      {/* Background Decorations - Same style as PricingSection */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-muted/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">사업장 클리닝</span>
          </div>

          <h2 className="text-headline mb-6">
            성공적인 비즈니스를 위한{" "}
            <span className="text-gradient">전문 케어</span>
          </h2>

          <p className="text-body-lg text-muted-foreground">
            깨끗하고 쾌적한 업무 환경이 생산성을 높입니다.
            케어빌의 체계적인 관리로 비즈니스에만 집중하세요.
          </p>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
            <motion.div
              key={service.productNo}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group h-full bg-card hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-border/50 hover:border-primary/30 rounded-2xl overflow-hidden relative">
                {/* 인기 배지 */}
                {service.popular && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-secondary text-white text-[11px] font-medium px-3 py-1.5 rounded-bl-xl flex items-center gap-1.5 shadow-md">
                      <Star className="w-3 h-3 fill-current" />
                      인기
                    </div>
                  </div>
                )}
                <CardHeader className="pt-6">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <IconComponent className="h-7 w-7 text-primary" />
                  </div>

                  <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* 자세히 보기 버튼 */}
                  <button
                    onClick={() => openDetailModal(service.serviceCd, service.title)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 mt-4 text-sm text-primary hover:text-primary-dark border border-primary/30 hover:border-primary rounded-xl transition-all hover:bg-primary/5"
                  >
                    <Eye className="w-4 h-4" />
                    자세히 보기
                  </button>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between mt-4 gap-3">
                    <span className="text-xl font-bold text-primary">{service.price}</span>
                    <Button
                      onClick={() => openRequestModal(service.serviceCd, service.title, service.productNo)}
                      className="w-1/2 h-12 rounded-xl bg-primary text-white hover:bg-primary-dark font-medium text-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20"
                    >
                      서비스 신청
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            );
          })}
        </div>

        {/* CTA Banner - Primary Green Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-primary text-white border-0 rounded-3xl">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-accent rounded-full blur-3xl" />
            </div>

            <CardContent className="relative p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full mb-6">
                    <Sparkles className="w-4 h-4 text-white/80" />
                    <span className="text-sm text-white/90">기업 전용 서비스</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                    기업 맞춤 견적을<br />받아보세요
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                          <benefit.icon className="w-4 h-4 text-white/90" />
                        </div>
                        <span className="text-sm text-white/90">{benefit.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Content */}
                <div className="text-center md:text-right">
                  <p className="text-sm text-white/70 mb-2">기업 상담 전용</p>
                  <p className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{siteConfig.contact.phone}</p>
                  <p className="text-white/70 mb-8">규모와 업종에 맞는 최적의 솔루션</p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-end">
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 rounded-xl h-12 px-6 font-semibold shadow-lg shadow-black/20"
                      onClick={() => handlePhoneCall()}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      전화 상담
                    </Button>
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 rounded-xl h-12 px-6 font-semibold shadow-lg shadow-black/20"
                    >
                      무료 견적 받기
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ServiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        serviceId={selectedService?.title || null}
      />

      <ServiceRequestModal
        isOpen={isRequestModalOpen}
        onClose={closeRequestModal}
        serviceCd={selectedService?.serviceCd || null}
        serviceName={selectedService?.title || null}
        productNo={selectedService?.productNo}
        category="사업장 클리닝"
      />
    </section>
  );
};

export default memo(BusinessCleaningSection);
