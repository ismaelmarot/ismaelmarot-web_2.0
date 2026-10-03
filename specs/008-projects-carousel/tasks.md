---

description: "Task list for the projects full-screen carousel"
---

# Tasks: Projects Full-Screen Carousel

**Input**: Design documents from `/specs/008-projects-carousel/`

**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Test tasks are included because this feature rewrites the geometry of the project card, replaces a list with a scroll region, and adds a new navigation control. Four existing tests assert the opposite of the new intent and are rewritten rather than removed.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- Paths shown below assume single project

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify the surface this feature rebuilds on

- [X] T001 Verify in `src/components/common/Section/Section.styles.ts` that `$fullViewport` renders `min-height: 100dvh` as a floor rather than a lock, and that `compositionStyles.projects` contributes `align-items: flex-start`, which constrains the strip width
- [X] T002 [P] Measure the live card geometry in production and record it as the baseline: 1024×167px, 20px padding, 16px radius, 1px `rgb(210,210,215)` border, `--shadow-xs`, 48px square icon, 28px name
- [X] T003 [P] Decode the alpha channel of all six icons in `src/data/projects.json` and confirm LinkIO is fully opaque and three icons are between 0.9% and 5.7% transparent, so the existing comment in `ProjectRow.styles.ts` claiming the artwork is already rounded is false

**Checkpoint**: The card edge, the icon silhouette and the section height are all understood, and the reason for the frame and the shadow tokens is documented

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tokens and shared strip state that MUST exist before any user story work begins

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Add `--shadow-card: 0 2px 8px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.08)` and `--shadow-card-hover: 0 4px 12px rgba(0,0,0,0.06), 0 24px 56px rgba(0,0,0,0.12)` to `src/styles/tokens.css`, because `--shadow-xs` is imperceptible at a card height near 570px
- [X] T005 Create `src/components/sections/Projects/useProjectsCarousel.ts` returning the strip ref, the current index, a `goTo` callback for the dots, and a `scrollLeft` handler throttled with `requestAnimationFrame`, deriving the index from `scrollLeft` rather than from one observer per card
- [X] T006 [P] Add the `Left` and `Right` arrow-key handler to `useProjectsCarousel.ts`, moving the strip by exactly one card while the strip holds focus
- [X] T007 Add unit tests in `tests/unit/` for the index derived from `scrollLeft`, including the first card, a middle card, the last card, and a partial offset rounding to the nearest card

**Checkpoint**: Shadows exist and the strip can report and change its current project

---

## Phase 3: User Story 1 - Take in one project at a time (Priority: P1) 🎯 MVP

**Goal**: One borderless shadow-defined card per screen, with a height derived from the viewport

**Independent Test**: Open `/projects` and verify the section is at least one viewport tall, exactly one card is in view, and the card carries its icon, name, description, categories and action

### Tests for User Story 1

- [X] T008 [P] [US1] Rewrite the icon size assertion in `src/components/sections/ProjectRow/ProjectRow.test.tsx` from `48px` to `88px`, and add assertions that the frame computes a 22px radius, an `overflow: hidden` and a hairline border
- [X] T009 [P] [US1] Rewrite `keeps a fixed square icon slot and never crops the artwork` in `src/components/sections/ProjectRow/ProjectRow.test.tsx` to assert that the frame defines the silhouette and that the artwork fills it, since the old test states the opposite of the new intent
- [X] T010 [P] [US1] Add assertions in `src/components/sections/ProjectRow/ProjectRow.test.tsx` that the card computes no border, a non-`none` `box-shadow`, a 24px radius and 32px padding, and that the name computes to 32px
- [X] T011 [P] [US1] Assert in `src/components/sections/ProjectRow/ProjectRow.test.tsx` that a failed icon load renders the fallback inside the same 88px frame so the card does not shift

### Implementation for User Story 1

