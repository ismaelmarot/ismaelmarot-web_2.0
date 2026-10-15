# Implementation Plan: Section-by-Section Scrolling on the Landing Page

**Branch**: `023-home-scroll-snap` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

## Summary

One hook, one rule, five declarations. A `data-scroll-snap` attribute on `<html>` while the landing page
is mounted, one `globals.css` rule behind it, and `scroll-snap-align: start` on the five bands.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3
**Primary Dependencies**: none added (FR-013)
**Storage**: none
**Testing**: Vitest for the attribute's lifecycle; the browser for the snap behaviour, because
`proximity` exposes no state and the only thing to assert is where the page came to rest
**Target Platform**: Static site, GitHub Pages
**Performance Goals**: unchanged. An attribute write on mount and its removal on unmount
**Constraints**: No band changes size (FR-006); `scroll-padding-top` is not duplicated (FR-010); existing
horizontal snapping is untouched (FR-011)

## Constitution Check

*GATE: passed.*

| Principle | Compliance |
|---|---|
| I. Component-First | No new component. The bands exist; they gain one declaration. |
| II. Type Safety | The hook returns `void` and takes `boolean`. Nothing to type loosely. |
| III. Testing | Computed styles for the type, real scrolling for the rest. The attribute's removal is asserted because a leaked attribute is the failure mode. |
| IV. A11y & Performance | **The substance is a11y**: reduced motion is honoured, and `proximity` rather than `mandatory` is what keeps find-on-page and the short footer usable. |
| V. Design Principles | A rhythm marker on a long scroll. No new visual element. |
| VI. YAGNI | No wrapper component, no context, no store. An attribute is the whole mechanism. |
| Styling | One rule in the existing `globals.css`, beside the `scroll-behavior` it is related to. |
| Path Aliases | `@/hooks/useScrollSnap`. |
| Dependencies | `package.json` untouched. |

## Why the type goes on `<html>` and the alignment goes on the bands

**These are two different properties of two different things, and the asymmetry is the whole design.**

`scroll-snap-type` belongs to the **scroll container**. On this site that is `<html>`, because nothing
else scrolls the page vertically. So that declaration is the only one that needs scoping.

`scroll-snap-align` belongs to the **snap targets**, which are the bands. And here the scoping problem
disappears on its own: `Hero`, `SectionSummary` and `ContactBand` are rendered on the landing page and
nowhere else, so their alignment declarations are inert on every other route without a single condition.

**Which is the reason this is small.** The tempting alternative — a class on the landing page's root, a
descendant selector, and every band reached through it — would need a hook, a class, and five selectors
to achieve what an attribute and five static declarations achieve.

## Why `proximity` and not `mandatory`

Stated once here rather than three times.

`mandatory` would satisfy the request more literally and would break three things the landing page
actually has:

1. **The footer is 182px.** It is not a snap point, so a visitor who scrolls into it is pulled back to
   the last band. With `proximity` the document ends where it ends.
2. **Find-on-page and hash links stop working reliably.** A mandatory container re-snaps after the
   browser's own jump, which fights the visitor's intent.
3. **A flick cannot cross a band.** That removes the ability to reach the bottom of a long page quickly,
   which is a real need on a 5000px document.

The maintainer chose `proximity` with those three in front of them. **The cost of that choice is that the
feature cannot be asserted from CSS**: there is no state to read, so the browser test has to scroll,
release, and measure where the page stopped.

## The one thing this feature gets wrong on purpose

**Reduced motion disables the snap.** Nobody asked for this. It is one declaration and it is recorded as
Amendment 1 rather than done quietly, because the landing page will look different to those visitors and
that has to be a visible decision.

## Testing, and the part that needed thought

**Computed styles** — the type on `<html>` on `/` and on six other routes, the five bands' alignment, the
footer's lack of it. These are the cheap assertions and they catch scoping mistakes, which is the most
likely way for this to do damage.

**The attribute's lifecycle** — mount sets it, navigating away removes it. A leaked `data-scroll-snap` on
`<html>` would silently snap every route from then on, and no computed-style assertion on the landing page
would notice. So it is asserted directly.

**The behaviour itself** — scroll to a point just short of a band, stop, and measure where the page
rested. Then do the same with a fast flick and confirm it did *not* snap, which is the property that
distinguishes `proximity` from `mandatory` and the one worth a test of its own.

**Not measured**: whether it feels right. Nothing here asserts that a visitor enjoys the rhythm, only that
the page settles where the specification says and that it does not trap them.

## What this plan does not do

**It does not add `scroll-margin-top` to the bands.** `scroll-padding-top: 64px` is already on `<html>`
from `specs/003`, and `scroll-padding` plus `scroll-margin` on the same snap point applies the 64px twice,
putting each band 128px down the screen (FR-010).

**It does not manage the landing page's scroll position** on mount or on back-navigation. A deep link to
`#contact-summary` therefore has the snap container appear after the browser's jump — Amendment 2. Solving
it means owning scroll restoration, which is a different feature.

**It does not touch the horizontal scrollers** inside the bands. They have their own container and their
own axis.