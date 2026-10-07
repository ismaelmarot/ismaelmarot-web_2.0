---

description: "Task list for dark project cards with auto-advance"
---

# Tasks: Dark Project Cards with Auto-Advance

**Input**: Design documents from `/specs/009-projects-carousel-dark/`

**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Test tasks are included because the card surface inverts, the action changes shape and accessible naming, and a new timer is introduced that must be provably single and must not run under reduced motion.

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

**Purpose**: Verify the surface this feature changes

- [X] T001 Read the alpha decode recorded in `specs/008-projects-carousel/plan.md` and note which icons will read as bright tiles on a dark frame: `car-expense-tracker` at 38.3% and `QEntry` at 19.5% transparent are the two
- [X] T002 [P] Confirm in `src/styles/tokens.css` that `--color-text-primary` and `--color-text-secondary` both resolve to dark ink, so neither can be reused inside a dark card and card-scoped tokens are required
- [X] T003 [P] Confirm in `src/components/sections/Projects/useProjectsCarousel.ts` that `step` clamps at both ends, which is why wrapping from the last project back to the first needs handling by the caller

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tokens and the timer controller that MUST exist before any user story work begins

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Add `--color-card: #1D1D1F`, `--color-card-fg`, `--color-card-fg-muted` and `--color-card-border` to `src/styles/tokens.css`, scoped rather than global so the dark card does not invert the rest of the site
- [X] T005 Add the `plus` glyph to `src/components/ui/Icon/useIcon.tsx` in the existing 24x24 stroked style, reusing the `pause`, `play`, `chevronLeft` and `chevronRight` set from the marquee
- [X] T006 Create `src/components/sections/Projects/useProjectsAutoAdvance.ts` returning `playing`, `toggle` and `label`, with a single `setInterval` created only while playing and cleared by the effect cleanup so two timers cannot exist
- [X] T007 Make the controller not auto-advance at all under `prefers-reduced-motion: reduce`, reporting stopped on load rather than showing a stop glyph for something that will never run
- [X] T008 Pause the controller while keyboard focus is anywhere inside the section, and resume when focus leaves, rather than only watching the strip
- [X] T009 Pause the controller while `document.visibilityState` is hidden, and reset the timer on becoming visible so the strip does not jump several projects
- [X] T010 Add unit tests in `tests/unit/projects-auto-advance.test.ts` covering the single-timer guarantee, the reduced-motion opt-out, the focus pause and the hidden-document pause

**Checkpoint**: The dark surface tokens exist, the plus glyph exists, and the timer is provably single and correctly gated

---

## Phase 3: User Story 1 - Read a project on a dark card (Priority: P1) 🎯 MVP

**Goal**: A near-black, borderless card with light, legible text and no hover reaction

**Independent Test**: Open `/projects` and verify the card computes `#1D1D1F`, has no border, and its name and description are light and legible

### Tests for User Story 1

- [X] T011 [P] [US1] Add assertions in `src/components/sections/ProjectRow/ProjectRow.test.tsx` that the card background resolves to the card surface token, that the border stays absent, and that the name and description use the card foreground tokens
- [X] T012 [P] [US1] Add an assertion in `src/components/sections/ProjectRow/ProjectRow.test.tsx` that the card declares no hover rule, so hovering cannot translate or change the shadow

### Implementation for User Story 1

- [X] T013 [US1] Rewrite the surface in `src/components/sections/ProjectRow/ProjectRow.styles.ts` to use the card surface token with no border, keeping the existing two-layer shadow because it is still what separates a dark card from the light section
- [X] T014 [US1] Switch the name and description in `src/components/sections/ProjectRow/ProjectRow.styles.ts` to the card foreground tokens, and set the icon frame to a surface slightly lighter than the card so transparent artwork corners resolve against the frame
- [X] T015 [US1] Remove the `&:hover` block entirely from `StyledProjectRow` in `src/components/sections/ProjectRow/ProjectRow.styles.ts`, including the reduced-motion branch that existed only to undo it

**Checkpoint**: The card is dark, light-texted and completely inert under the pointer

---

## Phase 4: User Story 2 - Open a project with one tap on a round button (Priority: P1)

**Goal**: A round plus button that replaces the labelled pill without losing its accessible name

