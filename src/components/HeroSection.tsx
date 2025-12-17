import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, ArrowDown, Sparkles, Check, Award, Shield, Clock, Play } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { handlePhoneCall } from "@/lib/utils";

const SLIDESHOW_IMAGES = [
  "images/banner1.png",
  "images/banner2.png",
  "images/banner3.png",
  "images/banner4.png",
  "images/banner5.png"
];

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Award,
      title: "15년 전문성",
      description: "2009년부터 축적된 전문 노하우",
      stat: "15+"
    },
    {
      icon: Shield,
      title: "신뢰할 수 있는 파트너",
      description: "체계적인 교육과 엄격한 품질 관리",
      stat: "100%"
    },
    {
      icon: Clock,
      title: "24시간 케어 시스템",
      description: "언제든 신속한 상담과 서비스",
      stat: "24H"
    }
  ];

  const trustBadges = [
    "ISO 인증 획득",
    "100% 친환경 세제",
    "책임보험 가입"
  ];

  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Slideshow */}
      <SlideshowBackground />

      {/* Gradient Overlays for Depth - Enhanced for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/80 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/50 via-foreground/20 to-foreground/40 z-10" />

      {/* Decorative Elements - Static for CPU optimization */}
      <div
        className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full z-10"
        style={{
          filter: 'blur(48px)',
          transform: 'translateZ(0)',
          contain: 'strict',
        }}
      />
      <div
        className="absolute bottom-1/3 right-10 w-48 h-48 bg-secondary/10 rounded-full z-10"
        style={{
          filter: 'blur(48px)',
          transform: 'translateZ(0)',
          contain: 'strict',
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex items-center relative z-20 pt-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Column - Text Content */}
            <div className="text-white space-y-8">

              {/* Eyebrow */}
              <div className={`transition-all duration-1000 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/30 shadow-lg">
                  <Sparkles className="h-4 w-4 text-secondary drop-shadow-lg" />
                  <span className="text-sm font-semibold text-white drop-shadow-md">프리미엄 청소업체</span>
                </div>
              </div>

              {/* Main Headline */}
              <div className={`space-y-4 transition-all duration-1000 delay-200 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <h1
                  className="text-display text-white leading-tight"
                  style={{
                    textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  <span className="block">깨끗함의</span>
                  <span className="block">새로운 기준</span>
                  <span
                    className="block text-gradient-warm"
                    style={{
                      textShadow: '0 4px 16px rgba(0,0,0,0.4)',
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                    }}
                  >
                    케어빌
                  </span>
                </h1>
              </div>

              {/* Subheadline */}
              <p
                className={`text-lg md:text-xl text-white max-w-lg leading-relaxed transition-all duration-1000 delay-300 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{
                  textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                당신의 소중한 공간, 15년 전문성과 최첨단 기술력으로
                완벽한 청결함을 선사합니다
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-wrap gap-4 transition-all duration-1000 delay-500 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <Button
                  size="lg"
                  className="group h-14 bg-secondary hover:bg-secondary-dark text-white px-8 rounded-full shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 transition-all duration-300 hover:scale-105 font-semibold"
                  onClick={() => handlePhoneCall("1600-9762")}
                >
                  <Phone className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  바로 상담받기
                </Button>
                <Button
                  size="lg"
                  className="group h-14 bg-primary hover:bg-primary-dark text-white px-8 rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 font-semibold"
                  onClick={() => {
                    const element = document.getElementById('quick-inquiry');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  온라인 문의
                </Button>
              </div>

              {/* Trust Badges */}
              <div className={`flex flex-wrap items-center gap-4 pt-4 transition-all duration-1000 delay-700 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                {trustBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-white font-medium px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                  >
                    <Check className="h-4 w-4 text-accent drop-shadow-md" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Feature Cards */}
            <div className={`hidden lg:block transition-all duration-1000 delay-500 transform ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}>
              <div className="relative">
                {/* Floating Cards */}
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`relative p-6 rounded-2xl backdrop-blur-md border transition-all duration-500 cursor-pointer shadow-lg ${
                        activeFeature === index
                          ? 'bg-black/40 border-white/40 scale-105 shadow-2xl'
                          : 'bg-black/25 border-white/20 hover:bg-black/35'
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        transform: activeFeature === index ? 'translateX(20px)' : 'translateX(0)'
                      }}
                      onClick={() => setActiveFeature(index)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Stat Number */}
                        <div
                          className={`text-3xl font-bold transition-colors duration-300 ${
                            activeFeature === index ? 'text-secondary' : 'text-white/80'
                          }`}
                          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                        >
                          {feature.stat}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h4
                            className="text-lg font-semibold text-white mb-1"
                            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                          >
                            {feature.title}
                          </h4>
                          <p
                            className="text-sm text-white/80"
                            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                          >
                            {feature.description}
                          </p>
                        </div>

                        {/* Icon */}
                        <div className={`p-3 rounded-xl transition-colors duration-300 ${
                          activeFeature === index ? 'bg-secondary/30' : 'bg-white/10'
                        }`}>
                          <feature.icon className={`h-6 w-6 transition-colors duration-300 drop-shadow-md ${
                            activeFeature === index ? 'text-secondary' : 'text-white/70'
                          }`} />
                        </div>
                      </div>

                      {/* Active Indicator */}
                      {activeFeature === index && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-secondary rounded-full shadow-lg shadow-secondary/50" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Decorative Ring */}
                <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 border border-white/20 rounded-full" />
                <div className="absolute -z-10 -bottom-5 -left-5 w-24 h-24 border border-white/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Slide Indicators & Scroll */}
      <div className="relative z-20 pb-8">
        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-xs text-white/80 tracking-widest uppercase font-medium"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
          >
            Scroll
          </span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1 shadow-lg">
            <div className="w-1.5 h-3 bg-white rounded-full animate-bounce shadow-md" />
          </div>
        </div>
      </div>

      {/* Floating Contact Buttons */}
      <FloatingButtons />
    </section>
  );
};

// Slideshow Background Component - Optimized for smooth transitions and low CPU usage
const SlideshowBackground = () => {
  const [currIndex, setCurrIndex] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const intervalRef = useRef<number | null>(null);

  // Preload images on mount
  useEffect(() => {
    SLIDESHOW_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setCurrIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 7000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        setCurrIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
      } else {
        setCurrIndex((prev) => (prev - 1 + SLIDESHOW_IMAGES.length) % SLIDESHOW_IMAGES.length);
      }
    }
    touchStart.current = 0;
    touchEnd.current = 0;
  };

  return (
    <>
      <div
        className="absolute inset-0 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ contain: 'strict' }}
      >
        {/* Keep ALL images in DOM for smooth transitions - use opacity only */}
        {SLIDESHOW_IMAGES.map((src, index) => {
          const isActive = index === currIndex;

          return (
            <div
              key={index}
              className="absolute inset-0 w-full h-full"
              style={{
                opacity: isActive ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out',
                willChange: isActive ? 'opacity' : 'auto',
                transform: 'translateZ(0)', // GPU acceleration
                contain: 'layout style paint',
              }}
            >
              <img
                src={src}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
                style={{
                  // Subtle zoom effect only on active slide, GPU accelerated
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 7s ease-out',
                  willChange: isActive ? 'transform' : 'auto',
                }}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {SLIDESHOW_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrIndex(index)}
            className="group relative"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`h-1 rounded-full transition-all duration-500 ${
              index === currIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/30 group-hover:bg-white/50'
            }`}>
              {index === currIndex && (
                <div className="h-full bg-secondary rounded-full animate-slideProgress origin-left" />
              )}
            </div>
          </button>
        ))}
      </div>
    </>
  );
};

// Floating Contact Buttons
const FloatingButtons = () => {
  const scrollToQuickInquiry = () => {
    const element = document.getElementById('quick-inquiry');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return true;
    }
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    let attempts = 0;
    const retryInterval = setInterval(() => {
      attempts++;
      const el = document.getElementById('quick-inquiry');
      if (el || attempts >= 10) {
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clearInterval(retryInterval);
      }
    }, 200);
    return false;
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-3">
      {/* Main floating container */}
      <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-border/50">
        <div className="flex flex-col gap-2">
          {/* KakaoTalk */}
          <Button
            size="icon"
            className="w-12 h-12 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <span className="text-xs font-bold">TALK</span>
          </Button>

          {/* Phone */}
          <Button
            size="icon"
            className="w-12 h-12 rounded-xl bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 hover:shadow-xl transition-all duration-300 hover:scale-110"
            onClick={() => handlePhoneCall("1600-9762")}
          >
            <Phone className="h-5 w-5" />
          </Button>

          {/* Blog */}
          <Button
            size="icon"
            className="w-12 h-12 rounded-xl bg-[#03C75A] hover:bg-[#02B150] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            onClick={() => window.open('https://blog.naver.com/PostList.naver?blogId=on_totalcare&parentCategoryNo=1&skinType=&skinId=&from=menu&userSelectMenu=true', '_blank')}
          >
            <span className="text-xs font-bold">N</span>
          </Button>

          {/* Inquiry */}
          <Button
            size="icon"
            className="w-12 h-12 rounded-xl bg-secondary hover:bg-secondary-dark text-white shadow-lg shadow-secondary/30 hover:shadow-xl transition-all duration-300 hover:scale-110"
            onClick={scrollToQuickInquiry}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
