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

---

## Amendment 1: The Name and Title on a Black Band

Added 2026-10-04, after implementation and deployment. See "Amendment 1" in `spec.md` for FR-016
through FR-022 and SC-011 through SC-014.

- [X] A001 [P] Measure the Hero's current geometry: 100dvh at every viewport, name 112px and 680px wide at 1440, title 56px, tagline 28px and 700px wide, content block 434px tall, gaps of 24/24/40
- [X] A002 [P] Confirm in the browser that `section#hero` measures x:0 with a width equal to `clientWidth` at 1600, 1440 and 390, with zero horizontal overflow, so a band child can reach full width with `width: 100%` and no `100vw`
- [X] A003 Confirm the five existing Hero tests assert no colours or backgrounds, so the restructure cannot break them
- [X] A004 [P] Add `StyledHeroBand` and `StyledHeroIdentity` in `src/components/sections/Hero/Hero.styles.ts`, with `width: 100%` explicit because the hero composition sets `align-items: center`
- [X] A005 Write the name and the title in `var(--color-white)`, and keep the tagline on the dark foreground by variant, since the title and the tagline share one styled component
- [X] A006 [P] Restructure `src/components/sections/Hero/Hero.tsx` so the band is a sibling of the container, and nest the shared `Container` inside the band rather than repeating its widths and padding
- [X] A007 [P] Add seven Hero tests: pure black without `100vw`, the name and title inside the band, the tagline and buttons outside it, both in white, the tagline still dark, fluid padding, and the gap below
- [X] A008 Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:component` and `npm run build`
- [X] A009 Verify the band spans the viewport at 320, 390, 768, 1024, 1280, 1440 and 1600, including 1600 where the container is inset 160px per side
- [X] A010 Verify `scrollWidth - clientWidth` is 0 at every one of those widths, which is the real test that avoiding `100vw` worked
- [X] A011 Verify the Hero still fills the viewport without overflowing at 320x640, the tightest case
- [X] A012 Run axe at 1440 and 390 and confirm zero violations, and capture the Hero at both sizes

### Verification Results

| Criterion | Result |
|-----------|--------|
| SC-011 band spans the viewport | Pass: band width equals viewport width at all seven widths, starting at x:0, including 1600 where the container sits at x:160 |
| SC-012 no horizontal overflow | Pass: `scrollWidth - clientWidth` is 0 at all seven widths |
| SC-013 white on black | Pass: name and title both `rgb(255, 255, 255)` on `rgb(0, 0, 0)`, 21:1 |
| SC-014 tagline on white, Hero fills | Pass: tagline `rgb(110, 110, 115)`, and the section matches the viewport height at all seven sizes |
| SC-006 axe | Pass: 0 violations at 1440 and 390 |

Measured band padding: 40px at 320 and 390, 49.15px at 768, 64px from 1024 up. Measured gap below
the band: 24px at 320 and 390, 26.88px at 768, 40px from 1280 up.

### One defect the browser check found

The Hero overflowed its viewport by 22px at 320x640 and the cause was not the band's padding in
isolation. "Ismael Marot" at the 56px floor of `--text-display-hero` measures 318px inside a 288px
gutter at that width, so the name wraps to two lines and stands 112px tall. That was already true
before this amendment; the section fitted because it had 102px of slack above its `min-height`. The
band spent that slack.

Fixed by making both of the band's vertical values fluid rather than stepped, so they scale together:
`padding-block: clamp(40px, 6.4vw, 64px)` and `margin-bottom: clamp(24px, 3.5vw, 40px)`. A stepped
48px below 768px left the section 6px over at 320 and would have needed a third breakpoint to close.
The section now measures exactly 640 of 640 at 320x640.

### Notes on this amendment

- **A002 is the task that avoided the wrong implementation.** The obvious way to make a band span the
  screen is `width: 100vw`, and it is wrong: `100vw` includes the scrollbar, so on a platform with
  classic scrollbars it adds roughly 15px of horizontal scroll. Measuring the section first showed it
  already equals `clientWidth`, which makes `width: 100%` both correct and cheaper.
- **A005 exists because the title and the tagline are one styled component.** Recolouring by
  surroundings rather than by variant would have put dark text on the black band. A test asserts the
  tagline stays dark for exactly that reason.
- **A007 uses `within` rather than `closest`.** `closest` is what the lint rule objects to, and scoping
  the band is also the stronger assertion: it states the whole containment rather than one hop up.
- **The section's own `size="xl"` padding is 40px at 320**, which was part of what made the narrow case
  tight. It was left alone rather than reduced, because it belongs to the shared Section component and
  changing it would move every page.

---

## Amendment 2: The Band Reaches the Top and the Header Turns With It

Added 2026-10-04, after implementation and deployment. See "Amendment 2" in `spec.md` for FR-023
through FR-029 and SC-015 through SC-019.

- [X] A013 [P] Measure why the band was not at the top: it sat at y:161 on a 1440px viewport against 80px of section padding, so 81px came from `verticalAlign` centring the content block, not from the padding
- [X] A014 [P] Measure every colour currently in the header against `#000000` and confirm all three fail: logo 1.25:1, navigation 4.14:1, GitHub CTA 3.54:1
- [X] A015 [P] Confirm every colour in the Header and Navigation styles is already a `var(--color-*)`, so a dark treatment can cascade without prop drilling or changing Navigation's API
- [X] A016 [P] Measure where the switch has to happen, being the band height less the header's 52px: 303px at 1440, 248px at 1024, 160px at 390
- [X] A017 Confirm the mobile menu is portaled to `document.body`, outside the header subtree, so it keeps its white panel without any of the dark treatment reaching it
- [X] A018 Add `StyledHeroSection` in `src/components/sections/Hero/Hero.styles.ts` with `padding-top: 0` and the bottom padding declared explicitly, and switch the Hero to `verticalAlign="top"`
- [X] A019 Give `StyledHero` in the same file `margin-block: auto` so the tagline and buttons stay centred in the space below the band
- [X] A020 Mark the band `data-header-contrast="dark"` so the header can find it without being told from a prop
- [X] A021 Rewrite `src/components/layout/Header/useHeader.ts` to add `overDark`, driven by the region's bottom edge against the header's own height, with the element cached and re-resolved only when disconnected
- [X] A022 Add the `$overDark` branch to `StyledHeader` in `src/components/layout/Header/Header.styles.ts`: black, no border, and the custom property overrides that cascade to the brand, navigation and menu button
- [X] A023 [P] Introduce `--link-hover-decoration`, defaulting to `none`, in `src/components/layout/Navigation/Navigation.styles.ts` and the CTA in the header, so white text has a hover that works and the light theme does not change
- [X] A024 [P] Add five Header tests covering the dark treatment, that 150px of scroll does not turn it white, the boundary in both directions, and that a page with no dark region is untouched
- [X] A025 Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:component` and `npm run build`
- [X] A026 Verify the band starts at y:0 at 320, 390, 768, 1024, 1280, 1440 and 1600 with no horizontal overflow
- [X] A027 Verify the header at 390px is black with no border at scrollY 0, 100 and 150, and white with a 1px border at 200 and 400, which brackets the measured 160px threshold
- [X] A028 Verify `/projects`, `/about` and `/technologies` are unchanged: transparent at the top, white with a border when scrolled
- [X] A029 Verify the nav items and CTA resolve to white over the black band, and that a real hover produces the underline with a 4px offset
- [X] A030 Run axe on the home page and confirm zero violations

### Verification Results

| Criterion | Result |
|-----------|--------|
| SC-015 band at y:0 | Pass at 320, 390, 768, 1024, 1280, 1440 and 1600, with zero horizontal overflow at each |
| SC-016 black at the top | Pass: at 390px the header is `rgb(0,0,0)` with a 0px border at scrollY 0, 100 and 150, logo `rgb(255,255,255)` |
| SC-017 light past the threshold | Pass: white with a 1px border at scrollY 200 and 400, which brackets the measured 160px |
| SC-018 other pages unchanged | Pass: `/projects`, `/about` and `/technologies` are transparent at the top and white with a border when scrolled |
| SC-019 contrast and axe | Pass: logo 21:1, all header text `#FFFFFF`, axe 0 violations |

