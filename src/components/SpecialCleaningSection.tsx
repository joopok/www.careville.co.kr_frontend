import { Card } from "@/components/ui/card";
import { AirVent, Flame, Droplets, Trash2, Factory, AlertTriangle, Zap } from "lucide-react";

const SpecialCleaningSection = () => {
  const services = [
    {
      icon: AirVent,
      title: "에어컨 설치/수리",
      description: "전문 기술로 에어컨 설치 및 수리",
      difficulty: "전문",
      color: "text-blue-500"
    },
    {
      icon: Factory,
      title: "식당 청소",
      description: "위생적인 주방 환경",
      difficulty: "중급",
      color: "text-orange-500"
    },
    {
      icon: Flame,
      title: "화재 청소",
      description: "화재 현장 복구 전문",
      difficulty: "고급",
      color: "text-red-500"
    },
    {
      icon: Droplets,
      title: "침수 청소",
      description: "수해 복구 및 건조",
      difficulty: "고급",
      color: "text-blue-500"
    },
    {
      icon: Trash2,
      title: "쓰레기집 청소",
      description: "특수 상황 정리 전문",
      difficulty: "특수",
      color: "text-purple-500"
    },
    {
      icon: Factory,
      title: "공장 청소",
      description: "산업 시설 전문 청소",
      difficulty: "고급",
      color: "text-gray-600"
    }
  ];

  return (
    <section id="special-cleaning" className="py-20 bg-gradient-to-b from-accent/10 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-destructive/10 px-4 py-2 rounded-full mb-4">
            <Zap className="h-5 w-5 text-destructive" />
            <span className="text-destructive font-semibold">특수청소</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            어떤 상황도 완벽하게 해결합니다
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            특수한 환경에 최적화된 전문 장비와 숙련된 기술력으로
            모든 청소 난제를 해결해드립니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${service.color}`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded">
                    {service.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {service.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-r from-destructive/5 to-primary/5 border-destructive/20">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 text-destructive flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">24시간 긴급 출동 서비스</h3>
              <p className="text-muted-foreground mb-4">
                화재, 침수 등 긴급 상황 발생 시 즉시 출동하여 
                피해를 최소화하고 빠른 복구를 도와드립니다.
              </p>
              <div className="flex gap-4 text-sm">
                <span className="font-semibold">긴급 전화:</span>
                <span className="text-destructive font-bold">1600-9762</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default SpecialCleaningSection;