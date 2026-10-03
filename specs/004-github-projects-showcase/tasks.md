---

description: "Task list template for feature implementation"
---

# Tasks: GitHub Projects Showcase

**Input**: Design documents from `/specs/004-github-projects-showcase/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included because the Projects feature ships with existing component tests whose assertions (link labels, DOM access patterns) must be updated when the card contract changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing infrastructure is ready for enhancement

- [x] T001 Verify existing Projects section and ProjectCard component structure in `src/components/sections/Projects/` and `src/components/sections/ProjectCard/`
- [x] T002 Verify existing data pipeline in `src/data/fetch-github.ts` and `src/data/projects.json`
- [x] T003 [P] Verify design tokens in `src/styles/tokens.ts` and `src/styles/tokens.css` include all needed Apple-style values

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type and data enhancements that MUST be complete before user story work begins

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Add `iconUrl` and `projectType` fields to `Project` interface in `src/types/project.ts`
- [x] T005 Update `transformGitHubRepo` in `src/types/github.ts` to populate `iconUrl` using Open Graph URL pattern `https://opengraph.githubassets.com/1/{owner}/{repo_name}`
- [x] T006 Update `transformGitHubRepo` in `src/types/github.ts` to detect `projectType` from repo topics (ios, android, react-native, flutter, swift, kotlin → 'mobile', else 'web')
- [x] T007 [P] Add `getProjectTypeLabel` helper in `src/utils/helpers.ts` that returns "Go Live App" for mobile and "Go Live" for web
- [x] T039 ~~Set `minStars: 1` in `src/data/fetch-github.ts`~~ **SUPERSEDED by T049**: star-based selection was removed entirely. The showcased projects are now the ones published in the GitHub profile README

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Browse GitHub Projects (Priority: P1) 🎯 MVP

**Goal**: Display project cards with name, description, icon, "Go Live" / "Go Live App" button, and "Github Repo" button

**Independent Test**: Load the Projects section and verify all project cards render with required fields and buttons link to correct destinations

### Tests for User Story 1

- [x] T008 [US1] Rewrite component tests for the new card contract in `src/components/sections/ProjectCard/ProjectCard.test.tsx` — icon render, icon fallback, icon error, Go Live / Go Live App label, Github Repo link, `target`/`rel` attributes, description fallback, skeleton, featured span

### Implementation for User Story 1

- [x] T009 [US1] Add icon display to ProjectCard in `src/components/sections/ProjectCard/ProjectCard.tsx` — show `project.iconUrl` as image with fallback placeholder
- [x] T010 [P] [US1] Add icon styles to `src/components/sections/ProjectCard/ProjectCard.styles.ts` — icon container with rounded corners, subtle border, and fallback state
- [x] T011 [US1] Add "Go Live" / "Go Live App" button to ProjectCard in `src/components/sections/ProjectCard/ProjectCard.tsx` — uses `getProjectTypeLabel()` for label, only renders when `project.demoUrl` is set
- [x] T012 [US1] Add "Github Repo" button to ProjectCard in `src/components/sections/ProjectCard/ProjectCard.tsx` — always visible, links to `project.githubUrl`
- [x] T013 [US1] Ensure both buttons open in new tab with `target="_blank"` and `rel="noopener noreferrer"` in `src/components/sections/ProjectCard/ProjectCard.tsx`
- [x] T014 [P] [US1] Add button styles to `src/components/sections/ProjectCard/ProjectCard.styles.ts` — Apple-style pill buttons with subtle background and hover state
- [x] T015 [US1] Update ProjectCard skeleton in `src/components/sections/ProjectCard/ProjectCard.tsx` and `ProjectCard.styles.ts` to include icon placeholder area and action placeholders
- [x] T016 [US1] Wire the fetched project data into the page in `src/pages/Projects.tsx` — import `src/data/projects.json`, sort with `sortProjectsByDisplayOrder`, pass `projects` and `featuredProjectIds` from `src/data/site-config.ts`
- [x] T017 [US1] Regenerate `src/data/projects.json` with `npm run fetch:github` and align `featuredProjectIds` in `src/data/site-config.ts` with the regenerated repository IDs
- [x] T018 [P] [US1] Fall back to `primaryLanguage` for `technologies` in `src/types/github.ts` when the GitHub list endpoint returns no topics