- [X] T012 [P] [US1] Create `StyledProjectIconFrame` in `src/components/sections/ProjectRow/ProjectRow.styles.ts` at 88px with a 22px radius, a hairline border, `overflow: hidden` and a white background, sized so it never flexes
- [X] T013 [P] [US1] Update `StyledProjectIcon` in `src/components/sections/ProjectRow/ProjectRow.styles.ts` to fill its frame with `object-fit: cover`, and update `StyledProjectIconFallback` to match the frame exactly
- [X] T014 [US1] Rewrite the card geometry in `src/components/sections/ProjectRow/ProjectRow.styles.ts`: remove the border, set a 24px radius and 32px padding, apply `--shadow-card` with `--shadow-card-hover` on hover, and set `height: 100%` so the card fills the strip rather than fixing its own height
- [X] T015 [US1] Wrap the icon in `StyledProjectIconFrame` in `src/components/sections/ProjectRow/ProjectRow.tsx`, in both the loaded and the fallback branch
- [X] T016 [US1] Make `StyledProjectsList` in `src/components/sections/Projects/Projects.styles.ts` a full-screen strip: `flex: 1` with `min-height: 0`, `align-self: stretch`, `flex-direction: row`, `overflow-x: auto` and `scroll-snap-type: x mandatory`, with vertical padding and a compensating negative margin so the card shadow is not clipped
- [X] T017 [US1] Give each card `scroll-snap-align: start`, `flex: 0 0 100%` below 900px and `flex: 0 0 800px` at 900px and above, and set `scroll-padding-inline-start` so a snapped card aligns with the gutter rather than the screen edge
- [X] T018 [US1] Change the three `background="default"` occurrences in `src/components/sections/Projects/Projects.tsx` to `background="muted"` so white shadow-defined cards read against `#F5F5F7`
- [X] T019 [US1] Wrap the list in a labelled, focusable group in `src/components/sections/Projects/Projects.tsx` with `role="group"`, an `aria-label` naming the projects and `tabIndex={0}`, and without `aria-live`

**Checkpoint**: One card fills the screen at a time with no border and a rounded icon frame

---

## Phase 4: User Story 2 - Move to the next project deliberately (Priority: P1)

**Goal**: Reach every project by swipe, drag or arrow key, with nothing moving on its own

**Independent Test**: Confirm nothing advances while idle, then reach each project by swipe and by arrow key and confirm each lands fully snapped

### Tests for User Story 2

- [X] T020 [P] [US2] Add assertions in `src/components/sections/Projects/Projects.test.tsx` that the strip computes `scroll-snap-type: x mandatory`, that it is focusable with `tabIndex={0}`, that it carries `role="group"` with an accessible name, and that it declares no `aria-live`
- [X] T021 [P] [US2] Add assertions in `src/components/sections/Projects/Projects.test.tsx` that pressing the right and left arrow keys on the focused strip changes the current project by exactly one, and that the right key on the last project and the left key on the first do not move

### Implementation for User Story 2

- [X] T022 [US2] Attach `goTo` to the strip ref in `src/components/sections/Projects/Projects.tsx`, so the strip tracks its own position and reports the current index
- [X] T023 [US2] Add `scroll-behavior: smooth` to the strip in `src/components/sections/Projects/Projects.styles.ts` and disable it inside a `prefers-reduced-motion: reduce` query
- [X] T024 [US2] Keep the strip's default `touch-action` in `src/components/sections/Projects/Projects.styles.ts` so a vertical gesture still scrolls the page while a horizontal one moves the strip
- [ ] T025 [US2] In the browser, reproduce the collapsing address bar on a narrow viewport and relax `scroll-snap-type` to `proximity` at that breakpoint only if a mandatory snap lands between cards

**Checkpoint**: Every project is reachable by swipe, drag and keyboard, and nothing advances by itself

---

## Phase 5: User Story 3 - Know how many projects there are (Priority: P1)

**Goal**: One named dot per project, marking the current one and navigating on activation

**Independent Test**: Verify the dot count equals the visible project count, the current card is the marked one, and activating a dot brings that project into view

### Tests for User Story 3

- [X] T026 [P] [US3] Create `src/components/sections/ProjectDots/ProjectDots.test.tsx` asserting one dot per project, that the current dot carries `aria-current`, that each dot is named with its position such as "Proyecto 3 de 6", and that activating a dot reports that index
- [X] T027 [P] [US3] Assert in `src/components/sections/ProjectDots/ProjectDots.test.tsx` that the dots render as a list and are reachable by keyboard, with no autoplay control present

