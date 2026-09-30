# Implementation Plan: Personal Developer Portfolio

**Branch**: `001-personal-dev-portfolio` | **Date**: 2026-09-28 | **Spec**: specs/001-personal-dev-portfolio/spec.md

**Input**: Feature specification from `/specs/001-personal-dev-portfolio/spec.md`

## Summary

Create a static personal developer portfolio website for Ismael Marot that showcases his web development projects, skills, and contact information. The site fetches project data from GitHub repositories at build time, presents it with Apple-inspired design principles (simplicity, hierarchy, spacing, subtle motion), and deploys to GitHub Pages. Built with React 18+, TypeScript 5+, and Vite as a single-page application with smooth CSS-based animations, full accessibility (WCAG 2.1 AA), and responsive design.

**Key Visual Requirement**: Each main HOME section (Hero, About, Projects, Technologies, Contact) MUST occupy at minimum 100% of the viewport height (conceptually `min-height: 100dvh`), allowing content to grow beyond this minimum if needed. Sections must feel like independent visual "scenes" during scroll, with distinct compositions, generous negative space, and proper vertical centering/distribution. This behavior must be maintained across mobile, tablet, and desktop breakpoints.

## Technical Context

**Language/Version**: TypeScript 5+ with React 18+

**Primary Dependencies**: React 18+, Vite 5+, styled-components (component-level styles in `*.styles.ts`), native fetch() for GitHub API

**Storage**: Static JSON files for GitHub data (fetched at build), no runtime database

**Testing**: Vitest (unit), Playwright (E2E), Testing Library (component) — focused on critical logic, accessibility, and key user flows

**Target Platform**: Static web (GitHub Pages), modern evergreen browsers (last 2 versions)

**Project Type**: Web application (frontend only, static deployment)

**Performance Goals**: LCP <2.5s, FID <100ms, CLS <0.1, Lighthouse Performance ≥90, Accessibility ≥95, 60fps animations

**Constraints**: Static deployment only (no backend), GitHub API rate limits, respect prefers-reduced-motion, zero critical accessibility violations

**Scale/Scope**: 5 main sections (Hero, About, Projects, Technologies, Contact), ~10-20 projects displayed, single-page layout with smooth scroll navigation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | All features as reusable components with clear prop contracts |
| II. Type Safety | PASS | TypeScript strict mode, all contracts typed |
| III. Testing Strategy | PASS | Tests for important logic, critical components, accessibility, key flows |
| IV. Accessibility & Performance | PASS | WCAG 2.1 AA, performance budgets defined |
| V. Design Principles | PASS | Apple-inspired principles documented in spec |
| VI. Simplicity & Maintainability | PASS | Minimal dependencies, styled-components, native fetch, no animation library |
| Architecture & Code Organization | PASS | Component folder structure, @/ aliases, styled-components, no unnecessary abstractions |

All gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-dev-portfolio/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (NOT created by plan)
```

### Source Code (repository root)

```text
# Web application (frontend only, static deployment)
src/
├── components/
│   ├── common/          # Shared UI components (each in own folder)
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Section/
│   │   ├── Container/
│   │   ├── Grid/
│   │   └── VisuallyHidden/
│   ├── layout/          # Layout components (each in own folder)
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Navigation/
│   │   ├── MobileMenu/
│   │   └── SkipLink/
│   ├── sections/        # Page sections (each in own folder)
│   │   ├── Hero/
│   │   ├── About/
│   │   ├── Projects/
│   │   ├── ProjectCard/
│   │   ├── ProjectDetail/
│   │   ├── Technologies/
│   │   ├── TechnologyCard/
│   │   ├── Contact/
│   │   └── ContactMethod/
│   └── ui/              # Primitive UI components (each in own folder)
│       ├── Icon/
│       └── Badge/
├── data/
│   ├── fetch-github.ts  # GitHub API fetch logic (build-time, native fetch)
│   └── projects.json    # Cached/fetched project data
├── hooks/
│   ├── useReducedMotion.ts
│   └── useIntersectionObserver.ts
├── pages/
│   └── Index.tsx        # Main portfolio page
├── styles/
│   ├── globals.css      # Global styles, CSS variables, reset
│   └── tokens.css       # Design tokens (colors, spacing, typography, motion)
├── types/
│   ├── project.ts       # Project, Technology, Contact types
│   ├── contact.ts       # ContactMethod, ContactType
│   ├── site.ts          # SiteConfig, SEOConfig
│   └── github.ts        # GitHub API response types
├── utils/
│   ├── animations.ts    # CSS animation utilities (keyframes, variants)
│   └── helpers.ts       # General helpers
├── App.tsx
├── main.tsx
└── vite-env.d.ts

