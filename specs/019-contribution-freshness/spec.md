# Feature Specification: How Old the Contribution Data Is

**Feature Branch**: `019-contribution-freshness`

**Created**: 2026-10-14

**Status**: Implemented

**Input**: A maintainer report: the Technologies page's GitHub contributions strip reads
*"Hoy - sin contribuciones"*, and *"esto ha pasado otros días"*.

## The gap this specification fills

The calendar is a build artefact. It is fetched once, written to `src/data/contributions.json`, and the
page shows the snapshot. The label under the grid says **"Hoy"** about a number that was true at the
moment the build ran, which for most of any given day is not now.

Measured on 2026-10-14, the report and the cause:

| | |
|---|---|
| GitHub's API, queried now | `2026-10-14 → 6` contributions |
| The deployed bundle | `2026-10-14 → 0` |
| The last deploy | `2026-10-14 08:37:44 UTC` |
| The cron's declared hour | `15 3 * * *`, i.e. 03:15 UTC |

The six contributions were made after 08:37 UTC and will not appear until the next deploy. **The label is
not lying about the data. It is lying about the data being today's.**

**"This has happened on other days" is the load-bearing part of the report.** It is not a one-off. The
window in which a contribution is invisible is the gap between the fetch and the visitor's next read of
the page, which on this repository is roughly twenty-four hours.

### The cron does not run when it says it runs

`ismaelmarot/ismaelmarot.github.io`'s `deploy.yml` schedules `15 3 * * *`, and its comment explains the
hour: *"A reader in UTC-3 enters a new local day at 03:00 UTC, so this offset means there is never a
moment when their own day is absent from the data."*

**The scheduler defeats the reasoning.** Every scheduled run in the recent history is five to seven and a
half hours late:

| Run | Event | Actual | Against the declared 03:15 UTC |
|---|---|---|---|
| 2026-10-14 | `schedule` | 08:37:44Z | **+5.4 h** |
| 2026-10-13 | `schedule` | 10:28:08Z | **+7.2 h** |
| 2026-10-12 | `schedule` | 10:40:17Z | **+7.4 h** |
| 2026-10-11 | `schedule` | 09:55:25Z | **+6.7 h** |
| 2026-10-10 | `schedule` | 09:44:54Z | **+6.5 h** |

So the fetch happens between roughly 09:00 and 11:00 UTC, which is six to eight hours *into* the visitor's
day rather than at its edge. The design goal was to capture the day as it opens; what it captures is the
day as it stands mid-morning, and every contribution made afterwards waits a full cycle.

**This is why the cron cannot be the whole fix.** The delay is GitHub's scheduling queue, not a number
anyone controls, and it is not bounded. A more frequent schedule reduces how often a visitor is misled. It
cannot guarantee they are not. Only the label can guarantee they are not misled.

## What this is deliberately not

**It does not fetch at runtime.** GitHub's contributions endpoint sends no `Access-Control-Allow-Origin`
header — checked, not assumed — so a browser cannot read it from this origin, and the constitution fixes
"build-time GitHub data" as an invariant.

**It does not remove "Hoy".** On a fresh build the label stays exactly as it is. This specification adds
what happens when it is not fresh, and leaves the fresh case untouched.

**It does not change the calendar, the grid, the cells, the colours or the scroll.** The defect is one
string.

**It does not claim the data is fresh when it is not.** That is the whole point, and it is why the fix is a
label rather than a rebuild.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Be told the truth about the number (Priority: P1)

A visitor who made contributions today, opens the page on a build that predates them, and reads a line
that says when the count was taken. The number is still shown, because hiding it would lose information
the build does have. It is attributed, so nobody reads it as current.

**Why this priority**: This is the report. The visitor is not being asked to tolerate a stale feature;
they are being asked to be told which part is stale.

**Independent Test**: Build with a `fetchedAt` older than the threshold and assert the line names a time
and no longer says "Hoy". Build with a fresh `fetchedAt` and assert the line is byte-identical to today's.

**Acceptance Scenarios**:

