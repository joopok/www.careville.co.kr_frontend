# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the CareVille (케어빌) frontend application - a premium home care service website built with React, TypeScript, Vite, and shadcn/ui. The site promotes cleaning services including air conditioner cleaning, move-in cleaning, mattress care, and other home maintenance services.

## Development Commands

### Core Commands
- `npm run dev` - Start development server on port 3000 with HMR
- `npm run build` - Production build with optimizations
- `npm run build:dev` - Development build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

### Environment Configuration

| 파일 | 환경 | API URL | 실행 명령어 |
|------|------|---------|-------------|
| `.env.localhost` | 로컬 | `http://localhost:8080` | `npm run dev:local` |
| `.env.development` | 개발 | `http://ksm1779.cafe24.com` | `npm run dev` |
| `.env.production` | 운영 | `http://ksm1779.cafe24.com` | `npm run build` |

**스크립트 설명**:
- `npm run dev` - 원격 개발 서버 연결 (기본)
- `npm run dev:local` - 로컬 백엔드 연결 (localhost:8080)
- `npm run dev:remote` - 원격 개발 서버 연결 (dev와 동일)
- `npm run build` - 운영 빌드
- `npm run build:dev` - 개발 빌드

**주의**: `dev:local` 사용 시 로컬 백엔드 서버(`localhost:8080`)가 실행 중이어야 합니다.

**사용법**: `import.meta.env.VITE_API_URL`

## Architecture & Key Patterns

### Performance-First Architecture
The application uses **OptimizedIndex** as the main entry point (not Index). This is critical:

- **Eager Loading**: Hero and ServiceMenu sections load immediately (above-the-fold content)
- **Lazy Loading**: All other sections use React.lazy() with Suspense boundaries
- **Code Splitting**: Vite config splits React, UI vendors, and utils into separate chunks
- **Performance Monitoring**: `measurePerformance()` tracks Web Vitals (LCP, FID, CLS) in development

### SEO & Meta Management
- `<SEO />` component handles all meta tags (Open Graph, Twitter Cards, canonical URLs)
- `<StructuredData />` provides JSON-LD for search engines
- `react-helmet-async` manages head elements
- Public files: `sitemap.xml`, `robots.txt` configured for production

### Component Organization
```
src/
├── components/
│   ├── ui/              # shadcn/ui components (Radix primitives)
│   ├── *Section.tsx     # Page sections (lazy loaded)
│   ├── Header.tsx       # Site header
│   ├── Footer.tsx       # Site footer
│   ├── SEO.tsx          # Meta tag management
│   └── StructuredData.tsx
├── pages/
│   ├── OptimizedIndex.tsx  # MAIN ENTRY (uses lazy loading)
│   ├── Index.tsx           # Legacy (not used)
│   └── NotFound.tsx
├── hooks/               # Custom React hooks
└── utils/
    └── performance.ts   # Performance utilities
```

### Routing & State
- React Router v6 for navigation
- TanStack Query for server state (5min stale time, 10min gc time)
- Lazy route loading with Suspense fallback
- All custom routes MUST be added above the catch-all `*` route

### UI Framework
- **shadcn/ui**: Unstyled Radix UI primitives with Tailwind styling
- **Framer Motion**: Animations and transitions
- **Lucide React**: Icon system
- Components are copy-paste friendly (in `src/components/ui/`)

### Build Optimizations
The Vite config includes aggressive optimizations:
- Terser minification with console removal in production
- Manual chunk splitting for vendors
- CSS code splitting enabled
- Asset hashing for cache busting
- Source maps only in development

### TypeScript Configuration
- `@/*` alias points to `src/*`
- Lenient type checking enabled (noImplicitAny: false, strictNullChecks: false)
- Multiple tsconfig references (app + node)

## Important Notes

### When Adding New Pages
1. Use lazy loading: `const NewPage = lazy(() => import("./pages/NewPage"))`
2. Wrap route in `<Suspense fallback={<PageLoader />}>`
3. Add route ABOVE the `*` catch-all route
4. Include `<SEO />` component with appropriate meta tags

### When Adding Sections
1. Export as lazy component if below-the-fold
2. Add to OptimizedIndex.tsx with `<Suspense fallback={<SectionLoader />}>`
3. Consider performance impact on LCP/FID

### Performance Considerations
- Keep above-the-fold bundle <500KB
- New dependencies should justify bundle size impact
- Use `debounce` and `throttle` from utils/performance.ts for event handlers
- Images should use lazy loading pattern

