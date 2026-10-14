# Tasks: How Old the Contribution Data Is

**Input**: Design documents from `specs/019-contribution-freshness/`

**Prerequisites**: plan.md, spec.md

**Tests**: Required. Twelve new tests and one fixture changed. No E2E, and the spec says why.

## Format

`[ID] [P?] [Story] Description` — [P] parallelisable, [Story] maps to US1–US3.

## Phase 1: Measurement before specification

- [x] T001 Read the maintainer's report and confirm the deployed bundle's value for today: `count: 0`
- [x] T002 Query GitHub's GraphQL API authenticated, at the same moment: `2026-10-14 → 6`
- [x] T003 Establish the deploy interval from `gh run list`, and measure the scheduler's delay against
      the cron's declared hour across five runs: **+5.4 h, +6.5 h, +6.7 h, +7.2 h, +7.4 h**
- [x] T004 Confirm the calendar's local copy ends `2026-10-04` and has no cell for today, which is the
      other stale case and the one a local build shows
- [x] T005 Check whether GitHub's contributions endpoint permits CORS, which would decide whether the
      data could be fetched from the browser at all: **no `Access-Control-Allow-Origin` header**
- [x] T006 Grep the deployed bundle for `fetchedAt`: **zero occurrences**, despite the fetcher writing it
      and the type declaring it
- [x] T007 Read `specs/010`'s Amendment 2 and find the same symptom already reported on 2026-10-05,
      fixed for the timezone half and never for the freshness half
- [x] T008 Write the specification, including the five-runs scheduler measurement as the reason the cron
      cannot be the whole fix

## Phase 2: The derivation

- [x] T009 [P] `dataAge(fetchedAt, now)` — hours as a number, `null` when absent or unparseable, and
      **negative rather than clamped** for a future timestamp (FR-005, FR-006)
- [x] T010 [P] `STALE_AFTER_HOURS = 3` and `isStale(fetchedAt, now, threshold = STALE_AFTER_HOURS)`,
      where an unknown age is not stale rather than guessed (FR-004, FR-007)
- [x] T011 [P] `formatFetchHour(fetchedAt, locale)` — `es-ES`, two-digit hour, no seconds
- [x] T012 Both functions take `now` as a parameter and never read the clock, so the boundary and the
      future-timestamp case are reachable in a test without waiting an hour (FR-005)

## Phase 3: The component

- [x] T013 `describeTodayLine(count, fetchedAt)` — `Hoy · N` below the threshold, byte-identical to
      today; `Última lectura a las HH:MM · N` at or above it, with no "Hoy" (FR-002, FR-003)
- [x] T014 Read `contributions.fetchedAt` **in the component**, which is what keeps the field in the
      bundle (FR-009)
- [x] T015 An absent or unparseable `fetchedAt` falls through to today's wording and renders no
      invalid date (FR-007)
- [x] T016 `fetchedAt` becomes optional on `ContributionsData`, because the consumer cannot assume it
      is present (FR-008)
- [x] T017 No cell, colour, dimension, scroll behaviour or accessible name changes; the label stays
      `aria-hidden` (FR-010, FR-013)
- [x] T018 Confirm `specs/010`'s FR-015 still wins: a calendar that stops short of today renders no line
      at all, fresh or stale (FR-011)

## Phase 4: The fixture, which is the part most likely to be wrong

- [x] T019 `Contributions.test.tsx`'s fixture pinned `fetchedAt: '2026-10-03'`, years old relative to
      whenever the suite runs. Parameterise it and **default it to now**, so the twenty-three existing
      tests keep testing the branch they name
- [x] T020 Move `weekEndingToday` from inside one `describe` to module scope, because the new battery
      needs it and nesting a `describe` inside another to reach it put three closing braces where two
      belong
- [x] T021 Confirm all twenty-three existing tests pass **unchanged** before adding anything

## Phase 5: Tests

- [x] T022 Ten component tests for the freshness branch: fresh, stale with a count, stale with zero,
      stale singular, the exact threshold and just under it, a future timestamp, an absent field, an
      unparseable field, a calendar that does not reach today, and the `aria-hidden` guarantee