**Checkpoint**: User Story 1 is fully functional — cards show all required fields with working buttons

---

## Phase 4: User Story 2 - Responsive Apple-Style Design (Priority: P2)

**Goal**: Responsive grid layout (1/2/3 columns) with Apple-inspired hover effects and visual polish

**Independent Test**: Resize browser viewport and verify grid adapts correctly with smooth hover animations

### Implementation for User Story 2

- [x] T019 [US2] Update grid in `src/components/sections/Projects/Projects.styles.ts` — responsive grid with 1 column (<768px), 2 columns (768–1024px), 3 columns (>1024px)
- [x] T020 [US2] Add hover elevation effect to `src/components/sections/ProjectCard/ProjectCard.styles.ts` — subtle shadow increase and translateY on hover
- [x] T021 [US2] Add smooth transition timing to `src/components/sections/ProjectCard/ProjectCard.styles.ts` — use `var(--transition-normal)` and `var(--ease-out)` tokens
- [x] T022 [US2] Verify featured card spans 2 columns on desktop in `src/components/sections/ProjectCard/ProjectCard.styles.ts`
- [x] T023 [US2] Add `prefers-reduced-motion` media query to disable hover animations in `src/components/sections/ProjectCard/ProjectCard.styles.ts`
- [x] T024 [US2] Fix the featured column span so it is declared on the grid item (`StyledProjectCard`, the `article`) rather than its inner wrapper in `src/components/sections/ProjectCard/ProjectCard.styles.ts`

**Checkpoint**: User Story 2 is fully functional — responsive grid with Apple-style hover effects

---

## Phase 5: User Story 3 - Graceful Handling of Missing Data (Priority: P3)

**Goal**: Handle missing demo URLs, missing descriptions, icon load failures, and data source errors gracefully

**Independent Test**: Verify projects without demo URLs hide the button, missing descriptions show fallback, and icon failures show placeholder

### Implementation for User Story 3

- [x] T025 [US3] Add description fallback in `src/components/sections/ProjectCard/ProjectCard.tsx` — display "No description available" when `project.description` is empty
- [x] T026 [US3] Add icon error handler in `src/components/sections/ProjectCard/useProjectCard.ts` and `src/components/sections/ProjectCard/ProjectCard.tsx` — `onError` callback shows the fallback placeholder, reset when `iconUrl` changes
- [x] T027 [US3] Verify error state in `src/components/sections/Projects/Projects.tsx` — confirm error message and retry button render correctly
- [x] T028 [US3] Verify empty state in `src/components/sections/Projects/Projects.tsx` — confirm "No projects available yet" message renders when project list is empty
- [x] T029 [US3] Add description line-clamp to `src/components/sections/ProjectCard/ProjectCard.styles.ts` — ensure `-webkit-line-clamp: 3` prevents overflow

**Checkpoint**: User Story 3 is fully functional — all edge cases handled gracefully

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and quality assurance

