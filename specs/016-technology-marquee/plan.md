# Implementation Plan: The Technology Marquee on the Landing Page

**Branch**: `016-technology-marquee` | **Date**: 2026-10-14 | **Spec**: [spec.md](./spec.md)

> **Retrospective.** This feature shipped on 2026-10-03 in three commits — `4e3ae15`, `4968883` and
> `432d83f` — and this plan was written eleven days later. It records the work as it was done rather than
> as it would have been planned, following the pattern of `specs/015`. Where it records a measurement,
> the measurement is the one that decided the implementation.

## Summary

A still grid of technology chips becomes two rows travelling in opposite directions, closed into an
endless loop by rendering the list twice, with one control that stops both of them and an edge mask so
nothing is sliced at the boundary.

The feature is 111 lines of component, 139 of styles and 30 of hook. The part that took thought was not
the animation; it was making the loop close without measuring anything, and naming the control so that
pausing it does not also change what a screen reader announces.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3
**Primary Dependencies**: styled-components 6.1, `simple-icons` for the brand marks. No additions
**Storage**: `src/data/technologies.ts`, a hand-curated array with `category`, `iconSlug` and `getPopulatedCategories`
**Testing**: Vitest component tests. Twelve of them. **No E2E was written for this feature** — see below
**Target Platform**: Static site, GitHub Pages, evergreen browsers
**Performance Goals**: CLS below 0.1; an 80-second animation on a section that already had one
**Constraints**: No change to `SectionSummary`'s API (FR-007); no new keyframes, no new duration literal
(FR-005); the duplicate copy must be hidden from assistive technology (FR-002)

## Constitution Check

*GATE: passed.*

| Principle | Compliance |
|---|---|
| I. Component-First | One component, `TechnologyMarquee`, in its own folder with a barrel export, and one hook. The presentational split between `TechnologyCard` and the pill was decided by this feature rather than inherited. |
| II. Type Safety | `TechnologyMarqueeProps` typed, and `CategoryGroupProps` declared locally with the `hidden` and `idPrefix` it needs. |
| III. Testing | Twelve component tests covering the behaviour in every FR that a DOM assertion can reach. No E2E, and the spec says so. |
| IV. A11y & Performance | WCAG 2.2.2 at level A, failure F16, cited by number in the hook's own JSDoc. The duplicate copy is `aria-hidden`. The control is named for its action. |
| V. Design Principles | Ambient, slow, and quietened the same day it shipped. Apple's motion is subordinate to content. |
| VI. YAGNI | No drag, no hover-to-pause, no configurable speed, no per-row control, no keyboard handling inside the rows. |
| Styling | All of it in `TechnologyMarquee.styles.ts` with styled-components. The one keyframe it uses is global and shared. |
| Path Aliases | `@/components/ui/Icon`, `@/data/technologies`, `@/types/project`. Nothing relative leaves the folder. |
| Dependencies | `package.json` untouched. |

## Project Structure

### Documentation (this feature)

```text
specs/016-technology-marquee/
├── plan.md    # This file, written 2026-10-14, after the fact
├── spec.md    # Written 2026-10-14, after the fact
└── tasks.md   # A record of the work, not a plan for it
```

No `research.md`, no `data-model.md`, no `contracts/`, no `quickstart.md`, no `checklists/`. Correct
rather than omitted: the feature introduces no entity, changes no schema, defines no contract between
systems and needs no validation guide. It reads an array that already existed and renders it.

### Source Code

```text
src/components/sections/TechnologyMarquee/
├── TechnologyMarquee.tsx       # 111 lines. JSX, plus a local CategoryGroup
├── TechnologyMarquee.styles.ts # 139 lines
├── TechnologyMarquee.test.tsx  # Twelve component tests
├── useMarqueePause.ts          # 30 lines. One boolean and one callback
└── index.ts                    # barrel

src/components/sections/TechnologyCard/
├── TechnologyCard.tsx
├── TechnologyCard.styles.ts
├── TechnologyCard.test.tsx
└── TechnologyPill.tsx          # created by this feature, 122 lines
```

