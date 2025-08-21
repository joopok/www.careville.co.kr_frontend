import { Card } from "@/components/ui/card";
import { Check, Award, Shield, Clock } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Award,
      title: "15년 전통",
      description: "2009년부터 시작된 청소 전문 기업"
    },
    {
      icon: Shield,
      title: "믿을 수 있는 서비스",
      description: "철저한 직원 교육과 품질 관리"
    },
    {
      icon: Clock,
      title: "신속한 대응",
      description: "24시간 내 방문 상담 가능"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            온다클린을 선택하는 이유
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            대한민국 No.1 청소 전문 기업 온다클린은 
            고객님의 깨끗한 공간을 위해 최선을 다합니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6 animate-slideInLeft">
            <h3 className="text-2xl font-bold text-foreground">
              프리미엄 청소 서비스의 기준
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              온다클린은 단순한 청소가 아닌, 고객님의 건강하고 쾌적한 생활 공간을 
              만들어드리는 것을 목표로 합니다. 최첨단 장비와 친환경 세제를 사용하여 
              깨끗함은 물론 안전함까지 보장합니다.
            </p>
            <ul className="space-y-3">
              {[
                "ISO 인증 획득 청소 전문 기업",
                "100% 친환경 인증 세제 사용",
                "전문 교육을 이수한 청소 전문가",
                "책임보험 가입으로 안심 서비스"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative animate-slideInRight">
            <Card className="overflow-hidden h-full">
              <div className="h-full bg-gradient-to-br from-primary/10 to-secondary/10 p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-primary">50,000+</div>
                  <div className="text-xl text-muted-foreground">만족한 고객님들</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;