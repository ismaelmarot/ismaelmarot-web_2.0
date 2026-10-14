# Implementation Plan: Project Icon Strip on the Landing Page

**Branch**: `011-project-icon-strip` | **Date**: 2026-10-06 | **Spec**: [spec.md](./spec.md)

> **Retrospective, and this document did not exist while the work was done.** The feature landed in
> `8850e9f` on 2026-10-07, was rebuilt in `42c1452` the next day, and then had two of its behaviours
> superseded by `specs/013-project-icon-rotation`. It shipped without a plan, so this document records
> the work as it was done rather than as it would have been planned, which is the honest form for a
> document written afterwards. `tasks.md` names `spec.md` as its only prerequisite; that is what
> happened, and this file is here so that the next reader is not left to infer that the plan was never
> needed.

## Summary

Six project app icons in 96px frames on the landing page's Projects section, arriving with a staggered
fade when the section reaches the viewport, scrolling horizontally on a phone, and sharing nothing with
the carousel on `/projects` but the frame it sits in.

The work that decided the shape of this feature was three measurements taken before anything was
written, and three techniques found already present in the project.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3
**Primary Dependencies**: styled-components 6.1. No additions
**Storage**: `src/data/projects.json`, read at build time by `npm run fetch:github` and imported directly
**Testing**: Vitest (unit + component) and Playwright (E2E). 36 component tests and 17 browser tests
**Target Platform**: Static site, GitHub Pages, evergreen browsers
**Performance Goals**: Six additional image requests on the landing page, accepted; CLS below 0.1
**Constraints**: `IntersectionObserver`-driven entrance (FR-006); no change to `SectionSummary` (FR-012);
no effect on `/projects` (FR-013)

## Constitution Check

*GATE: passed, and re-checked against the constitution as it stands at v2.2.1.*

| Principle | Compliance |
|---|---|
| I. Component-First | One component, `ProjectIconStrip`, in its own folder with a barrel export. No feature logic outside it. |
| II. Type Safety | Props are `ProjectIconStripProps` with an overridable `projects` so the component can be driven from a fixture. `projects.json` is cast once, at the default parameter, rather than at every use. |
| III. Testing | 36 component tests and 17 browser tests. No E2E was deleted to make room for `specs/013`; Amendment 5 of the spec says so and it was checked. |
| IV. A11y & Performance | `role="list"` with `role="listitem"` frames rather than an `aria-label` on a plain div, which this project got wrong once already on the heatmap. Reduced motion opt-in is explicit rather than inherited. |
| V. Design Principles | The frame copies the carousel's decision rather than inventing one, so the same asset reads the same in two places. |
| VI. YAGNI | No carousel behaviour, no index, no dots, no keyboard navigation, no pointer-drag shim. Six frames and one entrance animation. |
| Styling | All five declarations in `ProjectIconStrip.styles.ts`, styled-components, no CSS file. |
| Path Aliases | `@/data/projects.json`, `@/hooks/useIntersectionObserver`, `@/hooks/useReducedMotion`, `@/types/project`. No relative import leaves the folder. |
| Dependencies | `package.json` untouched. |

## Project Structure

### Documentation (this feature)

```text
specs/011-project-icon-strip/
├── plan.md       # This file, written 2026-10-14, after the fact
├── spec.md       # Written 2026-10-06, before the work
└── tasks.md      # Thirty-five tasks, all completed, with their verification table
```

This feature has no `research.md`, no `data-model.md`, no `contracts/` and no `quickstart.md`, which is
correct rather than an omission. It introduced no entity, changed no schema, defined no contract between
systems and needed no validation guide: it reads an array that already exists and renders it. `specs/001`,
which did introduce the data model, carries those four artifacts.

### Source Code

```text
src/components/sections/ProjectIconStrip/
├── ProjectIconStrip.tsx      # JSX and the two local useState calls that are genuinely local
├── ProjectIconStrip.styles.ts
├── ProjectIconStrip.test.tsx # 36 component tests
├── index.ts                  # barrel: component, prop type, and the rotation constants
├── useIconRotation.ts        # added by specs/013, not by this feature
└── iconRotation.ts           # added by specs/013, not by this feature
```

**Structure Decision**: the constitution's five-file pattern, with the caveat that the two rotation files
are a later feature's contribution living in this folder. They are exported through this folder's barrel
rather than their own, which is the one place where the folder no longer describes a single feature's
implementation. It is recorded here rather than corrected, because moving them would split
`sigs/013-project-icon-rotation`'s code away from the one component it modifies and the split would cost
more than it buys.

## The three measurements that decided the design

**Every source PNG has transparent corners.** That single fact is why the frame exists at all. An icon
dropped straight onto the page background shows its own alpha edge, and a rounded app-icon tile with
transparent corners reads as a badly cut square. The `#E8E8ED` background is not decoration; it is what
makes the artwork legible as an app icon.

**The sources are not square.** One is 379x366 against 192x192 for the smallest, and one is 1024px wide.
`object-fit: contain` would letterbox each one to a different apparent size, so `QEntry` would read
smaller than its neighbours purely because of its aspect ratio. `cover` crops about 4% of the one
non-square source and every icon reads at the same weight. This is the same trade the carousel already
makes at the same size, which is why the two look like the same set of assets.

**Six 96px frames are 656px and a phone is 390px.** This number produced the horizontal scroller this
feature originally shipped, and it later produced the reversal. `specs/013` Amendment 5 withdrew the
scroller and SC-007 with it, because a horizontal scroller inside a vertical page competes with the
page's own scroll. The number was right and the conclusion drawn from it was not, which is recorded here
because it is the more useful half of the fact.

## The three techniques that already existed

The component needed a mask to fade a cut frame rather than slice it, and a way to hide a horizontal
scrollbar. Both were in the project already, written for other components: the mask belongs to the
technology marquee, and the hidden scrollbar to the category filter. Reusing them is what made the
scroller a two-line change rather than a component.

`useIntersectionObserver` and `useReducedMotion` also already existed. `useReducedMotion` is a hook that
**throws outside a provider**, which is the correct design and a real constraint: this feature's tests
have to render inside `ReducedMotionProvider` or every one of them fails on the hook rather than on the
component.

## The three measurements taken at verification

| | Measured |
|---|---|
| Six frames | 96x96 with a computed radius of 21px, which is 22% of the width, identical at all four viewports |
| The stagger | 0, 60, 120, 180, 240, 300ms, read out of the browser rather than read off the stylesheet |
| Reduced motion | `animation: none`, `transform: none`, transition 0s, icons visible |
| The phone row | 704px of content against 342px of viewport at 390, masked, no scrollbar, all six reachable |

## What this plan does not claim

**The entrance does not replay, and proving it took three attempts.** The first version of that test read
`animationName` and appeared to show the animation re-running on a return scroll. `getAnimations()` showed
the animation was `finished`: the rule is still attached and the name was never evidence of a re-run.

**A test that could not fail looked exactly like a passing one.** Removing the stagger changed nothing
observable, because `tsc` rejected the now-unused `$index`, so `npm run build` aborted and the preview
server served the previous `dist` on every run. The check reported a pass. It is recorded in `tasks.md`
as T031, and it is the reason this document ends with a note rather than a clean table.

**No Lighthouse run exists for this feature**, as it does for `specs/004`'s SC-004. Layout shift was
measured through the browser tests instead.