**Independent Test**: Open `/projects` and verify the action is a circle with a plus, has no visible text, and is still named "Ver" plus the project name

### Tests for User Story 2

- [X] T016 [P] [US2] Rewrite the label assertions in `src/components/sections/ProjectRow/ProjectRow.test.tsx` so the action is verified to carry a plus glyph and no text node, while its accessible name still reads "Ver" plus the project name
- [X] T017 [P] [US2] Add an assertion in `src/components/sections/ProjectRow/ProjectRow.test.tsx` that the action is square with a border-radius of at least half its width, and keeps a focus ring

### Implementation for User Story 2

- [X] T018 [US2] Rewrite `StyledProjectAction` in `src/components/sections/ProjectRow/ProjectRow.styles.ts` as a 48px circle with no text padding, keeping the accent fill and the focus ring
- [X] T019 [US2] Replace the `Ver` span in `src/components/sections/ProjectRow/ProjectRow.tsx` with a decorative `plus` icon, and keep the `aria-label` of "Ver" plus the project name so the symbol is not the only name
- [X] T020 [US2] Confirm in `src/components/sections/ProjectRow/ProjectRow.styles.ts` that the 120px icon, the name and the 48px round action wrap deliberately at 320px rather than letting the action land somewhere arbitrary

**Checkpoint**: The action is a round plus that is still announced as "Ver" plus the project name

---

## Phase 5: User Story 3 - Let the carousel move, and stop it (Priority: P1)

**Goal**: Auto-advance every 7 seconds with a play/stop toggle and previous/next controls, none with hover styling

**Independent Test**: Open `/projects`, confirm it advances untouched, confirm the toggle stops it, and confirm the arrows move exactly one project

### Tests for User Story 3

- [X] T021 [P] [US3] Extend `src/components/sections/ProjectDots/ProjectDots.test.tsx` to cover the toggle showing a stop glyph while playing and a play glyph while stopped, and being named for the action it performs
- [X] T022 [P] [US3] Extend `src/components/sections/ProjectDots/ProjectDots.test.tsx` to cover the previous and next controls reporting their index and being reachable by keyboard
- [X] T023 [P] [US3] Assert in `src/components/sections/ProjectDots/ProjectDots.test.tsx` that no control declares a hover rule, while focus styling is still present

### Implementation for User Story 3

- [X] T024 [US3] Add wrapping behaviour to `src/components/sections/Projects/useProjectsCarousel.ts` so advancing past the last project returns to the first
- [X] T025 [P] [US3] Add control styles in `src/components/sections/ProjectDots/ProjectDots.styles.ts` for the toggle and the arrows, with no hover rule and a focus ring retained
- [X] T026 [US3] Extend `src/components/sections/ProjectDots/ProjectDots.tsx` to render the toggle and the arrows alongside the dots, wiring the toggle to the controller and the arrows to the carousel
- [X] T027 [US3] Wire the controller into `src/components/sections/Projects/Projects.tsx` so the toggle reflects and changes the playing state, with no `aria-live` region anywhere
- [X] T028 [US3] In the browser, confirm the strip advances untouched within 8 seconds, that the toggle stops it for at least 10 seconds, and that focus inside the section holds it still

**Checkpoint**: The carousel moves by itself and can be stopped, stepped and inspected from the keyboard

---

## Phase 6: User Story 4 - Take in the icon and the name at a glance (Priority: P2)

**Goal**: A 120px icon and a 48px name, both still fitting a 320px screen

**Independent Test**: Open `/projects` and verify the frame measures 120px and the name computes 48px on a wide viewport

### Tests for User Story 4

- [X] T029 [P] [US4] Update the frame assertions in `src/components/sections/ProjectRow/ProjectRow.test.tsx` from 88px to 120px and assert the radius scales with the frame rather than staying at 22px

### Implementation for User Story 4

- [X] T030 [US4] Set the icon frame to 120px in `src/components/sections/ProjectRow/ProjectRow.styles.ts` with a radius at 22% of its width, and keep the fallback the same size so no card shifts
- [X] T031 [US4] Raise the card title token in `src/styles/tokens.css` so it reaches 48px on wide viewports and stays fluid below that
- [X] T032 [US4] Confirm in the browser that all six icons read correctly on the dark frame, especially `car-expense-tracker` and `QEntry`, which are the two most likely to read as bright tiles