1. **Given** the calendar was fetched less than the threshold ago, **When** the strip renders, **Then** the line reads `Hoy · N contribuciones` exactly as it does today.
2. **Given** the calendar was fetched more than the threshold ago, **When** the strip renders, **Then** the line reads `Última lectura a las HH:MM · N contribuciones` and does not contain the word "Hoy".
3. **Given** the count is zero and the data is stale, **When** the strip renders, **Then** the line still shows the zero and still names the hour, because "no contributions" and "no contributions as of 05:37" are different claims.
4. **Given** the visitor reads in a different timezone, **When** the hour is rendered, **Then** it is their own local hour, not UTC and not the runner's.

---

### User Story 2 - Be told how old the calendar is even when there is no "today" (Priority: P2)

A visitor whose calendar does not reach their day today is shown no "Hoy" line at all — that is
`specs/010`'s FR-015 and FR-017, and it is correct. They can still see the period the section header
states. Nothing in this specification changes that.

**Why this priority**: It is a boundary of the fix rather than a goal. Stated so that adding freshness does
not accidentally start marking an old day as today's, which is exactly what `specs/010`'s Amendment 2
rejected a fallback for.

**Acceptance Scenarios**:

1. **Given** the calendar's last day is before the visitor's date, **When** the strip renders, **Then** no freshness line is rendered and no cell is marked.
2. **Given** the calendar's last day equals the visitor's date, **When** the strip renders, **Then** a line is rendered, marked as today or as a last reading depending on the age.

---

### User Story 3 - Not be misled when the data's age is unknown (Priority: P2)

A build made before this specification carries no `fetchedAt` at all — not because the fetcher omits it,
but because nothing read it and the bundler dropped it. Those builds keep today's behaviour rather than
inventing an hour.

**Why this priority**: The fallback must be chosen deliberately, and "guess the age from the last cell" is
the guess `specs/010`'s Amendment 2 already refused for a different reason.

**Acceptance Scenarios**:

1. **Given** a build with no `fetchedAt`, **When** the strip renders, **Then** the line reads as it does today, because nothing is known about its age.
2. **Given** a `fetchedAt` that does not parse, **When** the strip renders, **Then** the same fallback applies, and no invalid date reaches the visitor.

---

### Edge Cases

- **A timestamp in the future.** Clock skew between the build runner and the visitor, or a mistyped value.
  A negative age is treated as fresh: a build cannot be from the future, and showing "última lectura a las
  [mañana]" would be worse than saying nothing about it.
- **Exactly at the threshold.** Fresh. The boundary is inclusive of "still current", which is what a reader
  expects from a number that is a few hours old.
- **A build from six months ago.** The line still names the hour of that build. The section header already
  states the period, so the two together date the data without a third line.
- **The visitor's timezone changed since the build.** `fetchedAt` is an absolute instant; rendering it in
  the visitor's zone is the only reading that is about them, the same decision `specs/010`'s Amendment 2
  made for the date.
- **`fetchedAt` present but the calendar empty.** The component returns `null` before any of this is read,
  so an empty calendar still renders nothing.
- **Daylight saving.** `toLocaleTimeString` resolves it. The hour is a wall-clock reading, not an offset,
  and no arithmetic in the component depends on a 24-hour day.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The age of the calendar MUST be derived from `fetchedAt` and nothing else. The last cell's
  date MUST NOT be used as a proxy for freshness, because a cell's date is the runner's date and says
  nothing about when the page was built.
- **FR-002**: Below the threshold the line MUST read exactly as it reads today, with no added text and no
  removed text.
- **FR-003**: At or above the threshold the line MUST name the hour the data was fetched, rendered in the
  visitor's own timezone, and MUST NOT contain the word "Hoy".
- **FR-004**: The threshold MUST be a single named constant of 3 hours. Not a literal in the component and
  not a prop, because no caller has a reason to change it.
- **FR-005**: The age calculation MUST be a pure function of `(fetchedAt, now)`, returning hours as a
  number, and MUST NOT read the clock itself.
- **FR-006**: A negative age MUST be treated as fresh.
- **FR-007**: An absent or unparseable `fetchedAt` MUST fall back to today's behaviour, and MUST NOT render
  an invalid date to the visitor.
- **FR-008**: `fetchedAt` MUST be typed as optional on `ContributionsData`, because the consumer cannot
  assume it is present. The fetcher still always writes it.
- **FR-009**: Reading `fetchedAt` in the component is what keeps it in the built bundle. It MUST NOT be
  read only in a test.
