# Implementation Plan: The Contact Band's Copy and Spacing

**Branch**: `028-contact-band-copy-and-spacing` | **Date**: 2026-10-17 | **Spec**: [spec.md](./spec.md)

## Summary

One config value, one token reference, one step on the spacing scale. The sentence gains its accent and
the other sections' description scale, and the copy block gains 8px of air above the networks/email row.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3

**Primary Dependencies**: none added

**Storage**: none

**Testing**: the browser, because one of the three changes is a claim about rendered size and another
about rendered distance

**Target Platform**: Static site, GitHub Pages

**Project Type**: Single-page application (React + Vite)

**Performance Goals**: unchanged; the band keeps its `100dvh` shell

**Constraints**: the band keeps one heading, its id, its accessible name, its height and its snap
alignment (FR-006); no other token, component or page changes (FR-007)

**Scale/Scope**: one config value, one stylesheet, two test files

## Constitution Check

*GATE: passed.*

| Principle | Compliance |
|---|---|
| I. Component-First | No new component. The change touches values the band already owns. |
| II. Type Safety | `contactTagline` is already `string` on `SiteConfig`; nothing new to type. |
| III. Testing | The component test holds the token references; the E2E holds the rendered outcome. See Testing. |
| IV. A11y & Performance | The heading, the paragraph, contrast and focus states are untouched; contrast at 20px `textSecondary` is unchanged by size. |
| V. Design Principles | The spacing step keeps the scale's rhythm rather than inventing a value. |
| VI. YAGNI | Three declarations and one string. No new breakpoint, no new token. |
| Styling | All changes live in `ContactBand.styles.ts`, except the config value. |
| Path Aliases | Unchanged. |
| Dependencies | `package.json` untouched. |

## The decision the whole feature rests on

**The sentence moves to the description token, not the other sections to it.** The request names the
"Me interesa…" description. That description reads `tokens.fontSizes.lg`, whose alias resolves to
`var(--text-large-subtitle)`. The band's sentence reads `var(--text-large-subtitle)` directly, so the two
are the same size by construction, exactly as the question already shares `--text-display-section` with
the section titles.

The consequence is a deliberate overlap with `specs/027`'s first answer: `--text-large-subtitle` was
rejected as the *question's* token because its 20px floor beat the address's 18px floor. Here it is the
*sentence's* token, where its floor is asked for — the sentence is the smallest of the three texts at
216px of column, and it remains so, because the question's floor is 40px and the address's is 18px.

| Element | Token | 1440 | 768 | 390 | 320 |
|---|---|---|---|---|---|
| Question | `--text-display-section` | 72px | 40px | 40px | 40px |
| Email | `--text-display-email` | 56px | 32px | 23px | 18px |
| Sentence | `--text-large-subtitle` | 20px | 20px | 20px | 20px |

The sentence's 20px floor does not threaten the email's 18px floor on a phone: the two are 44px squares
and a line of text that wrap into three lines. `max-width: 60ch` stays.

## The accent

`contactTagline` is already copy in configuration, which `specs/025` argued for and the component repeats
without a comment of its own. One value changes:

```ts
contactTagline: 'Hablemos y pongámonos manos a la obra',
```

The component test reads it through `siteConfig.contactTagline`, so it follows the config unedited.

## The rhythm

`StyledContactBandInner`'s gap is the only vertical space between the copy block and the row — the copy
carries no margin, which is what the stylesheet already records. Moving that gap from `space[10]` (40px)
to `space[12]` (48px) is one declaration, and the composition nothing else:

```
StyledContactBandInner            (flex column, gap 48px)
├── StyledContactBandCopy         (flex column, align-start, gap 12px)
│   ├── StyledContactBandTitle    (h2, --text-display-section)
│   ├── StyledContactBandDescription (p, --text-large-subtitle)
│   └── StyledContactBandCta      (a, align-self: flex-start)
└── StyledContactBandRow          (grid auto 1fr, align-center)
    ├── StyledContactNetworks     (ul, left)
    └── StyledContactEmail        (a, justify-self: end)
```

The band is `100dvh` with `align-content: center` on the shell, so the extra 8px are absorbed by the
content's centring and the height does not grow. The E2E's existing height assertion holds.

## Testing

**Component** — the tagline text comes from `siteConfig` and reads with the accent; the description's
CSS contains `font-size: var(--text-large-subtitle)`; the inner's CSS contains `gap: 2.5rem` resolved
through `tokens.space[12]`; the description's CSS does not contain `--text-body`.

**E2E** — at 1440 the rendered sentence equals the rendered "Me interesa…" description in size; the
question stays the largest text in the band; the distance between the button's bottom and the row's top
measures the `space[12]` step and is greater than the previous band's; no viewport overflows and the
band stays one screen tall.

The E2E measures the *distance between elements*, not the gap declaration, so a margin smuggled in
elsewhere to fake a wider look fails it — which is what FR-005 asks for.

## What this plan does not do

**It does not touch `--text-body` or `--text-large-subtitle`** — the first is what the other bands'
smaller text and the button both read; the second is what this change adopts and must not be retuned.

**It does not touch the email, the networks, the row and the shell.** `specs/027`'s acceptance scenarios
on the row, the right edge and the heading are re-run, not rewritten.

**It does not add a `contracts/` folder.** The change is a config value and two style declarations.

## Project Structure

```text
specs/028-contact-band-copy-and-spacing/
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
└── components/sections/ContactBand/
    ├── ContactBand.styles.ts
    └── ContactBand.test.tsx

tests/
└── e2e/contact-band-layout.spec.ts
```

**Structure Decision**: no new directories and no new files beyond the spec artifacts. The change is
contained in one config value, one stylesheet and the two test files that hold the claim.

## Complexity Tracking

No constitution violations. No complexity to justify.
