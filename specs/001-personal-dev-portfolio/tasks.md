---
description: "Task list for Personal Developer Portfolio implementation (visual-first, phased with validation stop)"
---

# Tasks: Personal Developer Portfolio

**Input**: Design documents from `/specs/001-personal-dev-portfolio/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification. Following constitution principle III: "Strict TDD (tests before implementation) is not mandatory. Write tests that provide confidence in correctness—unit tests for logic, component tests for behavior, and E2E tests for critical user flows."

**Organization**: Tasks are grouped by implementation phase to enable visual validation at the designated stop point.

## Format: `[ID] [P?] [Phase] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Phase]**: Which implementation phase (1-5)
- Include exact file paths in descriptions

---

## Phase 1: Setup & Foundation Técnica (MOSTLY COMPLETE)

**Purpose**: Project initialization, basic structure, and core infrastructure

| Task | Description | Status |
|------|-------------|--------|
| T001 | Create project structure per implementation plan (src/, tests/, public/, .github/workflows/) | ✅ DONE |
| T002 | Initialize npm project with React 18+, TypeScript 5+, Vite 5+, styled-components, @types/styled-components | ✅ DONE |
| T003 | [P] Configure ESLint (strict), Prettier, and TypeScript strict mode (tsconfig.json) | ✅ DONE |
| T004 | [P] Configure Vite with styled-components, asset handling, @/ path alias, build output for GitHub Pages | ✅ DONE |
| T005 | [P] Setup GitHub Actions workflow (.github/workflows/ci.yml, deploy.yml) | ⬜ TODO |
| T006 | Create TypeScript type definitions (project.ts, contact.ts, site.ts, github.ts) | ✅ DONE |
| T007 | Create utility functions in `src/utils/helpers.ts` | ✅ DONE |
| T008 | Create CSS animation utilities in `src/utils/animations.ts` (keyframes for fadeInUp, staggerContainer, staggerItem) | ✅ DONE |
| T009 | Create `useReducedMotion` hook in `src/hooks/useReducedMotion.ts` | ✅ DONE |
| T010 | Create `useIntersectionObserver` hook in `src/hooks/useIntersectionObserver.ts` | ✅ DONE |
| T011 | Create GitHub fetch script in `src/data/fetch-github.ts` (build-time, native fetch) | ✅ DONE |
| T012 | [P] Create placeholder `src/data/projects.json` with sample data for development | ⬜ TODO |
| T013 | Create SiteConfig in `src/data/site-config.ts` | ✅ DONE |
| T014 | Create primitive UI components: Button, Icon, Badge, Card (each in own folder with 5-file structure) | ✅ DONE |
| T015 | Create common components: Section, Container, Grid, VisuallyHidden (each in own folder with 5-file structure) | ✅ DONE* |
| T016 | Create layout components: Header, Footer, Navigation, MobileMenu, SkipLink (each in own folder with 5-file structure) | ✅ DONE |
| T017 | [P] Configure Vitest, Playwright, Testing Library, axe-core | ✅ DONE |

**Note**: Section component needs `min-height: 100dvh` and vertical distribution variants (Phase 2)

---

## Phase 2: Sistema Visual y Tokens

**Purpose**: Define the complete visual language (tokens, globals, motion) before building sections

| Task | Description | Status |
|------|-------------|--------|
| T018 | Update `src/styles/tokens.css`: **Fluid typography with clamp()** (Apple-style scale: display, h1-h6, body, lead, small), **Color system** (base white/black/grays, accent colors as highlights), **Spacing system** (generous negative space scale), **Breakpoints** (mobile <768px, tablet 768-1023px, desktop ≥1024px), **Radii**, **Shadows**, **Transitions/motion tokens** | ✅ DONE |
| T019 | Verify `src/styles/globals.css` has all required tokens, base typography, focus styles, `@media (prefers-reduced-motion: reduce)` overrides, `html { scroll-behavior: smooth }` | ✅ MOSTLY DONE |
| T020 | Update `src/components/common/Section/`: **Add `min-height: 100dvh`**, vertical centering/distribution variants (top, center, bottom, space-between), distinct composition variants, composition prop | ✅ DONE |
| T021 | Verify `src/components/common/Container/` with max-width constraints and responsive padding | ✅ DONE |
| T022 | Verify `src/components/common/Grid/` with asymmetric layout capabilities for desktop | ✅ DONE |

---

## Phase 3: HOME Visual (Primera Etapa Visual)

**Purpose**: Build the complete HOME page with all main sections as independent visual "scenes" using `min-height: 100dvh`

