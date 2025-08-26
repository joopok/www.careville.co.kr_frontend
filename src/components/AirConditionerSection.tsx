import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AirVent, Wrench, Shield, CheckCircle2, Clock, Phone, Snowflake } from "lucide-react";
import { motion } from "framer-motion";

const AirConditionerSection = () => {
  const services = [
    {
      icon: AirVent,
      title: "에어컨 신규 설치",
      description: "전문 기술진이 정확하고 안전하게 설치합니다",
      features: [
        "벽걸이/스탠드/천장형 모든 타입 설치",
        "배관 및 전기 공사 포함",
        "설치 후 성능 테스트",
        "1년 무상 A/S"
      ]
    },
    {
      icon: Wrench,
      title: "에어컨 수리 서비스",
      description: "모든 브랜드 에어컨 수리 전문",
      features: [
        "고장 진단 무료",
        "냉매 충전 서비스",
        "컴프레서 수리/교체",
        "당일 방문 수리"
      ]
    },
    {
      icon: Shield,
      title: "정기 점검 서비스",
      description: "에어컨 수명 연장과 효율적인 관리",
      features: [
        "연 2회 정기 점검",
        "필터 청소 및 교체",
        "성능 최적화 서비스",
        "긴급 출동 서비스"
      ]
    }
  ];

  const benefits = [
    { icon: CheckCircle2, text: "전국 당일 출장 가능" },
    { icon: Clock, text: "24시간 긴급 서비스" },
    { icon: Shield, text: "정품 부품 사용" },
    { icon: AirVent, text: "모든 브랜드 서비스" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50/50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            <Snowflake className="w-3 h-3 mr-1" />
            에어컨 전문 서비스
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            에어컨 <span className="text-blue-600">설치부터 수리까지</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            15년 경력의 전문 기술진이 에어컨 설치와 수리를 
            완벽하게 처리해드립니다. 모든 브랜드, 모든 타입 서비스 가능!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-200">
                <CardHeader>
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <service.icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                    서비스 신청하기
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  지금 바로 에어컨 서비스를 신청하세요!
                </h3>
                <div className="space-y-3 mb-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <benefit.icon className="w-5 h-5 text-blue-200" />
                      <span className="text-white/90">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-3xl font-bold mb-2">1600-9762</p>
                <p className="text-blue-200 mb-4">연중무휴 24시간 상담 가능</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-end">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                    <Phone className="w-4 h-4 mr-2" />
                    전화 상담
                  </Button>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                    온라인 견적
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AirConditionerSection;