- **FR-010**: No cell, colour, dimension, scroll behaviour or accessible name may change.
- **FR-011**: `specs/010`'s FR-015, FR-016 and FR-017 continue to hold unchanged: no line when the
  calendar does not reach the visitor's day, today's cell identified by comparing stored dates, and no cell
  marked when it is absent.
- **FR-012**: No new dependency, no new component, no new prop on `Contributions`.
- **FR-013**: The line MUST be `aria-hidden` as it is today, because the cell's own `aria-label` already
  carries "(hoy)" and repeating the hour to a screen reader would duplicate it.

### Key Entities

- **Age**: the hours between `fetchedAt` and now. The only new thing in this specification.
- **Threshold**: 3 hours, the point past which a number stops being described as "today".
- **Snapshot line**: the same string as today's, carrying an hour instead of the word "Hoy".

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With `fetchedAt` 30 minutes old, the rendered line is byte-identical to today's.
- **SC-002**: With `fetchedAt` 4 hours old, the rendered line names the hour and contains no "Hoy".
- **SC-003**: With `fetchedAt` 90 seconds in the future, the line reads as fresh and no invalid hour is
  rendered.
- **SC-004**: With `fetchedAt` absent, the line reads as it does today.
- **SC-005**: With `fetchedAt` set to an unparseable string, the line reads as it does today.
- **SC-006**: The hour rendered at a known timezone offset equals that offset's wall-clock reading of the
  same instant.
- **SC-007**: With the calendar ending before today, no freshness line renders.
- **SC-008**: `fetchedAt` appears in the built bundle, verified by grepping the production build, because
  FR-009 is the only reason it survives.
- **SC-009**: Type checking, linting, the unit tests, the component tests and the build pass, and no
  existing assertion is deleted.
- **SC-010**: axe reports zero violations at 1440, 768, 390 and 320 on `/technologies`.

### On what is and is not backed by these criteria

**SC-001 through SC-007 are component tests** over a fixture whose `fetchedAt` is controllable, which is
why the fixture has to become parameterised rather than fixed.

**SC-008 is verified by grepping `dist/assets/*.js`** rather than by a test, because a bundler's
behaviour on an unused object property is not something a unit test should assert and a build test cannot
easily reach.

**SC-010 is the repository's own audit**, which now visits every route since `specs/018`.

**No E2E file was added**, and this specification's criteria do not need one: the change is a string, and
the timezone rendering is the only thing a browser would add, which SC-006 covers as a unit test with an
explicit offset.

## Assumptions

- **Three hours is the point at which "Hoy" stops being true.** It is short enough that a morning
  contribution is described as today's for most of the working day, and long enough that a visitor who
  opened the page immediately after a deploy is not given a timestamp for something that happened two
  minutes ago.
- **A build's fetch time is the honest answer to "when is this number from".** Not the last cell, not the
  deploy time, not the time of day: the instant the calendar was read.
- **Showing a stale number beats hiding it.** The visitor learns something true either way, and hiding
  today's count because the build is old would remove information the calendar genuinely has.
- **The build artefact's age is public information.** It is already in the repository.
- **The schedule change is a separate repository and a separate commit.** `ismaelmarot/ismaelmarot.github.io`
  holds the deployment workflow and nothing of the site's source.

## Amendments

### Amendment 1 - `fetchedAt` was never readable, which is why nobody had used it

**Added by**: during implementation, 2026-10-14.

`fetchedAt` has been written by `fetch-contributions.ts` since the feature was built and declared in
`ContributionsData`. **It appears zero times in the deployed bundle.** The deployed object is
`{username, calendar, summary}`.

The bundler drops it because nothing in the shipped code reads it, and an unused property on an inlined
object literal does not survive minification. The field was not missing from the data. It was missing from
the program, and it was removed from the data on its way to the browser.

**This is why FR-009 exists as a requirement rather than as a note.** A field being present in a type and
in a fetcher is not the same as being available, and nothing in the type system says the difference. The
first way to notice is to grep the built artefact, which is what SC-008 does and what should have been
done when the field was added.

**The fallback in FR-007 is therefore not hypothetical.** Every build made before this change ships
without the field, and it is not a rare edge case — it is every artefact currently deployed. The fallback
is what keeps those artifacts behaving exactly as they do rather than rendering "a las Invalid Date".