public/
├── images/              # Static assets (screenshots, favicon)
└── robots.txt

tests/
├── unit/                # Vitest unit tests (logic, utilities)
├── component/           # Testing Library component tests (critical components)
└── e2e/                 # Playwright E2E tests (key user flows, accessibility)

.github/
└── workflows/
    ├── ci.yml           # GitHub Actions for lint, typecheck, test, build
    └── deploy.yml       # GitHub Actions for build + deploy to Pages

package.json
tsconfig.json
vite.config.ts
```

**Structure Decision**: Single React + Vite project (frontend-only) with build-time GitHub data fetching. All source in `src/`, tests in `tests/`, static assets in `public/`. GitHub Actions workflow handles CI/CD to GitHub Pages.

**Component Architecture**: Every React component MUST have its own folder following the standard structure:
```
ComponentName/
├── ComponentName.tsx           # JSX/rendering only
├── ComponentName.styles.ts     # All component-specific styled-components definitions
├── useComponentName.ts         # Component-specific state, effects, handlers, and logic
├── ComponentName.test.tsx      # Component tests
└── index.ts                    # Public barrel export
```

**Path Aliases**: Internal project imports must use the `@/` path alias (e.g., `import { Header } from '@/components/Header'`). Avoid `../../` and `../../../` imports for internal modules.

**Styling**: styled-components with `*.styles.ts` files co-located in each component folder. No CSS Modules, vanilla-extract, Tailwind CSS, or other styling frameworks.

**Shared Styling**: Global design tokens and global styles may remain in `src/styles/`. Reusable visual primitives should use styled-components.

**Dependencies**: Use the simplest architecture compatible with the project. Do not introduce vanilla-extract or another styling solution. The existing simplified architecture, React, TypeScript, Vite, npm, GitHub Pages, build-time GitHub data, and testing strategy should remain unchanged.

## Technology Choices & Rationale

| Area | Choice | Rationale |
|------|--------|-----------|
| **Styling** | styled-components (`*.styles.ts`) | Component-scoped styles in dedicated files per constitution. Zero runtime overhead for static extraction, CSS-in-JS with tagged template literals, design tokens via CSS custom properties. Simpler than Tailwind (no config, no utility class learning curve). No CSS Modules, vanilla-extract, or other frameworks. |
| **Animation** | CSS Animations + `prefers-reduced-motion` | Framer Motion adds ~12KB gzipped and complexity. CSS animations cover all needs: scroll-reveal via IntersectionObserver + CSS keyframes, hover transitions. Native `prefers-reduced-motion` media query disables non-essential motion. No JS animation library needed for this scope. |
| **GitHub API** | Native `fetch()` | Octokit adds ~15KB for a simple REST call. GitHub REST API v3 is straightforward: `GET /users/:username/repos` with optional auth header. Native fetch is sufficient, zero dependencies, works in Node (build script) and browser. |
| **Package Manager** | npm | Constitution mandates npm with lockfile committed. |
| **State Management** | React Context only | Static site with minimal interactivity. Theme/reduced-motion via Context. No global state library needed. |
| **Testing** | Vitest + Playwright + Testing Library | Constitution standards. Focus on: utility functions (unit), critical components like ProjectCard/Navigation (component), key flows like navigation/project viewing (E2E), accessibility (axe-core in CI). No arbitrary coverage thresholds. |
| **Path Aliases** | `@/` via tsconfig/Vite | Constitution requires `@/` for all internal imports. Avoids `../../` relative paths. |

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | All principles satisfied | N/A |

---

## IMPLEMENTATION PHASES (REORGANIZED FOR VISUAL VALIDATION)

### PHASE 1: Setup & Foundation Técnica
**Purpose**: Project initialization, basic structure, and core infrastructure

| Task | Description |
|------|-------------|
| T001 | Create project structure per implementation plan (src/, tests/, public/, .github/workflows/) |
| T002 | Initialize npm project with React 18+, TypeScript 5+, Vite 5+, styled-components, @types/styled-components |
| T003 | [P] Configure ESLint (strict), Prettier, and TypeScript strict mode (tsconfig.json) |
| T004 | [P] Configure Vite with styled-components, asset handling, @/ path alias, build output for GitHub Pages |
| T005 | [P] Setup GitHub Actions workflow (.github/workflows/ci.yml, deploy.yml) |
| T006 | Create TypeScript type definitions (project.ts, contact.ts, site.ts, github.ts) |
| T007 | Create utility functions in `src/utils/helpers.ts` |
| T008 | Create CSS animation utilities in `src/utils/animations.ts` (keyframes for fadeInUp, staggerContainer, staggerItem) |
| T009 | Create `useReducedMotion` hook in `src/hooks/useReducedMotion.ts` |
| T010 | Create `useIntersectionObserver` hook in `src/hooks/useIntersectionObserver.ts` |
| T011 | Create GitHub fetch script in `src/data/fetch-github.ts` (build-time, native fetch) |
| T012 | [P] Create placeholder `src/data/projects.json` with sample data for development |
| T013 | Create SiteConfig in `src/data/site-config.ts` |
| T014 | Create primitive UI components: Button, Icon, Badge, Card (each in own folder with 5-file structure) |
| T015 | Create common components: Section, Container, Grid, VisuallyHidden (each in own folder with 5-file structure) |
| T016 | Create layout components: Header, Footer, Navigation, MobileMenu, SkipLink (each in own folder with 5-file structure) |
| T017 | [P] Configure Vitest, Playwright, Testing Library, axe-core |

**Checkpoint**: Foundation ready — visual system and HOME implementation can begin

---

### PHASE 2: Sistema Visual y Tokens
**Purpose**: Define the complete visual language (tokens, globals, motion) before building sections

| Task | Description |
|------|-------------|
| T018 | Create design tokens in `src/styles/tokens.css`: **Typography system** (Apple-style type scale, clamp() fluid sizes, font weights, line heights, letter spacing), **Color system** (base white/black/grays, accent colors as visual highlights only), **Spacing system** (generous negative space scale, section padding rhythms), **Breakpoints** (mobile <768px, tablet 768-1023px, desktop ≥1024px), **Radii**, **Shadows**, **Transitions/motion tokens** (duration, easing, reduced-motion overrides) |
| T019 | Create global styles in `src/styles/globals.css`: CSS reset, CSS variables from tokens, base typography, focus styles, `@media (prefers-reduced-motion: reduce)` global overrides, `html { scroll-behavior: smooth }` |
| T020 | Create base `Section` component in `src/components/common/Section/` with `min-height: 100dvh`, vertical centering/distribution patterns, and distinct composition variants |
| T021 | Create `Container` component in `src/components/common/Container/` with max-width constraints and responsive padding |
| T022 | Create `Grid` component in `src/components/common/Grid/` with asymmetric layout capabilities for desktop |

**Checkpoint**: Visual system complete — all tokens, globals, and base composition primitives ready

---

### PHASE 3: HOME Visual (Primera Etapa Visual)
**Purpose**: Build the complete HOME page with all main sections as independent visual "scenes" using `min-height: 100dvh`

| Task | Description |
|------|-------------|
| T023 | [P] Create **Hero** section in `src/components/sections/Hero/`: large Apple-style headlines (clamp()), value proposition, subtle entrance animation (fade + translate), distinct composition |
| T024 | [P] Create **About / Sobre mí** section in `src/components/sections/About/`: concise intro, distinct visual composition (not card grid), generous negative space, vertical content distribution |
| T025 | [P] Create **Projects / Proyectos** section in `src/components/sections/Projects/`: projects as visual protagonists, large images, asymmetric layouts on desktop, distinct from About composition |
| T026 | [P] Create **ProjectCard** in `src/components/sections/ProjectCard/`: visual-first card (image dominant), hover transitions (subtle scale/opacity), tech badges |
| T027 | [P] Create **Technologies / Tecnologías** section in `src/components/sections/Technologies/`: categorized, distinct composition (not card grid), visual hierarchy |
| T028 | [P] Create **TechnologyCard** in `src/components/sections/TechnologyCard/`: minimal, typography-focused |
| T029 | [P] Create **Contact / Contacto** section in `src/components/sections/Contact/`: distinct composition, centered/distributed vertically, functional links with icons |
| T030 | [P] Create **ContactMethod** in `src/components/sections/ContactMethod/` |
| T031 | [P] Refine **Header** in `src/components/layout/Header/`: sticky, backdrop blur, responsive (hamburger on mobile) |
| T032 | [P] Refine **Footer** in `src/components/layout/Footer/`: minimal, consistent with visual language |
| T033 | [P] Refine **Navigation** in `src/components/layout/Navigation/`: smooth scroll, active section indicator |
| T034 | [P] Refine **MobileMenu** in `src/components/layout/MobileMenu/`: focus trap, ARIA, compact navigation |
| T035 | [P] Refine **SkipLink** in `src/components/layout/SkipLink/` |
| T036 | Create main **Index page** in `src/pages/Index.tsx`: compose all sections in order (Header → Hero → About → Projects → Technologies → Contact → Footer) |
| T037 | Create **App.tsx** with providers (reduced-motion context) and main layout |
| T038 | Create **main.tsx** entry point with React 18 root |
| T039 | Apply scroll-triggered animations to all sections using `useIntersectionObserver` + animation utilities (fadeInUp, staggerContainer, staggerItem) |
| T040 | Implement hover transitions for all interactive elements (cards, buttons, links) using CSS transform/opacity only |
| T041 | Implement `prefers-reduced-motion` support: disable non-essential animations globally |
| T042 | **Responsive implementation**: Explicit design for mobile (vertical composition, compact nav, adapted sizes), tablet (adapted grids/compositions), desktop (wide compositions, large headlines, large images, asymmetric layouts) — NOT just shrinking desktop |
| T043 | Verify semantic heading hierarchy (h1 → h2 → h3) across all sections |
| T044 | Verify no horizontal scrolling at any viewport width |
| T045 | Verify touch targets ≥44×44px on mobile |
| T046 | Verify all sections meet `min-height: 100dvh` and content is vertically centered/distributed |

**Checkpoint**: **VISUAL VALIDATION STOP** — Run `npm run dev`, open in browser, manually review the complete HOME page. All 5 main sections must feel like distinct visual scenes with proper 100dvh behavior, typography, spacing, colors, composition, animations, and responsive behavior. **DO NOT PROCEED** to Phase 4 until visual approval is given.

---

### PHASE 4: Validación Visual del HOME (PARADA OBLIGATORIA)
**Purpose**: Manual visual review in browser before continuing

| Action | Description |
|--------|-------------|
| | Run `npm run dev` |
| | Open `http://localhost:5173` (or configured port) |
| | Verify **Hero**: Large headlines, clamp() fluid type, entrance animation, 100dvh minimum |
| | Verify **About**: Distinct composition, negative space, vertical distribution |
| | Verify **Projects**: Visual protagonists, large images, asymmetric desktop layout, distinct from About |
| | Verify **Technologies**: Categorized, distinct composition, hierarchy |
| | Verify **Contact**: Centered/distributed, functional links |
| | Verify **Header/Footer**: Sticky, backdrop blur, mobile hamburger |
| | Verify **Typography**: Apple-style scale, hierarchy, fluid sizes, discreet secondary text |
| | Verify **Spacing**: Generous negative space, wide compositions, no dashboard feel |
| | Verify **Colors**: Base white/black/grays, accents only as highlights |
| | Verify **Animations**: Scroll-reveal (fade/translate/scale), hover transitions, reduced-motion respected |
| | Verify **Responsive**: Mobile (vertical, compact), Tablet (adapted grids), Desktop (wide, asymmetric) |
| | **DECISION**: Approve visual direction → Continue to Phase 5 | Request changes → Return to Phase 3 tasks |

