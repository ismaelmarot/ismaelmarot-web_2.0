# Implementation Plan: The Contact Band's Proportions

**Branch**: `021-contact-band-proportions` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

## Summary

Five declarations change and one list gains two entries. The address becomes the largest thing in the
band by being measured against its half of the row rather than chosen in isolation, the question stops
being a display size, the button goes black, and two elements are deleted.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3
**Primary Dependencies**: styled-components 6.1. **No additions** (FR-017)
**Storage**: `src/data/site-config.ts` gains two entries. No other data change
**Testing**: Vitest (component) and the browser, because this feature is about width
**Target Platform**: Static site, GitHub Pages
**Performance Goals**: Unchanged. No new request, no new dependency, no measurement on the page
**Constraints**: `id` and accessible name kept (FR-013); no `Layout` change and no new hook (FR-017); the
address keeps no `target` (FR-015)

## Constitution Check

*GATE: passed.*

| Principle | Compliance |
|---|---|
| I. Component-First | One component, already in its own folder with the five files. No new component. |
| II. Type Safety | The two new entries use the `facebook` and `instagram` types `specs/020` added, so no type widened here. |
| III. Testing | Column widths and the address's fit cannot be asserted from jsdom, so those criteria are measured in a browser and recorded in `tasks.md` the way `specs/003` and `specs/009` record their measurements. |
| IV. A11y & Performance | The focus ring on a black surface is the one new accessibility question, and it is handled rather than inherited. axe at four viewports on `/` and `/contact`. |
| V. Design Principles | One dominant element and one subordinate one. The inversion was the design failure. |
| VI. YAGNI | **No measurement.** The 50% requirement was met with two data entries instead of a hook and a `Layout` change, because the maintainer declined the alternative twice. |
| Styling | Five declarations changed. No new stylesheet. |
| Path Aliases | Unchanged. |
| Dependencies | `package.json` untouched. |

## Project Structure

### Documentation (this feature)

```text
specs/021-contact-band-proportions/
├── plan.md
├── spec.md
├── tasks.md
└── checklists/
    └── requirements.md
```

### Source Code

```text
src/styles/tokens.css                                    # the address's ceiling
src/data/site-config.ts                                  # two entries
src/components/sections/ContactBand/
├── ContactBand.styles.ts                                # grid, black button, divider removed, name removed
├── ContactBand.tsx                                      # markup restructured into two columns
├── useContactBand.ts                                    # the name branch removed
└── ContactBand.test.tsx                                 # extended
```

## The decisions the rest followed from

### The ceiling is 40px because 44 does not fit

The request is a proportion, and a proportion is arithmetic before it is taste. The row is 1232px inside a
1280px container; with the existing 40px gap each column is **596px**; the address is its text plus a 28px
arrow plus a 12px gap. Measured text widths:

```
36px → 466 + 40 = 506    fits
40px → 526 + 40 = 566    fits, 30px to spare
44px → 579 + 40 = 619    over by 23
```

So the token's ceiling moves from 2.25rem to 2.5rem and its comment carries all of the above. The margin
at 40px is 30px, which is also the tolerance for a slightly longer address and nothing more.

### The question loses its display size

`--text-display-section` is `clamp(2.5rem, 5vw, 4.5rem)` and reaches 72px at 1440. The address is 40px.
A heading twice the size of the thing the band is about is not a hierarchy, it is an inversion, and the
cheapest correct token for a subordinate line is `--text-large-subtitle`, which the scale already carries
at 28px. **No new typographic step**, which matters: a scale with three display sizes and one of them
unused to make a heading smaller would be a worse scale than one with two.

### The markup has to move, not only the grid

`grid-template-columns: 1fr 1fr` on the existing row would put the button and the address in two equal
columns and leave the question above both, which is not what was asked for. **The question belongs in the
left column**, beside the button, and the address owns the right one.

That means the `<h2>` moves inside the row. It stays the band's only level-two heading and it stays above
the button in the left column, so the document order still reads question-then-action on the left and
address on the right, which is also how a screen reader walks it. On mobile the grid stacks and the
address comes first, which is done with `order` rather than by duplicating the markup.

### The focus ring has to change on a black button

`--shadow-focus` is drawn in the page's own colour. On a black surface that is invisible, which would
leave a black button with no visible focus indicator — a WCAG 2.4.7 failure on the one control in the band
that looks like a control. The button's focus state therefore uses a white ring rather than inheriting
the page's, and that is asserted rather than assumed.

### Two entries, not a second list

Facebook and Instagram go into `siteConfig.socialLinks` pointing at `https://www.facebook.com` and
`https://www.instagram.com`. Their types and their glyphs already exist from `specs/020`.

**The consequence is recorded rather than engineered away.** The footer and `/contact` read the same
array, so both will show the two marks. The footer will open the platforms' landing pages, and `/contact`
will gain two cards with the neutral violet surface pointing at the same two landings. That is what one
list feeding three surfaces means, and it was the arrangement `specs/020` chose deliberately over a
second list. The alternative was a filter in `/contact` that would have to be removed the day the real
profiles arrive, because those profiles are `https://` too.

## Testing, and what it does not reach

**Component** — the four marks and their `href`, the two buttons' colours read from the injected
stylesheet, the focus state differing from rest, the absence of the name and of the divider, and the
question still being the only heading.

**Browser, because this feature is about width.** Column equality, the address fitting inside its column,
the two text sizes read in a browser, and the absence of horizontal overflow at four viewports. jsdom
does not lay anything out, so a test asserting column widths there would assert nothing.

**Not measured**: the band's height, because it is not changing, and the band's appearance against a
screenshot, because this repository has no baseline to compare one to.

## What this plan does not do

**It does not make the band and the footer share a screen.** Withdrawn by the maintainer twice and
recorded in the specification's Amendment 1. The section is one screen and a fifth and that is the accepted
cost of not measuring the footer.

**It does not put a profile path on either of the two marks.** They go to the platforms' landing pages and
nowhere else, which is what the request says and which means neither link can be broken.
