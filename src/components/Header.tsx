import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useState, useEffect, useCallback, memo } from "react";
import Logo from "@/components/Logo";
import { useConfig, defaultConfig } from "@/contexts/ConfigContext";
import { useScrollToElement } from "@/hooks/useScrollToElement";

// 메뉴 아이템 상수 - 컴포넌트 외부로 이동하여 재생성 방지
const MENU_ITEMS = [
  { name: "홈클리닝", href: "#home-cleaning" },
  { name: "사업장케어", href: "#business-cleaning" },
  { name: "작업후기", href: "#reviews" },
  { name: "시공사례", href: "#portfolio" },
  { name: "CS센터", href: "#contact" },
  { name: "FAQ", href: "#notice" }
] as const;

const Header = () => {
  const { getConfig } = useConfig();
  const { scrollToHref, scrollToTop } = useScrollToElement();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // API에서 로드된 설정값 사용 (없으면 기본값)
  const phoneNumber = getConfig('PHONE', defaultConfig.PHONE);

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

  // 모바일 메뉴 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogoClick = useCallback(() => {
    scrollToTop();
  }, [scrollToTop]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-background/95 backdrop-blur-xl shadow-sm border-b border-border/50'
        : 'bg-gradient-to-b from-foreground/45 via-foreground/15 to-transparent backdrop-blur-sm'
    } ${
      isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`relative flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-16 sm:h-20' : 'h-18 sm:h-24'
        }`}>

          {/* Logo */}
          <button
            type="button"
            className="cursor-pointer z-10 transition-all duration-300 bg-transparent border-none p-0"
            onClick={handleLogoClick}
            aria-label="홈으로 이동"
          >
            <Logo
              variant="full"
              size="sm"
              darkBg={!isScrolled}
            />
          </button>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
            role="navigation"
            aria-label="메인 메뉴"
          >
            <div className={`flex items-center gap-0.5 xl:gap-1 rounded-full px-2 xl:px-3 py-2 transition-all duration-300 ${
              isScrolled ? 'bg-muted/50' : 'bg-white/10 backdrop-blur-sm'
            }`}>
              {MENU_ITEMS.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scrollToHref(item.href);
                  }}
                  aria-label={`${item.name} 섹션으로 이동`}
                  className={`relative px-2.5 xl:px-4 py-2 text-sm xl:text-[17px] font-bold whitespace-nowrap transition-colors duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    isScrolled
                      ? 'text-foreground hover:text-primary hover:bg-primary/5'
                      : 'text-white hover:text-white hover:bg-white/10'
                  }`}
                  style={{
                    opacity: 1,
                    pointerEvents: 'auto',
                    zIndex: 100
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </nav>

          {/* Right Side - CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Phone - Tablet & Desktop */}
            <a
              href={`tel:${phoneNumber}`}
              aria-label={`전화 상담 ${phoneNumber}`}
              className={`hidden sm:flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                isScrolled
                  ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20'
                  : 'bg-white text-primary hover:bg-white/90 shadow-lg'
              }`}
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              <span>{phoneNumber}</span>
            </a>

            {/* Phone - Mobile Icon */}
            <a
              href={`tel:${phoneNumber}`}
              aria-label={`전화 상담 ${phoneNumber}`}
              className={`sm:hidden flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                isScrolled ? 'bg-primary text-white' : 'bg-white text-primary'
              }`}
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
            </a>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                isScrolled ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/10'
              }`}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Full Screen */}
        <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ease-out ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              isMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Panel */}
          <nav
            className={`absolute top-16 sm:top-20 left-4 right-4 max-h-[calc(100vh-5rem)] overflow-y-auto transition-all duration-500 ease-out ${
              isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
            role="navigation"
            aria-label="모바일 메뉴"
          >
            <div className="py-4 space-y-1 bg-card/98 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl">
              {MENU_ITEMS.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    setTimeout(() => {
                      scrollToHref(item.href);
                    }, 150);
                  }}
                  aria-label={`${item.name} 섹션으로 이동`}
                  className="block w-full text-left text-foreground hover:text-primary hover:bg-primary/5 transition-colors duration-300 text-base sm:text-lg font-bold px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                  style={{
                    opacity: 1,
                    pointerEvents: 'auto'
                  }}
                >
                  {item.name}
                </button>
              ))}

              {/* Mobile Phone CTA */}
              <div className="px-4 pt-4 border-t border-border/50 mt-2">
                <a
                  href={`tel:${phoneNumber}`}
                  aria-label={`전화 상담 ${phoneNumber}`}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3.5 sm:py-4 bg-primary text-white rounded-xl font-bold text-base sm:text-lg hover:bg-primary-dark transition-colors active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  <span>전화 상담하기</span>
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
