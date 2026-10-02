# Tasks: Apple-Inspired Navbar/Header

**Input**: Design documents from `/specs/002-apple-inspired-navbar/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks grouped by user story for independent implementation/testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 (desktop), US2 (tablet), US3 (mobile)

## Path Conventions

Single Vite React project at repo root: `src/components/layout/...`

---

## Phase 1: Setup

- [x] T001 Verify baseline: run `npm run typecheck && npm run lint && npm run test` in repo root and confirm current state before changes.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T002 Extend `useHeader` to expose menu state and compact-nav detection: add `menuOpen`, `setMenuOpen`/`toggleMenu`, and `useCompactNav` (matchMedia `--bp-mobile` + content-width measurement) in `src/components/layout/Header/useHeader.ts`.
- [x] T003 Wire `MobileMenu` into `Header` (render `<MobileMenu items={navigation} cta={cta} isOpen={menuOpen} onClose={...} />`) and add hamburger button markup/styles while keeping desktop nav visible ≥1024px in `src/components/layout/Header/Header.tsx` and `Header.styles.ts`.
- [x] T004 Pass `onNavigate` from `Header` to `Navigation` so selecting a section closes the menu, in `src/components/layout/Header/Header.tsx` and `src/components/layout/Navigation/Navigation.tsx`.
- [x] T005 Close `MobileMenu` when crossing the mobile/tablet breakpoint (menuOpen → false on breakpoint change) in `useHeader.ts` or a small effect in `Header.tsx`.

**Checkpoint**: Foundation ready — all user stories can proceed.

---

## Phase 3: User Story 1 — Desktop minimalista (Priority: P1) 🎯 MVP

**Goal**: Navbar horizontal compacto, hover/active sutiles, integrado con tokens existentes.

**Independent Test**: Viewport ≥1024px: estructura horizontal, altura ~48–56px, hover sutil, active con accent + `aria-current`, blur al scroll.

### Tests (write first, must fail)

- [x] T006 [P] [US1] Update/extend `src/components/layout/Header/Header.test.tsx`: compact height tokens, brand/links/cta present, no hamburger ≥768px, aria-current on active.
- [x] T007 [P] [US1] Update `src/components/layout/Navigation/Navigation.test.tsx`: hover/active classes/styles and onNavigate callback invocation.

### Implementation

- [x] T008 [US1] Restyle `Header.styles.ts`: compact height (48–56px), padding-inline via tokens, blur + subtle separation when scrolled, no heavy borders/shadows.
- [x] T009 [US1] Refine `Navigation.styles.ts`: small label typography (`--text-label`), wide gaps on desktop, subtle hover/active (accent color, 120ms transition).
- [x] T010 [US1] Ensure active-section styling + `aria-current="page"` in `Navigation.tsx` (already scaffolded; verify activeSection wiring or default to undefined).

**Checkpoint**: US1 usable/testable independently.

---

## Phase 4: User Story 2 — Tablet progresiva (Priority: P2)

**Goal**: En 768–1024px, gaps se reducen progresivamente; hamburger aparece antes de que los enlaces se corten.

**Independent Test**: Resize 1024→768px; gaps decrecen; hamburger aparece sin recorte de texto.

### Tests

- [x] T011 [P] [US2] Add test in `Header.test.tsx` simulating narrow container/breakpoint: hamburger appears, links hidden, no clipped labels.

### Implementation

- [x] T012 [US2] Add tablet spacing rules in `Navigation.styles.ts` / `Header.styles.ts` (reduced gap at ≤1024px).
- [x] T013 [US2] Switch to compact nav (hamburger) when links would overflow: use `useCompactNav` in `Header.tsx` to toggle `Navigation` vs hamburger at ≤1024px.

**Checkpoint**: US1 + US2 both work.

---

## Phase 5: User Story 3 — Mobile hamburger + menú (Priority: P1)

**Goal**: Mobile muestra logo + hamburger; menú animado, cierra por sección/Escape/overlay, accesible por teclado.

**Independent Test**: Viewport <768px: abrir con botón y teclado, cerrar de 3+ formas, transición ≤300ms, focus trap.

### Tests

- [x] T014 [P] [US3] Extend `src/components/layout/MobileMenu/MobileMenu.test.tsx`: aria-modal, Escape close, overlay click close, item select close, scroll lock.
- [x] T015 [P] [US3] Add `Header.test.tsx` case: hamburger has aria-expanded/aria-controls; opens menu; body overflow hidden while open.

### Implementation

- [x] T016 [US3] Restyle `MobileMenu.styles.ts` to Apple-inspired minimal: keep right-side drawer or full-height sheet with subtle border/none, `--text-label`/small type, large tap targets, 200ms transform, no strong shadows.
- [x] T017 [US3] Ensure hamburger button in `Header.styles.ts` has hover/active/focus-visible states and 44px hit target.
- [x] T018 [US3] Verify `useMobileMenu` wiring: focus trap, restore focus, Escape, scroll lock (already implemented — only adjust if gaps).
- [x] T019 [US3] Close menu on section select via `Navigation onNavigate → onClose` chain.

**Checkpoint**: All stories functional.

---

## Phase 6: Polish & Cross-Cutting

- [x] T020 [P] Confirm reduced-motion: zero-duration transitions via tokens already; add e2e/visual check in quickstart.
- [x] T021 [P] Verify no layout shift on menu open (body scroll lock) and correct focus return.
- [x] T022 Run `npm run typecheck && npm run lint && npm run test` and fix issues.
- [ ] T023 Run quickstart.md validation at 360/768/1024/1440px.

---

## Dependencies & Execution Order

- T001 → Phase 2 (T002–T005) → US1 (T006–T010) → US2 (T011–T013) → US3 (T014–T019) → Polish.
- US3 overlaps US2 in Header wiring; implement US2 before finalizing US3 styles if parallel.

## Parallel Examples

- US1 tests T006 ∥ T007; US3 tests T014 ∥ T015.
- During polish: T020 ∥ T021.

## Implementation Strategy

MVP = Phase 1+2+US1. Then US3 (mobile menu), then US2 (tablet progressive), then polish.
