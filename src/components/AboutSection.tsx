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
            생활 공간을 돌보다, ㈜케어빌입니다.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            케어빌은 고객님의 일상에 따뜻한 변화를 더하는 생활 공간 케어 전문기업입니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6 animate-slideInLeft">
            <h3 className="text-2xl font-bold text-foreground">
              프리미엄 청소 서비스의 기준
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              우리는 고객 한 분 한 분의 공간을 정성껏 돌보고, 신뢰로 책임지는 생활관리 파트너가 되고자 합니다.
              눈에 보이는 청결은 물론, 보이지 않는 편안함까지 전하는 것을 케어빌의 소중한 가치로 삼고 있습니다.
              당신의 일상에 편안함과 감동을 선물하는 브랜드, 
              (주)케어빌을 찾아주셔서 감사합니다.
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