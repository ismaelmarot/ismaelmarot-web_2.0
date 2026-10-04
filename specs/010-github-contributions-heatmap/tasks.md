---

description: "Task list for the GitHub contributions heatmap"
---

# Tasks: GitHub Contributions Heatmap

**Input**: Design documents from `/specs/010-github-contributions-heatmap/`

**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Test tasks are included because the defect is a scroll position no runtime assertion can see from the repository alone, and because marking a cell has to be proved absent on every other cell.

**Organization**: Tasks are grouped by phase; the defect and its two supporting changes are the whole feature, and the documentation of what already shipped comes first.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root

---

## Phase 1: Verify the defect before changing anything

**Purpose**: Make sure the cause is the scroll position and not the data, the query or the level mapping

- [X] T001 Confirm the deployed bundle at `https://ismaelmarot.github.io/technologies` carries the current day, by extracting the contributions payload from `assets/index-*.js` and reading its last day and total
- [X] T002 Confirm the GitHub GraphQL API returns the current day both with and without an explicit `from`/`to`, so that the absence of a range in the query is not the cause and needs no change
- [X] T003 Measure the strip's `scrollLeft`, `scrollWidth` and `clientWidth` at 1440, 1024, 768, 390 and 320, and confirm the current day is outside the visible area exactly where the content overflows
- [X] T004 Confirm `Contributions.tsx` contains no `useEffect`, `useRef`, `scrollLeft` or `scrollTo`, so there is no existing logic to preserve

**Checkpoint**: The defect is located in the absence of a scroll, not in the data

---

## Phase 2: Foundations

**Purpose**: The measurements that decide the outline, taken before any styling is written

- [X] T005 Compute the contrast of `#0071E3`, `#1D1D1F` and `#FFFFFF` against all five contribution levels, and record that no single colour clears 3:1 on the purple ramp
- [X] T006 Confirm today's cell occupies the rightmost column and that the scroll container provides only 2px of horizontal padding, so an outward outline would be clipped

---

## Phase 3: User Story 1 - See what was worked on recently (Priority: P1) 🎯 MVP

**Goal**: The strip opens at its most recent end, before the first paint

**Independent Test**: Open `/technologies` at 390px and verify the strip is scrolled to its end and the most recent day is visible without interaction

### Tests for User Story 1

- [X] T007 [P] [US1] Add a test in `src/components/sections/Contributions/Contributions.test.tsx` asserting that the strip's `scrollLeft` equals its `scrollWidth` after mount, defining both on the element because jsdom reports them as zero
- [X] T008 [P] [US1] Add a test asserting the scroll still happens under `prefers-reduced-motion: reduce`, since an instant jump is not motion, so that nobody later "improves" it into a smooth scroll and breaks the guarantee

### Implementation for User Story 1

- [X] T009 [US1] Add a ref to `StyledContributionsScroller` in `src/components/sections/Contributions/Contributions.tsx` and a `useLayoutEffect` that assigns `scrollLeft = scrollWidth`, running before the first paint so the wrong year is never shown even for a frame
- [X] T010 [US1] Leave the assignment unguarded by viewport or motion preferences: it is a no-op where there is no overflow, and it is not an animation, so it needs neither a media query nor a reduced-motion branch

**Checkpoint**: Opening the section on a phone shows the current week

---

## Phase 4: User Story 2 - Tell today apart from every other day (Priority: P1)

**Goal**: Today's cell is outlined, on any background level, and announced as today

**Independent Test**: Verify exactly one cell is outlined, that it is the most recent one, and that only its description mentions today

### Tests for User Story 2

- [X] T011 [P] [US2] Add a test asserting the most recent cell carries the two-tone outline and that no other cell does
- [X] T012 [P] [US2] Add a test asserting today's accessible description says so, and that a cell which is not today does not
- [X] T013 [P] [US2] Add a test asserting that when the calendar's last day is not today, no cell is outlined, so a stale build cannot present yesterday as today

### Implementation for User Story 2

- [X] T014 [US2] Add a `$isToday` prop to `StyledContributionCell` in `src/components/sections/Contributions/Contributions.styles.ts` painting `inset 0 0 0 1px` in white over `inset 0 0 0 2px` in the foreground ink, so one layer always contrasts and neither can be clipped by the scroll container
- [X] T015 [US2] Compare each cell's stored date against the current UTC date in `src/components/sections/Contributions/Contributions.tsx` rather than assuming the last cell is today, since the two diverge when the build is stale
- [X] T016 [US2] Append a marker for today to the cell's accessible description in `src/components/sections/Contributions/Contributions.tsx`, so the mark is not visual-only

**Checkpoint**: Today is identifiable by sight and by screen reader, on every level colour

---

## Phase 5: User Story 3 - Read the year's shape without guessing (Priority: P2)

**Goal**: Confirm the figures, legend and descriptions the feature already had still render

**Independent Test**: Verify the period, the five legend levels and the four figures are present, and that a cell's description states its date and count

- [X] T017 [P] [US3] Confirm the seven existing tests in `src/components/sections/Contributions/Contributions.test.tsx` still pass unchanged, since this feature adds to the component rather than replacing any of it

