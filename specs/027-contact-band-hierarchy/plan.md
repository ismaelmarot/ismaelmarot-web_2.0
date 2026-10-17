# Implementation Plan: The Contact Band's Hierarchy

**Branch**: `027-contact-band-hierarchy` | **Date**: 2026-10-16 | **Spec**: [spec.md](./spec.md)

## Summary

One token change, one layout change, one config split. The question moves up to the section-title scale,
the row drops to the bottom of a natural-order stack, and the address's visible text and its destination
become two independent configuration values.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3

**Primary Dependencies**: none added (FR-014)

**Storage**: none

**Testing**: the browser, because the whole feature is a claim about sizes and widths

**Target Platform**: Static site, GitHub Pages

**Project Type**: Single-page application (React + Vite)

**Performance Goals**: unchanged; the band keeps its `100dvh` shell

**Constraints**: the band keeps one heading, its id, its accessible name, its height and its snap alignment
(FR-010, FR-011); no other typographic token changes (FR-015)

**Scale/Scope**: one component, its styles, its hook, its config and two test files

## Constitution Check

*GATE: passed.*

| Principle | Compliance |
|---|---|
| I. Component-First | No new component. `ContactBand` already owns every piece it renders. |
| II. Type Safety | `contactDisplayEmail: string` on `SiteConfig`, like `email` and `contactTagline`; `displayEmail?: string` on `ContactBandProps`. |
| III. Testing | The component test holds the mechanism (token references, alignment declarations); the E2E holds the outcome (rendered sizes, order, overflow). See Testing. |
| IV. A11y & Performance | The heading stays first in the DOM and remains the band's only `h2`; the networks stay a `ul`; focus states are unchanged. |
| V. Design Principles | The band opens with a section-scale question, the way the other bands open with their titles. |
| VI. YAGNI | No new breakpoint on the token; the row's existing `767px` breakpoint is reused. |
| Styling | All changes live in `ContactBand.styles.ts`. |
| Path Aliases | Unchanged. |
| Dependencies | `package.json` untouched. |

## The decision the whole feature rests on

**The request inverts the band's hierarchy, and the inversion is what makes the layout simpler.**

`specs/025` put the email at the top and raised it with `order: -1` so the question could stay first in the
DOM while the drawing put the networks and the address above it. The request now puts the question at the
top-left and the row at the bottom, so **the drawing and the DOM order finally agree** and the `order` hack
is deleted rather than repurposed. One copy of the markup, and the desktop and mobile arrangements cannot
drift apart.

**The question is the display.** It reads `--text-display-section`, the token the "Sobre mí" heading
already uses, so the two are the same size by construction rather than by a coincidental constant. The
email keeps `--text-display-email`, whose ceiling is `--text-display-project`, so it can never outgrow the
question. The sentence reads `--text-body`, the body text the other sections use.

| Element | Token | 1440 | 768 | 390 | 320 |
|---|---|---|---|---|---|
| Question | `--text-display-section` | 72px | 40px | 40px | 40px |
| Email | `--text-display-email` (ceiling `--text-display-project`) | 56px | 32px | 23px | 19px |
| Sentence | `--text-body` | 16px | 16px | 16px | 16px |

The question's `clamp` has a 40px floor, so on a phone it wraps rather than overflows — the same behaviour
the section titles already have.

## The address split

**The visible text and the destination are now two values.** `siteConfig.email` is the mailto target and
stays `ismaelmarot@hotmail.com`; a new `contactDisplayEmail` is the visible text and reads
`ismaelmarot@contacto.com`. The band is the only consumer of `siteConfig.email` — the footer and the
`/contact` page read the `email` entry of `socialLinks` — so the split is scoped to the band and nothing
else moves.

**The new address is one character longer.** `ismaelmarot@contacto.com` is twenty-four characters against
twenty-three. At 56px it measures roughly 741px against the ~970px column the row leaves it at 1440, and
roughly 423px against the ~476px column at 768, so the arithmetic that `specs/025` recorded still holds
with one character of slack to spare. The E2E asserts no wrap and no overflow at all five viewports rather
than trusting the estimate.

## The layout

Desktop, natural order, no `order`:

```
StyledContactBandInner            (flex column, gap 40px)
├── StyledContactBandCopy         (flex column, align-start, gap 12px)
│   ├── StyledContactBandTitle    (h2, --text-display-section)
│   ├── StyledContactBandDescription (p, --text-body)
│   └── StyledContactBandCta      (a, align-self: flex-start)
└── StyledContactBandRow          (grid auto 1fr, align-center)
    ├── StyledContactNetworks     (ul, left)
    └── StyledContactEmail        (a, justify-self: end)
```

**The email is flush right** with `justify-self: end` on the grid item, which is what "bien a la derecha"
asks for. On a phone the row collapses to one column and the email returns to `justify-self: start`,
because a right-aligned address at the end of a stacked column reads as a mistake.

**The call to action is left-aligned** beneath the sentence, inside the copy. The drawing shows it there,
and a left column of question, sentence and button is more cohesive than a button pinned to the far edge
of the band. It is one declaration to change.

## Mobile

The band stacks in reading order: question, sentence, call to action, networks, email. The email's scale
does not leave room for the networks and the address on one line at 390px — four 44px marks and three gaps
are about 230px, and the address at 23px is about 299px, together 529px against 358px of column — so they
stack. The question wraps at its 40px floor.

## Testing

**Component** — the question reads `--text-display-section` and is the band's only `h2`; the sentence reads
`--text-body`; the email's visible text is the display address and its `href` is the mailto target; the
email is `justify-self: end`; the call to action is `align-self: flex-start`; the row is `auto 1fr` and
collapses below 767px.

**E2E** — the rendered question equals the rendered "Sobre mí" section title at 1440; the email is smaller
than the question at every viewport; the vertical order is question, sentence, call to action, row; the
networks are left of the email and the email is flush right; the address never wraps and never overflows
at 1440, 1024, 768, 390 and 320.

**The E2E is the feature's real check on the outcome.** Everything about this is sizes and widths, and a
stylesheet assertion would pass on a value that overflows.

## What this plan does not do

**It does not let the address wrap.** Every number above exists so that it does not have to.

**It does not detect a longer address.** The ceiling is arithmetic for twenty-four specific characters.
Changing the address silently invalidates it and nothing will report that.

**It does not touch the four other display tokens**, two of which other sections read.

**It does not change the band's height**, and the existing assertion that it is `100dvh` is untouched and
must keep passing.

**It does not add a `contracts/` folder.** The constitution removed `src/contracts/` as a second copy of
interfaces that already exist, and the component's props are declared in its own file. The contract is the
`ContactBandProps` interface and the `SiteConfig` field, both in the source.

## Project Structure

```text
specs/027-contact-band-hierarchy/
├── spec.md
├── plan.md              # This file
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/
    └── requirements.md
```

```text
src/
├── data/site-config.ts
├── types/site.ts
└── components/sections/ContactBand/
    ├── ContactBand.tsx
    ├── ContactBand.styles.ts
    ├── useContactBand.ts
    └── ContactBand.test.tsx

tests/
└── e2e/contact-band-layout.spec.ts
```

**Structure Decision**: no new directories and no new files beyond the spec artifacts. The change is
contained in the component's existing folder and its two test files.

## Complexity Tracking

No constitution violations. No complexity to justify.