- [x] T023 Fourteen unit tests: `dataAge` at four values including null and negative, `isStale` at
      both sides of the boundary and with a custom threshold, and `formatFetchHour`
- [x] T024 `formatFetchHour` asserted against the runtime's own offset rather than a hard-coded string,
      because `toLocaleTimeString` resolves the zone from the runtime and **not** from the locale

## Phase 6: The schedule, in the other repository

- [x] T025 `ismaelmarot/ismaelmarot.github.io`: cron `15 3 * * *` → `15 */4 * * *`
- [x] T026 Replace the comment, which justified 03:15 UTC by reasoning about a moment that measurement
      shows never occurs
- [x] T027 Parse the edited YAML and assert `schedule` is `[{cron: "15 */4 * * *"}]`

## Phase 7: Verification

- [x] T028 `npm run lint` and `npm run typecheck`
- [x] T029 `npm run test` — 147 unit
- [x] T030 `npm run test:component` — 421
- [x] T031 `npm run build`
- [x] T032 **SC-008**: grep the production bundle for `fetchedAt`. Before: 0 occurrences. After: 2.
- [x] T033 `npm run test:a11y` — the audit visits every route since `specs/018`, so this covers
      `/technologies`

## Verification Results

| Criterion | Result |
|-----------|--------|
| SC-001 fresh line unchanged | Pass: `Hoy · 4 contribuciones`, byte-identical |
| SC-002 stale line names the hour | Pass: `Última lectura a las 06:37 · 4 contribuciones`, no "Hoy" |
| SC-003 future timestamp | Pass: reads as fresh, no future hour rendered |
| SC-004 absent field | Pass: today's wording |
| SC-005 unparseable field | Pass: today's wording |
| SC-006 timezone rendering | Pass: asserted against the runtime offset, not a literal |
| SC-007 calendar short of today | Pass: no line rendered, fresh or stale |
| SC-008 `fetchedAt` in the bundle | **Pass: 0 → 2 occurrences** |
| SC-009 lint, typecheck, tests, build | Pass: 147 unit, 421 component, no assertion deleted |
| SC-010 axe at four viewports | Pass: 0 violations on all seven routes |

## Notes

**T019 is the task that had to be right before any of the others mattered.** The fixture pinned
`fetchedAt` at `2026-10-03`. Adding a threshold would have moved five existing tests onto the stale branch,
where they would have kept passing while asserting something they never named. A test that silently
changes what it tests is the failure `specs/015` records as Amendment 1 and `specs/018` records as its own
Amendment 1, and the fix is the same: make the fixture say what it means.

**T020 cost more than it should have.** `weekEndingToday` was scoped inside one `describe`, so the new
battery could not reach it. The first fix nested a `describe` inside another, which is legal and left
three closing braces where two belong; the file stopped parsing and reported "no tests". Hoisting the
helper to module scope is what it wanted all along, and it is the shape the other helpers in that file
already have.

**T024 is the same lesson `specs/010`'s Amendment 2 records, from the other direction.** I asserted that
`formatFetchHour` returns `"09:37"` for a `09:37Z` instant under `es-ES`. It returns `06:37`, because
`toLocaleTimeString` takes the timezone from the runtime and this machine is on UTC-3. The function was
right and the test was wrong, and had the assertion stood it would have enforced **ignoring the visitor's
zone** — the exact defect Amendment 2 fixed for dates. The test now computes the local wall clock from the
instant itself, which fails if the formatter ever stops honouring the zone.

**One pre-existing flake, unrelated and untouched.** `ProjectIconStrip > el layout de mobile > SC-014` —
the one icon changes app on each rotation — failed once in five runs of its own file while this work was
in progress, and passes the other four. No file of that component is in this feature's diff. It is the
same class as the intermittent webkit failure `specs/014`'s Amendment 2 records: a test that waits on a
CSS state reached by an animation and loses the race on a loaded machine. **It is recorded here rather
than fixed**, because fixing it is its own change with its own specification.

**Firefox still cannot launch on this machine**, which `specs/014`'s Amendment 2 records, and the E2E
suite has been failing in CI since at least 2026-10-12 for reasons this feature does not touch.