---

### PHASE 5: Post-Visual-Approval (Solo tras aprobación de FASE 4)
**Purpose**: Add functionality, real data, accessibility polish, testing, optimization, deployment

| Task | Description |
|------|-------------|
| T047 | Run `npm run fetch:github` to populate `projects.json` with real GitHub data |
| T048 | Create **ProjectDetail** component in `src/components/sections/ProjectDetail/` (inline view with screenshots, tech badges, links, focus management, Escape to close) |
| T049 | Add project detail state management to Projects section |
| T050 | Add SEO meta tags (title, description, Open Graph, Twitter cards) in index.html |
| T051 | Add favicon and manifest.json in public/ |
| T052 | Add robots.txt in public/ |
| T053 | Optimize images in public/images/ (WebP/AVIF, srcset, lazy loading) |
| T054 | Run Lighthouse audit and verify performance budgets (LCP <2.5s, FID <100ms, CLS <0.1, Performance ≥90, Accessibility ≥95) |
| T055 | Run axe-core accessibility scan and fix any critical/serious violations |
| T056 | Run Playwright E2E tests for all user stories (keyboard nav, responsive, reduced-motion, contact links) |
| T057 | Run Vitest unit tests for utility functions (helpers.ts, animations.ts) |
| T058 | Run component tests for critical components (ProjectCard, Navigation, MobileMenu, ContactMethod) |
| T059 | Configure GitHub Actions CI workflow (lint → typecheck → test → build) |
| T060 | Configure GitHub Actions deploy workflow (deploy to GitHub Pages on main branch) |
| T061 | Verify production build works and deploys successfully to GitHub Pages |
| T062 | Document quickstart commands in README.md |
| T063 | Responsive refinements based on real content |
| T064 | Final polish and micro-interactions |

