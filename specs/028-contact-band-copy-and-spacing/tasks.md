# Tasks: The Contact Band's Copy and Spacing

**Input**: Design documents from `/specs/028-contact-band-copy-and-spacing/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: included, because the size change and the spacing change are claims about the rendered page and
a stylesheet assertion would pass on a value that overflows.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Every task names the exact file it changes

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Component folder: `src/components/sections/ContactBand/`

---

## Phase 1: Setup

- [ ] T001 [P] Write `specs/028-contact-band-copy-and-spacing/` artifacts: `spec.md`, `plan.md`,
      `research.md`, `data-model.md`, `quickstart.md`, `checklists/requirements.md` (this repository's
      SDD practice: the spec asks the size, the plan answers with the tokens that exist)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The two tests that hold the new behaviour, written before the implementation so they are red.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T002 [P] [US1] In `src/components/sections/ContactBand/ContactBand.test.tsx`, add a test asserting
      the rendered tagline is exactly `Hablemos y pongámonos manos a la obra`; confirm the suite is red
- [ ] T003 [P] [US2, US3] In `tests/e2e/contact-band-layout.spec.ts`, extend `medir()` to read the
      sentence's font size against the "Me interesa…" description and the button-to-row distance; add the
      assertions the spec's SC-002 and SC-004 name; confirm the suite is red

**Checkpoint**: Foundation ready - the tests describe the new band and fail against the old one.

---

## Phase 3: User Story 1 - Read the reflexive form with its accent (Priority: P1)

**Goal**: `contactTagline` reads `Hablemos y pongámonos manos a la obra`.

**Independent Test**: Render the band and compare the visible tagline against the accented string.

### Implementation for User Story 1

- [ ] T004 [US1] In `src/data/site-config.ts`, set `contactTagline` to `'Hablemos y pongámonos manos a la obra'`

**Checkpoint**: The landing page's closing sentence reads with its accent. T002 turns green; T003's two
new assertions stay red.

---

## Phase 4: User Story 2 - Read the sentence at the other sections' scale (Priority: P1)

**Goal**: The sentence renders at `--text-large-subtitle`, the size of the "Me interesa…" description.

**Independent Test**: The rendered sentence's font size equals the rendered "Me interesa…" description's
at 1440, and the question stays the largest text in the band.

### Implementation for User Story 2

- [ ] T005 [US2] In `src/components/sections/ContactBand/ContactBand.styles.ts`, set
      `StyledContactBandDescription` to `font-size: var(--text-large-subtitle)` and update its comment to
      record why the 20px floor is safe here when it was rejected for the question

**Checkpoint**: The sentence matches "Sobre mí"'s description. Half of T003 turns green; the spacing
assertion stays red.

---

## Phase 5: User Story 3 - See more air between the block and the row (Priority: P2)

**Goal**: The gap between the copy block and the networks/email row measures the `space[12]` step.

**Independent Test**: The rendered distance between the button's bottom and the row's top measures 48px
with sub-pixel slack, greater than the previous band's 40px.

### Implementation for User Story 3

- [ ] T006 [US3] In `src/components/sections/ContactBand/ContactBand.styles.ts`, set
      `StyledContactBandInner` to `gap: tokens.space[12]` and update the stylesheet's comments that name
      the old step

**Checkpoint**: The whole feature is green; T003's assertions pass.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify the whole feature and record what implementation found.

- [ ] T007 [P] Run `npm run lint` and `npm run typecheck`; fix any error
- [ ] T008 [P] Run `npm test` and `npm run test:component`; fix any failure
- [ ] T009 Run `npm run build`
- [ ] T010 Run `npm run test:e2e -- contact-band-layout` and `npm run test:e2e -- home-scroll-snap`; fix any failure
- [ ] T011 Run `npm run test:a11y`; confirm zero violations
- [ ] T012 Update `specs/028-contact-band-copy-and-spacing/spec.md` status to Implemented and record any amendment found during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phases 3-5)**: Depend on Foundational; they touch files in sequence
  (config → styles → styles)
- **Polish (Phase 6)**: Depends on all user stories

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational; touches only the config
- **User Story 2 (P1)**: Depends on US1 only through the test file, not the value; touches the styles
- **User Story 3 (P2)**: Same file as US2; runs after it

### Within Each User Story

- Tests are written before implementation
- Story complete before moving to the next priority

### Parallel Opportunities

- T002 and T003 are different files and can run in parallel
- T004 touches only the config and cannot be parallel with T005/T006, which share the styles file

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup + Foundational
2. Complete User Story 1
3. **STOP and VALIDATE**: the sentence reads with its accent
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → the tests describe the new band
2. Add User Story 1 → the copy is right
3. Add User Story 2 → the size is right
4. Add User Story 3 → the air is right
5. Polish → the whole feature is verified

---

## Notes

- [P] tasks = different files, no dependencies
- Each user story is independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
