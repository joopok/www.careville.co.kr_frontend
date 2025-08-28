import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Calendar, Briefcase } from "lucide-react";

const BusinessCleaningSection = () => {
  const services = [
    {
      icon: Briefcase,
      title: "사무실 청소",
      description: "쾌적한 업무 환경 조성",
      features: ["데스크 정리", "카펫 청소", "회의실 관리"]
    },
    {
      icon: Building2,
      title: "상가 청소",
      description: "깨끗한 비즈니스 공간",
      features: ["매장 청소", "쇼윈도우 관리", "입구 청소"]
    },
    {
      icon: Users,
      title: "준공 청소",
      description: "완벽한 마무리 청소",
      features: ["건축 잔재물 제거", "유리창 청소", "바닥 광택"]
    },
    {
      icon: Calendar,
      title: "정기 청소",
      description: "체계적인 관리 시스템",
      features: ["주간/월간 계약", "맞춤형 스케줄", "정기 점검"]
    }
  ];

  return (
    <section id="business-cleaning" className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full mb-4">
            <Building2 className="h-5 w-5 text-secondary" />
            <span className="text-secondary font-semibold">사업장클리닝</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            성공적인 비즈니스를 위한 첫걸음
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            깨끗하고 쾌적한 업무 환경이 생산성을 높입니다.
            케어빌의 체계적인 관리로 비즈니스에만 집중하세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="group p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <service.icon className="h-7 w-7 text-secondary" />
              </div>
              
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {service.description}
              </p>
              
              <ul className="space-y-2 text-sm">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">기업 맞춤 견적 문의</h3>
          <p className="text-muted-foreground mb-6">
            규모와 업종에 맞는 최적의 청소 솔루션을 제공합니다
          </p>
          <Button size="lg" className="bg-secondary hover:bg-secondary/90">
            무료 견적 받기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BusinessCleaningSection;