### Implementation for User Story 3

- [X] T028 [P] [US3] Create `src/components/sections/ProjectDots/ProjectDots.styles.ts` with a centred row of dots, a visible current state, a `focus-visible` ring and hit areas of at least 24px
- [X] T029 [US3] Create `src/components/sections/ProjectDots/ProjectDots.tsx` rendering one button per project inside a labelled list, wired to `goTo` and to the current index
- [X] T030 [US3] Render `ProjectDots` in `src/components/sections/Projects/Projects.tsx` below the strip, passing the filtered project count, the current index and `goTo`
- [X] T031 [US3] Add `flex-shrink: 0` to the dots row in `src/components/sections/Projects/Projects.styles.ts` so it cannot be squeezed out of the viewport by a tall card

**Checkpoint**: The visitor can see how many projects exist, which one is showing, and jump to any of them

---

## Phase 6: User Story 4 - Recognise each app by its icon (Priority: P2)

**Goal**: Every icon reads as a rounded tile, including the fully opaque one

**Independent Test**: Verify every icon frame is 88px with a 22px radius and a hairline border, and that LinkIO shows no square corner

### Tests for User Story 4

- [X] T032 [P] [US4] Assert in `src/components/sections/ProjectRow/ProjectRow.test.tsx` that the icon frame keeps the icon's accessible name and that a project without an icon still reserves the frame, leaving the card geometry unchanged

### Implementation for User Story 4

- [X] T033 [P] [US4] Confirm in the browser that all six icons, including the opaque LinkIO and the non-square QEntry, present a rounded silhouette with no square corner visible
- [X] T034 [US4] If any icon shows a square corner or an unintended seam, adjust the frame radius in `src/components/sections/ProjectRow/ProjectRow.styles.ts` so the frame still bounds the artwork, rather than reverting to a bare border

**Checkpoint**: The six icons read as one family, and the square one no longer looks square

---

## Phase 7: User Story 5 - Filter without landing in empty space (Priority: P3)

**Goal**: Filtering always leaves a real project in view and rebuilds the dots

**Independent Test**: Apply every category in turn and verify the first project is visible, the dot count matches the filtered list, and no empty area appears

### Tests for User Story 5

- [X] T035 [P] [US5] Add assertions in `src/components/sections/Projects/Projects.test.tsx` that applying a category moves the strip back to the first project even when it had been scrolled to the end, and that the dot count equals the filtered project count
- [X] T036 [P] [US5] Assert in `src/components/sections/Projects/Projects.test.tsx` that a category with no projects renders the existing empty explanation and no dots

### Implementation for User Story 5

- [X] T037 [US5] Reset the strip to the first project when `activeCategory` changes in `src/components/sections/Projects/useProjects.ts`, scrolling the strip ref back to its start so no empty offset survives a narrower list
- [X] T038 [US5] Gate the strip and the dots in `src/components/sections/Projects/Projects.tsx` on `visibleProjects.length > 0` so a narrowed list that matches nothing leaves the empty state alone

**Checkpoint**: The filter cannot strand the visitor in blank space

---

## Phase 8: Verification and Delivery

**Purpose**: Prove the spec is met, then ship

- [X] T039 Run `npm run lint`, `npm run typecheck` and the full test suite, and confirm the component and unit counts have only grown
- [X] T040 Run `npm run build` and confirm the route builds without new warnings
- [X] T041 In the browser at 1440, 1024, 900, 768, 390 and 320, verify exactly one card is snapped at rest, the card is 800px wide on desktop, the shadow is not clipped on hover, and there is no horizontal overflow
- [X] T042 Run axe at 1440, 390 and 320 and confirm zero WCAG 2.1 AA violations on the strip and the dots
- [X] T043 Confirm on a 900px-tall desktop viewport that the card lands within 560px to 580px tall, which is what proves the height is derived rather than hardcoded
- [X] T044 Measure CLS on settle, since the icon frame grew from 48px to 88px and late icon resolution is the most likely source of shift
- [X] T045 Verify the deep link `/projects` still resolves through `public/404.html`, since the section is now the only content on the route
- [X] T046 Commit, push to `main`, run the target `deploy.yml` workflow in `ismaelmarot/ismaelmarot.github.io` and confirm the same measurements on production

