# Tasks: How a project is written and how its icon is seen

> **Retrospective.** Every task below was carried out and deployed before this list existed, in
> `62466e0` and `73fcc31`. It is a record of the work, not a plan for it.

**Input**: Design documents from `specs/015-project-identity/`

**Prerequisites**: spec.md, plan.md

**Tests**: Required for the helper's rules. Not written for the rendering, which was measured instead
and is recorded in the spec.

## Format

`[ID] [P?] [Story] Description` — [P] parallelisable, [Story] maps to US1/US2/US3.

## Phase 1: Specification

- [x] T001 Establish which of the six names carry hyphens and which do not, and check whether the
      capitals in `LinkIO`, `QEntry` and `NauticAcademy` are deliberate
- [x] T002 Decide between a title-case and a hyphen guard, and record that a title-case misspells three
      of the six names
- [x] T003 Identify all three places a name is visible and all eight where it is accessible, and record
      that the second list must not change
- [x] T004 Write the specification, including that `projects.json` must not change
- [x] T005 Record Amendment 1: the fixture that tested nothing, the comment that stated a property the
      code did not have, and the first measurement that was a false negative

## Phase 2: The written name

- [x] T006 Add `formatProjectName` to `src/utils/helpers.ts`, keyed on the hyphen, returning the input
      untouched when there is none (FR-001, FR-002)
- [x] T007 Filter empty segments so a leading, trailing or doubled hyphen cannot produce a phantom space
      (FR-003)
- [x] T008 Apply it to the card title, the detail heading and the sentence about formal versions (FR-005)
- [x] T009 Confirm no `alt` and no `aria-label` was touched, by reading them off the deployed site
      (FR-006)
- [x] T010 Replace the hand-formatted fixture in `Projects.test.tsx` with the raw names from
      `projects.json` (FR-001, and the defect in Amendment 1)
- [x] T011 Write unit tests for the six real names, the hyphen edges and the empty string (FR-001 to
      FR-003)
- [x] T012 Remove the hyphen guard and confirm a test fails, rather than assuming the test has teeth

## Phase 3: The icon

- [x] T013 Measure the card frame, the detail icon and the home strip, and record that only the strip had
      a shadow
- [x] T014 Add the strip's exact value to the card's icon frame (FR-008, FR-013)
- [x] T015 Measure whether that shadow moves the card: line height before and after
- [x] T016 Add a frame to the detail carrying the same shadow, at 22% of its width, because a shadow on
      the square image box traces the rectangle (FR-009, FR-010, FR-011)
- [x] T017 Move the detail's image to `cover` so the frame clips it as the card's does (FR-016)
- [x] T018 Give the card placeholder the frame its comment already claimed it had (FR-012)
- [x] T019 Write component tests for the four declarations, and confirm each fails when removed
- [x] T020 Abort an icon request in a browser and measure the placeholder, rather than reading the
      stylesheet (FR-012)

## Phase 4: Geometry and verification

- [x] T021 Measure card heights at 320 and 1440 before and after the names change (SC-008)
- [x] T022 Type checking, lint, unit and component suites
- [x] T023 Production build, and axe at 1440, 768, 390 and 320 (SC-011)
- [x] T024 Deploy, and read the rendered names and the accessible labels off the live site (SC-001,
      SC-005, SC-006)

## Phase 5: Documentation

- [x] T025 Cite this specification from the code the way `ProjectRow.styles.ts` cites the carousel and
      dark-card specs, so the shadow and the helper have an origin on screen and not only here
- [x] T026 Add the comment `formatProjectName` did not have
- [x] T027 Record in the spec that no E2E covers either feature, rather than implying coverage

## Notes

T012 and T019 are the tasks that distinguish a test from a tautology. T015 and T020 are the tasks that
distinguish a measurement from a reading of the stylesheet, and T020 is here because the first attempt
at T15 measured an element that did not exist and reported no change at all.