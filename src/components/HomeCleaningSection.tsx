import { useState, useCallback, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Star, Shield, ArrowRight, Eye } from "lucide-react";
import ServiceDetailModal from "./ServiceDetailModal";
import ServiceRequestModal from "./ServiceRequestModal";

// 서비스 데이터 상수 - 컴포넌트 외부로 이동하여 재생성 방지
const SERVICES = [
  {
    title: "에어컨 분해 세척",
    description: "전문 장비로 완벽한 에어컨 분해 청소",
    features: ["분해 후 고압 세척", "곰팡이 완벽 제거", "항균 코팅 서비스"],
    price: "8만원~",
    popular: true
  },
  {
    title: "세탁기 분해 세척",
    description: "드럼/통돌이 세탁기 전문 분해 청소",
    features: ["드럼통 완전 분해", "세균/곰팡이 제거", "고압 스팀 세척"],
    price: "10만원~"
  },
  {
    title: "싱크대 상판 UV 코팅",
    description: "대리석 상판 UV 코팅으로 새것처럼",
    features: ["스크래치 완화", "광택 복원", "오염 방지 코팅"],
    price: "15만원~"
  },
  {
    title: "싱크대 상판 크랙 보수",
    description: "대리석 상판 균열 및 크랙 전문 보수",
    features: ["균열 부위 메꿈", "색상 복원", "방수 처리"],
    price: "6만원~"
  },
  {
    title: "싱크대 상판 실리콘 교체",
    description: "노후된 실리콘 완벽 교체",
    features: ["기존 실리콘 제거", "방수/방곰팡이 실리콘", "깔끔한 마감 처리"],
    price: "6만원~"
  }
] as const;

const HomeCleaningSection = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const openDetailModal = useCallback((serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setIsDetailModalOpen(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedService(null);
  }, []);

  const openRequestModal = useCallback((serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setIsRequestModalOpen(true);
  }, []);

  const closeRequestModal = useCallback(() => {
    setIsRequestModalOpen(false);
    setSelectedService(null);
  }, []);

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
            {SERVICES.map((service, index) => (
              <Card
                key={index}
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
                        <Shield className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* 자세히 보기 버튼 */}
                  <button
                    onClick={() => openDetailModal(service.title)}
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
                      className="group bg-primary hover:bg-primary-dark"
                      onClick={() => openRequestModal(service.title)}
                    >
                      서비스 신청
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
        serviceId={selectedService}
      />
      <ServiceRequestModal
        isOpen={isRequestModalOpen}
        onClose={closeRequestModal}
        serviceName={selectedService}
        category="홈클리닝"
      />
    </>
  );
};

export default memo(HomeCleaningSection);