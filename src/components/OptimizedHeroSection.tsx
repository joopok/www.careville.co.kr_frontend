import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Phone, MessageCircle, ArrowDown, Sparkles, Check, Award, Shield, Clock } from "lucide-react";
import { useEffect, useState, useCallback, memo } from "react";
import { handlePhoneCall } from "@/lib/utils";

// Memoized slideshow component
const SlideshowBanner = memo(() => {
  const images = [
    "images/banner1.png",
    "images/banner2.png",
    "images/banner3.png",
    "images/banner4.png",
    "images/banner5.png"
  ];

  const [currIndex, setCurrIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Preload images
  useEffect(() => {
    const preloadImages = () => {
      images.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };
    preloadImages();
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let isPaused = false;

    const startInterval = () => {
      interval = setInterval(() => {
        setCurrIndex((prev) => (prev + 1) % images.length);
      }, 7000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        isPaused = true;
      } else if (isPaused) {
        startInterval();
        isPaused = false;
      }
    };

    startInterval();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleIndicatorClick = useCallback((index: number) => {
    if (!isTransitioning && index !== currIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrIndex(index);
        setIsTransitioning(false);
      }, 50);
    }
  }, [currIndex, isTransitioning]);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        {images.map((src, index) => {
          const isActive = index === currIndex;
          
          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity ${
                isActive ? 'opacity-100 z-20' : 'opacity-0 z-10'
              }`}
              style={{
                transitionDuration: '1500ms',
                transitionTimingFunction: 'ease-in-out',
              }}
            >
              <img
                src={src}
                alt={`Banner ${index + 1}`}
                className={`w-full h-full object-cover ${
                  isActive ? 'animate-smoothKenBurns' : ''
                }`}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40 pointer-events-none" />
            </div>
          );
        })}
      </div>
      
      <div className="absolute bottom-64 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
        {images.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => handleIndicatorClick(index)}
            className="relative group"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`w-12 h-1 rounded-full transition-all duration-700 ${
                index === currIndex 
                  ? "bg-white" 
                  : "bg-white/30 hover:bg-white/50"
              }`}
            >
              {index === currIndex && (
                <div className="h-full bg-white/80 rounded-full animate-slideProgress" />
              )}
            </div>
          </button>
        ))}
      </div>
    </>
  );
});

SlideshowBanner.displayName = 'SlideshowBanner';

// Memoized feature item
const FeatureItem = memo(({ icon: Icon, title, description }: {
  icon: typeof Award;
  title: string;
  description: string;
}) => (
  <Card className="p-4 backdrop-blur-sm bg-white/90 hover:bg-white/95 transition-all duration-300 group cursor-default">
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  </Card>
));

FeatureItem.displayName = 'FeatureItem';

const OptimizedHeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    { icon: Award, title: "15년 전문성", description: "2009년부터 축적된 전문 노하우" },
    { icon: Shield, title: "신뢰할 수 있는 파트너", description: "체계적인 교육과 엄격한 품질 관리" },
    { icon: Clock, title: "24시간 케어 시스템", description: "언제든 신속한 상담과 서비스 제공" }
  ];

  const handleQuickInquiry = useCallback(() => {
    const element = document.getElementById('quick-inquiry');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden z-1">
      <SlideshowBanner />
      
      <div className="flex-1 flex items-center -mt-[390px]">
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center text-white space-y-8 max-w-4xl mx-auto">
            <div className={`space-y-6 transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <p className="text-lg md:text-xl font-medium opacity-90">
                당신의 소중한 공간, 전문가에게 맡기세요
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                깨끗함의 새로운 기준 <span className="text-white drop-shadow-2xl">케어빌</span>
              </h1>
            </div>
            
            <div className={`flex justify-center mt-2.5 transition-all duration-1000 delay-300 transform ${
              isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
              <Badge className="glass text-white border-white/30 px-8 py-3 text-lg font-semibold flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
                <Sparkles className="h-5 w-5" />
                프리미엄 청소 서비스
              </Badge>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mt-14 transition-all duration-1000 delay-500 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <Button 
                size="lg" 
                className="group bg-white text-primary hover:bg-white/90 text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                onClick={() => handlePhoneCall("1600-9762")}
              >
                <Phone className="mr-2 h-5 w-5" />
                바로 상담받기
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="glass text-white border-white/30 hover:bg-white/20 text-lg px-10 py-7 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105"
                onClick={handleQuickInquiry}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                온라인 문의
              </Button>
            </div>

            <div className="mt-16">
              <ArrowDown className="h-6 w-6 text-white/60 mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[0px] left-0 right-0 z-20">
        <div className="bg-gradient-to-t from-white via-white/95 to-white/0 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <FeatureItem key={feature.title} {...feature} />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>손해보험 가입</span>
              </div>
              <span className="mx-2 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>100% 친환경 세제</span>
              </div>
              <span className="mx-2 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>책임보험 가입</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-3 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-gray-200">
        {[
          { text: ["TALK", "카톡"], bgColor: "bg-yellow-400 hover:bg-yellow-500", textColor: "text-black" },
          { text: ["전화"], icon: Phone, bgColor: "bg-gradient-to-br from-primary to-secondary hover:from-primary-dark hover:to-secondary", textColor: "text-white", onClick: () => handlePhoneCall("1600-9762") },
          { text: ["blog", "후기"], bgColor: "bg-green-500 hover:bg-green-600", textColor: "text-white" },
          { text: ["상담"], icon: MessageCircle, bgColor: "bg-pink-500 hover:bg-pink-600", textColor: "text-white" }
        ].map((btn, idx) => (
          <Button 
            key={idx}
            className={`group w-14 h-14 rounded-full ${btn.bgColor} ${btn.textColor} shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 flex-shrink-0`}
            onClick={btn.onClick}
          >
            <div className="text-center">
              {btn.icon ? (
                <>
                  <btn.icon className="h-4 w-4 mx-auto mb-0.5" />
                  <div className="text-[10px]">{btn.text[0]}</div>
                </>
              ) : (
                btn.text.map((t, i) => (
                  <div key={i} className={i === 0 ? "text-xs font-bold" : "text-[10px]"}>{t}</div>
                ))
              )}
            </div>
          </Button>
        ))}
      </div>
    </section>
  );
};

export default OptimizedHeroSection;