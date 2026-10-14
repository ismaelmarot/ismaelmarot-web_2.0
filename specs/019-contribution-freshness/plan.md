# Implementation Plan: How Old the Contribution Data Is

**Branch**: `019-contribution-freshness` | **Date**: 2026-10-14 | **Spec**: [spec.md](./spec.md)

## Summary

Two pure functions, one conditional in a component, and a type that stops lying. The calendar itself does
not change: it is a build artefact, it will always be a snapshot, and the specification's job is to stop
the page calling the snapshot "today".

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3
**Primary Dependencies**: styled-components 6.1. No additions
**Storage**: `src/data/contributions.json`, unchanged in shape
**Testing**: Vitest (unit and component). No E2E, and the spec says why
**Target Platform**: Static site, GitHub Pages
**Performance Goals**: Unchanged. A string comparison and one `Intl` call at render
**Constraints**: No cell, colour or dimension changes (FR-010); 010's FR-015/016/017 hold (FR-011); no new
prop or component (FR-012)

## Constitution Check

*GATE: passed.*

| Principle | Compliance |
|---|---|
| I. Component-First | No new component. Two functions in the component's existing hook file. |
| II. Type Safety | `dataAge(fetchedAt: string \| undefined, now: Date): number \| null` and `isStale(...): boolean`. `fetchedAt` becomes optional because the consumer cannot assume it (FR-008). |
| III. Testing | The fixture becomes parameterised because a fixed timestamp would silently move five existing tests onto the new branch. That is the part of this feature most likely to be got wrong. |
| IV. A11y & Performance | The line stays `aria-hidden` (FR-013), so nothing is announced twice. axe at four viewports. |
| V. Design Principles | The tone changes from a claim to a reading. "Última lectura a las 05:37" says what it knows. |
| VI. YAGNI | No relative-time library, no countdown, no auto-refresh, no polling. One threshold constant. |
| Styling | **No CSS change at all.** The line is the same element with the same style. |
| Path Aliases | Unchanged. |
| Dependencies | `package.json` untouched. |

## Project Structure

### Documentation (this feature)

```text
specs/019-contribution-freshness/
├── plan.md    # This file
├── spec.md
└── tasks.md
```

No `research.md`, `data-model.md`, `contracts/` or `quickstart.md`: no entity is added to a data model, no
schema changes, no interface between systems, no validation guide. No `checklists/` either, because the
specification was written after the investigation that produced it rather than before it, and its
requirements checklist would restate the spec rather than review it. That is recorded rather than papered
over: `specs/001` and `specs/002` have one because they went through `/speckit.checklist`; this one did
not.

## The three decisions

### The age is computed from `fetchedAt`, never from the last cell

The last cell's date says which **day** the calendar covers. It says nothing about **when the calendar was
read**. A calendar fetched at 09:00 and one fetched at 23:00 both end on the same date, and on this
repository the first is what ships, routinely.

Using the last cell would also reproduce the exact defect `specs/010`'s Amendment 2 fixed: it reasons from
the runner's date and presents it as the visitor's. Deriving the age from an instant, and rendering that
instant in the visitor's zone, keeps both halves of that amendment intact.

### Three hours, and why the number is not smaller or larger

It is not one hour: a build at 09:00 is still an accurate description of "today" for a visitor at 10:00,
and a timestamp is noise when the number is plainly current.

It is not six: at six, the first half of every working day is described as stale.

Three is where the description stops being a lie. It is a named constant, not a literal in the component,
because a threshold that is written inline cannot be changed without reading the render path, and a
threshold that is a prop would be offered to a caller that has no reason to change it.

### The unparseable and the absent both fall back to today's behaviour

`fetchedAt` is absent from every build made before this change, and the specification's Amendment 1
records why. A fallback that rendered "a las Invalid Date" would be worse than the behaviour it replaces,
and guessing the age from the last cell is the fallback `specs/010`'s Amendment 2 already refused.

So: no field, no claim. The line reads as it reads today, which is a claim about the data but not a claim
about its age — the same claim the site has always made, and no more.

## The fixture is the part that has to be right

`Contributions.test.tsx` builds its fixture with `fetchedAt: '2026-10-03T00:00:00.000Z'`. **That is years old
relative to whenever the suite runs.** Adding a freshness threshold would move five existing tests —
"names today in words", "says so plainly when today has no contributions", "uses the singular", "does not
repeat the date" — onto the new branch, and they would fail for a reason that has nothing to do with what
they assert.

The fixture therefore takes `fetchedAt` as a parameter and **defaults it to now**. The five tests keep
testing the fresh case they were written for, unchanged, and a new battery covers the stale case. A test
that silently moves onto a different branch is worse than a test that fails, because it keeps passing
while testing something else.

## Testing, and what it does not reach

**Unit** — `dataAge` and `isStale`, including the boundary, the future, the absent and the unparseable.
These are pure functions of `(fetchedAt, now)`, so every case is reachable without a clock.

**Component** — the fresh line is byte-identical to today, the stale line names the hour and drops "Hoy",
and the calendar-not-reaching-today case still renders nothing. The fixture controls `fetchedAt`.

**Build** — SC-008 greps `dist/assets/*.js` for `fetchedAt`. It is a build assertion rather than a test
because a bundler's treatment of an unused property is not a unit test's business, and because the whole
point of FR-009 is that the field must be read by shipped code.

**No E2E**, because the only thing a browser adds here is timezone rendering, and SC-006 covers that as a
unit test with an explicit offset — which is a stronger assertion than reading a clock's timezone from a
browser would be.

## What this plan does not fix

**The staleness window itself.** Every four hours instead of every twenty-four, once the schedule changes,
and not at all without it. That is a separate repository and a separate commit, and the schedule's
reliability is GitHub's, not this repository's: the last five scheduled runs were five to seven and a half
hours after the hour they declare. **The label is what makes the site correct; the schedule only makes it
correct less often.**