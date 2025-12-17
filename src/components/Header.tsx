import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Leaf } from "lucide-react";
import { useState, useEffect, useCallback, useMemo, memo } from "react";

// 메뉴 아이템 상수 - 컴포넌트 외부로 이동하여 재생성 방지
const MENU_ITEMS = [
  { name: "가전케어", href: "#home-cleaning" },
  { name: "키친케어", href: "#business-cleaning" },
  { name: "사업장케어", href: "#pricing" },
  { name: "가격정책", href: "#pricing" },
  { name: "작업후기", href: "#reviews" },
  { name: "시공사례", href: "#portfolio" },
  { name: "CS센터", href: "#contact" },
  { name: "FAQ", href: "#notice" }
] as const;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Trigger load animation
    const timer = setTimeout(() => setIsLoaded(true), 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // useCallback으로 함수 메모이제이션
  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  }, []);

  const handleLogoClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-background/95 backdrop-blur-xl shadow-sm border-b border-border/50'
        : 'bg-gradient-to-b from-foreground/60 via-foreground/30 to-transparent backdrop-blur-sm'
    } ${
      isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
    }`}>
      <div className="container mx-auto px-6">
        <div className={`relative flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-20' : 'h-24'
        }`}>

          {/* Logo */}
          <div
            className="flex items-center gap-3 group cursor-pointer"
            onClick={handleLogoClick}
          >
            {/* Logo Icon - Organic Shape */}
            <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isScrolled
                ? 'bg-primary'
                : 'bg-white/90'
            }`}>
              <Leaf className={`w-6 h-6 transition-colors duration-300 ${
                isScrolled ? 'text-white' : 'text-primary'
              }`} />
              {/* Decorative dot */}
              <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                isScrolled ? 'bg-secondary' : 'bg-secondary'
              }`} />
            </div>

            {/* Logo Text */}
            <div className="flex flex-col">
              <span className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
                isScrolled
                  ? 'text-foreground'
                  : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
              }`}>
                케어빌
              </span>
              <span className={`text-[11px] font-medium tracking-widest uppercase transition-colors duration-300 ${
                isScrolled
                  ? 'text-muted-foreground'
                  : 'text-white/70'
              }`}>
                CareVille
              </span>
            </div>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden xl:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className={`flex items-center gap-1 rounded-full px-3 py-2 transition-all duration-300 ${
              isScrolled ? 'bg-muted/50' : 'bg-white/10 backdrop-blur-sm'
            }`}>
              {MENU_ITEMS.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => scrollToSection(item.href)}
                  className={`relative px-4 py-2 text-[17px] font-bold whitespace-nowrap transition-all duration-300 rounded-full ${
                    isScrolled
                      ? 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  } ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                  style={{
                    transitionDelay: isLoaded ? `${50 + index * 30}ms` : '0ms'
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </nav>

          {/* Right Side - CTA */}
          <div className="flex items-center gap-3">
            {/* Phone CTA - Desktop */}
            <a
              href="tel:1600-9762"
              className={`hidden md:flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 ${
                isScrolled
                  ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20'
                  : 'bg-white text-primary hover:bg-white/90 shadow-lg'
              }`}
            >
              <Phone className="w-5 h-5" />
              <span>1600-9762</span>
            </a>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`xl:hidden w-12 h-12 transition-all duration-300 ${
                isScrolled
                  ? 'text-foreground hover:bg-muted'
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`xl:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-1 bg-card/95 backdrop-blur-xl rounded-2xl mt-2 border border-border/50 shadow-xl">
            {MENU_ITEMS.map((item, index) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 text-lg font-bold px-6 py-4 rounded-xl"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.name}
              </button>
            ))}

            {/* Mobile Phone CTA */}
            <div className="px-4 pt-4 border-t border-border/50 mt-2">
              <a
                href="tel:1600-9762"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>전화 상담하기</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