Hover over the black band resolves to white text with `underline` and a 4px offset, and the light
theme's own hover is untouched.

### Notes on this amendment

- **A013 corrected an assumption before it became a bug.** The band's top edge was 81px lower than the
  section's padding accounted for, and the cause was vertical centring rather than padding. Removing
  the padding alone would have left the band at y:81 with a white gap under the header, which is the
  symptom this amendment is about.
- **A014 is why this was not a one-line change.** Three of the header's colours fail on black, so
  "make the header dark" meant recolouring the brand, the navigation and the CTA, not just its
  background.
- **A015 is why there are no new props.** Because every colour in the subtree was already a custom
  property, the treatment is a block of overrides on the header and nothing else changes shape.
- **A023 exists because white has nowhere to brighten to.** The existing hover darkens from
  `--color-text-secondary` to `--color-text-primary`; with both white there is no visible change, so the
  affordance became an underline behind a property that defaults to `none`.
- **The Header tests stub two things jsdom does not implement.** `offsetHeight` is always 0, which
  would collapse the switch to `bottom > 0`, and `window.scrollTo` does not move `scrollY`. Both are
  stubbed to the real values, 52px and a set scrollY, so the boundary is exercised rather than
  approximated. An earlier version of the test also appended a second region instead of moving the
  first, which meant `querySelector` kept returning the original and the test passed for the wrong
  reason.

