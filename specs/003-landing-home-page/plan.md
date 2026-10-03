# Implementation Plan: Landing Home Page

**Branch**: `003-landing-home-page` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-landing-home-page/spec.md`

## Summary

Implement a multi-page architecture for the portfolio with a dedicated Landing/Home page that displays summaries of each main section (About, Projects, Technologies, Contact) with CTA buttons linking to their respective full pages. The existing single-page layout will be refactored into separate routes with a shared layout (Header/Footer).

**Technical approach**: Add `react-router-dom` with `createBrowserRouter` for client-side routing. Create a shared `Layout` component that wraps all pages with Header and Footer. Refactor existing section components into full pages. Create summary/preview components for the landing page.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3.1

**Primary Dependencies**: react-router-dom (new), styled-components 6.1.12 (existing)

**Storage**: N/A (static site, no backend)

**Testing**: Vitest 2.0 (unit), Playwright 1.45 (E2E), Testing Library 16.0 (component)

**Target Platform**: Web (static hosting on GitHub Pages)

**Project Type**: Web application (SPA with client-side routing)

**Performance Goals**: LCP <2.5s, FID <100ms, CLS <0.1, 60fps animations

**Constraints**: Static hosting (no server-side rendering), GitHub Pages deployment, WCAG 2.1 AA accessibility

**Scale/Scope**: 5 pages (Home, About, Projects, Technologies, Contact), ~15 components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | All components follow the standard structure (ComponentName.tsx, .styles.ts, useComponentName.ts, index.ts) |
| II. Type Safety | PASS | All props and data contracts defined with TypeScript types |
| III. Testing Strategy | PASS | Unit tests for logic, component tests for behavior, E2E for critical flows |
| IV. Accessibility & Performance | PASS | WCAG 2.1 AA, semantic HTML, keyboard navigation, performance budgets |
| V. Design Principles | PASS | Apple-inspired minimalist design, existing tokens reused |
| VI. Simplicity & Maintainability | PASS | react-router-dom is the standard solution, no unnecessary abstractions |
| Styling (styled-components) | PASS | All styles in *.styles.ts files, no CSS Modules/Tailwind |
| Path Aliases (@/) | PASS | All internal imports use @/ alias |
| Dependencies | PASS | react-router-dom is the standard routing solution for React SPAs |

**Gate Result**: PASS — No violations

## Project Structure

### Documentation (this feature)

```text
specs/003-landing-home-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── common/              # Shared primitives (Section, Container, Grid, VisuallyHidden)
│   ├── layout/              # Header, Footer, Navigation, MobileMenu, SkipLink
│   ├── sections/            # Hero, About, Projects, Technologies, Contact, ProjectCard, TechnologyCard, ContactMethod
│   └── ui/                  # Button, Icon
├── pages/                   # Route-level page components
│   ├── Index.tsx            # Landing page (refactored)
│   ├── About.tsx            # About page (new)
│   ├── Projects.tsx         # Projects page (new)
│   ├── Technologies.tsx     # Technologies page (new)
│   └── Contact.tsx          # Contact page (new)
├── hooks/                   # useReducedMotion, useIntersectionObserver
├── data/                    # site-config.ts, projects.json, fetch-github.ts
├── styles/                  # tokens.ts, tokens.css, globals.css
├── types/                   # site.ts, project.ts, contact.ts, github.ts
├── contracts/               # components.ts (shared type contracts)
├── App.tsx                  # Root component with router
├── main.tsx                 # Entry point
└── router.tsx               # Route definitions (new)

tests/
├── e2e/                     # Playwright E2E tests
├── unit/                    # Vitest unit tests
└── setup.ts
```

**Structure Decision**: Single-page application with client-side routing. The existing structure is preserved with minimal additions: a `pages/` directory for route-level components, a `router.tsx` for route definitions, and a `Layout` component for shared Header/Footer wrapper.

## Complexity Tracking

No Constitution Check violations to justify.