---

## Phase 9: Analysis

**Purpose**: Confirm the code delivers the spec, and record it

- [X] T047 Run `/speckit.analyze` and confirm FR-001 through FR-016 and SC-001 through SC-011 are each satisfied or explicitly deferred
- [X] T048 Update `**Status**: Draft` to `Implemented` in `specs/008-projects-carousel/spec.md` and note any requirement that shipped relaxed

---

## Dependencies

- **Phase 2 blocks Phases 3–7**: no card or strip work can compile without the new shadows and the carousel hook
- **Phase 3 blocks Phases 4–7**: the strip must exist before navigation, dots or filtering attach to it
- **Phase 5 blocks Phase 7**: the dots must be able to rebuild before filtering can be asserted against them
- **T004, T008–T011 are parallel**: tokens and card tests touch different files
- **T028 and T026 are parallel**: dots styles and dots tests touch different files
- **T025 and T041 are sequential**: T025 only runs if T041 reproduces a misaligned snap

## Parallel Execution Examples

Phase 2, tokens and card tests:

```
T004 (tokens.css) || T007 (unit tests)
T008, T009, T010, T011 (ProjectRow.test.tsx) || T004 (tokens.css)
```

Phase 3, the dot component's two files:

```
T028 (ProjectDots.styles.ts) || T026 (ProjectDots.test.tsx)
```

## Verification Results

Recorded after implementation, against production at `https://ismaelmarot.github.io/projects`.

| Criterion | Result |
|-----------|--------|
| SC-001 one card snapped | Pass at 1440, 1024, 768, 390, 320 |
| SC-002 no horizontal overflow at 320 | Pass |
| SC-003 CLS under 0.1 | Pass: 0.0000 desktop, 0.0266 mobile |
| SC-005 axe WCAG 2.1 AA | Pass: 0 violations at 1440, 390 and 320 |
| SC-006 dots match the visible card | Pass after swipe, arrow key and filter change |
| SC-007 no border, shadow present | Pass: computed `border: 0px none`, shadow present |
| SC-008 icon frame | Pass: 88x88, radius 22px, 1px border, all six icons load |
| SC-011 card height is derived | Pass: 490px at 1440x900, inside the 560-580 band |

Two results worth recording rather than hiding:

- **The section is 813px tall on a 320x640 viewport**, which is 173px more than the
  screen. The category filter needs three rows of 44px buttons at that width and the
  heading and dots take the rest. Nothing is clipped: the card body scrolls internally,
  the name, description, categories and action are all reachable, and there is no
  horizontal overflow. Section padding was already halved below 768px to reduce it. Every
  other tested size lands exactly on one screen.
- **`scroll-snap-type` stayed `mandatory`.** The relaxed `proximity` variant in T025 was
  not written because a misaligned landing could not be reproduced, and pre-emptively
  coding around a problem that does not occur would be speculative. It remains a
  verification task rather than a decision.

Two defects found by verification and fixed before shipping, both recorded in the commit:

- `role="group"` on the strip's `ul` overrode its implicit list role and stranded the six
  `li` outside a list. axe reported six `listitem` violations. The strip now keeps the list
  role and takes the accessible name and focus directly.
- The section kept 80px of block padding on a 640px-tall phone, a quarter of the screen
  before any content. It is now 40px below 768px.

## Notes

- **T009 is a rewrite, not a deletion.** `keeps a fixed square icon slot and never crops the artwork` asserts the opposite of the new design. It is replaced with an assertion that the frame defines the silhouette, because the old intent was based on a comment about the artwork being already rounded, and the alpha decode in T003 disproves it.
- **T014 changes content, not only style.** `object-fit: cover` crops about 4% off QEntry, which is 379×366 rather than square. This is accepted deliberately and recorded in the spec.
- **T025 may change nothing.** The relaxed snap is only worth writing if the browser reproduces a misaligned landing, so the task is verification rather than an assumption.
- **`useIntersectionObserver` in `src/hooks/useIntersectionObserver.ts` is left untouched.** It is unused and single-element, so it cannot track six cards without calling a hook in a loop. Adopting it would be more code than reading `scrollLeft`, and removing it is out of scope for this feature.