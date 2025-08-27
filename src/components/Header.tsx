import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    // { name: "케어빌"      , href: "#about" }, // #about 섹션이 없어져서 주석 처리
    { name: "홈클리닝"    , href: "#home-cleaning" }, 
    { name: "사업장클리닝", href: "#business-cleaning" },
    { name: "특수청소"    , href: "#special-cleaning" },
    { name: "작업후기"    , href: "#reviews" },
    { name: "시공사례"    , href: "#portfolio" },
    { name: "질문"        , href: "#notice" },
    { name: "CS 센터"     , href: "#contact" },
    { name: "부가서비스"  , href: "#additional" }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-purple-100' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {/* <Sparkles className="h-6 w-6 text-primary animate-pulse" /> */}
            <div className="text-2xl font-bold text-gradient">케어빌</div>
            <div className={`text-xs transition-colors ${isScrolled ? 'text-muted-foreground' : 'text-white/80'}`}>carevile</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 absolute left-1/2 -translate-x-1/2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`font-medium text-sm transition-all duration-300 hover:text-primary hover:scale-105 ${
                  isScrolled ? 'text-foreground' : 'text-white hover:text-white/80'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center">
            {/* Phone Button */}
            {/* <Button className="hidden md:flex bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all duration-300 text-white px-6 rounded-full shadow-lg hover:shadow-xl ">
              <Phone className="mr-2 h-4 w-4" />
              1600-9762
            </Button> */}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden transition-colors ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-4 bg-white/95 backdrop-blur-lg rounded-lg mt-2 animate-fadeIn">
            {menuItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left text-foreground hover:text-primary transition-all duration-300 font-medium px-4 py-2 hover:bg-primary/10 rounded-lg"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;