### Git Configuration
- User: `seung0910`
- Email: `seung0910@cafe24.com`
- Remote: `cafe24` pointing to `seung0910@seung0910.cafe24app.com:seung0910_seung0910`

## Cafe24 Node.js Hosting

### Hosting Information
- **App URL**: http://seung0910.cafe24app.com
- **Git Repository**: `seung0910@seung0910.cafe24app.com:seung0910_seung0910`
- **App PORT**: 8001
- **Entry Point**: `web.js` (required by Cafe24)

### Git Remote Configuration
```bash
# Two remotes required
origin  → GitHub (https://github.com/KCS-PROJECT/www.careville.co.kr_frontend.git)
cafe24  → Cafe24 Git Server (seung0910@seung0910.cafe24app.com:seung0910_seung0910)
```

### Deployment Workflow

**1. Build Production Assets**
```bash
npm run build
# Generates optimized files in dist/ folder
```

**2. Commit Changes**
```bash
git add .
git commit -m "Your commit message"
```

**3. Deploy to GitHub (Optional - for backup/collaboration)**
```bash
git push origin master
```

**4. Deploy to Cafe24**
```bash
git push cafe24 master
# Pushes code + dist folder to Cafe24 Git server
```

**5. Restart App (Required!)**
- Go to Cafe24 hosting management page
- Navigate: 나의 서비스 관리 → 호스팅 관리 → 기본 관리 → 앱 생성/관리
- Select `seung0910` app
- Click **"중지"** (Stop) → Wait → Click **"실행"** (Start)

### SSH Public Key Setup

**Required for Git push to work!**

1. Your SSH public key location: `~/.ssh/id_rsa.pub`
2. Register in Cafe24:
   - Login: https://hosting.cafe24.com/
   - Navigate: 좌측 메뉴 → **"Public Key 관리"**
   - Paste entire contents of `id_rsa.pub`
   - Save
3. Wait 5-10 minutes for system to propagate the key
4. Test: `ssh -T seung0910@seung0910.cafe24app.com`

### web.js Server Configuration

The `web.js` file is the entry point for Cafe24 Node.js hosting:
- Uses ES Module syntax (`import` instead of `require`)
- Serves static files from `dist/` folder using Express
- Supports React Router (SPA routing) with wildcard catch-all
- Enables Gzip compression for performance
- Listens on port 8001 as required by Cafe24

### Important Notes

1. **dist folder in Git**: Unlike typical React projects, the `dist/` folder MUST be committed to Git for Cafe24 deployment (it's uncommented in `.gitignore`)

2. **Dependencies**: Express and compression are in `dependencies` (not devDependencies) because they're needed in production

3. **No GitHub Integration**: Cafe24 doesn't support automatic deployment from GitHub. You must push directly to Cafe24's Git server.

4. **Environment Variables**: Set in Cafe24 hosting panel, not in code

5. **Logs**: Check app logs in Cafe24 management page for debugging errors

### Troubleshooting

**SSH Connection Timeout**
- Ensure Public Key is registered in Cafe24
- Wait 5-10 minutes after registration
- Test SSH connection: `ssh -T seung0910@seung0910.cafe24app.com`

**503 Service Unavailable**
- App crashed or not running
- Check logs in Cafe24 management page
- Restart the app manually

**ES Module Errors**
- Ensure `package.json` has `"type": "module"`
- Ensure `web.js` uses `import` syntax, not `require`

## Backend Server (서버)

**중요**: 서버, DB, 프로그램 수정 요청 시 아래 경로에 직접 접근하여 수정할 것

### Backend Project Path
```
/Users/doseunghyeon/developerApp/springDev/www.careville.co.kr_backend
```

### Backend Information
- **Framework**: Spring Boot (Java)
- **API Base URL**: http://ksm1779.cafe24.com
- **관련 키워드**: 서버, DB, 데이터베이스, API, 백엔드, 프로그램 수정

### When to Access Backend
- "서버 수정" 요청 시 → 백엔드 소스 직접 수정
- "DB 수정" 요청 시 → 백엔드 Entity/Repository 수정
- "프로그램 수정" 요청 시 → 백엔드 로직 수정
- "API 수정" 요청 시 → Controller/Service 수정

## Technology Stack

**Core**: React 18, TypeScript 5, Vite 5
**UI**: shadcn/ui, Radix UI, Tailwind CSS, Framer Motion
**State**: TanStack Query, React Hook Form
**Routing**: React Router v6
**Meta**: React Helmet Async
**Testing**: Playwright