- [x] T030 [P] Run `npm run lint` and fix issues in the files owned by this feature
- [x] T031 [P] Run `npm run typecheck` and fix any type errors
- [x] T032 Run `npm run test` and ensure all unit tests pass
- [x] T033 Run `npm run test:component` and ensure ProjectCard and Projects tests pass
- [x] T034 Run `npm run build` and verify production build succeeds
- [x] T035 [US1] Fix tech badge contrast in `src/components/ui/Badge/Badge.styles.ts` and add `--color-accent-light` in `src/styles/tokens.css` / `src/styles/tokens.ts` (accent-on-accent made badge labels unreadable)
- [x] T036 [US1] Remove the invalid `role="list"` from the projects grid in `src/components/sections/Projects/Projects.tsx` — it had no `listitem` children (critical axe violation)
- [x] T037 Run an axe-core audit (WCAG 2.1 A/AA) against the Projects section and confirm zero violations
- [x] T038 Verify quickstart.md validation checklist passes end-to-end
- [x] T040 [US1] Make the landing page "Ver Proyectos" CTA reach the Projects section — pass `{ basename: import.meta.env.BASE_URL }` to `createBrowserRouter` in `src/router.tsx` (the site is served from the `/ismaelmarot-web_2.0` subpath, so every route resolved to the catch-all 404) and render the Hero CTAs with react-router `Link` instead of raw `<a href>` in `src/components/sections/Hero/Hero.tsx`
- [x] T041 [US1] Remove the invalid `<a><button></button></a>` nesting on every CTA in `src/components/sections/Hero/Hero.tsx`, `src/components/sections/SectionSummary/SectionSummary.tsx` and `src/pages/NotFound.tsx` — the link itself is now the single interactive element styled as a button, and `src/components/sections/Hero/Hero.test.tsx` renders inside `MemoryRouter` since the component now uses `Link`
- [x] T042 Repair the pre-existing test suite: 36 failing tests across 16 files asserted CSS class names (`primary`, `sm`) and inline `style` attributes that styled-components never emits. Replaced with `toHaveStyle` for longhand properties and a shared `getCssForElement` helper in `src/test-utils/css.ts` for shorthand properties and media queries, which jsdom cannot resolve
- [x] T043 Fix the component defects those tests exposed: `justify-content: between` / `around` in `src/components/common/Grid/Grid.styles.ts` were invalid CSS keywords that the browser discarded (now `space-between` / `space-around`), `role="listitem"` on the anchors in `src/components/layout/Footer/Footer.tsx` overrode their link semantics (now a `<ul>`/`<li>` structure), and a non-decorative `Icon` had no `role="img"` in `src/components/ui/Icon/Icon.tsx`

- [x] T044 Give the blue buttons a real hover colour in `src/styles/tokens.css` and `src/styles/tokens.ts` by adding `--color-accent-hover` (`#0062C4`) and pointing `primaryHover` / `accentHover` at it. `primaryHover` previously aliased `--color-accent`, so the six blue buttons (Button primary, Hero CTA, SectionSummary CTA, NotFound CTA, SkipLink, ProjectCard Go Live) showed no change at all on hover
- [x] T045 Stop the blue buttons from turning their label blue on hover: the global `a:hover` rule in `src/styles/globals.css` had specificity (0,1,1) and outranked every styled-components class (0,1,0), so white labels were repainted accent blue over an accent blue background (1.26:1). The three global anchor rules are now wrapped in `:where()`
---
- [x] T046 Give every button the fully rounded `tokens.radii.full` shape, replacing `radii.md` in `src/components/ui/Button/Button.styles.ts`, `src/components/sections/SectionSummary/SectionSummary.styles.ts`, `src/pages/NotFound.styles.ts`, `src/components/layout/SkipLink/SkipLink.styles.ts`, `src/components/layout/MobileMenu/MobileMenu.styles.ts` (close button), `src/components/layout/Header/Header.styles.ts` (menu button) and the retry button in `src/components/sections/Projects/Projects.styles.ts`. The Hero, ProjectCard and skeleton buttons already used `radii.full`

- [x] T047 Make every landing section fill the viewport: `src/components/sections/SectionSummary/SectionSummary.styles.ts` now sets `min-height: 100vh` / `100dvh` with `display: grid; align-content: center`, matching the `fullViewport` behaviour the Hero already had through the `Section` primitive
## Dependencies & Execution Order
- [x] T048 Scroll back to the top when the current route's nav link is clicked: `ScrollToTop` only reacts to `pathname` changes, so clicking "Home" while already on Home did nothing. `src/components/layout/Navigation/Navigation.tsx` now scrolls to the top when a non-external item's `href` matches the current pathname, which covers both the desktop header and the mobile menu

- [x] T049 Replace star-based project selection with the GitHub profile README as the source of truth: `src/data/profile-readme.ts` parses the README projects tables into `{ name, repo, iconUrl, demoUrl }` in README order, `src/data/fetch-github.ts` fetches the README and resolves each listed repository, and `minStars`, `maxRepos`, `sortReposByActivity` and `limitRepos` were removed from `src/types/github.ts`
- [x] T050 Cover the README parser with unit tests in `tests/unit/profile-readme.test.ts`, make `transformGitHubRepo` accept curated overrides (icon, destination, README order) and abort the build without overwriting `src/data/projects.json` when no project resolves from the README
### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 card structure
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on US1 card structure

