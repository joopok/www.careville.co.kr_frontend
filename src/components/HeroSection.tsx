import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle, ArrowDown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary animate-gradient" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center text-white space-y-8 max-w-4xl mx-auto">
          <div className={`space-y-6 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <p className="text-lg md:text-xl font-medium opacity-90 animate-slideInLeft">
              고민하지마세요 저선있으니까요
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fadeIn">
              청소는 <span className="text-white drop-shadow-2xl">온다클린</span>에서
            </h1>
          </div>
          
          {/* Premium Badge */}
          <div className={`flex justify-center transition-all duration-1000 delay-300 transform ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            <Badge className="glass text-white border-white/30 px-8 py-3 text-lg font-semibold flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
              <Sparkles className="h-5 w-5 animate-pulse" />
              국내 1위 프리미엄 청소업체 온다클린
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
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowDown className="h-6 w-6 text-white/60" />
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