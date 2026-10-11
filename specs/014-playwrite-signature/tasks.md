# Tasks: The footer signature in Playwrite US Modern

**Input**: Design documents from `specs/014-playwrite-signature/`

**Prerequisites**: plan.md, spec.md

**Tests**: Required. SC-002 and SC-004 describe layout behaviour and a blocked network request, neither
of which a component test can reach, and SC-001 is satisfied by a stylesheet that declares a font and
renders nothing.

## Format

`[ID] [P?] [Story] Description` — [P] parallelisable, [Story] maps to US1/US2/US3.

## Phase 1: Specification

- [x] T001 Establish that Playwrite US Modern has a single `wght` axis from 100 to 400 and therefore no
      bold, against a site that sets 700 on the hero and 600 on project titles
- [x] T002 Record in the spec why the hero, the project titles and the site at large were each rejected,
      rather than presenting the footer as the only candidate
- [x] T003 Confirm the licence is OFL-1.1, the same terms Inter already ships under, so no new obligation
- [x] T004 Write the specification, including the edge case where `copyright` is not provided and the
      edge case where the CDN is unreachable

## Phase 2: Measurement before implementation

**Purpose**: The height question decides whether the implementation needs a reserved line height. Answered
by measuring, not by guessing.

- [x] T005 Measure the copyright line's rendered height in Inter at 320 and 1440
- [x] T006 Measure it again with Playwrite applied at the same two viewports, and record the difference
- [x] T007 Decide from those two numbers whether a reserved line height is needed, and record the numbers
      in an amendment rather than silently

## Phase 3: Tokens and font loading

**Purpose**: The typeface is declared once and fetched in parallel with the stylesheet.

- [x] T008 Add `--font-hand` to `tokens.css`, Playwrite followed by `--font-sans`, so no component holds a
      font stack (FR-003)
- [x] T009 Add `preconnect` to `fonts.gstatic.com` and the Playwrite stylesheet `<link>` with `display=swap`
      to `index.html`, rather than an `@import` that would serialise behind Inter (FR-004, FR-011)

## Phase 4: The footer

- [x] T010 Add `StyledSignature` to `Footer.styles.ts` with `font-family: var(--font-hand)` and an explicit
      `font-weight: 400` (FR-001, FR-002)
- [x] T011 Wrap only the name in `Footer.tsx`, leaving `©` and the year in the paragraph's own style
      (FR-005, FR-006, FR-010)
- [x] T012 Reserve the line height if T007 concluded it is needed, so the swap cannot move the social
      links (FR-007)

## Phase 5: Tests

- [x] T013 Component test: the copyright's text content is byte-identical to before the feature (SC-005)
- [x] T014 Component test: the signature declares Playwrite and weight 400 rather than inheriting it, and
      the `©` and year do not
- [x] T015 E2E: computed `font-family` names Playwrite and computed `font-weight` is 400 with the font
      loaded (SC-001)
- [x] T016 E2E: footer height and the bounding boxes of the copyright and social links identical before and
      after the font loads, at 320, 390, 768 and 1440 (SC-002)
- [x] T017 E2E: CLS below 0.1 over a load with the font enabled (SC-003)
- [x] T018 E2E: with the font request blocked, the name is visible, non-empty, in the accessibility tree
      and resolves to the fallback (SC-004)
- [x] T019 E2E: `body` still computes to Inter and no heading's weight changed (SC-006)
- [x] T020 E2E: the footer markup gained no heading and no landmark (SC-010)
- [x] T021 Confirm each new test fails when the feature is absent, so none of them pass vacuously

## Phase 6: Verification

- [x] T022 typecheck, lint, unit and component suites
- [x] T023 production build, and record bundle growth against the 5kB budget (SC-009)
- [x] T024 E2E in chromium and webkit
- [x] T025 axe at 1440, 768, 390 and 320, re-reading the copyright's contrast (SC-007)
- [x] T026 Confirm no existing Footer or Layout test was deleted (SC-008)
- [ ] T027 Commit, push, deploy, and verify the signature in the deployed site

## Notes

T021 is not ceremonial. The previous two features in this repository both shipped tests that passed
while measuring nothing, because a fixture had been written in the shape the assertion expected rather
than in the shape the data has. A test written after the implementation is exactly the test most likely
to encode the implementation's own mistake.