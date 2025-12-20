# Repository Guidelines

This repo is the CareVille frontend built with React, TypeScript, Vite, Tailwind, Radix UI, and Express for static serving. Use this guide to develop, test, and contribute consistently.

## Project Structure & Module Organization
- `src/` – app code
  - `components/` (UI, shadcn/Radix in `components/ui/`), `pages/`, `hooks/`, `lib/`, `utils/`
- `public/` – static assets
- `dist/` – build output (committed for Cafe24 deploy)
- Entry: `index.html`, `src/main.tsx`, `src/App.tsx`
- Alias: `@` → `src` (e.g., `import Button from "@/components/ui/button"`)

## Build, Test, and Development Commands
- `npm run dev` – Start Vite dev server (port 8001; proxy to API)
- `npm run build` – Production build to `dist/`
- `npm run build:dev` – Development-optimized build
- `npm run preview` – Serve built app locally
- `npm run lint` – Run ESLint using `eslint.config.js`
- E2E: `npx playwright test` (headless); `npx playwright test --ui` (debug)
- Unit (vim lib only): `npx vitest` in `src/lib/vim` if installed

## Coding Style & Naming Conventions
- TypeScript everywhere; React components in `.tsx`
- 2-space indent, double quotes, trailing semicolons
- Components: PascalCase (`ServiceCard.tsx`); hooks: `useX.ts`
- Tailwind utility classes for styling; keep classlists tidy
- Run `npm run lint` and fix warnings before pushing

## Testing Guidelines
- E2E: Playwright specs under `./` (add `tests/` if creating new). Use meaningful test ids.
- Unit: existing Vitest tests in `src/lib/vim/__tests__/*.test.ts`. Match `*.test.ts[x]` naming.
- Aim for meaningful coverage on new logic; prefer small, focused tests.

## Commit & Pull Request Guidelines
- Commits: short, imperative titles (optionally scoped). Examples: `feat: add booking form`, `fix(ui): correct modal focus trap`.
- PRs must include: purpose/summary, linked issue, screenshots/GIFs for UI, test plan, and risk/rollback notes.
- CI expectations: lint passes; builds locally; relevant tests updated/added.

## Security & Configuration Tips
- Do not commit secrets; `.env.development`/`.env.production` exist already. Access via `import.meta.env.*`.
- Cafe24 requires `dist/` to be committed and `web.js` (Express) as the entry.
- Vite proxy targets the API at `http://ksm1779.cafe24.com` (see `vite.config.ts`).

## Agent-Specific Instructions
- Respect file layout and the `@` alias; avoid needless refactors/renames.
- Update docs when adding routes/pages; keep `pages/*` lazy-loaded where applicable.
- For deploys, build before pushing if targeting Cafe24.