---

## Amendment 3: The Hero Is Distributed Like the Rest of the Page

Added 2026-10-04, after the report that the name and title sat too high. See "Amendment 3" in
`spec.md` for FR-030 through FR-034 and SC-020 through SC-024.

- [X] A031 [P] Measure the vertical balance of every section on the Home page and confirm the Hero was the only one unbalanced at 0 above and 322 below, against 319/318 on three sections and 208/207 on the fourth
- [X] A032 [P] Confirm the header's 52px is hardcoded in `StyledInner` with no token, which is why the band had no way to reserve it
- [X] A033 Add `--header-height: 52px` to `src/styles/tokens.css` and use it for the header's height, so the header and the band read the same value
- [X] A034 Move `margin-block: auto` from `StyledHero` to a new `StyledHeroBody` wrapping the content `Container`, because auto margins only distribute free space on a flex item and the Container is the section's direct child
- [X] A035 [P] Set the band's top padding to `calc(var(--header-height) + var(--space-12))`, and `+ var(--space-8)` below 768px, leaving 48px and 32px of clearance under the header
- [X] A036 [P] Keep the band's bottom padding on the 64px scale, matching the `padding-block` of the four summary sections
- [X] A037 [P] Rewrite the Amendment 1 test that asserted a single fluid `padding-block`, since the top and bottom are now separate declarations, and add tests for the derived top padding, the 64px bottom and the placement of the centring margins
- [X] A038 Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:component` and `npm run build`
- [X] A039 Verify the clearance between the header's bottom edge and the name's top at 320, 390, 768, 1024, 1280, 1440 and 1600, and confirm the two never overlap
- [X] A040 Verify the Hero's empty space above and below its content matches to within 1px at every one of those widths
- [X] A041 Capture the Home page at 1440 and 390 and inspect the composition before committing

### Verification Results

| Criterion | Result |
|-----------|--------|
| SC-020 clearance between 32 and 64px | Pass: 48px at 768 and above, 32px below, at all seven widths |
| SC-021 name never overlaps the header | Pass: name at y:100 against a header ending at y:52, and y:84 against y:52 on mobile |
| SC-022 empty space balanced within 1px | Pass: 103/103 at 1440, 66/66 at 1280, 79/79 at 1024, 253/253 at 768, 167/167 at 390, 3/3 at 320 |
| SC-023 band full width and at y:0 | Pass: y:0 and viewport width at all seven widths, unchanged by this amendment |
| SC-024 suite | Pass: 91 unit and 327 component |

### A measurement that first reported a false defect

The first pass reported the Hero 24 to 40px out of balance at every width, which would have meant the
fix did not work. It did not: the difference was exactly the band's own `margin-bottom` at each
breakpoint, 40px at 1440, 35 at 1024, 27 at 768 and 24 at 390, which the measurement was counting as
"empty above". The margin sits between the band and the content, so it is not part of the free space
the auto margins distribute. Once excluded, every width balances to the pixel.

### Notes on this amendment

- **A031 is why this was a bug and not a preference.** Four sections sat at 319/318 and one at 0/322.
  A design decision does not look like that next to its neighbours; a broken declaration does.
- **A034 is the whole defect in one line.** Auto margins distribute free space on a flex item.
  `StyledHero` is a grandchild, so the declaration was inert, and an inert declaration reads as a layout
  that happens to be top-aligned rather than as an error.
- **A033 is the smallest change that makes the relationship maintainable.** Writing `100px` would have
  been one character shorter and would have broken silently the day the header changed height.
- **A037 rewrites a test rather than deleting it.** The Amendment 1 test asserted a single fluid
  `padding-block`, which is correct for that design and wrong for this one.
