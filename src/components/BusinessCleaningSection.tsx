import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Calendar, Briefcase, CheckCircle2, Clock, Phone, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { handlePhoneCall } from "@/lib/utils";

const BusinessCleaningSection = () => {
  // Primary Green Color Palette - Matching PricingSection "예약하기" button
  // Forest Green (#2D4A3E / HSL 160 35% 22%) - Trust, Nature, Cleanliness
  const services = [
    {
      icon: Briefcase,
      title: "사무실 청소",
      description: "쾌적한 업무 환경 조성을 위한 전문 청소",
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
    <section id="business-cleaning" className="py-20 bg-background relative overflow-hidden">
      {/* Background Decorations - Same style as PricingSection */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-muted/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">사업장 클리닝</span>
          </div>

          <h2 className="text-headline mb-6">
            성공적인 비즈니스를 위한{" "}
            <span className="text-gradient">전문 케어</span>
          </h2>

          <p className="text-body-lg text-muted-foreground">
            깨끗하고 쾌적한 업무 환경이 생산성을 높입니다.
            케어빌의 체계적인 관리로 비즈니스에만 집중하세요.
          </p>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group h-full bg-card hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-border/50 hover:border-primary/30 rounded-2xl overflow-hidden">
                {/* Top Accent Bar */}
                <div className="h-1 bg-primary" />

                <CardHeader className="pt-6">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>

                  <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button matching PricingSection "예약하기" style */}
                  <Button className="w-full mt-6 h-14 rounded-xl bg-primary text-white hover:bg-primary-dark font-medium text-base transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                    서비스 신청
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner - Primary Green Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-primary text-white border-0 rounded-3xl">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-accent rounded-full blur-3xl" />
            </div>

            <CardContent className="relative p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full mb-6">
                    <Sparkles className="w-4 h-4 text-white/80" />
                    <span className="text-sm text-white/90">기업 전용 서비스</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                    기업 맞춤 견적을<br />받아보세요
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                          <benefit.icon className="w-4 h-4 text-white/90" />
                        </div>
                        <span className="text-sm text-white/90">{benefit.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Content */}
                <div className="text-center md:text-right">
                  <p className="text-sm text-white/70 mb-2">기업 상담 전용</p>
                  <p className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">1600-9762</p>
                  <p className="text-white/70 mb-8">규모와 업종에 맞는 최적의 솔루션</p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-end">
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 rounded-xl h-12 px-6 font-semibold shadow-lg shadow-black/20"
                      onClick={() => handlePhoneCall("1600-9762")}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      전화 상담
                    </Button>
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 rounded-xl h-12 px-6 font-semibold shadow-lg shadow-black/20"
                    >
                      무료 견적 받기
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessCleaningSection;
