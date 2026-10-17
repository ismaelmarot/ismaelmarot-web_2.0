# Tasks: The Contact Band's Breathing Room

**Input**: Design documents from `/specs/029-contact-band-breathing-room/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: included, because the feature is a claim about a rendered distance and a stylesheet assertion
would pass on a value that overflows.

**Organization**: one user story, three phases.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1; first n = shared phases)
- Every task names the exact file it changes

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Component folder: `src/components/sections/ContactBand/`

---

## Phase 1: Setup

- [ ] T001 [P] Write `specs/029-contact-band-breathing-room/` artifacts: `spec.md`, `plan.md`,
      `research.md`, `data-model.md`, `quickstart.md`, `checklists/requirements.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The two tests that hold the new behaviour, written before the implementation so they are red.

**⚠️ CRITICAL**: No implementation can begin until this phase is complete.

- [ ] T002 [P] [US1] In `src/components/sections/ContactBand/ContactBand.test.tsx`, tighten the gap
      assertion: the inner's CSS holds `tokens.space[16]` and does not resolve `var(--space-12)` on the
      gap declaration; confirm the suite is red
- [ ] T003 [P] [US1] In `tests/e2e/contact-band-layout.spec.ts`, tighten the spacing assertions in the
      "aire entre el bloque y la fila" test: the distance is greater than 40 **and** measures 64 with 1px
      of slack; confirm the suite is red

**Checkpoint**: Foundation ready - the tests describe the new band and fail against the old one.

---

## Phase 3: User Story 1 - See the two blocks separate by a full breath (Priority: P1)

**Goal**: The button-to-row distance measures the `space[16]` step (64px).

**Independent Test**: The rendered distance between the button's bottom and the row's top measures 64px
(±1) at 1440 and at 390/320, greater than the 48px the band carried through specs/028.

### Implementation for User Story 1

- [ ] T004 [US1] In `src/components/sections/ContactBand/ContactBand.styles.ts`, set
      `StyledContactBandInner` to `gap: tokens.space[16]` and update the stylesheet's comments that name
      the step

**Checkpoint**: The whole feature is green; both tightened tests pass.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Verify the whole feature and record what implementation found.

- [ ] T005 [P] Run `npm run lint` and `npm run typecheck`; fix any error
- [ ] T006 [P] Run `npm test` and `npm run test:component`; fix any failure
- [ ] T007 Run `npm run build`
- [ ] T008 Run `npm run test:e2e -- contact-band-layout` and `npm run test:e2e -- home-scroll-snap`; fix any failure
- [ ] T009 Run `npm run test:a11y`; confirm zero violations
- [ ] T010 Update `specs/029-contact-band-breathing-room/spec.md` status to Implemented and record any amendment found during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS the user story
- **User Story 1 (Phase 3)**: Depends on Foundational
- **Polish (Phase 4)**: Depends on User Story 1

### Parallel Opportunities

- T002 and T003 are different files and can run in parallel

---

## Notes

- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task or logical group
- Avoid: vague tasks, cross-file conflicts, tasks that share the same file in parallel
