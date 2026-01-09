import { useState, memo, useCallback } from "react";
import {
  Building2,
  Star,
  Users,
  Calendar,
  Award,
  ArrowRight,
  Leaf,
  Wind,
  Utensils
} from "lucide-react";
import { useConfig, defaultConfig } from "@/contexts/ConfigContext";

const serviceCategories = [
  {
    id: "home",
    title: "가전케어",
    subtitle: "Home Care",
    icon: Wind,
    description: "에어컨, 세탁기 등 전문 청소",
    services: ["에어컨 분해 세척", "세탁기 클리닝"],
    image: "images/banner1.png",
    color: "primary",
    popular: true
  },
  {
    id: "kitchen",
    title: "키친케어",
    subtitle: "Kitchen Care",
    icon: Utensils,
    description: "싱크대 상판 UV코팅, 크랙 보수, 실리콘 교체 등",
    services: ["싱크대 상판 UV코팅", "싱크대 상판 크랙 보수", "싱크대 상판 실리콘 교체"],
    image: "images/banner3.png",
    color: "accent"
  },
  {
    id: "business",
    title: "사업장케어",
    subtitle: "Business Care",
    icon: Building2,
    description: "시스템 에어컨 분해세척, 사무실 청소,\n상가/입주 청소 등.",
    services: ["시스템 에어컨 분해 세척", "사무실청소", "상가청소", "입주청소"],
    image: "images/banner2.png",
    color: "secondary"
  },
];

const features = [
  {
    icon: Star,
    title: "국내 최고",
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
  const { getConfig } = useConfig();
  const phoneNumber = getConfig('PHONE', defaultConfig.PHONE);

  const [activeCategory, setActiveCategory] = useState("home");
  const activeService = serviceCategories.find(s => s.id === activeCategory);

  return (
    <section id="services" className="section-padding bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-organic opacity-50" />
      <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12 lg:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-medium text-primary tracking-wider uppercase">
                Premium Services
              </span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            당신의 공간을 위한{" "}
            <span className="text-gradient">프리미엄 케어</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
            15년의 노하우와 최첨단 기술력으로 고객님의 일상에
            완벽한 청결함을 선사합니다
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Side - Category Selector */}
          <div className="lg:col-span-4">
            {/* Mobile: Horizontal Scroll / Desktop: Vertical Stack */}
            <div className="flex lg:flex-col gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory lg:snap-none scrollbar-hide">
              {serviceCategories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex-shrink-0 w-[260px] sm:w-[300px] lg:w-full group relative p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl text-left transition-all duration-500 snap-start ${activeCategory === category.id
                    ? 'bg-primary text-white shadow-xl shadow-primary/20'
                    : 'bg-card hover:bg-card-hover border border-border/50 hover:border-primary/30'
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Popular Badge */}
                  {category.popular && (
                    <div className="absolute -top-2 -right-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-secondary text-white text-[10px] sm:text-xs font-medium rounded-full">
                      인기
                    </div>
                  )}

                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center transition-colors duration-300 ${activeCategory === category.id
                      ? 'bg-white/20'
                      : 'bg-primary/10'
                      }`}>
                      <category.icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 transition-colors duration-300 ${activeCategory === category.id
                        ? 'text-white'
                        : 'text-primary'
                        }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                        <h3 className={`text-sm sm:text-base lg:text-lg font-semibold transition-colors duration-300 ${activeCategory === category.id ? 'text-white' : 'text-foreground'
                          }`}>
                          {category.title}
                        </h3>
                        <span className={`text-[10px] sm:text-xs font-medium tracking-wider transition-colors duration-300 ${activeCategory === category.id ? 'text-white/60' : 'text-muted-foreground'
                          }`}>
                          {category.subtitle}
                        </span>
                      </div>
                      <p className={`text-xs sm:text-sm mt-0.5 sm:mt-1 transition-colors duration-300 line-clamp-2 whitespace-pre-line ${activeCategory === category.id ? 'text-white/80' : 'text-muted-foreground'
                        }`}>
                        {category.description}
                      </p>
                    </div>

                    {/* Arrow - Hidden on mobile */}
                    <ArrowRight className={`hidden sm:block w-4 h-4 lg:w-5 lg:h-5 transition-all duration-300 flex-shrink-0 ${activeCategory === category.id
                      ? 'text-white translate-x-0 opacity-100'
                      : 'text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                      }`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Service Detail Card */}
          <div className="lg:col-span-8">
            <div className="relative h-full">
              {/* Background Image */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                  style={{ backgroundImage: `url(${activeService?.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-foreground/30" />
              </div>

              {/* Content Overlay */}
              <div className="relative p-5 sm:p-8 md:p-12 min-h-[350px] sm:min-h-[400px] lg:min-h-[500px] flex flex-col justify-end text-white">
                {/* Service Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {activeService?.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium border border-white/20 transition-all duration-300 hover:bg-white/20"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {service}
                    </span>
                  ))}
                </div>

                {/* Title & Description */}
                <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    {activeService?.title}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-lg whitespace-pre-line">
                    {activeService?.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      // 활성화된 탭에 따라 스크롤 대상 결정
                      const targetId = activeCategory === 'business' ? 'business-cleaning' : 'home-cleaning';
                      const headerOffset = 80;

                      const scrollToElement = () => {
                        const element = document.getElementById(targetId);
                        if (element) {
                          const elementRect = element.getBoundingClientRect();
                          const absoluteTop = elementRect.top + window.pageYOffset - headerOffset;
                          window.scrollTo({
                            top: Math.max(0, absoluteTop),
                            behavior: 'smooth'
                          });
                          return true;
                        }
                        return false;
                      };

                      if (scrollToElement()) return;

                      // lazy-loading 트리거를 위해 한 번만 페이지 끝으로 이동
                      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });

                      // 로드 완료 후 타겟으로 부드럽게 스크롤 (재시도 시 끝으로 이동 안함)
                      let attempts = 0;
                      const maxAttempts = 15;
                      const checkAndScroll = () => {
                        attempts++;
                        if (scrollToElement()) return;
                        if (attempts < maxAttempts) {
                          setTimeout(checkAndScroll, 100);
                        }
                      };

                      setTimeout(checkAndScroll, 300);
                    }}
                    className="inline-flex items-center justify-center sm:justify-start gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-foreground font-medium rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 text-sm sm:text-base cursor-pointer"
                  >
                    가격 확인하기
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href={`tel:${phoneNumber}`}
                    className="inline-flex items-center justify-center sm:justify-start gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
                  >
                    상담 문의
                  </a>
                </div>

                {/* Decorative Element - Hidden on mobile */}
                <div className="hidden sm:block absolute top-8 right-8 w-16 lg:w-20 h-16 lg:h-20 border border-white/20 rounded-full" />
                <div className="hidden sm:block absolute top-12 right-12 w-10 lg:w-12 h-10 lg:h-12 border border-white/10 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-10 sm:mt-16 lg:mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-foreground mb-0.5 sm:mb-1 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceMenuSection;
