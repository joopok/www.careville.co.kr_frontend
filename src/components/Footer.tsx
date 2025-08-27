import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Youtube,
  MessageCircle,
  ChevronRight,
  Shield,
  Award,
  Users,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-background to-card border-t">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">케어빌</h2>
                  <p className="text-xs text-muted-foreground">CareVille Cleaning Service</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                케어빌은 전문적이고 신뢰할 수 있는 청소 서비스를 제공합니다. 
                고객님의 건강하고 깨끗한 생활 공간을 위해 최선을 다하겠습니다.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="py-1.5 px-3">
                <Shield className="w-3 h-3 mr-1" />
                100% 안전 보장
              </Badge>
              <Badge variant="secondary" className="py-1.5 px-3">
                <Award className="w-3 h-3 mr-1" />
                전문 인증업체
              </Badge>
              <Badge variant="secondary" className="py-1.5 px-3">
                <Users className="w-3 h-3 mr-1" />
                50,000+ 고객
              </Badge>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all">
                <Youtube className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-[#03C75A] hover:text-white hover:border-[#03C75A] transition-all">
                <span className="font-bold text-xs">N</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-[#FEE500] hover:text-black hover:border-[#FEE500] transition-all">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-foreground mb-6 text-lg">고객센터</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:1577-8282" className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors group">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary">1577-8282</p>
                    <p className="text-sm">24시간 상담 가능</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@careville.co.kr" className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors group">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary">info@careville.co.kr</p>
                    <p className="text-sm">이메일 문의</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">운영시간</p>
                  <p className="text-sm">평일 09:00 - 18:00</p>
                  <p className="text-sm">주말 09:00 - 15:00</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Company Details */}
          <div>
            <h4 className="font-bold text-foreground mb-6 text-lg">사업자 정보</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex flex-col space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">상호명:</span>
                  <span>(주)케어빌</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">대표이사:</span>
                  <span>홍길동</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">사업자번호:</span>
                  <span>123-45-67890</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">통신판매업:</span>
                  <span>제2024-서울강남-1234호</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">주소:</span>
                  <span>서울특별시 강남구 테헤란로 123, 케어빌타워 5층</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">개인정보:</span>
                  <span>김철수 (privacy@careville.co.kr)</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Enhanced Bottom Footer */}
        <div className="mt-6">
          {/* Legal Links Bar */}
          <div className="border-t pt-4 pb-2">
              <p className="text-xs text-muted-foreground">
                Copyright &copy; {currentYear} CareVille. All rights reserved. 
                본 사이트의 모든 콘텐츠는 저작권법의 보호를 받으며, 무단 전재 및 복사를 금합니다.
              </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;