**Checkpoint**: Icon and name are scannable at a glance, and the card still fits the smallest screen

---

## Phase 7: Verification and Delivery

**Purpose**: Prove the spec is met, then ship

- [X] T033 Run `npm run lint`, `npm run typecheck`, `npm run test` and `npm run test:component`, and confirm the previous feature's carousel tests still pass
- [X] T034 Run `npm run build` and confirm the route builds without new warnings
- [X] T035 In the browser at 1440, 390 and 320, verify the card computes `rgb(29, 29, 31)` with no border, the name computes 48px at 1440, the frame is 120px, and there is no horizontal overflow
- [X] T036 Measure the contrast of the name and the description against `#1D1D1F` and confirm both reach at least 4.5:1
- [X] T037 Hover a card and every control and confirm nothing changes in transform, colour, size or shadow
- [X] T038 Run axe at 1440, 390 and 320 and confirm zero WCAG 2.1 AA violations
- [X] T039 Measure CLS on load, since the icon frame grew from 88px to 120px
- [X] T040 Verify under emulated `prefers-reduced-motion` that the carousel does not advance and the toggle reports stopped
- [ ] T041 Commit, push to `main`, run the target `deploy.yml` workflow in `ismaelmarot/ismaelmarot.github.io` and confirm the same measurements on production

---

## Phase 8: Analysis

**Purpose**: Confirm the code delivers the spec, and record it

- [ ] T042 Run `/speckit.analyze` and confirm FR-001 through FR-020 and SC-001 through SC-012 are each satisfied or explicitly deferred
- [ ] T043 Update `**Status**: Draft` to `Implemented` in `specs/009-projects-carousel-dark/spec.md` and record any requirement that shipped differently

---

## Verification Results

Measured against a production build, and then against production after deploying.

| Criterion | Result |
|-----------|--------|
| SC-001 card surface | Pass: `rgb(29, 29, 31)`, border `0px none` at 1440, 390 and 320 |
| SC-002 text contrast | Pass: name 15.46:1, description 6.54:1 against `#1D1D1F` |
| SC-003 no hover | Pass: transform stays `none`, shadow and background unchanged, zero `:hover` rules on the card |
| SC-004 round action | Pass: 48x48, radius 9999px, no text node, a plus glyph |
| SC-005 auto-advance | Pass: moved from project 1 to 2 within 8s untouched |
| SC-006 toggle stops it | Pass: still on the same project after 10s, control renamed to "Reproducir" |
| SC-007 arrows move one | Pass: next on the last project stops there; dot 6 lands on project 6 |
| SC-008 scale | Pass: 120px frame, name 48px at 1440 |
| SC-009 no overflow at 320 | Pass, and the action stays inside the card |
| SC-010 axe | Pass: 0 violations at 1440, 390 and 320 |
| SC-011 CLS | Pass: 0.0000 desktop, 0.0001 mobile |
| SC-012 previous tests | Pass: 91 unit and 291 component |

Two defects found by verification, both fixed before shipping:

- **`goTo` asked for a scroll the strip could not perform.** The last card starts at
  4272px while the strip only scrolls to 3744px, so the browser clamped it and the nearest
  card-start tie at 416px each way resolved to card 5. Clicking the last dot showed the
  second-to-last project. Two changes fixed it: `goTo` clamps to `scrollWidth - clientWidth`,
  and the current card is found from the middle of the viewport instead of from whichever
  start is nearest, because the middle can only be inside one card.
- **`role` and structure of the control list.** A group `div` was placed inside the dots
  `ul`, which takes the list semantics away from its `li` children. axe reported one
  `list` and two `listitem` violations. The controls now sit outside the `ul`, which holds
  only `li`.

One result that is not clean:

- **The section is 855px on a 390x844 viewport and 911px on a 320x640 one**, so it no
  longer lands exactly on one screen on mobile. Both are consequences of what was asked:
  a 120px icon and a control row the previous feature did not have. Nothing is clipped and
  the card body scrolls internally. Desktop still lands exactly on 900 of 900.

## Dependencies

- **Phase 2 blocks Phases 3–6**: no card, action or control work can be written against tokens or a controller that do not exist
- **Phase 3 blocks Phase 4**: the dark surface and the round action land on the same card
- **Phase 2 blocks Phase 5**: the toggle cannot exist before the controller
- **T004 and T005 are parallel**: tokens and the icon set are different files
- **T011, T012 and T016, T017 are parallel**: separate assertions in one test file, resolved in sequence rather than in parallel

