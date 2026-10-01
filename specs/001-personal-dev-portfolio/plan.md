# Implementation Plan: Personal Developer Portfolio - Visual System Update

**Branch**: `001-personal-dev-portfolio` | **Date**: 2026-10-01 | **Spec**: specs/001-personal-dev-portfolio/spec.md

**Input**: Feature specification from `/specs/001-personal-dev-portfolio/spec.md` (updated with Visual Design System)

## Summary

Update the existing personal developer portfolio to implement the formal Visual Design System defined in the specification. The project **already exists and compiles** (React 18+, TypeScript 5+, Vite 5+, styled-components). This plan updates tokens, global styles, and HOME sections to match the spec exactly: Inter font, specific typographic scale with clamp(), defined color palette, 100dvh sections with distinct compositions, responsive behavior per breakpoint, and subtle animations — all centralized via reusable design tokens.

**Key Visual Requirement**: Each main HOME section (Hero, About, Projects, Technologies, Contact) MUST occupy at minimum `min-height: 100dvh`, allowing content to grow beyond. Sections must feel like independent visual "scenes" with distinct compositions, generous negative space, and proper vertical distribution. This behavior must be maintained across mobile, tablet, and desktop breakpoints.

---

## Technical Context

| Aspect | Current State | Required Update |
|--------|---------------|-----------------|
| **Language/Version** | TypeScript 5+, React 18+ | No change |
| **Styling** | styled-components (`*.styles.ts`), design tokens in `src/styles/tokens.css` + `tokens.ts` | Update tokens to match spec exactly |
| **Fonts** | System font stack (`-apple-system...`) | **Must change to Inter** |
| **Font Weights** | 400, 500, 600, 700 | Already matches — verify no others used |
| **Typographic Scale** | Fluid clamp() values but different from spec | **Must update to exact spec values** |
| **Color Palette** | Close but accent is `#0066cc` vs spec `#0071E3` | **Must update accent and verify all values** |
| **Spacing** | 4px base scale (0.25rem increments) | Keep scale, verify usage |
| **Breakpoints** | 768px, 1024px, 1280px, 1440px | Simplify to mobile (<768), tablet (768-1023), desktop (≥1024) |
| **Radius** | 0, 4, 8, 12, 16, 24px, full | Keep, verify usage |
| **Motion** | CSS animations + IntersectionObserver | Keep approach, update tokens |
| **Animations** | fadeInUp, slideInLeft/Right, scaleIn, stagger | Keep, ensure spec compliance |
| **Project Structure** | 5-file component structure, @/ aliases | No change |

---

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

---

## Project Structure (Existing — No Changes)

The project already follows the required structure. No new directories or structural changes needed.

