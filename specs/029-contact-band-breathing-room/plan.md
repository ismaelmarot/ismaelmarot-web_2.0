# Implementation Plan: The Contact Band's Breathing Room

**Branch**: `029-contact-band-breathing-room` | **Date**: 2026-10-17 | **Spec**: [spec.md](./spec.md)

## Summary

One declaration. The air between the copy block and the networks/email row takes the next step up the
spacing scale — 48px to 64px — and nothing else in the band or the page moves.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3

**Primary Dependencies**: none added

**Storage**: none

**Testing**: the browser, because the feature is a claim about a rendered distance

**Target Platform**: Static site, GitHub Pages

**Project Type**: Single-page application (React + Vite)

**Performance Goals**: unchanged; the band keeps its `100dvh` shell

**Constraints**: the band keeps one heading, its id, its accessible name, its height and its snap
alignment (FR-003); no other token, component or page changes (FR-004)

**Scale/Scope**: one stylesheet declaration, two test files

## Constitution Check

*GATE: passed.*

| Principle | Compliance |
|---|---|
| I. Component-First | No new component. One styled value the band already owns. |
| II. Type Safety | Nothing new to type; no props, no config fields. |
| III. Testing | The E2E measures the rendered distance; the component test holds the token reference. See Testing. |
| IV. A11y & Performance | Nothing visual moves except the gap: contrast, focus, keyboard order, the `ul` of networks and the single `h2` are untouched. |
| V. Design Principles | Apple's whitespace practice, read through the scale the project already owns: the gap's new value is the token the bands' own padding uses, so inner and outer rhythm agree. |
| VI. YAGNI | No token, no breakpoint, no abstraction. One number on one declaration. |
| Styling | All changes live in `ContactBand.styles.ts`. |
| Path Aliases | Unchanged. |
| Dependencies | `package.json` untouched. |

## The decision the whole feature rests on

**The air goes up one token step, not by an invented number.** `space[16]` (64px) is already in use in
this very stylesheet — `StyledContactBand` spends it as `padding-block` — so the band's inner air and
its outer air become the same value. A number pulled from nowhere would be a sixth spacing value on the
page that nothing else recognizes; a step on the scale is a rhythm.

`specs/028`'s mechanism stands entirely: the gap is owned by `StyledContactBandInner`, the copy carries
no margin, and the E2E measures the button-to-row distance on the rendered page. Moving the gap to
`space[16]` is a retuning of the same instrument, not a second one.

## The arithmetic that was checked, and the assertion that holds it

**The band's height does not grow.** The shell is `min-height: 100dvh` with `align-content: center` on
the shell grid. At 900px tall the content measures roughly 72 + 20 + 48 + 64* + 56 + 44 ≈ 380px against
a viewport of 900 padded by 128 — the extra 16px over specs/028's step are absorbed by the leftover the
centring owns, and the existing height assertion (`la banda sigue siendo del alto de una pantalla`)
fails loudly if that ever stops being true.

At 640px tall (the 320-width viewport) the budget is tighter but holds: 380px of content against
640 − 96 of padding leaves 164px of leftover. The same assertion covers it.

**The assertion gets two thresholds rather than one literal.** Greater than 40 (specs/028's *original*
step, so even a stale 48px build fails it) and equal to 64 within 1px (roundoff). A build that renders
48px fails the equality; a build that "fixes" the distance with a margin anywhere fails the equality
too, because the distance is what is measured and no two margins sum to exactly 64. FR-002 is asserted,
not hoped for.

## Testing

**Component** — the inner's CSS contains `gap` through `tokens.space[16]` and does not contain
`var(--space-12)` on the gap; those two will run red first.

**E2E** — at 1440 the rendered button-to-row distance measures 64px (±1) and is greater than 40; at 390
and 320 the distance is the same step and no viewport overflows; the band stays one screen tall at all
five viewports the suite already covers.

## What this plan does not do

**It does not touch the row, the copy, the sentence's or the question's tokens.** `specs/027` and
`specs/028`'s assertions are re-run, not rewritten — except the one number in the E2E that this feature
changes, which is rewritten to catch it.

**It does not add a `contracts/` folder, a component file or a config field.** The feature is a value.

## Project Structure

```text
specs/029-contact-band-breathing-room/
├── spec.md
├── plan.md              # This file
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/
    └── requirements.md
```

```text
src/components/sections/ContactBand/
├── ContactBand.styles.ts
└── ContactBand.test.tsx

tests/
└── e2e/contact-band-layout.spec.ts
```

**Structure Decision**: no new directories and no new files beyond the spec artifacts. One stylesheet
declaration and the two test files that hold the claim.

## Complexity Tracking

No constitution violations. No complexity to justify.