**Structure Decision**: the constitution's pattern, with one exception recorded rather than corrected.
`TechnologyPill.tsx` lives inside `TechnologyCard/`'s folder and is re-exported from that folder's
barrel, rather than having its own. It was extracted from `TechnologyCard.tsx` by this feature because the
card and the pill have different jobs — one is a card with a name and a description, the other is a chip
with no text of its own — and it has 122 lines and its own concerns. It should have its own folder. It is
recorded here as a known deviation rather than fixed as part of writing a document, because moving it is
a change to `specs/001`'s and `specs/004`'s code and belongs to a feature that intends to change it.

## The decision that made the loop free

**The track translates by `-50%`, and it holds exactly two copies of the list.**

That single number is the whole trick. Two copies means half the track is one copy's worth, so moving by
half the track always lands on the boundary between copy one and copy two — which is the boundary where
copy one begins again. The loop closes because the animation's end state is visually identical to its
start state, not because anything was measured.

**The alternative was to measure.** The obvious way to build an endless marquee is to animate
`translateX(-100%)` on a wrapper sized to one copy, and that needs the copy's width, which means a
`ResizeObserver`, which means the loop is wrong for one frame after any content change and needs a
re-measure. Because the copy is rendered twice instead of measured, **no measurement is needed at all**,
and one copy is already wider than the section allows at every viewport, so the visible window can never
run out of content.

**Both rows carry identical content**, which is what makes them travel at the same speed. Same track
width, same duration, same keyframes; the lower row reverses them. Two different lists would have shown
as two different speeds and read as an accident.

## Why one control and why it is named for the action

**One control, not two.** W3C's guidance for a page with several moving elements is a single control that
stops all of them. Two controls would double the tab stops for one decision.

**Named for the action, not the state.** The control reads "Pausar el carrusel de tecnologías" while the
rows move and "Reanudar…" once they are stopped. It does not use `aria-pressed`. The reason is in the
component's own comment and it is worth repeating here: a toggle button whose label changes with its
state reads two contradictory things at once, and `aria-pressed` on a control whose glyph is the only
visible content leaves the state as the only announcement. `specs/009` reached the same decision
independently, for the same control, six days earlier.

**The glyph is `aria-hidden`.** The icon carries no text, so the label is the whole accessible name.
Without the `aria-hidden` a screen reader would announce the name and then the glyph's own name.

## Pausing must not change what is announced

The requirement that took the most care: pressing the control changes a styled component's `$paused`
prop and nothing else. It does not add, remove, hide or reveal a single node.

That is not an accident of the current implementation, it is FR-012, and the test that holds it is
"stops both rows when the control is used" combined with "hides the duplicate half from assistive
technology". A pause implemented by unmounting the rows would stop them perfectly and would remove the
technologies from the page at the same time, which is a worse outcome than the motion it solved.

## Reduced motion removes the control rather than disabling it

`@media (prefers-reduced-motion: reduce)` sets `animation: none` on the row **and** the control is not
rendered. A rendered button that pauses nothing is a control that lies about what it does, and a
focusable, screen-reader-announced control on a row that cannot move is worse than no control.

## Testing, and what it does not reach

**Twelve component tests** cover everything a DOM assertion can reach: two rows, the doubled content,
the `aria-hidden` half, the shared keyframe and duration on both, the two directions, the control's name,
the hidden glyph, the glyph swap, the stop, the resume, and the empty case.

**No browser test was written, and nothing names this feature.** The loop closing — the one property that
is the entire point of the feature — is not asserted anywhere. Reading `-50%` in a stylesheet is not the
same as watching a chip cross the boundary for eighty seconds, and no test in this repository does the
latter. Layout shift and axe are measured by the pipeline on every commit, but neither was run as part
of this feature's work.

**The mask was inherited, not invented.** `4e3ae15` reused the edge-fading mask already in the project
for the icon strip's scrolling row, which is the technique `specs/011`'s T014 records having found and
reused in the other direction.