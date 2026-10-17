# Tasks: The Contact Band's Hierarchy

**Input**: Design documents from `/specs/027-contact-band-hierarchy/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: included, because every success criterion in the spec is a measurement on a rendered page and a stylesheet assertion would pass on a value that overflows.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Every task names the exact file it changes

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Component folder: `src/components/sections/ContactBand/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: The configuration split that every story reads.

- [ ] T001 [P] Add `contactDisplayEmail: string` to `SiteConfig` in `src/types/site.ts`, documented as the visible address shown in the band
- [ ] T002 [P] Add `contactDisplayEmail: 'ismaelmarot@contacto.com'` to `siteConfig` in `src/data/site-config.ts`, beside `email` and `contactTagline`
- [ ] T003 [P] Extend `UseContactBandReturn` and `useContactBand` in `src/components/sections/ContactBand/useContactBand.ts` to return `displayEmail: siteConfig.contactDisplayEmail`
- [ ] T004 [P] Extend `ContactBandProps` in `src/components/sections/ContactBand/ContactBand.tsx` with `displayEmail?: string`, overridable like `email`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The tests that hold the new behaviour, written before the implementation so they are red.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 [P] Update `src/components/sections/ContactBand/ContactBand.test.tsx` so the email assertions use `ismaelmarot@contacto.com` as the accessible name and `mailto:ismaelmarot@hotmail.com` as the href; confirm the suite is red
- [ ] T006 [P] Update `tests/e2e/contact-band-layout.spec.ts` so `medir()` reads the new order (row below the heading, email flush right, CTA left) and the new sizes (question vs section title, email below the question); confirm the suite is red

**Checkpoint**: Foundation ready - the tests describe the new band and fail against the old one.

---

## Phase 3: User Story 1 - Read the question as the section's subject (Priority: P1) 🎯 MVP

**Goal**: The question renders at the section-title scale and is the largest text in the band.

**Independent Test**: The rendered question's font size equals the rendered "Sobre mí" section title's at 1440.

### Tests for User Story 1

- [ ] T007 [P] [US1] In `src/components/sections/ContactBand/ContactBand.test.tsx`, assert the question's CSS contains `font-size: var(--text-display-section)` and that the band has exactly one `h2`

### Implementation for User Story 1

- [ ] T008 [US1] In `src/components/sections/ContactBand/ContactBand.styles.ts`, set `StyledContactBandTitle` to `font-size: var(--text-display-section)`, `font-weight: 700`, `line-height: 1.05`, `letter-spacing: -0.01em`, `color: textPrimary`, and remove the `max-width: 18ch` cap
- [ ] T009 [US1] In `src/components/sections/ContactBand/ContactBand.styles.ts`, set `StyledContactBandDescription` to `font-size: var(--text-body)` and `color: textSecondary`
- [ ] T010 [US1] In `src/components/sections/ContactBand/ContactBand.styles.ts`, keep `StyledContactEmail` at `font-size: var(--text-display-email)` so the email stays one step below the question

**Checkpoint**: The question is the band's display element and the sentence is body text.

---

## Phase 4: User Story 2 - See the band in the requested order (Priority: P1)

**Goal**: A vertical stack — question, sentence, call to action, then the networks/email row — with the networks left and the email flush right.

**Independent Test**: At 1440 the vertical order is question, sentence, call to action, row; the networks are left of the email and the email is flush right.

### Tests for User Story 2

- [ ] T011 [P] [US2] In `src/components/sections/ContactBand/ContactBand.test.tsx`, assert the row's CSS is `grid-template-columns: auto 1fr` and collapses to `1fr` under `@media (max-width: 767px)`
- [ ] T012 [P] [US2] In `src/components/sections/ContactBand/ContactBand.test.tsx`, assert the email's CSS contains `justify-self: end` and the call to action's contains `align-self: flex-start`

### Implementation for User Story 2

