import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Truck, Shield, Wrench, Sparkles } from "lucide-react";

const AdditionalSection = () => {
  const services = [
    {
      icon: Package,
      title: "정리 수납 서비스",
      description: "전문 정리 컨설턴트가 공간을 효율적으로 정리해드립니다",
      price: "10만원~"
    },
    {
      icon: Truck,
      title: "이사 도우미",
      description: "포장부터 정리까지 이사 전 과정을 도와드립니다",
      price: "15만원~"
    },
    {
      icon: Shield,
      title: "방역 서비스",
      description: "해충 방제 및 바이러스 소독 서비스",
      price: "5만원~"
    },
    {
      icon: Wrench,
      title: "소규모 수리",
      description: "간단한 집수리 및 보수 작업",
      price: "견적 문의"
    }
  ];

  return (
    <section id="additional" className="py-20 bg-gradient-to-b from-accent/10 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-secondary" />
            <span className="text-secondary font-semibold">부가서비스</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            더 나은 생활을 위한 플러스 서비스
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            청소와 함께 이용하시면 더욱 편리한 부가 서비스를 제공합니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="h-7 w-7 text-secondary" />
                </div>
                
                <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {service.price}
                  </span>
                  <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-white transition-colors">
                    자세히
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            케어 + 부가서비스 패키지 할인
          </h3>
          <p className="mb-6 text-white/90">
            케어 서비스와 부가 서비스를 함께 이용하시면
            최대 20% 할인 혜택을 받으실 수 있습니다
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90">
            패키지 문의하기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AdditionalSection;