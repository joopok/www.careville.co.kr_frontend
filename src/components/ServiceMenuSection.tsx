import { useState } from "react";
import {
  Home,
  Building2,
  MessageSquare,
  Star,
  Users,
  Calendar,
  Award,
  Sparkles,
  ArrowRight,
  Leaf,
  Wind,
  Utensils
} from "lucide-react";

const serviceCategories = [
  {
    id: "home",
    title: "가전케어",
    subtitle: "Home Care",
    icon: Wind,
    description: "에어컨, 세탁기, 냉장고 등 가전제품 전문 청소",
    services: ["에어컨 분해 청소", "세탁기 클리닝", "냉장고 살균", "공기청정기 필터"],
    image: "images/banner1.png",
    color: "primary",
    popular: true
  },
  {
    id: "kitchen",
    title: "키친케어",
    subtitle: "Kitchen Care",
    icon: Utensils,
    description: "주방 후드, 가스렌지, 식기세척기 전문 청소",
    services: ["후드 청소", "가스렌지 분해 청소", "오븐 클리닝", "싱크대 살균"],
    image: "images/banner2.png",
    color: "secondary"
  },
  {
    id: "business",
    title: "사업장케어",
    subtitle: "Business Care",
    icon: Building2,
    description: "사무실, 상가, 병원 등 상업 공간 전문 청소",
    services: ["사무실 청소", "상가 청소", "병원 살균", "정기 관리"],
    image: "images/banner3.png",
    color: "accent"
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
  const [activeCategory, setActiveCategory] = useState("home");
  const activeService = serviceCategories.find(s => s.id === activeCategory);

  return (
    <section id="services" className="section-padding bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-organic opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-sm font-medium text-primary tracking-wider uppercase">
                Premium Services
              </span>
            </div>
          </div>

          <h2 className="text-headline mb-6">
            당신의 공간을 위한{" "}
            <span className="text-gradient">프리미엄 케어</span>
          </h2>

          <p className="text-body-lg text-muted-foreground">
            15년의 노하우와 최첨단 기술력으로 고객님의 일상에
            완벽한 청결함을 선사합니다
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Side - Category Selector */}
          <div className="lg:col-span-4 space-y-4">
            {serviceCategories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full group relative p-6 rounded-2xl text-left transition-all duration-500 ${
                  activeCategory === category.id
                    ? 'bg-primary text-white shadow-xl shadow-primary/20'
                    : 'bg-card hover:bg-card-hover border border-border/50 hover:border-primary/30'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Popular Badge */}
                {category.popular && activeCategory !== category.id && (
                  <div className="absolute -top-2 -right-2 px-3 py-1 bg-secondary text-white text-xs font-medium rounded-full">
                    인기
                  </div>
                )}

                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    activeCategory === category.id
                      ? 'bg-white/20'
                      : 'bg-primary/10'
                  }`}>
                    <category.icon className={`w-7 h-7 transition-colors duration-300 ${
                      activeCategory === category.id
                        ? 'text-white'
                        : 'text-primary'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                        activeCategory === category.id ? 'text-white' : 'text-foreground'
                      }`}>
                        {category.title}
                      </h3>
                      <span className={`text-xs font-medium tracking-wider transition-colors duration-300 ${
                        activeCategory === category.id ? 'text-white/60' : 'text-muted-foreground'
                      }`}>
                        {category.subtitle}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 transition-colors duration-300 ${
                      activeCategory === category.id ? 'text-white/80' : 'text-muted-foreground'
                    }`}>
                      {category.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className={`w-5 h-5 transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'text-white translate-x-0 opacity-100'
                      : 'text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                  }`} />
                </div>
              </button>
            ))}
          </div>

          {/* Right Side - Service Detail Card */}
          <div className="lg:col-span-8">
            <div className="relative h-full">
              {/* Background Image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                  style={{ backgroundImage: `url(${activeService?.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-foreground/30" />
              </div>

              {/* Content Overlay */}
              <div className="relative p-8 md:p-12 min-h-[500px] flex flex-col justify-end text-white">
                {/* Service Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeService?.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 transition-all duration-300 hover:bg-white/20"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {service}
                    </span>
                  ))}
                </div>

                {/* Title & Description */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-3xl md:text-4xl font-bold">
                    {activeService?.title}
                  </h3>
                  <p className="text-lg text-white/80 max-w-lg">
                    {activeService?.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#pricing"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-foreground font-medium rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105"
                  >
                    가격 확인하기
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="tel:1600-9762"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300"
                  >
                    상담 문의
                  </a>
                </div>

                {/* Decorative Element */}
                <div className="absolute top-8 right-8 w-20 h-20 border border-white/20 rounded-full" />
                <div className="absolute top-12 right-12 w-12 h-12 border border-white/10 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
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