| Task | Description | Status |
|------|-------------|--------|
| T023 | [P] Create **Hero** section in `src/components/sections/Hero/`: large Apple-style headlines (clamp()), value proposition, subtle entrance animation (fade + translate), distinct composition, CTA | ✅ DONE |
| T024 | [P] Create **About / Sobre mí** section in `src/components/sections/About/`: concise intro, distinct visual composition (not card grid), generous negative space, vertical content distribution | ✅ DONE |
| T025 | [P] Create **Projects / Proyectos** section in `src/components/sections/Projects/`: projects as visual protagonists, large images, asymmetric layouts on desktop, distinct from About composition | ✅ DONE |
| T026 | [P] Create **ProjectCard** in `src/components/sections/ProjectCard/`: visual-first card (image dominant), hover transitions (subtle scale/opacity), tech badges | ✅ DONE |
| T027 | [P] Create **Technologies / Tecnologías** section in `src/components/sections/Technologies/`: categorized, distinct composition (not card grid), visual hierarchy | ✅ DONE |
| T028 | [P] Create **TechnologyCard** in `src/components/sections/TechnologyCard/`: minimal, typography-focused | ✅ DONE |
| T029 | [P] Create **Contact / Contacto** section in `src/components/sections/Contact/`: distinct composition, centered/distributed vertically, functional links with icons | ✅ DONE |
| T030 | [P] Create **ContactMethod** in `src/components/sections/ContactMethod/` | ✅ DONE |
| T031 | [P] Refine **Header** in `src/components/layout/Header/`: sticky, backdrop blur, responsive (hamburger on mobile) | ⬜ TODO |
| T032 | [P] Refine **Footer** in `src/components/layout/Footer/`: minimal, consistent with visual language | ⬜ TODO |
| T033 | [P] Refine **Navigation** in `src/components/layout/Navigation/`: smooth scroll, active section indicator | ⬜ TODO |
| T034 | [P] Refine **MobileMenu** in `src/components/layout/MobileMenu/`: focus trap, ARIA, compact navigation | ⬜ TODO |
| T035 | [P] Refine **SkipLink** in `src/components/layout/SkipLink/` | ⬜ TODO |
| T036 | Create main **Index page** in `src/pages/Index.tsx`: compose all sections in order (Header → Hero → About → Projects → Technologies → Contact → Footer) | ✅ DONE |
| T037 | Update **App.tsx** with providers (reduced-motion context) and main layout | ✅ DONE |
| T038 | Verify **main.tsx** entry point with React 18 root | ✅ DONE |
| T039 | Apply scroll-triggered animations to all sections using `useIntersectionObserver` + animation utilities (fadeInUp, staggerContainer, staggerItem) | ⬜ TODO |
| T040 | Implement hover transitions for all interactive elements (cards, buttons, links) using CSS transform/opacity only | ⬜ TODO |
| T041 | Implement `prefers-reduced-motion` support: disable non-essential animations globally | ⬜ TODO |
| T042 | **Responsive implementation**: Explicit design for mobile (vertical, compact nav, adapted sizes), tablet (adapted grids/compositions), desktop (wide compositions, large headlines, large images, asymmetric layouts) — NOT just shrinking desktop | ⬜ TODO |
| T043 | Verify semantic heading hierarchy (h1 → h2 → h3) across all sections | ⬜ TODO |
| T044 | Verify no horizontal scrolling at any viewport width | ⬜ TODO |
| T045 | Verify touch targets ≥44×44px on mobile | ⬜ TODO |
| T046 | Verify all sections meet `min-height: 100dvh` and content is vertically centered/distributed | ⬜ TODO |

**Checkpoint**: **VISUAL VALIDATION STOP** — Run `npm run dev`, open in browser, manually review the complete HOME page. All 5 main sections must feel like distinct visual scenes with proper 100dvh behavior, typography, spacing, colors, composition, animations, and responsive behavior. **DO NOT PROCEED** to Phase 4 until visual approval is given.

---

## Phase 4: Validación Visual del HOME (PARADA OBLIGATORIA)

**Purpose**: Manual visual review in browser before continuing

