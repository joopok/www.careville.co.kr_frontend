// src/config/site.ts
// 사이트 전체 설정 중앙화 파일

export const siteConfig = {
  // ========== 기본 정보 ==========
  name: "케어빌",
  nameEn: "CareVille",
  url: "https://www.careville.co.kr",
  logoUrl: "https://www.careville.co.kr/logo.png",
  description: "에어컨 청소, 입주 청소, 매트리스 케어 등 전문적인 홈케어 서비스",

  // ========== 사업자 정보 ==========
  company: {
    name: "주식회사 케이빌",
    ceo: "이경숙",
    businessNumber: "276-87-03677",
    businessType: ["서비스", "건설업", "도소매"],
  },

  // ========== 연락처 ==========
  contact: {
    phone: "1600-9762",
    email: "seung0910@naver.com",
    emailOfficial: "info@careville.co.kr", // SEO용
  },

  // ========== 주소 ==========
  address: {
    headquarters: {
      label: "본사",
      line1: "경기 고양시 일산동구 정발산로 31-10",
      line2: "806호(장항동, 파크프라자)",
      full: "경기 고양시 일산동구 정발산로 31-10, 806호(장항동, 파크프라자)",
    },
    branches: [
      {
        label: "서울지사",
        line1: "경기 고양시 으뜸로8",
        line2: "504호(덕은아이에스비즈타워센트럴 1차)",
        full: "경기 고양시 으뜸로8, 504호(덕은아이에스비즈타워센트럴 1차)",
      },
    ],
  },

  // ========== 고객센터 ==========
  customerService: {
    title: "고객센터",
    phoneDescription: "24시간 상담 가능",
    hours: {
      weekday: "평일 09:00 - 18:00",
      weekend: "주말 09:00 - 15:00",
      emergency: "연중무휴(긴급 24시간)",
    },
    emailDescription: "이메일 문의",
  },

  // ========== SEO/구조화 데이터 ==========
  seo: {
    geo: {
      latitude: 37.5172,
      longitude: 127.0473,
      addressLocality: "강남구",
      addressRegion: "서울특별시",
      addressCountry: "KR",
      serviceRadius: 50000, // meters
    },
    rating: {
      value: "4.8",
      reviewCount: "250",
    },
    priceRange: "₩₩",
    openingHours: {
      opens: "00:00",
      closes: "23:59",
    },
  },

  // ========== 소셜/링크 (추후 확장) ==========
  social: {
    kakao: "",
    instagram: "",
    blog: "",
    youtube: "",
  },

  // ========== 저작권 ==========
  copyright: {
    year: new Date().getFullYear(),
    text: "본 사이트의 모든 콘텐츠는 저작권법의 보호를 받습니다.",
  },
} as const;

// ========== 유틸리티 함수 ==========
export const getTelLink = (phone?: string) => `tel:${phone || siteConfig.contact.phone}`;
export const getMailLink = (email?: string) => `mailto:${email || siteConfig.contact.email}`;

export type SiteConfig = typeof siteConfig;
