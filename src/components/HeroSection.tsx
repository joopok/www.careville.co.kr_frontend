import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Phone, MessageCircle, ArrowDown, Sparkles, Check, Award, Shield, Clock } from "lucide-react";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // AboutSection features
  const features = [
    {
      icon: Award,
      title: "15년 전문성",
      description: "2009년부터 축적된 전문 노하우"
    },
    {
      icon: Shield,
      title: "신뢰할 수 있는 파트너",
      description: "체계적인 교육과 엄격한 품질 관리"
    },
    {
      icon: Clock,
      title: "24시간 케어 시스템",
      description: "언제든 신속한 상담과 서비스 제공"
    }
  ];

  // Slideshow Banner 컴포넌트
  const SlideshowBanner = () => {
    const images = [
      "images/banner1.png",
      "images/banner2.png",
      "images/banner3.png",
      "images/banner4.png",
      "images/banner5.png"
    ];

    const [currIndex, setCurrIndex] = useState(0);  // 현재 보여주는 배너 index

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
      return () => {
        clearInterval(interval);
      };
    }, [images.length]);

    return (
      <>
        <div>
          {
            images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Banner ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))
          }
        </div>
        <div className="absolute bottom-64 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setCurrIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 ease-in-out ${
                index === currIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden z-1">
      {/* Slideshow Banner */}
      <SlideshowBanner />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Hero Content */}
      <div className="flex-1 flex items-center -mt-[390px]">
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center text-white space-y-8 max-w-4xl mx-auto">
            <div className={`space-y-6 transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <p className="text-lg md:text-xl font-medium opacity-90 animate-slideInLeft">
                당신의 소중한 공간, 전문가에게 맡기세요
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fadeIn">
                깨끗함의 새로운 기준 <span className="text-white drop-shadow-2xl">케어빌</span>
              </h1>
            </div>
            
            {/* Premium Badge */}
            <div className={`flex justify-center mt-2.5 transition-all duration-1000 delay-300 transform ${
              isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
              <Badge className="glass text-white border-white/30 px-8 py-3 text-lg font-semibold flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
                <Sparkles className="h-5 w-5 animate-pulse" />
                프리미엄 청소업체 케어빌
              </Badge>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mt-14 transition-all duration-1000 delay-500 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <Button 
                size="lg" 
                className="group bg-white text-primary hover:bg-white/90 text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                <Phone className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                바로 상담받기
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="glass text-white border-white/30 hover:bg-white/20 text-lg px-10 py-7 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                온라인 문의
              </Button>
            </div>

            {/* Scroll Indicator */}
            <div className="mt-16 animate-bounce">
              <ArrowDown className="h-6 w-6 text-white/60 mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* AboutSection as Overlay at Bottom */}
      <div className="absolute bottom-[0px] left-0 right-0 z-20">
        <div className="bg-gradient-to-t from-white via-white/95 to-white/0 backdrop-blur-sm">
          <div className="container mx-auto px-6 pb-12 pt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gradient">
                프리미엄 라이프케어 파트너, ㈜케어빌
              </h2>
              <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                15년의 노하우와 최첨단 기술력으로 고객님의 일상에 완벽한 청결함을 선사합니다
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/95 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <feature.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h4 className="text-base font-semibold mb-1">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>ISO 인증 획득</span>
                <span className="mx-2">•</span>
                <Check className="h-4 w-4 text-primary" />
                <span>100% 친환경 세제</span>
                <span className="mx-2">•</span>
                <Check className="h-4 w-4 text-primary" />
                <span>책임보험 가입</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Contact Buttons - Horizontal Layout */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-2xl border border-gray-200">
        <Button className="group w-14 h-14 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 flex-shrink-0">
          <div className="text-center">
            <div className="text-xs font-bold">TALK</div>
            <div className="text-[10px]">카톡</div>
          </div>
        </Button>
        <Button className="group w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary hover:from-primary-dark hover:to-secondary text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 flex-shrink-0">
          <div className="text-center">
            <Phone className="h-4 w-4 mx-auto mb-0.5 group-hover:animate-pulse" />
            <div className="text-[10px]">전화</div>
          </div>
        </Button>
        <Button className="group w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 flex-shrink-0">
          <div className="text-center">
            <div className="text-xs font-bold">blog</div>
            <div className="text-[10px]">후기</div>
          </div>
        </Button>
        <Button className="group w-14 h-14 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 flex-shrink-0">
          <div className="text-center">
            <MessageCircle className="h-4 w-4 mx-auto mb-0.5 group-hover:animate-pulse" />
            <div className="text-[10px]">상담</div>
          </div>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;