import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Sparkles, Shield, Clock, ArrowRight } from "lucide-react";
import ContactModal from "./ContactModal";

const HomeCleaningSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const services = [
    {
      title: "입주 청소",
      description: "새 집 입주 전 완벽한 청소",
      features: ["실내 전체 소독", "새집증후군 제거", "바닥 왁스 코팅"],
      price: "30만원~",
      popular: true
    },
    {
      title: "이사 청소",
      description: "이사 전후 깔끔한 정리",
      features: ["짐 정리 후 청소", "생활 얼룩 제거", "원상복구 지원"],
      price: "25만원~"
    },
    {
      title: "거주 청소",
      description: "살고 있는 집 대청소",
      features: ["가구 이동 청소", "깊은 곳까지 청소", "정기 관리 가능"],
      price: "20만원~"
    },
    {
      title: "욕실 정기서비스",
      description: "욕실 전문 정기 관리",
      features: ["곰팡이 완벽 제거", "배수구 청소", "타일 틈새 청소"],
      price: "10만원~"
    }
  ];

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
              깨끗한 우리집 만들기
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              전문가의 손길로 새집처럼 깨끗하게! 
              온다클린의 홈클리닝 서비스를 경험해보세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {service.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      인기
                    </span>
                  </div>
                )}
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {service.price}
                    </span>
                    <Button 
                      size="sm" 
                      className="group bg-primary hover:bg-primary-dark"
                      onClick={() => setIsModalOpen(true)}
                    >
                      상담하기
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="inline-block p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <div className="font-semibold">빠른 예약 안내</div>
                  <div className="text-sm text-muted-foreground">
                    전화 한 통으로 24시간 내 방문 상담 가능
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default HomeCleaningSection;