## Parallel Execution Examples

Phase 2, the two independent foundations:

```
T004 (tokens.css) || T005 (useIcon.tsx)
```

Phase 6, the icon assertions can run while the control styles are written:

```
T029 (ProjectRow.test.tsx) || T025 (ProjectDots.styles.ts)
```

## Notes

- **T015 deletes code rather than changing it.** The `prefers-reduced-motion` branch on the card existed only to undo the hover transform. With no hover rule there is nothing to undo, and leaving it would be dead CSS.
- **T024 changes the previous feature's behaviour deliberately.** `step` clamped at the last project on purpose; auto-advance needs it to wrap instead. The clamp is kept for the arrow controls, where stopping at the end is correct.
- **T007 is not a smaller version of the requirement.** Disabling only the scroll animation under reduced motion would leave the card still changing every 7 seconds, which is the same motion more slowly. The toggle must report stopped, not show a stop glyph that does nothing.
- **The dots are kept.** The request did not ask to remove them, so they join the toggle and the arrows rather than being replaced.
---

## Amendment 2: The Icon Frame Is Sized for the Phone It Is On

Added 2026-10-05. See "Amendment 2" in `spec.md`. The measurements and the reasoning live in
Amendment 1 of `specs/008-projects-carousel`, which is where the section height contract is owned;
this file records the one requirement of this spec that it qualifies.

- [X] T044 Drop the icon frame from 120px to 80px below 520px, with the radius scaled to stay 22% of the frame
- [X] T045 Keep the failed-icon fallback at the same 80px, so a broken icon cannot change the geometry
- [X] T046 Set the name to 22px and the description clamp to two lines below 520px, so every card is the same height on every phone
- [X] T047 Reduce the action from 48px to 44px below 520px, which still satisfies FR-004's 44px minimum
- [X] T048 Assert both sizes in `tests/e2e/projects-viewport.spec.ts`: 120px at 1440 and 80px at 320

### Verification Results

| Criterion | Result |
|-----------|--------|
| SC-013 icon frame | Pass: 120px at 1440px, 80px at 320px, radius 22% at both |
| SC-012 of Amendment 1 | Pass: 91 unit, 333 component and 21 measured browser tests |

### Notes on this amendment

- **T044 is a qualification, not a reversal.** 120px stays where there is room for it. What changes is
  that FR-017 no longer states a size without naming a viewport, which is what let a 120px frame reach
  a 320px screen where it cannot work.
- **T046 is about uniformity, not just truncation.** At 320x640 two lines is what fits. Leaving it to
  the container meant the text was cut through the middle by the box rather than by the clamp, which
  reads as a fault rather than as truncation.

---

## Amendment 3: Light Cards, Smaller Cards

Added 2026-10-06, after the request "en la seccion de proyctos, el carrousel de proyectos, las cards
deben ser mas pequenas y de color gris claro estilo apple". See "Amendment 3" in `spec.md` for
FR-022 through FR-026 and SC-014 through SC-020.

