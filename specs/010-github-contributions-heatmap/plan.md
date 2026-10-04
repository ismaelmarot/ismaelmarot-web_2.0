# Implementation Plan: GitHub Contributions Heatmap

**Branch**: `010-github-contributions-heatmap` | **Date**: 2026-10-04 | **Spec**: [/specs/010-github-contributions-heatmap/spec.md](../spec.md)

**Input**: Feature specification from `/specs/010-github-contributions-heatmap/spec.md`

## Summary

The heatmap's data was always correct and already contained today. The strip simply started at its
left edge, which is the oldest week of the year, so on any viewport narrower than the full year today's
cell was off-screen: 416px away at 390px, 486px at 320px. GitHub's own graph does the opposite and
opens at the recent end. The fix is a mount-time scroll to the maximum, plus an outline on today's
cell, because a cell's colour encodes how much was done and never which day it is.

This specification also documents the feature itself, which shipped with no specification claiming it.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3

**Primary Dependencies**: styled-components 6.1. No new dependencies.

**Storage**: `src/data/contributions.json`, a build-time artefact fetched through the GitHub GraphQL API

**Testing**: Vitest (unit), Testing Library (component), Playwright (E2E), axe-core (a11y)

**Target Platform**: Web (static site on GitHub Pages)

**Project Type**: Web application (SPA)

**Performance Goals**: Lighthouse 90+, LCP < 2.5s, CLS < 0.1. The change adds no layout-affecting state and no images.

**Constraints**: WCAG 2.1 AA, no new dependencies, existing tokens, styled-components only, `@/` path alias

**Scale/Scope**: 365 cells, one visitor, one profile

## Investigation Findings

### The data was never the problem

Verified against the live site rather than the repository file, because the repository copy is fetched
locally while production is fetched during the deploy:

- The production bundle contains `2026-10-04` with `count: 2` and `totalContributions: 1704`.
- The repository file is stale by design: `fetchedAt: 2026-10-03T20:20:21Z`, last day `2026-10-03`.
  The deploy workflow re-fetches, so this is expected and not a defect.
- Querying the GraphQL API with and without an explicit `from`/`to` both returned the current day. The
  range in the query was therefore not the cause and did not need changing. Worth recording because
  adding a range would have been the obvious wrong fix.

### The component had no scroll logic at all

`Contributions.tsx` contained no `useEffect`, no `useRef`, no `scrollLeft` and no `scrollTo`. The
scroller carries `overflow-x: auto`, so it was simply left wherever the browser put it: zero.

| Viewport | Scroll required | Today visible |
|----------|-----------------|---------------|
| 1440 | 0px | yes |
| 1024 | 0px | yes |
| 768 | 94px | no |
| 390 | 416px | no |
| 320 | 486px | no |

This is why the defect was reported as intermittent: it is invisible on a desktop and unavoidable on a
phone.

### No single-colour outline can work on this palette

The five levels are a purple ramp from `#E6E3F5` to `#241663`. Measured against the 3:1 that a
meaningful graphic needs:

| Candidate | level 0 | level 1 | level 2 | level 3 | level 4 |
|-----------|---------|---------|---------|---------|---------|
| `#0071E3` accent | 3.7 | 1.4 | 1.3 | 2.1 | 3.3 |
| `#1D1D1F` ink | 13.4 | 4.9 | 2.7 | 1.7 | 1.1 |
| `#FFFFFF` | 1.3 | 3.4 | 6.1 | 9.9 | 15.3 |

Every candidate fails on at least one level, and the ink and the accent fail on opposite ends. The
outline therefore needs two layers, one of which always contrasts.

### Today's cell sits at the edge, so the outline must be inset

Today is the last day, which puts it in the rightmost column. The scroller clips its overflow and
provides only 2px of horizontal breathing room, so an outward outline would lose a pixel to clipping.
An inset outline cannot be clipped by an ancestor's overflow at all.

### An instant jump is not motion

`scrollTo({ behavior: 'smooth' })` would need a `prefers-reduced-motion` guard. Assigning `scrollLeft`
directly is not an animation, so it is correct under reduced motion without a branch. This is recorded
so a later reader does not "improve" it into a smooth scroll and break the guarantee.

### `useLayoutEffect` rather than `useEffect`, to avoid a visible jump

With `useEffect` the browser paints the strip at its left edge first and then jumps to the right end.
The visitor would see the wrong year flash before the right one. `useLayoutEffect` runs before the
first paint. This is safe here because the site is a static SPA with no server rendering, which is the
only situation in which React warns about it.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | No new component; the effect and the today flag live inside the existing `Contributions` component, whose single responsibility already includes presenting the calendar |
| II. Type Safety | PASS | No data change; a `$isToday` boolean prop on the styled cell |
| III. Testing Strategy | PASS | Five new component tests covering the scroll, the outline, the stale-data case and the reduced-motion guarantee |
| IV. Accessibility & Performance | PASS | Today's description states that it is today, so the mark is not visual-only; no layout shift because no size changes |
| V. Design Principles | PASS | The reference is GitHub's own calendar, which opens at the recent end; no decorative addition |
| VI. Simplicity & Maintainability | PASS | Three lines of effect and one prop. No library, no month labels, no second render pass |
| Styling (styled-components) | PASS | Outline declared in `Contributions.styles.ts` |
| Path Aliases (`@/`) | PASS | No new imports beyond React hooks |
| Dependencies | PASS | No new packages |

**Result**: All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/010-github-contributions-heatmap/
├── spec.md      # Feature specification, including the undocumented feature itself
├── plan.md      # This file
└── tasks.md     # Task list
```

### Source Code (repository root)

```text
src/components/sections/Contributions/
├── Contributions.tsx        # + scroller ref, layout effect, $isToday, "hoy" in the label
├── Contributions.styles.ts  # + two-tone inset outline on today's cell
└── Contributions.test.tsx   # + 5 tests
```

## Complexity Tracking

| Item | Decision | Alternative rejected |
|------|----------|---------------------|
| Scroll trigger | `useLayoutEffect` on mount | `useEffect`, which paints the wrong year first; and re-running on resize, which fights the visitor |
| Scroll mechanism | Direct `scrollLeft` assignment | `scrollTo({behavior:'smooth'})`, which is motion and needs a reduced-motion branch |
| Outline colour | Two tones, light over dark | Any single colour, which fails 3:1 on at least one of the five levels |
| Outline direction | `inset` | Outset, which the scroll container clips on the rightmost cell |
| Today detection | Compare against the current UTC date | Assume the last cell is today, which mislabels a stale build |
| Focus today handling | Add "hoy" to the accessible description | Rely on the outline alone, which is visual-only |