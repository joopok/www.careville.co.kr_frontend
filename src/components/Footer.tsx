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
      {/* Newsletter Section */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-2xl font-bold">최신 소식과 특별 할인을 받아보세요</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              케어빌의 새로운 서비스와 프로모션 정보를 가장 먼저 만나보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="lg" className="whitespace-nowrap">
                구독하기 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
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

          {/* Services */}
          <div>
            <h4 className="font-bold text-foreground mb-6 text-lg">서비스</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>입주/이사 청소</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>정기 청소</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>사무실 청소</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>에어컨 청소</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>특수 청소</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>소독 방역</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-foreground mb-6 text-lg">회사 소개</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>케어빌 소개</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>서비스 지역</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>파트너 모집</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>채용 정보</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>뉴스 & 공지</span>
                </a>
              </li>
            </ul>
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
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">서울특별시 강남구</p>
                  <p className="text-sm">테헤란로 123, 케어빌타워 5층</p>
                </div>
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
        </div>

        <Separator className="my-12" />

        {/* Bottom Footer */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground justify-center">
            <a href="#" className="hover:text-primary transition-colors">이용약관</a>
            <a href="#" className="hover:text-primary transition-colors font-semibold">개인정보처리방침</a>
            <a href="#" className="hover:text-primary transition-colors">위치기반서비스 이용약관</a>
            <a href="#" className="hover:text-primary transition-colors">사업자정보 확인</a>
            <a href="#" className="hover:text-primary transition-colors">제휴 문의</a>
            <a href="#" className="hover:text-primary transition-colors">고객센터</a>
          </div>

          {/* Company Details */}
          <div className="text-center text-xs text-muted-foreground space-y-2">
            <p>
              (주)케어빌 | 대표이사: 홍길동 | 사업자등록번호: 123-45-67890 | 통신판매업신고: 제2024-서울강남-1234호
            </p>
            <p>
              주소: 서울특별시 강남구 테헤란로 123, 케어빌타워 5층 | 개인정보관리책임자: 김철수 (privacy@careville.co.kr)
            </p>
            <p>
              호스팅 서비스: Amazon Web Services (AWS) | 구매안전서비스: 고객님은 안전거래를 위해 현금 등으로 결제 시 저희 쇼핑몰에서 가입한 구매안전서비스를 이용하실 수 있습니다.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} CareVille. All rights reserved. Made with ❤️ for clean and healthy spaces.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;