import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Shield,
  Award,
  Users,
  Leaf,
  ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-foreground text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">케어빌</h2>
                <p className="text-xs text-white/50 tracking-wider uppercase">CareVille Cleaning Service</p>
              </div>
            </div>

            <p className="text-white/70 leading-relaxed max-w-md">
              케어빌은 전문적이고 신뢰할 수 있는 청소 서비스를 제공합니다.
              고객님의 건강하고 깨끗한 생활 공간을 위해 최선을 다하겠습니다.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-white/80">100% 안전 보장</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm">
                <Award className="w-4 h-4 text-secondary" />
                <span className="text-white/80">전문 인증업체</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm">
                <Users className="w-4 h-4 text-accent" />
                <span className="text-white/80">50,000+ 고객</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary hover:text-white text-white/70 transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white text-white/70 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-red-600 hover:text-white text-white/70 transition-all duration-300"
              >
                <Youtube className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#03C75A] hover:text-white text-white/70 transition-all duration-300"
              >
                <span className="font-bold text-sm">N</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#FEE500] hover:text-[#3C1E1E] text-white/70 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">고객센터</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:1600-9762" className="group flex items-start gap-3 text-white/70 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-white group-hover:text-primary transition-colors">1600-9762</p>
                    <p className="text-sm text-white/50">24시간 상담 가능</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@careville.co.kr" className="group flex items-start gap-3 text-white/70 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-white group-hover:text-primary transition-colors">info@careville.co.kr</p>
                    <p className="text-sm text-white/50">이메일 문의</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-white">운영시간</p>
                  <p className="text-sm text-white/50">평일 09:00 - 18:00</p>
                  <p className="text-sm text-white/50">주말 09:00 - 15:00</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Company Details */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">사업자 정보</h4>
            <div className="space-y-3 text-sm text-white/60">
              <p><span className="text-white/80">상호명:</span> 주식회사 케이빌</p>
              <p><span className="text-white/80">대표이사:</span> 이경숙</p>
              <p><span className="text-white/80">사업자번호:</span> 276-87-03677</p>
              <p><span className="text-white/80">사업종류:</span> 서비스, 건설업, 도소매</p>
              <p className="pt-2">
                <span className="text-white/80">본사:</span> 경기도 고양시 일산동구 정발산로 31-10, 806
              </p>
              <p>
                <span className="text-white/80">서울:</span> 서울 강서구 공항대로 426 VIP빌딩 9층
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50 text-center md:text-left">
              Copyright © {currentYear} CareVille. All rights reserved.
              본 사이트의 모든 콘텐츠는 저작권법의 보호를 받습니다.
            </p>

            {/* Scroll to Top Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToTop}
              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-primary text-white/70 hover:text-white transition-all duration-300"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
