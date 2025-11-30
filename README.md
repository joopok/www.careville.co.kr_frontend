# 케어빌 (CareVille) - 프리미엄 홈케어 서비스

> 에어컨 청소, 입주 청소, 매트리스 케어 등 전문적인 홈케어 서비스를 제공하는 케어빌의 공식 웹사이트

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646cff)

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [개발 가이드](#-개발-가이드)
- [배포](#-배포)

## 🎯 프로젝트 소개

**케어빌(CareVille)**은 고객에게 최상의 홈케어 서비스를 제공하는 프리미엄 라이프케어 플랫폼입니다.

### 제공 서비스

- 🌡️ **에어컨 청소**: 전문 장비를 이용한 에어컨 내부 청소 및 살균
- 🏠 **입주 청소**: 이사 전후 전문 청소 서비스
- 🛏️ **매트리스 케어**: 매트리스 살균 및 케어
- 🧺 **세탁기 청소**: 세탁기 내부 청소 및 관리
- 🏢 **사업장 청소**: 상업 공간 청소 서비스
- ✨ **특수 청소**: 각종 특수 청소 서비스

## ✨ 주요 기능

### 사용자 경험

- ⚡ **빠른 로딩**: Vite 기반 최적화된 빌드 시스템
- 📱 **반응형 디자인**: 모든 디바이스에서 완벽한 사용자 경험
- 🎨 **모던한 UI/UX**: Radix UI와 Tailwind CSS 기반의 세련된 인터페이스
- 🔍 **SEO 최적화**: React Helmet을 통한 검색 엔진 최적화
- 💬 **실시간 상담**: 온라인 문의 및 상담 시스템

### 핵심 컴포넌트

- **HeroSection**: 메인 히어로 섹션 (CTA 버튼 포함)
- **ServiceMenuSection**: 서비스 메뉴 네비게이션
- **PricingSection**: 가격 안내 섹션
- **ReviewsSection**: 고객 리뷰 및 평점
- **PortfolioSection**: 서비스 포트폴리오
- **ContactSection**: 문의 및 연락처

## 🛠 기술 스택

### Core

- **React 18.3.1**: UI 라이브러리
- **TypeScript 5.8.3**: 타입 안전성
- **Vite 5.4.19**: 빌드 도구 및 개발 서버

### UI/UX

- **Tailwind CSS 3.4.17**: 유틸리티 우선 CSS 프레임워크
- **Radix UI**: 접근성을 갖춘 무헤드 UI 컴포넌트
- **Framer Motion 12.23.12**: 애니메이션 라이브러리
- **Lucide React**: 아이콘 세트
- **Swiper 11.2.10**: 터치 슬라이더

### Routing & State

- **React Router DOM 6.30.1**: 라우팅
- **TanStack Query 5.83.0**: 서버 상태 관리

### Form & Validation

- **React Hook Form 7.61.1**: 폼 관리
- **Zod 3.25.76**: 스키마 검증

### SEO & Meta

- **React Helmet Async 2.0.5**: 메타 태그 관리
- **Structured Data**: JSON-LD 기반 구조화된 데이터

### Additional Libraries

- **Date-fns 3.6.0**: 날짜 처리
- **Recharts 2.15.4**: 차트 및 데이터 시각화
- **Sonner 1.7.4**: 토스트 알림

### Development

- **ESLint**: 코드 린팅
- **Playwright**: E2E 테스팅
- **PostCSS**: CSS 후처리
- **Terser**: JavaScript 압축

## 🚀 시작하기

### 필수 요구사항

- **Node.js**: 18.x 이상
- **npm**: 9.x 이상

### 설치

```bash
# 저장소 클론
git clone https://github.com/KCS-PROJECT/www.careville.co.kr_frontend.git

# 프로젝트 디렉토리로 이동
cd www.careville.co.kr_frontend

# 의존성 설치
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.development` 및 `.env.production` 파일이 이미 설정되어 있습니다.

### 개발 서버 실행

```bash
# 개발 서버 시작 (http://localhost:3000)
npm run dev
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 개발 모드 빌드
npm run build:dev

# 빌드 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
www.careville.co.kr_frontend/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── ui/             # Radix UI 기반 컴포넌트
│   │   ├── HeroSection.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ServiceMenuSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── ReviewsSection.tsx
│   │   ├── PortfolioSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── SEO.tsx
│   │   └── ...
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── Index.tsx
│   │   ├── NotFound.tsx
│   │   └── ...
│   ├── hooks/              # 커스텀 훅
│   ├── lib/                # 유틸리티 및 라이브러리
│   ├── utils/              # 헬퍼 함수
│   ├── App.tsx            # 메인 앱 컴포넌트
│   ├── main.tsx           # 엔트리 포인트
│   └── index.css          # 글로벌 스타일
├── public/                 # 정적 파일
├── dist/                   # 빌드 결과물
├── index.html             # HTML 템플릿
├── vite.config.ts         # Vite 설정
├── tailwind.config.ts     # Tailwind CSS 설정
├── tsconfig.json          # TypeScript 설정
└── package.json           # 프로젝트 메타데이터

```

## 👨‍💻 개발 가이드

### 코드 품질

```bash
# ESLint 실행
npm run lint
```

### 스크립트

| 명령어              | 설명                       |
| ------------------- | -------------------------- |
| `npm run dev`       | 개발 서버 시작             |
| `npm run build`     | 프로덕션 빌드              |
| `npm run build:dev` | 개발 모드 빌드             |
| `npm run preview`   | 빌드된 앱 미리보기         |
| `npm run lint`      | ESLint 실행                |
| `npm run start`     | Node.js 서버 시작 (web.js) |

### 개발 규칙

1. **TypeScript 사용**: 모든 파일은 TypeScript로 작성
2. **컴포넌트 네이밍**: PascalCase 사용
3. **파일 구조**: 기능별로 컴포넌트 분리
4. **스타일링**: Tailwind CSS 유틸리티 클래스 사용
5. **상태 관리**: TanStack Query를 통한 서버 상태 관리
6. **폼 처리**: React Hook Form + Zod 검증

## 🌐 배포

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### Express 서버

프로젝트에는 정적 파일 서빙을 위한 Express 서버(`web.js`)가 포함되어 있습니다.

```bash
npm run start
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 기여

기여를 환영합니다! 이슈를 등록하거나 Pull Request를 보내주세요.

## 📞 문의

- **웹사이트**: [www.careville.co.kr](https://www.careville.co.kr)
- **이메일**: contact@careville.co.kr

---

**© 2024 CareVille. All rights reserved.**