| Task | Description | Status |
|------|-------------|--------|
| T047 | Run `npm run dev` and open `http://localhost:5173` | ⬜ BLOCKED |
| T048 | Verify **Hero**: Large headlines, clamp() fluid type, entrance animation, 100dvh minimum | ⬜ BLOCKED |
| T049 | Verify **About**: Distinct composition, negative space, vertical distribution | ⬜ BLOCKED |
| T050 | Verify **Projects**: Visual protagonists, large images, asymmetric desktop layout, distinct from About | ⬜ BLOCKED |
| T051 | Verify **Technologies**: Categorized, distinct composition, hierarchy | ⬜ BLOCKED |
| T052 | Verify **Contact**: Centered/distributed, functional links | ⬜ BLOCKED |
| T053 | Verify **Header/Footer**: Sticky, backdrop blur, mobile hamburger | ⬜ BLOCKED |
| T054 | Verify **Typography**: Apple-style scale, hierarchy, fluid sizes, discreet secondary text | ⬜ BLOCKED |
| T055 | Verify **Spacing**: Generous negative space, wide compositions, no dashboard feel | ⬜ BLOCKED |
| T056 | Verify **Colors**: Base white/black/grays, accents only as highlights | ⬜ BLOCKED |
| T057 | Verify **Animations**: Scroll-reveal (fade/translate/scale), hover transitions, reduced-motion respected | ⬜ BLOCKED |
| T058 | Verify **Responsive**: Mobile (vertical, compact), Tablet (adapted grids), Desktop (wide, asymmetric) | ⬜ BLOCKED |
| T059 | **DECISION**: Approve visual direction → Continue to Phase 5 | Request changes → Return to Phase 3 tasks |

---

## Phase 5: Post-Visual-Approval (Solo tras aprobación de FASE 4)

**Purpose**: Add functionality, real data, accessibility polish, testing, optimization, deployment

| Task | Description | Status |
|------|-------------|--------|
| T060 | Run `npm run fetch:github` to populate `projects.json` with real GitHub data | ⬜ BLOCKED |
| T061 | Create **ProjectDetail** component in `src/components/sections/ProjectDetail/` (inline view with screenshots, tech badges, links, focus management, Escape to close) | ⬜ BLOCKED |
| T062 | Add project detail state management to Projects section | ⬜ BLOCKED |
| T063 | Add SEO meta tags (title, description, Open Graph, Twitter cards) in index.html | ⬜ BLOCKED |
| T064 | Add favicon and manifest.json in public/ | ⬜ BLOCKED |
| T065 | Add robots.txt in public/ | ⬜ BLOCKED |
| T066 | Optimize images in public/images/ (WebP/AVIF, srcset, lazy loading) | ⬜ BLOCKED |
| T067 | Run Lighthouse audit and verify performance budgets (LCP <2.5s, FID <100ms, CLS <0.1, Performance ≥90, Accessibility ≥95) | ⬜ BLOCKED |
| T068 | Run axe-core accessibility scan and fix any critical/serious violations | ⬜ BLOCKED |
| T069 | Run Playwright E2E tests for all user stories (keyboard nav, responsive, reduced-motion, contact links) | ⬜ BLOCKED |
| T070 | Run Vitest unit tests for utility functions (helpers.ts, animations.ts) | ⬜ BLOCKED |
| T071 | Run component tests for critical components (ProjectCard, Navigation, MobileMenu, ContactMethod) | ⬜ BLOCKED |
| T072 | Configure GitHub Actions CI workflow (lint → typecheck → test → build) | ⬜ BLOCKED |
| T063 | Configure GitHub Actions deploy workflow (deploy to GitHub Pages on main branch) | ⬜ BLOCKED |
| T074 | Verify production build works and deploys successfully to GitHub Pages | ⬜ BLOCKED |
| T075 | Document quickstart commands in README.md | ⬜ BLOCKED |
| T076 | Responsive refinements based on real content | ⬜ BLOCKED |
| T077 | Final polish and micro-interactions | ⬜ BLOCKED |

---

## Phase Dependencies & Execution Order

```
PHASE 1: Setup & Foundation Técnica
    ↓ (mostly done)
PHASE 2: Sistema Visual y Tokens
    ↓ (must complete)
PHASE 3: HOME Visual (Primera Etapa Visual)
    ↓ (must complete + visual validation)
PHASE 4: VALIDACIÓN VISUAL DEL HOME  ← PARADA OBLIGATORIA AQUÍ
    ↓ (only after visual approval)
PHASE 5: Post-Visual-Approval
```

---

## Notes

- [P] tasks = different files, no dependencies — can run in parallel
- Every component in own folder with 5-file structure (`.tsx`, `.styles.ts`, `use*.ts`, `.test.tsx`, `index.ts`)
- Use `@/` imports for all internal modules — no `../../` relative paths
- styled-components via `*.styles.ts` — No CSS Modules, vanilla-extract, Tailwind, Framer Motion
- Build-time GitHub fetch → static JSON — no runtime loading/error/empty states needed
- **Visual validation is a hard gate** — Phase 4 does not auto-advance to Phase 5
- Design tokens drive everything — no magic numbers in component styles
- Each section = distinct visual scene — avoid repeating card grid pattern
- Typography, spacing, and composition are the product — not afterthoughts