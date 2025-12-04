import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Calendar, Briefcase, CheckCircle2, Clock, Phone, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { handlePhoneCall } from "@/lib/utils";

const BusinessCleaningSection = () => {
  const services = [
    {
      icon: Briefcase,
      title: "사무실 청소",
      description: "쾌적한 업무 환경 조성을 위한 전문 청소",
      gradient: "from-emerald-500 to-teal-400",
      iconColor: "text-emerald-500",
      features: [
        "데스크 및 업무공간 정리",
        "카펫 청소 및 관리",
        "회의실 청소 서비스",
        "화장실 및 공용공간 관리"
      ]
    },
    {
      icon: Building2,
      title: "상가 청소",
      description: "깨끗한 비즈니스 공간 유지 관리",
      gradient: "from-blue-500 to-cyan-400",
      iconColor: "text-blue-500",
      features: [
        "매장 바닥 청소 및 광택",
        "쇼윈도우 유리창 관리",
        "입구 및 외부 청소",
        "영업 전/후 정기 청소"
      ]
    },
    {
      icon: Users,
      title: "준공 청소",
      description: "완벽한 마무리 청소 서비스",
      gradient: "from-violet-500 to-purple-400",
      iconColor: "text-violet-500",
      features: [
        "건축 잔재물 완벽 제거",
        "유리창 전면 청소",
        "바닥 광택 및 코팅",
        "입주 전 완벽 청소"
      ]
    },
    {
      icon: Calendar,
      title: "정기 청소",
      description: "체계적인 관리 시스템 제공",
      gradient: "from-amber-500 to-orange-400",
      iconColor: "text-amber-500",
      features: [
        "주간/월간 계약 가능",
        "맞춤형 스케줄 관리",
        "정기 품질 점검",
        "전담 매니저 배정"
      ]
    }
  ];

  const benefits = [
    { icon: CheckCircle2, text: "전문 청소 인력 파견" },
    { icon: Clock, text: "24시간 긴급 출동" },
    { icon: Shield, text: "청소 품질 보증" },
    { icon: Building2, text: "대형 건물 전문" }
  ];

  return (
    <section id="business-cleaning" className="py-20 bg-gradient-to-b from-secondary/5 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
            <Building2 className="w-3 h-3 mr-1" />
            사업장 클리닝
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            성공적인 비즈니스를 위한 <span className="text-secondary">첫걸음</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            깨끗하고 쾌적한 업무 환경이 생산성을 높입니다.
            케어빌의 체계적인 관리로 비즈니스에만 집중하세요.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-secondary/50">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-500 mb-4`}>
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                      <service.icon className={`h-8 w-8 ${service.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-secondary hover:bg-secondary/90">
                    서비스 신청하기
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-secondary to-secondary/80 text-white border-0">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  기업 맞춤 견적을 받아보세요!
                </h3>
                <div className="space-y-3 mb-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <benefit.icon className="w-5 h-5 text-white/70" />
                      <span className="text-white/90">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-3xl font-bold mb-2">1600-9762</p>
                <p className="text-white/70 mb-4">규모와 업종에 맞는 최적의 솔루션</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-end">
                  <Button
                    size="lg"
                    className="bg-white text-secondary hover:bg-white/90"
                    onClick={() => handlePhoneCall("1600-9762")}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    전화 상담
                  </Button>
                  <Button size="lg" className="bg-white text-secondary hover:bg-white/90">
                    무료 견적 받기
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

export default BusinessCleaningSection;