---

## Phase Dependencies & Execution Order

```
PHASE 1: Setup & Foundation Técnica
    ↓ (must complete)
PHASE 2: Sistema Visual y Tokens
    ↓ (must complete)
PHASE 3: HOME Visual (Primera Etapa Visual)
    ↓ (must complete + visual validation)
PHASE 4: VALIDACIÓN VISUAL DEL HOME  ← PARADA OBLIGATORIA AQUÍ
    ↓ (only after visual approval)
PHASE 5: Post-Visual-Approval
```

- **Phase 1**: No dependencies — can start immediately
- **Phase 2**: Depends on Phase 1 completion
- **Phase 3**: Depends on Phase 2 completion (needs tokens, globals, base Section/Container/Grid)
- **Phase 4**: **MANDATORY STOP** — Manual visual review in browser. Implementation HALTS here.
- **Phase 5**: Only begins after explicit visual approval of Phase 3 output

## Visual-First Implementation Strategy

### PRIORITY ORDER WITHIN PHASE 3 (HOME Visual)

1. **Tokens & Globals first** (Phase 2) — No section work begins without the visual system defined
2. **Base Section/Container/Grid** — Composition primitives that enforce 100dvh and vertical distribution
3. **Hero** — Sets the visual tone, largest typography, entrance animation
4. **About** — Distinct composition from Hero, validates negative space approach
4. **Projects** — Visual protagonists, asymmetric layouts, distinct from About
5. **Technologies** — Categorized, distinct composition
6. **Contact** — Centered/distributed, functional
7. **Header/Footer/Navigation** — Layout shell
8. **Index page composition** — Assemble all sections
9. **Animations & Responsive** — Polish across all sections
10. **Accessibility verification** — Focus, headings, touch targets, reduced-motion

### RESPONSIVE STRATEGY (Explicit per breakpoint)

| Breakpoint | Hero | About | Projects | Technologies | Contact |
|------------|------|-------|----------|--------------|---------|
| **Mobile** (<768px) | Vertical, centered, large type | Vertical, generous spacing | Single column, large images | 1 col, typography-focused | Centered, stacked links |
| **Tablet** (768-1023px) | Two-column possible | Asymmetric layout | 2-col grid, adapted | 2-col grid | Side-by-side possible |
| **Desktop** (≥1024px) | Wide, asymmetric, large | Distinct wide composition | Asymmetric, 3+ cols, large images | 3-4 col grid | Wide, distributed |

### ANIMATION STRATEGY

- **Scroll-reveal**: `IntersectionObserver` + CSS keyframes (`fadeInUp`, `staggerContainer`, `staggerItem`)
- **Hover**: CSS `transform` (translate/scale) + `opacity` only — no layout-triggering properties
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables all non-essential keyframes/transitions globally
- **Performance**: `will-change` on animated elements, 60fps target, transform/opacity only

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