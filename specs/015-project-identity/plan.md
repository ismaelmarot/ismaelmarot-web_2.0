# Implementation Plan: How a project is written and how its icon is seen

**Branch**: `015-project-identity` | **Date**: 2026-10-11 | **Spec**: [spec.md](./spec.md)

> **Retrospective.** Both features were implemented and deployed before this specification existed. The
> plan below describes the work as it was done rather than as it would have been planned, which is the
> honest form for a document written afterwards. Where it records a measurement, the measurement is the
> one that decided the implementation.

## Summary

Two display corrections to how a project is presented. Names carrying a hyphen are written as words in
the three places a name is visible, and the icon's frame carries the shadow the home strip has always
had, in all three places an icon appears.

The whole change is one helper and three declarations. The work that took the time was the measuring:
confirming that the longer names cost no card row, and confirming that a shadow on a square image box
would trace the rectangle rather than the icon.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19
**Primary Dependencies**: styled-components 6.1, no additions
**Storage**: `src/data/projects.json` unchanged, deliberately
**Testing**: Vitest (unit + component). **No E2E was written for either feature** — see below.
**Target Platform**: Static site, GitHub Pages, evergreen browsers
**Performance Goals**: Card heights unchanged at 320 and 1440 (SC-008)
**Constraints**: No new dependency (FR-015); no stored name changes (FR-004); no accessible label changes
(FR-006)

## Constitution Check

*GATE: passed.*

| Principle | Compliance |
|---|---|
| I. Component-First | No new component. Three existing render sites and two stylesheets. |
| II. Type Safety | One exported function, typed `(name: string) => string`. |
| III. Testing | Unit for the helper's rules, component for the declarations. The absence of E2E is stated in the spec rather than papered over. |
| IV. A11y & Performance | Accessible labels deliberately untouched (FR-006); card heights measured unchanged (SC-008). |
| V. Design Principles | Corrects a slug reading as a title; unifies an icon across pages. No new decoration. |
| VI. YAGNI | One helper, three declarations. No font loading, no display name resolver, no config. |
| Styling | styled-components in the existing `*.styles.ts`. |
| Path Aliases | Unchanged. |
| Dependencies | `package.json` untouched. |

## The one decision everything else followed from

`formatProjectName` keys on the hyphen, not on capitalising. A general title-case would render `LinkIO`
as `Linkio`, `QEntry` as `Qentry` and `NauticAcademy` as `Nauticacademy`, all three of which are
misspellings of real names. The guard is therefore the rule, not a refinement of it:

```
if (!name.includes('-')) return name;
```

`.filter(Boolean)` after the split is what keeps `'-leading'` from returning `' Leading'`. Without it
the feature ships a bug that no current data would trigger and the next repository might.

## Why the detail gained a frame

The detail's icon was a bare `<img>`: 72px square, `object-fit: contain`, no radius, no background. The
six PNGs have transparent corners. A `box-shadow` on that element traces the **72×72 rectangle**, so the
measured result was a grey block behind a rounded icon. Giving it a frame and putting the shadow on the
frame is the same thing the card has always done.

The radius is scaled rather than copied: 22% of the width, which is 21px at 96px and 16px at 72px.
Copying 21px would have made the detail's corners visibly tighter in proportion.

The image moved from `contain` to `cover` because the frame now clips it, which is what the card's
already does.

## Why the shadow is a literal and not a token

`--shadow-xs` is `0.1`. On a 96px tile that reads as grime rather than lift. The home strip's value,
`0 1px 2px rgba(0, 0, 0, 0.04)`, is not a token today, so introducing `--shadow-icon` for two of three
call sites would leave the third on a literal and make the set harder to change rather than easier.

## Testing, and what it does not reach

**Unit** — the helper's six cases, including the four real names and the hyphen edges.

**Component** — that the card frame, the card placeholder and the detail frame declare the shadow, and
that the detail's image is `cover`.

**No E2E.** SC-001, SC-006 and SC-008 describe what a browser renders and were measured in one during
implementation; nothing automates them today. The spec says so in its own section rather than implying
coverage that does not exist, because this repository has already shipped a broken short-viewport
fallback through a fully green component suite.

The tests that do exist were checked against a broken version of the feature. Removing the hyphen guard
fails the unit test; removing the four declarations fails the component tests.

## Measurements taken during implementation

| | Before | After |
|---|---|---|
| Card height at 320 | 328px | 328px |
| Card height at 1440 | 381px | 381px |
| `Car Expense Tracker` lines at 320 | 3 | 3 |
| Card placeholder, icon aborted | 96px, no radius, transparent | 96px, 21px radius, framed |
| Computed shadow, three places | `none`, `none`, `0 1px 2px .04` | `0 1px 2px .04` in all three |

The accessible labels were checked against the deployed site and still read `Icono de cash-counter` and
`Icono de car-expense-tracker`.