### Within Each User Story

- Tests before implementation for the card contract
- Styles can be developed in parallel with component logic
- Button implementation before accessibility verification
- Core implementation before edge case handling

### Parallel Opportunities

- T003 can run in parallel with T001, T002
- T007 can run in parallel with T004, T005, T006
- T010 can run in parallel with T009
- T014 can run in parallel with T011, T012, T013
- T018 can run in parallel with T009–T015
- T030, T031 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch style tasks together:
Task: "Add icon styles to ProjectCard.styles.ts"
Task: "Add button styles to ProjectCard.styles.ts"

# Launch component tasks together (after styles):
Task: "Add icon display to ProjectCard.tsx"
Task: "Add Go Live button to ProjectCard.tsx"
Task: "Add Github Repo button to ProjectCard.tsx"
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
5. Each story adds value without breaking previous stories

---

## Verification Results

Validated against real GitHub data in Chromium at 390px, 900px and 1440px viewports.

Projects shown are the ones published in the GitHub profile README (`ismaelmarot/ismaelmarot`), in the order the README lists them: 6 projects out of 50 public repositories.

| Check | Result |
|-------|--------|
| Project cards rendered | 6 (the ones listed in the profile README) |
| App icons from the README loaded / fallback placeholder | 6 / 0 |
| "Github Repo" links | 7 |
| "Go Live" links (only where `demoUrl` exists) | 2 |
| Description fallback ("No description available") | 0 |
| Grid columns at 375px / 900px / 1440px | 1 / 2 / 3 |
| Featured card width (2 columns) | 803px vs 389px |
| `target="_blank"` + `rel="noopener noreferrer"` | present on both button types |
| `-webkit-line-clamp` | 3 |
| axe-core (WCAG 2.1 A/AA) violations | 0 |
| `npm run typecheck` | pass |
| `npm run test` | 20/20 pass |
| Component suite (`npm run test:component`) | 139/139 pass across 22 files |
| `npm run lint` | pass (0 errors) |
| `npm run build` | pass |

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- T008, T016, T017, T018, T024, T035, T036, T039, T040, T041, T042, T043, T044, T045, T046, T047, T048, T049, T050 were added during implementation because the original task list did not cover them; each was required to satisfy the spec or a verified defect
- T039 was superseded by T049: showcase selection no longer depends on GitHub stars. Adding a project to the profile README is the only step needed for it to appear after `npm run fetch:github`
- `npm run lint` and `npm run test:component` are both fully green; the 36 broken assertions and 47 lint errors that predated this feature were repaired in T042 and T043
- Nav scrolling verified in Chromium at 1280x800 and 390x844: clicking the current route's link returns `scrollY` to 0 (smooth, instant under `prefers-reduced-motion`), while other routes keep working
- Landing sections verified in Chromium: the Hero and the four `SectionSummary` sections all report exactly 100vh at 1280x800 and 390x844
- All 17 buttons audited in Chromium across every route report `border-radius: 9999px`; the 44x44 icon buttons (menu toggle, close) render as circles on hover
- Button hover verified in Chromium: the five blue buttons on the Projects page go from `#0071E3` to `#0062C4` and keep a white label at 5.93:1
- Known contrast issues outside this feature's scope, all pre-existing and unaffected by T044/T045: `--color-fg-subtle` (`#86868B`) on white is 3.62:1 and fails WCAG AA (4.5:1) for the header logo, the four navigation links, the footer copyright and the About/Technologies secondary text (3.32:1 on the muted background), and `--color-accent` on the muted About background is 4.31:1. The Projects cards are unaffected
- Known ARIA issue outside this feature's scope: `ContactMethod` in `src/components/sections/ContactMethod/ContactMethod.tsx` renders `role="listitem"` while its container in `src/pages/Contact.tsx` has no `role="list"`, so axe reports `aria-required-parent` on `/contact` (3 nodes). Same class of defect as the Footer one fixed in T043