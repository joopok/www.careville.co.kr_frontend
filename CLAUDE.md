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
- `.env.development` - Development API: `http://localhost:8081`
- `.env.production` - Production API: `http://ksm1779.cafe24.com`

Access via `import.meta.env.VITE_API_URL`

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

## Technology Stack

**Core**: React 18, TypeScript 5, Vite 5
**UI**: shadcn/ui, Radix UI, Tailwind CSS, Framer Motion
**State**: TanStack Query, React Hook Form
**Routing**: React Router v6
**Meta**: React Helmet Async
**Testing**: Playwright
