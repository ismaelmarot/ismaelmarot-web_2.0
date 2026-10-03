# Tasks: Landing Home Page

**Input**: Design documents from `/specs/003-landing-home-page/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create project structure for multi-page architecture

- [x] T001 Install react-router-dom dependency (`npm install react-router-dom`)
- [x] T002 [P] Create `src/pages/` directory structure
- [x] T003 [P] Create `src/router.tsx` with basic route definitions skeleton

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core routing infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create `src/router.tsx` with all route definitions (Home, About, Projects, Technologies, Contact, NotFound)
- [x] T005 Create `src/components/layout/Layout/Layout.tsx` with Header, `<Outlet />`, Footer pattern
- [x] T006 [P] Create `src/components/layout/Layout/Layout.styles.ts` with layout styles
- [x] T007 [P] Create `src/components/layout/Layout/useLayout.ts` with layout logic
- [x] T008 [P] Create `src/components/layout/Layout/index.ts` barrel export
- [x] T009 Update `src/App.tsx` to use `<RouterProvider>` with router from `src/router.tsx`
- [x] T010 Create `src/components/layout/ScrollToTop/ScrollToTop.tsx` for scroll restoration on route change
- [x] T011 [P] Create `src/components/layout/ScrollToTop/ScrollToTop.styles.ts`
- [x] T012 [P] Create `src/components/layout/ScrollToTop/index.ts` barrel export
- [x] T013 Update `src/components/layout/Header/Header.tsx` to use `NavLink` instead of regular links for route navigation
- [x] T014 Update `src/components/layout/Navigation/Navigation.tsx` to use `NavLink` with active state styling
- [x] T015 Update `src/data/site-config.ts` to export navigation configuration array
- [x] T016 Create `src/pages/NotFound.tsx` with 404 page component
- [x] T017 [P] Create `src/pages/NotFound.styles.ts` with 404 page styles
- [x] T018 [P] Create `src/pages/NotFound/index.ts` barrel export

**Checkpoint**: Foundation ready - routing works, layout wraps all pages, navigation uses NavLink

---

## Phase 3: User Story 1 - Discover and Navigate from Landing (Priority: P1) 🎯 MVP

**Goal**: Landing page displays Hero + section summaries (About, Projects, Technologies, Contact) with working CTAs

**Independent Test**: Load homepage, verify all section summaries visible with CTAs that navigate to correct pages

### Implementation for User Story 1

- [x] T019 [US1] Create `src/components/sections/SectionSummary/SectionSummary.tsx` with title, description, CTA props
- [x] T020 [P] [US1] Create `src/components/sections/SectionSummary/SectionSummary.styles.ts` with summary card styles
- [x] T021 [P] [US1] Create `src/components/sections/SectionSummary/useSectionSummary.ts` with CTA navigation logic
- [x] T022 [P] [US1] Create `src/components/sections/SectionSummary/index.ts` barrel export
- [x] T023 [US1] Refactor `src/pages/Index.tsx` to render Hero + SectionSummary components instead of full sections
- [x] T024 [US1] Create `src/pages/Index.styles.ts` with landing page layout styles
- [x] T025 [US1] Update `src/pages/Index.tsx` to import and render SectionSummary for About, Projects, Technologies, Contact
- [x] T026 [US1] Add featured projects preview to Projects summary using existing ProjectCard component
- [x] T027 [US1] Add technologies preview to Technologies summary using existing TechnologyCard component
- [x] T028 [US1] Update `src/components/sections/Hero/Hero.tsx` to use react-router Link for CTAs instead of hash links
- [x] T029 [US1] Create `src/pages/Index.test.tsx` with component tests for landing page

**Checkpoint**: Landing page fully functional with all section summaries and working CTAs

---

## Phase 4: User Story 2 - Navigate Between Pages via Navbar (Priority: P1)

**Goal**: Navbar allows navigation between all pages with active state styling and GitHub external link

**Independent Test**: Click each navbar link, verify correct page loads with active state

### Implementation for User Story 2

- [x] T030 [US2] Update `src/components/layout/Header/Header.tsx` to pass navigation config from site-config
- [x] T031 [US2] Update `src/components/layout/Navigation/Navigation.tsx` to use `NavLink` with `isActive` for active styling
- [x] T032 [US2] Update `src/components/layout/Navigation/Navigation.styles.ts` to add active link styles
- [x] T033 [US2] Update `src/components/layout/MobileMenu/MobileMenu.tsx` to use `NavLink` for navigation items
- [x] T034 [US2] Update `src/components/layout/MobileMenu/MobileMenu.styles.ts` to add active link styles for mobile
- [x] T035 [US2] Verify logo/brand links to `/` (Home) in Header component
- [x] T036 [US2] Verify GitHub CTA opens in new tab with `target="_blank"` and `rel="noopener noreferrer"`
- [x] T037 [US2] Create `src/components/layout/Header/Header.test.tsx` with navigation tests

**Checkpoint**: Navbar fully functional with active states and external GitHub link

---

## Phase 5: User Story 3 - View Full Content on Individual Pages (Priority: P1)

**Goal**: Each sub-page (About, Projects, Technologies, Contact) displays full content

**Independent Test**: Navigate to each page, verify full content is displayed

### Implementation for User Story 3

- [x] T038 [US3] Create `src/pages/About.tsx` that renders full About section content
- [x] T039 [P] [US3] Create `src/pages/About.styles.ts` with About page styles
- [x] T040 [P] [US3] Create `src/pages/About/index.ts` barrel export
- [x] T041 [US3] Create `src/pages/Projects.tsx` that renders full Projects section with data fetching
- [x] T042 [P] [US3] Create `src/pages/Projects.styles.ts` with Projects page styles
- [x] T043 [P] [US3] Create `src/pages/Projects/index.ts` barrel export
- [x] T044 [US3] Create `src/pages/Technologies.tsx` that renders full Technologies section
- [x] T045 [P] [US3] Create `src/pages/Technologies.styles.ts` with Technologies page styles
- [x] T046 [P] [US3] Create `src/pages/Technologies/index.ts` barrel export
- [x] T047 [US3] Create `src/pages/Contact.tsx` that renders full Contact section
- [x] T048 [P] [US3] Create `src/pages/Contact.styles.ts` with Contact page styles
- [x] T049 [P] [US3] Create `src/pages/Contact/index.ts` barrel export
- [x] T050 [US3] Update `src/components/sections/About/About.tsx` to work as standalone page content
- [x] T051 [US3] Update `src/components/sections/Projects/Projects.tsx` to work as standalone page content
- [x] T052 [US3] Update `src/components/sections/Technologies/Technologies.tsx` to work as standalone page content
- [x] T053 [US3] Update `src/components/sections/Contact/Contact.tsx` to work as standalone page content
- [x] T054 [US3] Create `src/pages/About.test.tsx` with component tests
- [x] T055 [US3] Create `src/pages/Projects.test.tsx` with component tests
- [x] T056 [US3] Create `src/pages/Technologies.test.tsx` with component tests
- [x] T057 [US3] Create `src/pages/Contact.test.tsx` with component tests

**Checkpoint**: All individual pages fully functional with complete content

---

## Phase 6: User Story 4 - Experience Responsive Layout Across Devices (Priority: P2)

**Goal**: All pages adapt layout appropriately for mobile, tablet, and desktop

**Independent Test**: View site at 375px, 768px, 1440px widths, verify proper layout at each breakpoint

### Implementation for User Story 4

- [x] T058 [US4] Update `src/components/sections/SectionSummary/SectionSummary.styles.ts` with responsive breakpoints (mobile: stack, tablet/desktop: grid)
- [x] T059 [US4] Update `src/pages/Index.styles.ts` with responsive layout for landing page
- [x] T060 [US4] Update `src/components/layout/Header/Header.styles.ts` with responsive navbar (hamburger on mobile)
- [x] T061 [US4] Update `src/components/layout/MobileMenu/MobileMenu.styles.ts` with mobile-optimized styles
- [x] T062 [US4] Update `src/components/layout/Footer/Footer.styles.ts` with responsive footer layout
- [x] T063 [US4] Verify touch targets are minimum 44x44px on mobile for all interactive elements
- [x] T064 [US4] Create `tests/e2e/responsive.spec.ts` with Playwright responsive tests

**Checkpoint**: All pages fully responsive with proper layout at all breakpoints

---

## Phase 7: User Story 5 - Experience Polished Visual Design (Priority: P2)

**Goal**: Consistent visual design across all pages with subtle animations and reduced-motion support

**Independent Test**: Visual inspection of all pages, verify design tokens consistency and animation behavior

### Implementation for User Story 5

- [x] T065 [US5] Update `src/components/sections/Hero/Hero.styles.ts` with entrance animations (fade-up)
- [x] T066 [US5] Update `src/components/sections/SectionSummary/SectionSummary.styles.ts` with hover transitions
- [x] T067 [US5] Update `src/components/layout/Layout/Layout.styles.ts` with page transition fade-in
- [x] T068 [US5] Verify all animations respect `prefers-reduced-motion` media query
- [x] T069 [US5] Update `src/styles/globals.css` with page transition keyframes
- [x] T070 [US5] Create `tests/e2e/animations.spec.ts` with Playwright animation tests
- [x] T071 [US5] Run `npm run test:a11y` and verify zero critical accessibility violations

**Checkpoint**: Visual design polished, animations subtle and purposeful, accessibility validated

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, testing, and deployment preparation

- [x] T072 [P] Update `README.md` with multi-page architecture documentation
- [x] T073 [P] Create `public/404.html` as copy of `index.html` for GitHub Pages SPA fallback
- [x] T074 [P] Update `vite.config.ts` with base path configuration for GitHub Pages
- [x] T075 Run `npm run typecheck` and verify zero TypeScript errors
- [x] T076 Run `npm run lint` and verify zero ESLint errors
- [x] T077 Run `npm run test` and verify all unit tests pass
- [x] T078 Run `npm run test:component` and verify all component tests pass
- [x] T079 Run `npm run test:e2e` and verify all E2E tests pass
- [x] T080 Run `npm run build` and verify production build succeeds
- [x] T081 Run `npm run preview` and manually verify all pages work in production build
- [x] T082 Create `tests/e2e/deep-linking.spec.ts` with Playwright deep linking tests
- [x] T083 Create `tests/e2e/navigation.spec.ts` with Playwright navigation flow tests

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 (Landing) → US2 (Navbar) → US3 (Pages) → US4 (Responsive) → US5 (Polish)
  - US2 depends on US1 (navbar must work with landing page routes)
  - US3 depends on US1 (CTAs link to these pages)
  - US4 and US5 can start after US3
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on US1 (navbar must navigate to landing page routes)
- **User Story 3 (P1)**: Depends on US1 (CTAs link to these pages)
- **User Story 4 (P2)**: Depends on US3 (responsive layout for all pages)
- **User Story 5 (P2)**: Depends on US3 (visual polish for all pages)

### Within Each User Story

- Styles can be created in parallel with components
- Tests should be written after implementation (or before if TDD preferred)
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Within US1: SectionSummary component files can be created in parallel
- Within US3: All page components can be created in parallel (different files)
- Within US3: All page test files can be created in parallel
- Within US4: All style updates can be run in parallel
- Within US5: All animation updates can be run in parallel

---

## Parallel Example: User Story 3

```bash
# Launch all page components for User Story 3 together:
Task: "Create src/pages/About.tsx that renders full About section content"
Task: "Create src/pages/Projects.tsx that renders full Projects section with data fetching"
Task: "Create src/pages/Technologies.tsx that renders full Technologies section"
Task: "Create src/pages/Contact.tsx that renders full Contact section"

# Launch all page styles for User Story 3 together:
Task: "Create src/pages/About.styles.ts with About page styles"
Task: "Create src/pages/Projects.styles.ts with Projects page styles"
Task: "Create src/pages/Technologies.styles.ts with Technologies page styles"
Task: "Create src/pages/Contact.styles.ts with Contact page styles"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 → User Story 2
   - Developer B: User Story 3 (pages)
   - Developer C: User Story 4 + User Story 5 (responsive + polish)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (if TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
