import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    title: "입주 청소",
    description: "새집 입주를 위한 완벽한 딥클리닝",
    image: "🏠",
    quotes: "평균 11건 견적",
    popular: true
  },
  {
    title: "원룸 청소", 
    description: "작은 공간을 위한 맞춤형 청소",
    image: "🏢",
    quotes: "평균 8건 견적",
    popular: false
  },
  {
    title: "세탁기 청소",
    description: "세탁기 분해 청소 및 관리",
    image: "🧺",
    quotes: "평균 5건 견적", 
    popular: false
  },
  {
    title: "에어컨 청소",
    description: "전문적인 에어컨 클리닝 서비스",
    image: "❄️",
    quotes: "평균 7건 견적",
    popular: true
  },
  {
    title: "욕실 줄눈 시공",
    description: "곰팡이 제거 및 줄눈 재시공",
    image: "🚿",
    quotes: "평균 3건 견적",
    popular: false
  },
  {
    title: "이사 도우미",
    description: "이사 전후 완벽한 정리 서비스",
    image: "📦",
    quotes: "평균 12건 견적",
    popular: true
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-background" id="services">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            인기 서비스
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            합리적인 가격부터 프리미엄 서비스까지, 고객님께 꼭 맞는 서비스를 선택하세요
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/20"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{service.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      {service.popular && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          인기
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      {service.description}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {service.quotes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;