---

## Phase 6: Verification and Delivery

- [X] T018 Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:component` and `npm run build`
- [X] T019 In the browser at 320, 390, 768, 1024 and 1440, verify `scrollLeft` is greater than zero only where the content overflows, and that the current day lies inside the visible area at every size
- [X] T020 Verify the current day's outline is fully drawn at 390px, where it sits against the scroll container's edge, and that no page-level horizontal overflow appears at 320px
- [X] T021 Run axe on `/technologies` and confirm zero WCAG 2.1 AA violations
- [X] T022 Capture the strip before and after the scroll, as the evidence that what was reported as missing is now on screen
- [ ] T023 Commit, push, run the target `deploy.yml` workflow in `ismaelmarot/ismaelmarot.github.io`, and repeat T019 to T021 against production

---

## Dependencies

- **Phase 1 blocks everything**: changing a scroll position is unjustified until the data is confirmed good and the absence of logic is confirmed
- **Phase 2 blocks Phase 4**: the outline shape follows from the contrast and clipping measurements
- **T001, T002, T003 and T004 are parallel**: independent read-only checks
- **T007 and T008 are parallel**: separate tests in one file, resolved in sequence rather than in parallel
- **T009 must precede T019**: there is nothing to verify before the change exists
- **T013 depends on T015**: the stale-build case is only meaningful once the comparison is by date

## Parallel Execution Examples

Phase 1, the four read-only checks:

```
T001 (bundle) || T002 (API) || T003 (measure) || T004 (grep)
```

Phase 4, the outline and its tests:

```
T014 (styles) || T011 (outline test) || T012 (label test)
```

## Notes

- **T002 records a wrong fix avoided.** The obvious suspect was the missing `from`/`to` in the GraphQL
  query, and adding one would have changed nothing while looking like a fix. Both forms of the query
  were run instead.
- **T005 is why the outline has two colours.** A single-colour outline was the first instinct and it
  fails on the purple ramp; the numbers are recorded in the styles file so the choice is not undone.
- **T010's lack of guards is deliberate.** There is no viewport check and no reduced-motion check, and
  adding either would be noise: the assignment is a no-op without overflow and is not an animation.
- **T017 exists because this feature could have broken the existing surface.** The heatmap is being
  documented and modified at once, so the tests written for the original implementation are the
  regression guard for the parts this change does not touch.
- **T022 is the only proof that addresses the report as it was made.** The complaint was visual: a
  visitor could not see today's work. A test asserting `scrollLeft` proves the mechanism; only the
  capture shows the result.
---

## Verification Results

Measured against a production build, and then against production after deploying.

| Criterion | Result |
|-----------|--------|
| SC-001 scroll only where there is overflow | Pass: 0/0 at 1440 and 1024, 94/94 at 768, 416/416 at 390, 486/486 at 320 |
| SC-002 today's cell visible | Pass at 320, 390, 768, 1024 and 1440 without interaction |
| SC-003 exactly one marked cell | Pass: 1 of 365 at every viewport |
| SC-004 today marked even with few contributions | Pass: covered by a fixture with today's count at 0 |
| SC-005 accessible description | Pass: `2 contribuciones el 4 de octubre de 2026 (hoy)` |
| SC-006 no page overflow, outline not clipped | Pass: the rightmost cell's right edge stays inside the strip |
| SC-007 axe and the empty-calendar path | Pass: 0 violations, and the component still renders nothing with no calendar |
| SC-008 full suite | Pass: 91 unit and 310 component |
| SC-016 reduced motion | Pass: the assignment still happens, asserted so nobody smooths it later |

The computed outline is `rgb(255,255,255) 0 0 0 1px inset, rgb(29,29,31) 0 0 0 2px inset` on today's
cell and `none` on the other 364.

### One result that looked like a failure and was not

Marking did nothing on the first local build, and it was worth chasing rather than assuming. The local
`npm run build` runs only `tsc && vite build`; it does not re-fetch, so the bundle used the committed
`contributions.json`, whose last day is `2026-10-03` while the current UTC date is `2026-10-04`. No cell
matched, so nothing was marked. That is the stale-build path behaving exactly as FR-005 requires, and
it only became visible because the comparison is by date rather than by position. Re-fetching confirmed
the marking works.

### Notes on the tests

- **The scroll tests define `scrollWidth` and `clientWidth` on `HTMLDivElement.prototype`**, before the
  render, because the mount effect reads them synchronously and any test code afterwards is too late.
  jsdom reports both as 0, so without this the assertion would read `0 = 0` and pass without proving
  anything.
- **The outline is asserted with `getComputedStyle(cell)`, not `getCssForElement`.** Every cell shares
  one styled-components class, so the helper returns the base rule and today's rule for all 365 of
  them and cannot tell any cell from another. Computed style resolves per element, which is what the
  test needed.
- **The stale fixture has to end before today, not start before it.** A week starting two days back
  reaches today on its fifth day, so the first version of that test asserted a case that did not exist.
- **The reduced-motion test asserts the scroll still happens rather than stubbing the media query**,
  because nothing in the component reads it. Pinning the behaviour is the point; the stub would only
  have tested the stub.
