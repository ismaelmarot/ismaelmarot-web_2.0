# Tasks: Rotating the project icon strip

**Input**: Design documents from `specs/013-project-icon-rotation/`

**Prerequisites**: plan.md, spec.md, research.md

**Tests**: Required. FR-003 cannot be checked by looking at the page, and SC-008 and SC-009 describe
timing that only a controlled clock can verify.

## Format

`[ID] [P?] [Story] Description` — [P] parallelisable, [Story] maps to US1/US2/US3.

## Phase 1: Specification

- [x] T001 Count the derangements of 6 elements and of 7-taken-6, to establish that the guarantee has
      room and that six apps in six slots really does force a permutation
- [x] T002 Establish that six apps in six slots leaves nothing new to appear, and record both readings of
      the request rather than choosing silently
- [x] T003 Decide between permuting the rendered array and holding fixed slots, and record what the
      permutation would cost: the entrance stagger, node identity, and the phone scroller's snap points
- [x] T004 Write the specification, with the superseded "no autoplay" assumption named explicitly rather
      than quietly contradicted
- [x] T005 Record Amendment 4 in `specs/011-project-icon-strip/spec.md`, listing the six things that
      stay true as well as the one that stops being true
- [x] T006 Write `research.md` with the arithmetic and the rejected alternatives

## Phase 2: Foundational

**Purpose**: The assignment function. Everything else depends on it and it is the only part with real
logic in it.

- [x] T007 Create `iconRotation.ts` with `ESPACIOS`, `INTERVALO_MS`, `FASE_MS` and the pure
      `siguienteAsignacion(total, espacios, previa, rng?)`
- [x] T008 Implement the shuffle with Fisher-Yates over `rng`, rejecting a draw in which any slot keeps
      its own previous app
- [x] T009 Bound the retries and repair the leftovers by filling each slot with the first app that is
      neither already used nor what that slot had, so a degenerate random source cannot break the
      guarantee
- [x] T010 Prefer apps that are not currently on screen where the arithmetic allows it, which is 12 apps
      in 6 slots or more (FR-006)
- [x] T011 Return every app and signal that no rotation is possible when `total <= espacios`, so the
      caller has no degenerate-case branch of its own (FR-008)
- [x] T012 Write `tests/unit/project-icon-rotation.test.ts`: with a seeded `rng`, 20 consecutive
      assignments and every one of SC-001 to SC-004 asserted without a timer
- [x] T013 [P] Test the degenerate counts: 0, 1, 2, 5 and 6 apps in 6 slots
- [x] T014 [P] Test that a constant `rng` still satisfies the guarantee, since that is the worst case the
      bounded retries have to survive
- [x] T015 [P] Test that the `rng` is genuinely used, so a hardcoded permutation cannot pass as random
- [x] T016 [P] Test that an empty or short `previa` yields a valid assignment rather than throwing

**Checkpoint**: `npm run test` green. The guarantee holds and is proven without a timer.

## Phase 3: User Story 1 - See the row renew itself (Priority: P1) MVP

**Goal**: Every slot shows a different app every four seconds, and the slots do not move.

- [x] T017 Create `useIconRotation.ts` holding the assignment, the interval, the two-phase fade and the
      four pauses, keeping state out of the `.tsx` as the constitution requires
- [x] T018 Make the fade two phases on separate clocks: opacity to 0, the assignment changes on a timer
      matching `FASE_MS`, opacity back to 1 (FR-009)
- [x] T019 Use a transition on `opacity` rather than a second animation, because the frame already
      animates opacity and transform for its entrance
- [x] T020 Hold six fixed slots and render `projects[asignacion[i]]` in slot `i`, rather than permuting
      the array (FR-001)
- [x] T021 Start the interval only once the row is on screen, using the observer the strip already has
      (FR-012)
- [x] T022 Remember a failed icon across rotations so the placeholder does not flicker when the app comes
      round again (FR-015)
- [x] T023 Test that the assignment changes at the interval and that every slot changed (SC-001, SC-002)
- [x] T024 [P] Test that no app appears in two slots at once (SC-003)
- [x] T025 [P] Test that the entrance stagger is still `0, 60, 120, 180, 240, 300` after a rotation, which
      is the assertion that proves the slots never reordered
- [x] T026 [P] Test that every slot's alternative text still names an app after a rotation (FR-013)
- [x] T027 [P] Test that no timer is created when there are no more apps than slots (FR-008)

## Phase 4: User Story 2 - Not be shown movement they did not ask for (Priority: P1)

- [x] T028 Create no interval at all under reduced motion, rather than pausing one (FR-010)
- [x] T029 [P] Test that with reduced motion requested the assignment does not change across three
      intervals (SC-008)
- [x] T030 [P] Test that the frames still have a computed transition duration of `0s` under reduced
      motion, which is feature 011's SC-006 and the assertion most at risk from this feature
