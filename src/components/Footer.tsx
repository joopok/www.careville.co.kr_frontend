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
  ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { siteConfig, getTelLink, getMailLink } from "@/config/site";
import { useConfig, defaultConfig } from "@/contexts/ConfigContext";

const Footer = () => {
  const { getConfig } = useConfig();

  // API에서 로드된 설정값 사용 (없으면 기본값)
  const phoneNumber = getConfig('PHONE', defaultConfig.PHONE);
  const email = getConfig('EMAIL', defaultConfig.EMAIL);
  const companyName = getConfig('COMPANY_NAME', defaultConfig.COMPANY_NAME);
  const ceoName = getConfig('CEO_NAME', defaultConfig.CEO_NAME);
  const businessNumber = getConfig('BIZ_NUMBER', defaultConfig.BUSINESS_NUMBER);
  const businessType = getConfig('BUSINESS_TYPE', defaultConfig.BUSINESS_TYPE);
  const address = getConfig('ADDRESS_HQ', defaultConfig.ADDRESS_HQ);
  const branchName = getConfig('BRANCH_NAME', defaultConfig.BRANCH_NAME);
  const branchAddress = getConfig('ADDRESS_BRANCH', defaultConfig.ADDRESS_BRANCH);

  // 고객센터 운영시간
  const phoneDescription = getConfig('PHONE_DESCRIPTION', defaultConfig.PHONE_DESCRIPTION);
  const emailDescription = getConfig('EMAIL_DESCRIPTION', defaultConfig.EMAIL_DESCRIPTION);
  const weekdayHours = getConfig('WEEKDAY_HOURS', defaultConfig.WEEKDAY_HOURS);
  const weekendHours = getConfig('WEEKEND_HOURS', defaultConfig.WEEKEND_HOURS);

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
            <Logo variant="full" size="md" darkBg={true} />

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
            <h4 className="font-bold text-white mb-6 text-lg">{siteConfig.customerService.title}</h4>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${phoneNumber}`} className="group flex items-start gap-3 text-white/70 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-white group-hover:text-primary transition-colors">{phoneNumber}</p>
                    <p className="text-sm text-white/50">{phoneDescription}</p>
                  </div>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="group flex items-start gap-3 text-white/70 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-white group-hover:text-primary transition-colors">{email}</p>
                    <p className="text-sm text-white/50">{emailDescription}</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-white">운영시간</p>
                  <p className="text-sm text-white/50">{weekdayHours}</p>
                  <p className="text-sm text-white/50">{weekendHours}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Company Details */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">사업자 정보</h4>
            <div className="space-y-3 text-sm text-white/60">
              <p><span className="text-white/80">상호명:</span> {companyName}</p>
              <p><span className="text-white/80">대표이사:</span> {ceoName}</p>
              <p><span className="text-white/80">사업자번호:</span> {businessNumber}</p>
              <p><span className="text-white/80">사업종류:</span> {businessType}</p>
              <p>
                <span className="text-white/80">본사:</span> {address}
              </p>
              <p className="pt-2">
                <span className="text-white/80">{branchName}:</span> {branchAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50 text-center md:text-left">
              Copyright © {siteConfig.copyright.year} {siteConfig.nameEn}. All rights reserved.
              {siteConfig.copyright.text}
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