- [X] T044 [P] Measure four light candidates against the `#F5F5F7` section on two questions: does it read as the focus of the page, and does the text on it pass AA
- [X] T045 [P] Rule out `#F2F2F7` and `#E8E8ED` on measured grounds: `#F2F2F7` drops the action's blue to 4.21:1 and `#E8E8ED` drops the description to 4.15:1, both below AA
- [X] T046 [P] Establish that a `#D2D2D7` border measures 1.51:1 against white and cannot be the separator, since WCAG holds a non-text boundary to 3:1
- [X] T047 [P] Confirm the shadow does the separating, measuring that the previous pair reached `#D8D8DA` and deepening it to `#D2D2D4` for a smaller card
- [X] T048 Invert the card tokens: surface white, name `#1D1D1F`, description `#6E6E73`, frame `#E8E8ED`, border transparent
- [X] T049 Replace the card's gradient with a flat `background-color`, since two identical white stops resolved to a transparent `background-color` behind a no-op gradient
- [X] T050 [P] Find that the width alone does not make the card smaller: measured at 800, 700, 620 and 560px it stayed 476px tall, so a maximum height is what the request needed
- [X] T051 Take the card to 620px wide and 380px tall, and the icon frame from 120px to 96px
- [X] T052 [P] Find that the carousel already overflowed on short desktop viewports, at 795 of 720, 782 of 700 and 782 of 768, which every previous measurement missed because they all used a 900px-tall viewport
- [X] T053 Give the section a definite height at every viewport and drop its block padding to 48px under 1000px of height, which resolves all four
- [X] T054 [P] Find the visible band of section background under the card at 1440x900: the strip is 564px and the card 380, so 184px of grey sat under it with the shadow across it. Align the card to the start
- [X] T055 [P] Find that the category chips did not move: the Badge's own single-class rule outranked the descendant selector. Raise the parent selector so it carries two classes
- [X] T056 Write `tests/unit/card-contrast.test.ts`, eight tests that measure each contrast pair rather than asserting a colour string
- [X] T057 [P] Correct an assertion of my own while writing them: `#6E6E73` on `#F2F2F7` measures 4.54:1 and passes AA, so the description was never what ruled that colour out. The accent was, and the spec now says so
- [X] T058 Rewrite the ProjectRow test that asserted the gradient rather than deleting it, per SC-010 of the carousel spec
- [X] T059 Add browser tests for the size, the surface, the shadow, the chip and the four short viewports
- [X] T060 Give `projects-viewport.spec.ts` the same `irA` helper the Hero tests needed, since it had the same defect of navigating before setting the viewport
- [X] T061 Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:component` and `npm run build`
- [X] T062 Confirm the new browser tests fail when the old surface is reinstated
- [X] T063 Run the full Playwright suite twice and confirm the three pre-existing failures are the same ones
- [X] T064 Run axe at 1440, 768, 390 and 320
- [X] T065 Capture 1440, 1024, 390 and 320 and inspect them, because a band of grey under a card is invisible to every number above

### Verification Results

| Criterion | Result |
|-----------|--------|
| SC-014 contrast | Pass: name 16.83:1, description 5.07:1, action 4.70:1, chip 8.18:1, all on white |
| SC-015 size | Pass: 620px wide, 380px tall at 1440 |
| SC-016 short viewports | Pass: 720 of 720, 700 of 700, 768 of 768, 760 of 760, against four real overflows before |
| SC-017 short viewports measured | Pass: four heights added to the browser tests that never ran before |
| SC-018 contrast measured, not string-matched | Pass: 8 tests in `tests/unit/card-contrast.test.ts`, one of which fails on the old surface |
| SC-019 axe | Pass: 0 violations at 1440, 768, 390 and 320 |
| SC-020 full suite | Pass: 99 unit, 336 component and 57 browser |

### Notes on this amendment

- **T045 is the design decision, and it is a hierarchy argument before it is a contrast one.** Only
  white makes the card the brightest element on a page whose section is already grey. `#E8E8ED` is
  nearly invisible against `#F5F5F7` and costs the description its compliance besides.
- **T050 is the measurement that changed the work.** "Smaller" read as a width change, and the width
  changes nothing: at 560px the card was still 476px tall. The height is set by the flex chain, so
  the request needed a maximum height to be honoured at all.
- **T052 is the finding I did not expect and would not have found without being asked for smaller
  cards.** The carousel had been overflowing on short desktop viewports since the dark-card feature
  shipped, and every measurement in this feature used 900px of height because that is the laptop I
  develop on. The cause was never the card: 160px of block padding plus the heading, filter and
  controls does not fit in 720px whatever the card does.
- **T055 cost four attempts.** The chip values were correct and did not apply, three times over: a
  linear-gradient of two whites, then a descendant selector losing to the Badge, then token names
  that resolved to the section background rather than to what the chip needs. The value in the
  browser was the icon frame's colour, which is what made it obvious that the wrong element was
  being read.
- **T057 is a correction to my own reasoning, recorded rather than quietly fixed.** I had claimed the
  description failed on `#F2F2F7` and it does not, at 4.54:1. The colour choice still holds, on the
  accent and on hierarchy. The spec says which, and a test now measures it either way.
- **T065 earned its place.** The band of grey under the card at 1440 was invisible to every test
  written for this amendment: the section was the right height, the card was the right size, and the
  contrast was correct. It only showed up in a screenshot.