```text
src/
├── components/
│   ├── common/          # Section, Container, Grid, VisuallyHidden
│   ├── layout/          # Header, Footer, Navigation, MobileMenu, SkipLink
│   ├── sections/        # Hero, About, Projects, ProjectCard, Technologies, TechnologyCard, Contact, ContactMethod
│   └── ui/              # Button, Icon, Badge
├── data/
│   ├── fetch-github.ts
│   └── site-config.ts
├── hooks/
│   ├── useReducedMotion.ts
│   └── useIntersectionObserver.ts
├── pages/
│   └── Index.tsx
├── styles/
│   ├── globals.css
│   ├── tokens.css
│   └── tokens.ts
├── types/
│   ├── project.ts
│   ├── contact.ts
│   ├── site.ts
│   └── github.ts
├── utils/
│   ├── animations.ts
│   └── helpers.ts
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

## Phase 0: Auditoría de la Base Existente (COMPLETED)

**Result**: The project exists, compiles, and has a working visual system that is **close but not compliant** with the updated spec.

### Existing Components to REUSE (minimal changes)

| Component | Location | Reuse Strategy |
|-----------|----------|----------------|
| Section | `src/components/common/Section/` | Keep 5-file structure; update styles for spec-compliant 100dvh + distinct compositions |
| Container | `src/components/common/Container/` | Keep; verify padding/max-width tokens |
| Grid | `src/components/common/Grid/` | Keep; may need asymmetric layout variants |
| VisuallyHidden | `src/components/common/VisuallyHidden/` | Keep as-is |
| Header | `src/components/layout/Header/` | Keep structure; update styles for spec font/colors |
| Footer | `src/components/layout/Footer/` | Keep structure; update styles |
| Navigation | `src/components/layout/Navigation/` | Keep; verify font weights |
| MobileMenu | `src/components/layout/MobileMenu/` | Keep; verify font weights |
| SkipLink | `src/components/layout/SkipLink/` | Keep |
| Hero | `src/components/sections/Hero/` | Keep structure; **update typography to spec clamp() values** |
| About | `src/components/sections/About/` | Keep structure; **update composition to be distinct from Hero/Projects** |
| Projects | `src/components/sections/Projects/` | Keep structure; **update to visual protagonists (large images, asymmetric)** |
| ProjectCard | `src/components/sections/ProjectCard/` | Keep structure; **update to visual-first, large images** |
| Technologies | `src/components/sections/Technologies/` | Keep structure; **update composition (not logo grid)** |
| TechnologyCard | `src/components/sections/TechnologyCard/` | Keep structure; **minimal, typography-focused** |
| Contact | `src/components/sections/Contact/` | Keep structure; **update as visual closing** |
| ContactMethod | `src/components/sections/ContactMethod/` | Keep |
| Button | `src/components/ui/Button/` | Keep; verify font weight 500 for labels |
| Icon | `src/components/ui/Icon/` | Keep |
| Badge | `src/components/ui/Badge/` | Keep |

### Files REQUIRING MODIFICATION

| File | Reason |
|------|--------|
| `src/styles/tokens.css` | **Critical** — Update font-family to Inter, typographic scale to exact spec clamp() values, accent color to `#0071E3`, verify all color tokens |
| `src/styles/tokens.ts` | **Critical** — Update TypeScript token exports to match tokens.css |
| `src/styles/globals.css` | **Critical** — Update font-family to Inter, verify base styles |
| `src/components/common/Section/Section.styles.ts` | Update composition variants to enforce distinct visual scenes per section |
| `src/components/sections/Hero/Hero.styles.ts` | Update headline to `clamp(3.5rem, 8vw, 7rem)` weight 700; tagline to spec scale |
| `src/components/sections/About/About.styles.ts` | Update section title to `clamp(2.5rem, 5vw, 4.5rem)` weight 700; create distinct composition |
| `src/components/sections/Projects/Projects.styles.ts` | Update section title; grid → asymmetric/visual-first layout |
| `src/components/sections/ProjectCard/ProjectCard.styles.ts` | Visual-first design: large images, minimal info, hover transitions |
| `src/components/sections/Technologies/Technologies.styles.ts` | Distinct composition (not card grid); categorized, clean |
| `src/components/sections/Contact/Contact.styles.ts` | Visual closing: simple, spacious, direct |
| `src/components/layout/Header/Header.styles.ts` | Font weight 500 for navigation; backdrop blur |
| `src/components/layout/Footer/Footer.styles.ts` | Minimal, consistent with visual language |

### Identified Issues to Fix

1. **Font family**: Currently system stack — must be `Inter`
2. **Typographic scale**: Current clamp() values differ from spec — must match exactly
3. **Accent color**: Currently `#0066cc` — must be `#0071E3`
4. **Section compositions**: Several sections use similar `content` composition — must be distinct per spec
5. **Projects grid**: Currently 3-column card grid — must become visual protagonists with large images
6. **Shadows**: Current tokens include shadows up to `xl` — spec prohibits "strong shadows"
7. **Dark mode**: Spec doesn't require — can keep or remove (decision: keep as optional, not used)
8. **Breakpoints**: 4 breakpoints defined — simplify to 3 per spec (mobile, tablet, desktop)
9. **Animations**: Current hover uses `translateY(-4px)` + shadow — spec permits only subtle translate/scale/opacity

---

## FASE 1 — SISTEMA VISUAL (Tokens & Globals)

**Purpose**: Implement the centralized visual system matching spec exactly. No component work begins until tokens are correct.

### Tasks

| Task | Description |
|------|-------------|
| **T1.1** | **Update `src/styles/tokens.css`**:<br>• `--font-sans`: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`<br>• Typographic scale — replace ALL clamp() values with spec-exact values:<br>  - `--text-display-hero`: `clamp(3.5rem, 8vw, 7rem)` (Hero headline, weight 700)<br>  - `--text-display-section`: `clamp(2.5rem, 5vw, 4.5rem)` (Section titles, weight 700)<br>  - `--text-display-project`: `clamp(2rem, 4vw, 3.5rem)` (Project titles, weight 600)<br>  - `--text-large-subtitle`: `clamp(1.25rem, 2vw, 1.75rem)` (Large subtitles, weight 400)<br>  - `--text-body`: `1rem` (Body, weight 400)<br>  - `--text-secondary`: `0.875rem` (Secondary, weight 400)<br>  - `--text-label`: `0.75rem` (Labels/nav, weight 500)<br>• Colors — update to spec palette exactly:<br>  - `--color-bg`: `#FFFFFF`<br>  - `--color-bg-muted`: `#F5F5F7`<br>  - `--color-fg`: `#1D1D1F`<br>  - `--color-fg-muted`: `#6E6E73`<br>  - `--color-fg-subtle`: `#86868B`<br>  - `--color-border`: `#D2D2D7`<br>  - `--color-black`: `#000000`<br>  - `--color-white`: `#FFFFFF`<br>  - `--color-accent`: `#0071E3`<br>• Remove `--color-primary`, `--color-primary-hover`, `--color-primary-light` (not in spec)<br>• Spacing: Keep 4px base scale — no arbitrary values<br>• Breakpoints: Simplify to 3: `--bp-mobile: 768px`, `--bp-tablet: 1024px`, `--bp-desktop: 1280px`<br>• Radius: Keep existing scale<br>• Shadows: **Reduce to only xs/sm** — spec prohibits strong shadows<br>• Transitions/Motion: Keep durations/easings; ensure `prefers-reduced-motion` zeros them |
| **T1.2** | **Update `src/styles/tokens.ts`**: Sync all TypeScript token exports to match updated tokens.css exactly. Remove unused tokens (primary, primaryHover, primaryLight, bgAccent, error, success, etc. not in spec). |
| **T1.3** | **Update `src/styles/globals.css`**:<br>• `font-family: var(--font-sans)` (now Inter)<br>• Verify `body` uses `var(--color-fg)` and `var(--color-bg)`<br>• Verify `a` uses `var(--color-accent)` for links<br>• Ensure `@media (prefers-reduced-motion: reduce)` disables transitions/animations globally<br>• Remove dark mode block (optional — not in spec, but harmless if kept unused) |
| **T1.4** | **Verify Inter font loading**: Add `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')` in globals.css or index.html |
| **T1.5** | **Run typecheck**: `npm run typecheck` — ensure token exports compile |

**Checkpoint**: Tokens and globals match spec exactly. All clamp() values, colors, weights verified. TypeScript compiles.

---

## FASE 2 — COMPONENTES BASE (Section, Container, Grid)

**Purpose**: Update composition primitives to enforce distinct visual scenes and 100dvh behavior.

### Tasks

| Task | Description |
|------|-------------|
| **T2.1** | **Update `src/components/common/Section/Section.styles.ts`**:<br>• Ensure `min-height: 100dvh` with `100vh` fallback works correctly<br>• Update composition variants to be **distinct per section** (no mechanical repetition):<br>  - `hero`: Centered, flex column, justify-center, align-center, text-center<br>  - `about`: Content-left, max-width constrained, generous negative space<br>  - `projects`: Visual-first, asymmetric on desktop, large images<br>  - `technologies`: Categorized, clean hierarchy, not card grid<br>  - `contact`: Centered vertically/horizontally, direct<br>• Update `verticalAlign` variants for each section's needs<br>• Responsive padding per breakpoint (mobile/tablet/desktop)<br>• Remove gradient background option (not in spec) |
| **T2.2** | **Update `src/components/common/Section/Section.tsx`**: Update `SectionComposition` type to reflect new distinct variants. Remove `gradient` from background. |
| **T2.3** | **Update `src/components/common/Container/Container.styles.ts`**: Verify max-widths and paddings work with new section compositions. |
| **T2.4** | **Update `src/components/common/Grid/Grid.styles.ts`**: Add asymmetric layout variant for desktop Projects section (e.g., featured project large + others smaller). |
| **T2.5** | **Run tests**: `npm run test` — ensure base components still pass |

**Checkpoint**: Base composition primitives enforce 100dvh, distinct compositions, and responsive behavior.

---

## FASE 3 — HOME VISUAL (Secciones Principales)

**Purpose**: Build/update each HOME section using the new visual system. Each section = distinct visual scene.

### Implementation Order (Priority)

1. **Hero** — Sets visual tone, largest typography, entrance animation
2. **About** — Distinct composition, validates negative space approach
3. **Projects** — Visual protagonists, asymmetric layouts, distinct from About
4. **Technologies** — Categorized, distinct composition
5. **Contact** — Centered/distributed, functional, visual closing
6. **Header/Footer** — Layout shell

### Tasks

| Task | Description |
|------|-------------|
| **T3.1 Hero** | Update `src/components/sections/Hero/Hero.styles.ts`:<br>• Headline: `font-size: var(--text-display-hero)`, `font-weight: 700`, `line-height: 1.0`, `letter-spacing: -0.02em`<br>• Title (role): `font-size: var(--text-display-project)`, `font-weight: 600` (spec says project titles 600, but hero role is large subtitle → use `--text-large-subtitle` weight 400)<br>• Tagline: `font-size: var(--text-large-subtitle)`, `font-weight: 400`, color `textSecondary`<br>• CTA: `font-size: var(--text-label)`, `font-weight: 500`, accent color<br>• Composition: `hero` variant, generous gap, max-width 900px<br>• Entrance animation: fade + subtle translate up (staggered) |
| **T3.2 About** | Update `src/components/sections/About/About.styles.ts`:<br>• Section title: `font-size: var(--text-display-section)`, `font-weight: 700`<br>• Body text: `font-size: var(--text-body)`, `font-weight: 400`, `line-height: 1.625`, color `textSecondary`<br>• **Distinct composition**: Not centered like Hero. Left-aligned, max-width ~700px, generous vertical space<br>• Stats (if kept): Minimal, typography-focused, not card-like<br>• Remove border-top on stats (spec: no excessive borders) |
| **T3.3 Projects** | Update `src/components/sections/Projects/Projects.styles.ts` AND `ProjectCard.styles.ts`:<br>• Section title: `font-size: var(--text-display-section)`, `font-weight: 700`<br>• **ProjectsGrid**: Asymmetric on desktop (e.g., 1 featured large + 2 smaller, or 2-col with large images)<br>• **ProjectCard**: Visual-first — image dominant (aspect-ratio 16:9 or 4:3), title overlay or below, minimal meta (tech badges, links)<br>• Project title: `font-size: var(--text-display-project)`, `font-weight: 600`<br>• Tech badges: `font-size: var(--text-label)`, `font-weight: 500`<br>• Hover: Subtle scale (1.01-1.02) + opacity on image, NO shadow lift<br>• Avoid 3-col card grid — use asymmetric, expansive layout |
| **T3.4 Technologies** | Update `src/components/sections/Technologies/Technologies.styles.ts`:<br>• Section title: `font-size: var(--text-display-section)`, `font-weight: 700`<br>• Category title: `font-size: var(--text-label)`, `font-weight: 500`, uppercase, tracking-wide, color `textTertiary`<br>• TechnologyCard: Minimal — name only, `font-size: var(--text-body)`, `font-weight: 400`, color `textPrimary`<br>• Layout: Flow/wrap or simple grid, NOT card grid with borders/shadows<br>• Grouped by category with clear visual separation |
| **T3.5 Contact** | Update `src/components/sections/Contact/Contact.styles.ts`:<br>• Section title: `font-size: var(--text-display-section)`, `font-weight: 700`<br>• Intro text: `font-size: var(--text-large-subtitle)`, `font-weight: 400`, color `textSecondary`<br>• ContactMethod: `font-size: var(--text-body)`, `font-weight: 400`, accent color for links<br>• Composition: `contact` variant — centered, vertically distributed, spacious<br>• Direct, simple, no form — just links |
| **T3.6 Header** | Update `src/components/layout/Header/Header.styles.ts`:<br>• Logo: `font-size: var(--text-label)`, `font-weight: 500`<br>• Navigation items: `font-size: var(--text-label)`, `font-weight: 500`<br>• Sticky with backdrop blur, transparent until scroll<br>• Mobile: hamburger menu |
| **T3.7 Footer** | Update `src/components/layout/Footer/Footer.styles.ts`:<br>• Copyright: `font-size: var(--text-secondary)`, `font-weight: 400`, color `textTertiary`<br>• Social links: Icon + minimal spacing<br>• Minimal, consistent with visual language |
| **T3.8 Index Page** | Verify `src/pages/Index.tsx` composes all sections in correct order with correct props. No changes needed if props match. |
| **T3.9 Animations** | Apply scroll-reveal to all sections using `useIntersectionObserver` + CSS keyframes:<br>• Fade + translate up (20px) — subtle<br>• Stagger children (100ms delay)<br>• Hover transitions: transform (translate/scale) + opacity only<br>• Respect `prefers-reduced-motion` globally |
| **T3.10 Responsive** | Explicit per-breakpoint implementation (NOT just shrinking):<br>• **Mobile (<768px)**: Vertical stack, centered Hero, single-col Projects, adapted typography via clamp()<br>• **Tablet (768-1023px)**: Adapted grids (2-col Projects), intermediate spacing<br>• **Desktop (≥1024px)**: Wide compositions, large headlines, large images, asymmetric Projects layout |
| **T3.11 Accessibility** | Verify: semantic heading hierarchy (h1→h2→h3), focus-visible on all interactive, touch targets ≥44×44px, no horizontal scroll, skip link works |
| **T3.12 Verification** | Run `npm run typecheck`, `npm run test`, `npm run build` — all must pass |

**Checkpoint**: All 5 main HOME sections implemented with spec-compliant visual system. Ready for visual validation.

---

## FASE 4 — VALIDACIÓN VISUAL OBLIGATORIA (HARD STOP)

**Purpose**: Manual visual review in browser before ANY further work.

### Required Actions

1. Run `npm run dev`
2. Open `http://localhost:5173` (or configured port)
3. Verify each section against spec:

| Section | Verification Checklist |
|---------|------------------------|
| **Hero** | `clamp(3.5rem, 8vw, 7rem)` weight 700 headline; role + tagline at spec sizes; CTA weight 500; 100dvh min; centered composition; entrance animation |
| **About** | `clamp(2.5rem, 5vw, 4.5rem)` weight 700 title; body 1rem weight 400; distinct left-aligned composition; generous negative space; no card feel |
| **Projects** | `clamp(2.5rem, 5vw, 4.5rem)` weight 700 title; project titles `clamp(2rem, 4vw, 3.5rem)` weight 600; large images; asymmetric desktop layout; visual protagonists; hover = subtle scale/opacity |
| **Technologies** | `clamp(2.5rem, 5vw, 4.5rem)` weight 700 title; categorized; clean typography; no logo grid; no card borders/shadows |
| **Contact** | `clamp(2.5rem, 5vw, 4.5rem)` weight 700 title; intro `clamp(1.25rem, 2vw, 1.75rem)` weight 400; links weight 400 accent color; centered/distributed; visual closing |
| **Global** | Inter font loads; colors match spec exactly; spacing consistent; no strong shadows; no decorative gradients; no excessive borders; 100dvh all sections; responsive at 3 breakpoints; animations subtle; prefers-reduced-motion works |

4. **DECISION**:
   - **Approve** → Continue to Phase 5 (Post-Visual-Approval: real data, SEO, testing, deploy)
   - **Request changes** → Return to Phase 3 tasks

**IMPLEMENTATION STOPS HERE UNTIL VISUAL APPROVAL.**

---

## FASE 5 — Post-Visual-Approval (Solo tras aprobación de FASE 4)

**Purpose**: Add real data, polish, testing, optimization, deployment.

| Task | Description |
|------|-------------|
| T5.1 | Run `npm run fetch:github` to populate `projects.json` with real GitHub data |
| T5.2 | Create **ProjectDetail** component (inline view with screenshots, tech badges, links, focus management, Escape to close) |
| T5.3 | Add project detail state management to Projects section |
| T5.4 | Add SEO meta tags (title, description, Open Graph, Twitter cards) in index.html |
| T5.5 | Add favicon and manifest.json in public/ |
| T5.6 | Add robots.txt in public/ |
| T5.7 | Optimize images (WebP/AVIF, srcset, lazy loading) |
| T5.8 | Run Lighthouse audit — verify budgets (LCP <2.5s, FID <100ms, CLS <0.1, Performance ≥90, Accessibility ≥95) |
| T5.9 | Run axe-core accessibility scan — fix critical/serious violations |
| T5.10 | Run Playwright E2E tests for all user stories |
| T5.11 | Run Vitest unit tests for utilities |
| T5.12 | Run component tests for critical components |
| T5.13 | Configure GitHub Actions CI workflow (lint → typecheck → test → build) |
| T5.14 | Configure GitHub Actions deploy workflow (deploy to GitHub Pages on main branch) |
| T5.15 | Verify production build works and deploys successfully |
| T5.16 | Document quickstart commands in README.md |
| T5.17 | Responsive refinements based on real content |
| T5.18 | Final polish and micro-interactions |

---

## Phase Dependencies & Execution Order

```
FASE 1: Sistema Visual (Tokens & Globals)
    ↓ (must complete + typecheck)
FASE 2: Componentes Base (Section, Container, Grid)
    ↓ (must complete)
FASE 3: HOME Visual (Hero → About → Projects → Technologies → Contact → Header/Footer)
    ↓ (must complete + all checks pass)
FASE 4: VALIDACIÓN VISUAL OBLIGATORIA  ← PARADA OBLIGATORIA AQUÍ
    ↓ (only after explicit visual approval)
FASE 5: Post-Visual-Approval
```

---

## Visual-First Implementation Strategy

### Typography Token Mapping (Spec → CSS Variables)

| Spec Role | CSS Variable | Weight | Usage |
|-----------|--------------|--------|-------|
| Hero headline | `--text-display-hero` | 700 | Hero name |
| Section titles | `--text-display-section` | 700 | About, Projects, Technologies, Contact h2 |
| Project titles | `--text-display-project` | 600 | ProjectCard title |
| Large subtitles | `--text-large-subtitle` | 400 | Hero tagline, Contact intro |
| Body text | `--text-body` | 400 | About content, ContactMethod |
| Secondary text | `--text-secondary` | 400 | Meta, descriptions |
| Labels & navigation | `--text-label` | 500 | Header nav, Button, tech badges |

### Color Token Mapping (Spec → CSS Variables)

| Spec Token | CSS Variable | Hex |
|------------|--------------|-----|
| Background Primary | `--color-bg` | `#FFFFFF` |
| Background Alternate | `--color-bg-muted` | `#F5F5F7` |
| Text Primary | `--color-fg` | `#1D1D1F` |
| Text Secondary | `--color-fg-muted` | `#6E6E73` |
| Text Tertiary | `--color-fg-subtle` | `#86868B` |
| Border | `--color-border` | `#D2D2D7` |
| Black | `--color-black` | `#000000` |
| White | `--color-white` | `#FFFFFF` |
| Accent | `--color-accent` | `#0071E3` |

### Section Composition Mapping

| Section | Composition Variant | Vertical Align | Background |
|---------|---------------------|----------------|------------|
| Hero | `hero` | `center` | `default` |
| About | `about` (new) | `center` | `muted` |
| Projects | `projects` (new) | `top` | `default` |
| Technologies | `technologies` (new) | `top` | `muted` |
| Contact | `contact` (new) | `center` | `default` |

---

## Success Criteria (from Spec)

- **SC-001**: First-time visitor identifies role and views ≥3 projects within 10s
- **SC-002**: All sections functional on mobile, tablet, desktop
- **SC-003**: Keyboard-only navigation reaches all interactive elements
- **SC-004**: Lighthouse Performance ≥90, Accessibility ≥95, Best Practices ≥90, SEO ≥90
- **SC-005**: Project data displays within 3s (broadband) / 5s (3G)
- **SC-006**: Animations 60fps on mid-range devices (last 3 years)
- **SC-007**: Zero critical accessibility violations
- **SC-008**: Builds and deploys to GitHub Pages with zero errors
- **SC-009**: All contact links open correct destination
- **SC-010**: Each main HOME section fills ≥100vh on initial load, content centered/distributed

---

## Notes

- [P] tasks = different files, no dependencies — can run in parallel
- Every component in own folder with 5-file structure (`.tsx`, `.styles.ts`, `use*.ts`, `.test.tsx`, `index.ts`)
- Use `@/` imports for all internal modules — no `../../` relative paths
- styled-components via `*.styles.ts` — **No CSS Modules, vanilla-extract, Tailwind, Framer Motion**
- Build-time GitHub fetch → static JSON — no runtime loading/error/empty states needed
- **Visual validation is a hard gate** — Phase 4 does not auto-advance to Phase 5
- Design tokens drive everything — no magic numbers in component styles
- Each section = distinct visual scene — avoid repeating card grid pattern
- Typography, spacing, and composition are the product — not afterthoughts
- Inter font MUST be loaded (Google Fonts or self-hosted)
- Accent `#0071E3` used SPARINGLY — only links, actions, interactive states, small highlights
- No strong shadows — max `shadow-sm` (0 1px 3px rgba(0,0,0,0.1))
- No decorative gradients
- No excessive borders/cards
- No dashboard appearance

---

## Resumen de Entregables del Plan Actualizado

1. **Fases reordenadas**: Auditoría (completada) → Sistema Visual → Componentes Base → HOME Visual → **Validación Visual (STOP)** → Post-Approval
2. **Tokens centralizados**: `src/styles/tokens.css` + `tokens.ts` — única fuente de verdad
3. **Componentes a reutilizar**: 22 componentes existentes mantienen estructura 5-archivos
4. **Componentes a modificar**: 15 archivos de estilos + tokens + globals
5. **Validación visual**: Detención obligatoria tras Fase 3 — `npm run dev` → revisión humana en navegador
6. **No se implementa código** — solo plan actualizado