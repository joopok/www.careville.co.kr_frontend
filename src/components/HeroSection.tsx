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
      title: "15년 전통",
      description: "2009년부터 시작된 청소 전문 기업"
    },
    {
      icon: Shield,
      title: "믿을 수 있는 서비스",
      description: "철저한 직원 교육과 품질 관리"
    },
    {
      icon: Clock,
      title: "신속한 우리들의 대응",
      description: "24시간 내 방문 상담 가능"
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
    }, [images.length, currIndex]);

    return (
      <>
        <div>
          {
            images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Banner ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
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
              className={`w-3 h-3 rounded-full transition ${
                index === currIndex ? "bg-white" : "bg-white/50"
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
      <div className="flex-1 flex items-center -mt-[400px]">
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center text-white space-y-8 max-w-4xl mx-auto">
            <div className={`space-y-6 transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <p className="text-lg md:text-xl font-medium opacity-90 animate-slideInLeft">
                고민하지마세요 자신있으니까요
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fadeIn">
                청소는 <span className="text-white drop-shadow-2xl">케어빌</span>에서
              </h1>
            </div>
            
            {/* Premium Badge */}
            <div className={`flex justify-center transition-all duration-1000 delay-300 transform ${
              isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
              <Badge className="glass text-white border-white/30 px-8 py-3 text-lg font-semibold flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
                <Sparkles className="h-5 w-5 animate-pulse" />
                프리미엄 청소업체 케어빌
              </Badge>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mt-12 transition-all duration-1000 delay-500 transform ${
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
          <div className="container mx-auto px-6 pb-8 pt-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gradient">
                생활 공간을 돌보다, ㈜케어빌입니다.
              </h2>
              <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                케어빌은 고객님의 일상에 따뜻한 변화를 더하는 생활 공간 케어 전문기업입니다.
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
      
      {/* Floating Contact Buttons */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 space-y-3">
        <Button className="group w-16 h-16 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <div className="text-center">
            <div className="text-xs font-bold">TALK</div>
            <div className="text-xs">카톡문의</div>
          </div>
        </Button>
        <Button className="group w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary hover:from-primary-dark hover:to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <div className="text-center">
            <Phone className="h-5 w-5 mx-auto mb-1 group-hover:animate-pulse" />
            <div className="text-xs">전화하기</div>
          </div>
        </Button>
        <Button className="group w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <div className="text-center">
            <div className="text-xs font-bold">blog</div>
            <div className="text-xs">후기보기</div>
          </div>
        </Button>
        <Button className="group w-16 h-16 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <div className="text-center">
            <MessageCircle className="h-5 w-5 mx-auto mb-1 group-hover:animate-pulse" />
            <div className="text-xs">전화상담</div>
          </div>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;