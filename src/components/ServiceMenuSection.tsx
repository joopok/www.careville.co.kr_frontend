import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  Building2,
  Zap,
  MessageSquare,
  Star,
  Users,
  Calendar,
  Award,
  Sparkles,
  TrendingUp
} from "lucide-react";

const serviceCategories = [
  {
    title: "홈클리닝",
    icon: Home,
    services: ["입주 청소", "이사 청소", "거주 청소", "욕실정기서비스"],
    popular: true
  },
  {
    title: "사업장클리닝", 
    icon: Building2,
    services: ["사무실,상가 청소", "준공 청소", "정기 청소"],
    popular: false
  },
  {
    title: "특수청소",
    icon: Zap,
    services: ["에어컨 설치/수리", "식당 청소", "화재 청소", "침수 청소", "공장 청소"],
    popular: true
  },
  {
    title: "작업후기",
    icon: MessageSquare,
    services: ["고객후기", "시공사례"],
    popular: false
  }
];

const features = [
  {
    icon: Star,
    title: "국내 1위",
    description: "프리미엄 케어 서비스"
  },
  {
    icon: Users,
    title: "전문 인력",
    description: "숙련된 청소 전문가"
  },
  {
    icon: Calendar,
    title: "예약 시스템",
    description: "편리한 온라인 예약"
  },
  {
    icon: Award,
    title: "품질 보증",
    description: "100% 만족도 보장"
  }
];

const ServiceMenuSection = () => {
  return (
    <section id="services" className="py-20 -mt-[140px] bg-white relative z-40">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            프리미엄 케어 서비스
          </h2>
          <p className="text-muted-foreground text-lg">
            케어빌만의 차별화된 프리미엄 서비스를 경험해보세요
          </p>
        </div>
        {/* Service Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {serviceCategories.map((category, index) => (
            <Card
              key={index}
              className="service-card group relative overflow-hidden transition-all duration-300 cursor-pointer border-2 hover:shadow-2xl hover:-translate-y-3 hover:border-primary/50 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <CardContent className="relative p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <category.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-3 transition-colors duration-200 text-foreground group-hover:text-primary">
                  {category.title}
                </h3>

                <ul className="space-y-2 text-sm">
                  {category.services.map((service, serviceIndex) => (
                    <li
                      key={serviceIndex}
                      className="transition-all duration-200 text-muted-foreground group-hover:text-foreground hover:text-primary"
                    >
                      <span className="inline-block mr-2">•</span>
                      {service}
                    </li>
                  ))}
                </ul>

                {category.popular && (
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-105">
                      <Sparkles className="h-3 w-3" />
                      인기 서비스
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center group cursor-pointer animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-500">
                  <feature.icon className="h-10 w-10 text-primary group-hover:animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h4>
              <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceMenuSection;