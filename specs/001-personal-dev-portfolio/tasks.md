---
description: "Task list for Personal Developer Portfolio visual system implementation (visual-first, phased with validation stop)"
---

# Tasks: Personal Developer Portfolio - Visual System Update

**Input**: Design documents from `/specs/001-personal-dev-portfolio/`

**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification. Following constitution principle III: "Strict TDD (tests before implementation) is not mandatory. Write tests that provide confidence in correctness—unit tests for logic, component tests for behavior, and E2E tests for critical user flows."

**Organization**: Tasks are grouped by implementation phase per the updated plan. Each task is concrete, executable, small, and verifiable.

---

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Required for user story phase tasks only (e.g., [US1], [US2])
- Include exact file paths in descriptions

---

## FASE 1 — Auditoría de la base existente

**Purpose**: Review existing implementation, identify tokens, globals, components, and determine what to reuse vs modify.

- [ ] T001 Audit `src/styles/tokens.css` — verify current font-family, typographic scale (clamp values), color palette, spacing, breakpoints, radii, shadows, motion tokens against spec.md
- [ ] T002 Audit `src/styles/tokens.ts` — verify TypeScript token exports match tokens.css
- [ ] T003 Audit `src/styles/globals.css` — verify font-family, base styles, focus styles, reduced-motion support, Inter font loading
- [ ] T004 Audit `src/components/common/Section/Section.styles.ts` — verify min-height: 100dvh, composition variants, vertical align variants
- [ ] T005 Audit `src/components/common/Container/Container.styles.ts` — verify max-widths, responsive padding
- [ ] T006 Audit `src/components/common/Grid/Grid.styles.ts` — verify asymmetric layout capabilities
- [ ] T007 Audit Hero section styles (`src/components/sections/Hero/Hero.styles.ts`) — verify typography clamp values, weights, composition
- [ ] T008 Audit About section styles (`src/components/sections/About/About.styles.ts`) — verify section title clamp, body text, composition distinctness
- [ ] T009 Audit Projects section styles (`src/components/sections/Projects/Projects.styles.ts`) — verify section title, grid layout, asymmetric capability
- [ ] T010 Audit ProjectCard styles (`src/components/sections/ProjectCard/ProjectCard.styles.ts`) — verify visual-first design, image dominance, hover transitions
- [ ] T011 Audit Technologies section styles (`src/components/sections/Technologies/Technologies.styles.ts`) — verify composition (not card grid), categorization
- [ ] T012 Audit Contact section styles (`src/components/sections/Contact/Contact.styles.ts`) — verify composition, centered/distributed, closing feel
- [ ] T013 Audit Header styles (`src/components/layout/Header/Header.styles.ts`) — verify font weights, backdrop blur, responsive nav
- [ ] T014 Audit Footer styles (`src/components/layout/Footer/Footer.styles.ts`) — verify minimal style, consistency
- [ ] T015 Document audit findings: create `AUDIT.md` listing files to reuse (no changes), files to modify, and files to create

---

## FASE 2 — Sistema visual (Tokens)

**Purpose**: Implement centralized design tokens matching spec.md exactly. No component work until tokens are correct.

### Typography Tokens

- [ ] T016 Update `src/styles/tokens.css` — set `--font-sans` to `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- [ ] T017 Update `src/styles/tokens.css` — define `--text-display-hero: clamp(3.5rem, 8vw, 7rem)` (Hero headline, weight 700)
- [ ] T018 Update `src/styles/tokens.css` — define `--text-display-section: clamp(2.5rem, 5vw, 4.5rem)` (Section titles, weight 700)
- [ ] T019 Update `src/styles/tokens.css` — define `--text-display-project: clamp(2rem, 4vw, 3.5rem)` (Project titles, weight 600)
- [ ] T020 Update `src/styles/tokens.css` — define `--text-large-subtitle: clamp(1.25rem, 2vw, 1.75rem)` (Large subtitles, weight 400)
- [ ] T021 Update `src/styles/tokens.css` — define `--text-body: 1rem` (Body text, weight 400)
- [ ] T022 Update `src/styles/tokens.css` — define `--text-secondary: 0.875rem` (Secondary text, weight 400)
- [ ] T023 Update `src/styles/tokens.css` — define `--text-label: 0.75rem` (Labels & navigation, weight 500)
- [ ] T024 Update `src/styles/tokens.css` — verify font weights: `--font-weight-normal: 400`, `--font-weight-medium: 500`, `--font-weight-semibold: 600`, `--font-weight-bold: 700` (no other weights)

### Color Tokens

- [ ] T025 Update `src/styles/tokens.css` — set `--color-bg: #FFFFFF` (Background Primary)
- [ ] T026 Update `src/styles/tokens.css` — set `--color-bg-muted: #F5F5F7` (Background Alternate)
- [ ] T027 Update `src/styles/tokens.css` — set `--color-fg: #1D1D1F` (Text Primary)
- [ ] T028 Update `src/styles/tokens.css` — set `--color-fg-muted: #6E6E73` (Text Secondary)
- [ ] T029 Update `src/styles/tokens.css` — set `--color-fg-subtle: #86868B` (Text Tertiary)
- [ ] T030 Update `src/styles/tokens.css` — set `--color-border: #D2D2D7` (Border)
- [ ] T031 Update `src/styles/tokens.css` — set `--color-black: #000000` (Black)
- [ ] T032 Update `src/styles/tokens.css` — set `--color-white: #FFFFFF` (White)
- [ ] T033 Update `src/styles/tokens.css` — set `--color-accent: #0071E3` (Accent — links, actions, interactive states, highlights)
- [ ] T034 Update `src/styles/tokens.css` — remove unused tokens: `--color-primary`, `--color-primary-hover`, `--color-primary-light`, `--color-bg-accent`, `--color-error`, `--color-success`, `--color-focus`

### Spacing Tokens

- [ ] T035 Verify `src/styles/tokens.css` spacing scale (4px base): `--space-0` through `--space-24` — keep existing, no arbitrary values

### Breakpoint Tokens

- [ ] T036 Update `src/styles/tokens.css` — simplify to 3 breakpoints: `--bp-mobile: 768px`, `--bp-tablet: 1024px`, `--bp-desktop: 1280px` (remove `--bp-wide`)

### Radius Tokens

- [ ] T037 Verify `src/styles/tokens.css` radius scale: `--radius-none` through `--radius-full` — keep existing

### Motion/Transition Tokens

- [ ] T038 Update `src/styles/tokens.css` — reduce shadows to only `--shadow-xs` and `--shadow-sm` (spec: no strong shadows)
- [ ] T039 Update `src/styles/tokens.css` — verify transitions: `--transition-fast: 120ms ease-out`, `--transition-normal: 200ms ease-out`, `--transition-slow: 300ms ease-out`
- [ ] T040 Update `src/styles/tokens.css` — verify durations/easings: `--duration-fast: 120ms`, `--duration-normal: 200ms`, `--duration-slow: 300ms`, `--ease-out: ease-out`, `--ease-in-out: ease-in-out`, `--ease-spring: cubic-bezier(0.16, 1, 0.3, 1)`

### Prefers-Reduced-Motion

- [ ] T041 Update `src/styles/tokens.css` — ensure `@media (prefers-reduced-motion: reduce)` zeros all transition/duration variables

### TypeScript Token Sync

- [ ] T042 Update `src/styles/tokens.ts` — sync all exports to match updated tokens.css exactly (remove unused, add new typography tokens)
- [ ] T043 Run `npm run typecheck` — verify TypeScript compiles with updated tokens

---

## FASE 3 — Global Styles

**Purpose**: Adapt global styles to use the new token system with Inter font.

- [ ] T044 Update `src/styles/globals.css` — add `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')` at top
- [ ] T045 Update `src/styles/globals.css` — ensure `body` uses `font-family: var(--font-sans)`, `color: var(--color-fg)`, `background-color: var(--color-bg)`
- [ ] T046 Update `src/styles/globals.css` — ensure `a` uses `color: var(--color-accent)` for links
- [ ] T047 Update `src/styles/globals.css` — verify `@media (prefers-reduced-motion: reduce)` disables `scroll-behavior: smooth` and all transitions/animations globally
- [ ] T048 Update `src/styles/globals.css` — ensure `html { box-sizing: border-box }`, `*, *::before, *::after { box-sizing: inherit }`, no horizontal overflow
- [ ] T049 Update `src/styles/globals.css` — verify focus-visible styles use `var(--color-accent)` for outline
- [ ] T050 Update `src/styles/globals.css` — remove dark mode block (optional, not in spec) or keep commented
- [ ] T051 Run `npm run typecheck` — verify globals compile

---

## FASE 4 — HOME Visual

**Purpose**: Build/update each HOME section using the new visual system. Each section = distinct visual scene with `min-height: 100dvh`.

### Header

- [ ] T052 [P] Update `src/components/layout/Header/Header.styles.ts` — logo: `font-size: var(--text-label)`, `font-weight: 500`
- [ ] T053 [P] Update `src/components/layout/Header/Header.styles.ts` — nav items: `font-size: var(--text-label)`, `font-weight: 500`, color `var(--color-fg)`
- [ ] T054 [P] Update `src/components/layout/Header/Header.styles.ts` — sticky with backdrop blur, transparent until scroll, CTA uses accent
- [ ] T055 [P] Update `src/components/layout/Header/Header.tsx` — ensure props/types match updated styles
- [ ] T056 [P] Update `src/components/layout/Header/Header.test.tsx` — verify styles render correctly

### Hero

- [ ] T057 Update `src/components/sections/Hero/Hero.styles.ts` — headline: `font-size: var(--text-display-hero)`, `font-weight: 700`, `line-height: 1.0`, `letter-spacing: -0.02em`, `color: var(--color-fg)`
- [ ] T058 Update `src/components/sections/Hero/Hero.styles.ts` — role (title): `font-size: var(--text-display-project)`, `font-weight: 600`, `color: var(--color-fg)`
- [ ] T059 Update `src/components/sections/Hero/Hero.styles.ts` — tagline: `font-size: var(--text-large-subtitle)`, `font-weight: 400`, `color: var(--color-fg-muted)`, `line-height: 1.625`
- [ ] T060 Update `src/components/sections/Hero/Hero.styles.ts` — CTA buttons: `font-size: var(--text-label)`, `font-weight: 500`, accent color for primary
- [ ] T061 Update `src/components/sections/Hero/Hero.styles.ts` — composition: `hero` variant, centered, max-width 900px, generous gap via `var(--space-6)`
- [ ] T062 Update `src/components/sections/Hero/Hero.tsx` — ensure structure matches updated styles
- [ ] T063 [P] Update `src/components/sections/Hero/Hero.test.tsx` — verify typography tokens applied

### About

- [ ] T064 Update `src/components/sections/About/About.styles.ts` — section title (h2): `font-size: var(--text-display-section)`, `font-weight: 700`, `line-height: 1.05`, `letter-spacing: -0.01em`, `color: var(--color-fg)`, left-aligned
- [ ] T065 Update `src/components/sections/About/About.styles.ts` — body text: `font-size: var(--text-body)`, `font-weight: 400`, `line-height: 1.625`, `color: var(--color-fg-muted)`, max-width ~700px
- [ ] T066 Update `src/components/sections/About/About.styles.ts` — composition: `about` variant (new) — left-aligned, generous negative space, NOT centered like Hero
- [ ] T067 Update `src/components/sections/About/About.styles.ts` — stats (if kept): minimal, typography-focused, no card borders, no border-top
- [ ] T068 Update `src/components/sections/About/About.tsx` — ensure structure matches updated styles
- [ ] T069 [P] Update `src/components/sections/About/About.test.tsx` — verify typography tokens applied

### Projects

- [ ] T070 Update `src/components/sections/Projects/Projects.styles.ts` — section title (h2): `font-size: var(--text-display-section)`, `font-weight: 700`, left-aligned
- [ ] T071 Update `src/components/sections/Projects/Projects.styles.ts` — `StyledProjectsGrid`: asymmetric desktop layout (e.g., 1 featured large + 2 smaller, or 2-col with large images), NOT 3-col card grid
- [ ] T072 Update `src/components/sections/Projects/Projects.styles.ts` — responsive: mobile 1-col, tablet 2-col adapted, desktop asymmetric
- [ ] T073 Update `src/components/sections/Projects/Projects.tsx` — ensure structure uses updated grid
- [ ] T074 Update `src/components/sections/ProjectCard/ProjectCard.styles.ts` — visual-first: image dominant (aspect-ratio 16:9 or 4:3), title overlay or below
- [ ] T075 Update `src/components/sections/ProjectCard/ProjectCard.styles.ts` — project title: `font-size: var(--text-display-project)`, `font-weight: 600`, `color: var(--color-fg)`
- [ ] T076 Update `src/components/sections/ProjectCard/ProjectCard.styles.ts` — tech badges: `font-size: var(--text-label)`, `font-weight: 500`, `color: var(--color-fg-muted)`, no heavy borders
- [ ] T077 Update `src/components/sections/ProjectCard/ProjectCard.styles.ts` — hover: subtle `scale(1.01)` + opacity on image, NO shadow lift, NO translateY
- [ ] T078 Update `src/components/sections/ProjectCard/ProjectCard.tsx` — ensure structure matches updated styles
- [ ] T079 [P] Update `src/components/sections/ProjectCard/ProjectCard.test.tsx` — verify visual-first design, hover transition

### Technologies

- [ ] T080 Update `src/components/sections/Technologies/Technologies.styles.ts` — section title (h2): `font-size: var(--text-display-section)`, `font-weight: 700`
- [ ] T081 Update `src/components/sections/Technologies/Technologies.styles.ts` — category title: `font-size: var(--text-label)`, `font-weight: 500`, `text-transform: uppercase`, `letter-spacing: 0.05em`, `color: var(--color-fg-subtle)`
- [ ] T082 Update `src/components/sections/Technologies/Technologies.styles.ts` — TechnologyCard: minimal — name only, `font-size: var(--text-body)`, `font-weight: 400`, `color: var(--color-fg)`, no borders/shadows
- [ ] T083 Update `src/components/sections/Technologies/Technologies.styles.ts` — layout: flow/wrap or simple grid, grouped by category with clear visual separation (space, not cards)
- [ ] T084 Update `src/components/sections/Technologies/Technologies.tsx` — ensure structure matches updated styles
- [ ] T085 [P] Update `src/components/sections/Technologies/Technologies.test.tsx` — verify categorized composition

### Contact

- [ ] T086 Update `src/components/sections/Contact/Contact.styles.ts` — section title (h2): `font-size: var(--text-display-section)`, `font-weight: 700`
- [ ] T087 Update `src/components/sections/Contact/Contact.styles.ts` — intro text: `font-size: var(--text-large-subtitle)`, `font-weight: 400`, `color: var(--color-fg-muted)`, `line-height: 1.625`
- [ ] T088 Update `src/components/sections/Contact/Contact.styles.ts` — ContactMethod links: `font-size: var(--text-body)`, `font-weight: 400`, `color: var(--color-accent)`
- [ ] T089 Update `src/components/sections/Contact/Contact.styles.ts` — composition: `contact` variant (new) — centered, vertically distributed (`justify-content: space-between`), spacious, direct
- [ ] T090 Update `src/components/sections/Contact/Contact.tsx` — ensure structure matches updated styles
- [ ] T091 [P] Update `src/components/sections/Contact/Contact.test.tsx` — verify visual closing feel

### Footer

- [ ] T092 [P] Update `src/components/layout/Footer/Footer.styles.ts` — copyright: `font-size: var(--text-secondary)`, `font-weight: 400`, `color: var(--color-fg-subtle)`
- [ ] T093 [P] Update `src/components/layout/Footer/Footer.styles.ts` — social links: icon + minimal spacing, `color: var(--color-fg-muted)`, hover `color: var(--color-accent)`
- [ ] T094 [P] Update `src/components/layout/Footer/Footer.tsx` — ensure structure matches updated styles
- [ ] T095 [P] Update `src/components/layout/Footer/Footer.test.tsx` — verify minimal style

### Section Component Updates

- [ ] T096 Update `src/components/common/Section/Section.styles.ts` — add new composition variants: `about`, `projects`, `technologies`, `contact` (distinct from each other and from `hero`)
- [ ] T097 Update `src/components/common/Section/Section.tsx` — update `SectionComposition` type to include new variants, remove `gradient` background
- [ ] T098 Update `src/components/common/Section/Section.styles.ts` — ensure each variant enforces distinct visual composition (no mechanical repetition)
- [ ] T099 Update `src/components/common/Section/Section.styles.ts` — verify responsive padding per breakpoint using token values
- [ ] T100 [P] Update `src/components/common/Section/Section.test.tsx` — verify 100dvh and composition variants

---

## FASE 5 — Animaciones

**Purpose**: Implement subtle animations after visual structure is working.

- [ ] T101 Update `src/utils/animations.ts` — ensure keyframes: `fadeInUp` (fade + translateY 20px), `fadeIn`, `scaleIn` (scale 0.95→1), `slideInLeft`, `slideInRight`
- [ ] T102 Update `src/utils/animations.ts` — stagger utilities: `staggerContainer`, `staggerItem` with 100ms increments
- [ ] T103 Update `src/hooks/useIntersectionObserver.ts` — ensure hook adds `is-visible` class on viewport entry
- [ ] T104 Apply scroll-reveal to Hero: entrance animation (fade + translate up) on section load
- [ ] T105 Apply scroll-reveal to About: fadeInUp with stagger on content blocks
- [ ] T106 Apply scroll-reveal to Projects: stagger fadeInUp on project cards
- [ ] T107 Apply scroll-reveal to Technologies: stagger fadeInUp on category groups
- [ ] T108 Apply scroll-reveal to Contact: fadeInUp on contact methods
- [ ] T109 Implement hover transitions: ProjectCard (scale 1.01 + image opacity), TechnologyCard (color transition), ContactMethod (color transition), Button (scale 1.02), Header nav (color transition)
- [ ] T110 Verify all hover transitions use ONLY `transform` (translate/scale) + `opacity` — no layout-triggering properties
- [ ] T111 Verify `prefers-reduced-motion` disables all non-essential animations globally (via globals.css and component-level media queries)

---

## FASE 6 — Responsive

**Purpose**: Explicit per-breakpoint implementation (NOT just shrinking desktop).

- [ ] T112 Verify mobile (<768px): Hero vertical centered, About single column, Projects 1-col large images, Technologies 1-col flow, Contact stacked, Header hamburger menu
- [ ] T113 Verify tablet (768-1023px): Hero adapted, About asymmetric possible, Projects 2-col adapted, Technologies 2-col grid, Contact side-by-side possible, Header inline nav
- [ ] T114 Verify desktop (≥1024px): Hero wide asymmetric, About distinct wide composition, Projects asymmetric (featured large), Technologies 3-4 col grid, Contact wide distributed, Header full nav
- [ ] T115 Verify typography scales correctly via clamp() at all breakpoints (no manual media query overrides for font-size)
- [ ] T116 Verify spacing adapts via Section padding responsive values (tokens)
- [ ] T117 Verify images responsive (max-width 100%, height auto, aspect-ratio maintained)
- [ ] T118 Verify navigation: mobile hamburger with focus trap, tablet/desktop inline
- [ ] T119 Verify all sections maintain `min-height: 100dvh` at all breakpoints (content can grow)
- [ ] T120 Verify no horizontal scrolling at any viewport width (320px - 1920px)

---

## FASE 7 — VALIDACIÓN VISUAL (HARD GATE)

**Purpose**: Manual visual review in browser. Implementation STOPS here until explicit approval.

- [ ] T121 Run `npm run typecheck` — must pass with zero errors
- [ ] T122 Run `npm run test` — must pass (unit + component tests)
- [ ] T123 Run `npm run build` — must pass with zero errors
- [ ] T124 Run `npm run dev` — start development server
- [ ] T125 Open browser at `http://localhost:5173` — manual visual review
- [ ] T126 Verify **Hero**: `clamp(3.5rem, 8vw, 7rem)` weight 700 headline; role + tagline at spec sizes; CTA weight 500; 100dvh min; centered composition; entrance animation
- [ ] T127 Verify **About**: `clamp(2.5rem, 5vw, 4.5rem)` weight 700 title; body 1rem weight 400; distinct left-aligned composition; generous negative space; no card feel
- [ ] T128 Verify **Projects**: `clamp(2.5rem, 5vw, 4.5rem)` weight 700 title; project titles `clamp(2rem, 4vw, 3.5rem)` weight 600; large images; asymmetric desktop layout; visual protagonists; hover = subtle scale/opacity
- [ ] T129 Verify **Technologies**: `clamp(2.5rem, 5vw, 4.5rem)` weight 700 title; categorized; clean typography; no logo grid; no card borders/shadows
- [ ] T130 Verify **Contact**: `clamp(2.5rem, 5vw, 4.5rem)` weight 700 title; intro `clamp(1.25rem, 2vw, 1.75rem)` weight 400; links weight 400 accent color; centered/distributed; visual closing
- [ ] T131 Verify **Global**: Inter font loads; colors match spec exactly; spacing consistent; no strong shadows; no decorative gradients; no excessive borders; 100dvh all sections; responsive at 3 breakpoints; animations subtle; prefers-reduced-motion works
- [ ] T132 **STOP — esperar validación visual del usuario antes de continuar con las siguientes fases.**

---

## Phase Dependencies & Execution Order

```
FASE 1: Auditoría
    ↓
FASE 2: Sistema Visual (Tokens)
    ↓ (must complete + typecheck)
FASE 3: Global Styles
    ↓ (must complete)
FASE 4: HOME Visual (Header → Hero → About → Projects → ProjectCard → Technologies → Contact → Footer → Section updates)
    ↓ (must complete)
FASE 5: Animaciones
    ↓ (must complete)
FASE 6: Responsive
    ↓ (must complete + all checks pass)
FASE 7: VALIDACIÓN VISUAL OBLIGATORIA  ← HARD GATE — PARADA OBLIGATORIA AQUÍ
    ↓ (only after explicit visual approval)
[Post-approval tasks would go here — NOT included in this tasks.md per instructions]
```

---

## Notes

- Total tasks: 132
- [P] tasks = different files, no dependencies — can run in parallel
- Every component in own folder with 5-file structure (`.tsx`, `.styles.ts`, `use*.ts`, `.test.tsx`, `index.ts`)
- Use `@/` imports for all internal modules — no `../../` relative paths
- styled-components via `*.styles.ts` — **No CSS Modules, vanilla-extract, Tailwind, Framer Motion**
- Design tokens drive everything — no magic numbers in component styles
- Each section = distinct visual scene — avoid repeating card grid pattern
- Typography, spacing, and composition are the product — not afterthoughts
- Inter font MUST be loaded (Google Fonts)
- Accent `#0071E3` used SPARINGLY — only links, actions, interactive states, small highlights
- No strong shadows — max `shadow-sm` (0 1px 3px rgba(0,0,0,0.1))
- No decorative gradients
- No excessive borders/cards
- No dashboard appearance