- [x] T031 [P] Test that the assignment does not change while the pointer is over the row (FR-011)
- [x] T032 [P] Test that it does not change while focus is within the row, and that it resumes after
- [x] T033 [P] Test that it does not change while the document is hidden, checked inside the tick rather
      than by a listener, so a tab hidden before the tick and revealed before the next cannot slip one
      through
- [x] T034 Test that the row is still a list of six, still has no links, and still introduces no new
      heading (FR-016, FR-018)

## Phase 5: User Story 3 - Read it on a phone (Priority: P2)

- [x] T035 [P] Test that the row's `scrollLeft` does not change across a rotation, which is what holding
      the slots fixed buys and what a permutation would have broken
- [x] T036 [P] Test that the icons are still 96x96 with a 21px radius and `cover` after a rotation, so
      feature 011's geometry is untouched
- [x] T037 [P] Test that the row is still a horizontal scroller with a masked edge below 700px, so the
      phone carousel is untouched
- [x] T038 Test in the browser that six slots do not move and that the page's cumulative layout shift
      stays below 0.1 across three rotations (SC-005, SC-007)

## Phase 6: Verification

- [x] T039 Run `npm run typecheck`, `npm run lint`, `npm run test` and `npm run test:component` (SC-012)
- [x] T040 Confirm feature 011's e2e assertions still pass **unchanged**, and add the new ones beside them
      rather than editing any (SC-012)
- [x] T041 Run the browser tests across chromium, webkit, Mobile Chrome and Mobile Safari
- [x] T042 Run `npm run test:a11y` and confirm the row is still announced as a list of six (SC-011)
- [x] T043 Compare the bundle against 441.47kB (SC-013)
- [x] T044 Verify by hand against `quickstart.md`, including the reduced-motion case

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Specification): done
- Phase 2 (Foundational): blocks all stories
- Phase 3 (US1): after Phase 2. MVP, verifiable with a controlled clock
- Phase 4 (US2): after US1. Same timer, about what suppresses it
- Phase 5 (US3): after US1. Styles and geometry, parallel to US2
- Phase 6: last

### Parallel Opportunities

- T013 to T016 parallel with T012
- T024 to T027 parallel
- T029 to T034 parallel
- T035 to T037 parallel

### Critical Path

T007 → T008 → T009 → T012 → T017 → T020 → T023 → T039

## Notes

- Every task carries the FR, SC or requirement it serves, so traceability from specification to
  assertion stays visible
- No test of feature 011 is deleted. Feature 011's own criteria are the ones this feature is most likely
  to break, so they are the ones worth leaving exactly as they are and re-running
- Firefox cannot launch in this environment, which also affects the pre-existing suite; CI runs chromium

## Phase 7: One icon on a phone (Amendment 1)

**Purpose**: Replace feature 011's mobile carousel with a single rotating icon. Amendment 5 of feature
011 withdraws SC-007 and narrows SC-001, because the carousel's scrollWidth, its snapping and its edge
mask no longer describe anything.

- [x] T045 Record Amendment 1 in this specification and Amendment 5 in feature 011, before writing code,
      because the change supersedes two of that feature's own success criteria
- [x] T046 Add `esMovil` to the hook through `matchMedia('(max-width: 700px)')`, reusing the width the
      carousel used so the styles and the slot count change together
- [x] T047 Recompute the assignment when the slot count changes, because a six-entry previous assignment
      means nothing to a single slot
- [x] T048 Derive the slot count from the hook rather than from the project count, so the component does
      not need to know about the viewport
- [x] T049 Replace the carousel's `overflow-x`, `scroll-snap-type` and `mask-image` with centring, and
      delete the snap alignment from the frame rather than leaving unreachable rules behind
- [x] T050 Assert the carousel's absence in the component test: three techniques that cannot be reached are
      dead weight in a stylesheet shipped to every visitor
- [x] T051 Assert SC-014 in the browser: one frame, centred within two pixels, and no horizontal scroll
- [x] T052 Assert SC-015 at 701px, 700px and 699px, so there is no viewport range where one layout's rules
      apply while the other's elements are in the document
- [x] T053 Measure the section's height at four viewports before changing the mobile frame count, and
      confirm it still measures exactly one screen. It does: 900, 1024, 844 and 640 against matching
      viewports, so feature 011's own one-screen assertion stands and needs no amendment
- [x] T054 Rewrite the browser test that asserted six frames at 390 and 320, which Amendment 5 supersedes,
      while keeping every other assertion in that block for all four viewports
- [x] T055 Fix two browser tests that were measuring or hovering wrongly rather than asserting wrongly:
      one measured during feature 011's entrance and read 96,96,95,94,93,91, and one hovered a frame's
      edge, which lands in a gap in webkit and left the row un-hovered
- [x] T056 Fix the assignment function, its repair path and two seeded test helpers, all four found by
      tests asserting the right thing against code that was not doing it. Recorded as Amendment 3