- [ ] T013 [US2] In `src/components/sections/ContactBand/ContactBand.tsx`, move `StyledContactBandCta` inside `StyledContactBandCopy` and remove `order: -1` from `StyledContactBandRow` so the DOM order is the visual order
- [ ] T014 [US2] In `src/components/sections/ContactBand/ContactBand.styles.ts`, make `StyledContactBandInner` a flex column with `gap: space[10]`, and `StyledContactBandCopy` a flex column with `align-items: flex-start` and `gap: space[3]`
- [ ] T015 [US2] In `src/components/sections/ContactBand/ContactBand.styles.ts`, add `justify-self: end` to `StyledContactEmail` and `justify-self: start` under `@media (max-width: 767px)`
- [ ] T016 [US2] In `src/components/sections/ContactBand/ContactBand.styles.ts`, change `StyledContactBandCta` to `align-self: flex-start` and remove its right-alignment media query

**Checkpoint**: The band reads top-to-bottom as the request describes.

---

## Phase 5: User Story 3 - Write to the address the band shows (Priority: P1)

**Goal**: The visible text and the destination are independent values.

**Independent Test**: The link's text is `ismaelmarot@contacto.com` and its href is `mailto:ismaelmarot@hotmail.com`.

### Tests for User Story 3

- [ ] T017 [P] [US3] In `src/components/sections/ContactBand/ContactBand.test.tsx`, assert the link's accessible name is the display address and its href is the mailto target, and that overriding `displayEmail` changes only the text

### Implementation for User Story 3

- [ ] T018 [US3] In `src/components/sections/ContactBand/ContactBand.tsx`, render `displayEmail ?? derived.displayEmail` as the link text and `mailto:${email ?? derived.email}` as the href

**Checkpoint**: The band shows one address and writes to another.

---

## Phase 6: User Story 4 - Keep the band's identity and its outline (Priority: P2)

**Goal**: The id, accessible name, height, snap alignment and single heading are preserved.

**Independent Test**: The band keeps `id="contact-summary"`, `aria-label="Contacto"`, `100dvh` and one `h2`.

### Tests for User Story 4

- [ ] T019 [P] [US4] In `src/components/sections/ContactBand/ContactBand.test.tsx`, assert the region keeps its id and accessible name and has exactly one `h2`

### Implementation for User Story 4

- [ ] T020 [US4] In `src/components/sections/ContactBand/ContactBand.styles.ts`, confirm `StyledContactBand` keeps `min-height: 100dvh`, `scroll-snap-align: start` and its background; change nothing

**Checkpoint**: The band's shell is untouched.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify the whole feature and record what implementation found.

- [ ] T021 [P] Run `npm run lint` and `npm run typecheck`; fix any error
- [ ] T022 [P] Run `npm test` and `npm run test:component`; fix any failure
- [ ] T023 Run `npm run build`
- [ ] T024 Run `npm run test:e2e -- contact-band-layout` and `npm run test:e2e -- home-scroll-snap`; fix any failure
- [ ] T025 Run `npm run test:a11y`; confirm zero violations
- [ ] T026 Update `specs/027-contact-band-hierarchy/spec.md` status to Implemented and record any amendment found during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phases 3-6)**: Depend on Foundational; they touch the same files and should run in order
- **Polish (Phase 7)**: Depends on all user stories

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational
- **User Story 2 (P1)**: Depends on User Story 1's styles; same file
- **User Story 3 (P1)**: Depends on Setup; independent of US1/US2's styles but shares the component file
- **User Story 4 (P2)**: Independent; a confirmation that the shell is unchanged

### Within Each User Story

- Tests are written before implementation
- Styles before component wiring where both are in the same story
- Story complete before moving to the next priority

### Parallel Opportunities

- T001, T002, T003, T004 are different files and can run in parallel
- T005 and T006 are different files and can run in parallel
- T007, T011, T012, T017, T019 are test tasks in different describe blocks and can run in parallel
- T021 and T022 are independent checks and can run in parallel

---

## Parallel Example: User Story 1

```bash
# Tests and implementation are in the same file, so they run sequentially:
Task: "T007 assert the question reads --text-display-section"
Task: "T008 set StyledContactBandTitle to --text-display-section"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: The question is the band's display element
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → the tests describe the new band
2. Add User Story 1 → the hierarchy is right
3. Add User Story 2 → the order is right
4. Add User Story 3 → the address split works
5. Add User Story 4 → the shell is confirmed unchanged
6. Polish → the whole feature is verified

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
