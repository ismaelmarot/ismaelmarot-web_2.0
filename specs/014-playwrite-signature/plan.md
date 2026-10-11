# Implementation Plan: The footer signature in Playwrite US Modern

**Branch**: `014-playwrite-signature` | **Date**: 2026-10-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/014-playwrite-signature/spec.md`

## Summary

The footer copyright keeps its text, its element and its colour, and the name inside it is set in
Playwrite US Modern at weight 400. The typeface is served from the Google Fonts CDN that already serves
Inter, declared through one new token, with Inter as the fallback.

The work is small by design. The interesting part is not adding a font, it is adding a font without
moving anything, which is why FR-007 and SC-002 exist.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19
**Primary Dependencies**: styled-components 6.1, no additions
**Storage**: N/A — `siteConfig.name` is unchanged
**Testing**: Vitest (unit + component), Playwright (E2E), Testing Library
**Target Platform**: Static site, GitHub Pages, evergreen browsers
**Performance Goals**: CLS < 0.1 on load with the font enabled (SC-003), footer geometry unchanged
(SC-002)
**Constraints**: No new dependency (FR-012); no other element's typeface changes (FR-009); no existing
Footer or Layout test deleted (SC-008)

## Constitution Check

*GATE: passed. Re-checked after design.*

| Principle | Compliance |
|---|---|
| I. Component-First | No new component. The footer already has this responsibility and already renders this text. |
| II. Type Safety | No new types. `FooterProps` is unchanged. |
| III. Testing | Component for what the DOM declares, E2E for the computed values and for the blocked-font case, which no unit test can reach. |
| IV. A11y & Performance | Contrast re-measured rather than inherited from Inter; CLS measured; text never invisible. |
| V. Design Principles | One deliberate moment of personality at the end of the page, in the muted colour the footer already used. Nothing decorative added. |
| VI. YAGNI | One token, one styled span, one link element. No font-loading library, no preload manager, no class to toggle. |
| Component Structure | No new folder. `Footer.styles.ts` and `Footer.tsx` keep their existing roles. |
| Styling | styled-components in the existing `*.styles.ts`. The literal font stack is not written in a component; it lives in the token. |
| Path Aliases | Unchanged; no new internal imports. |
| Dependencies | `package.json` untouched. |

**Complexity Tracking**: nothing to record, no gate failed.

### The decision this plan is built around

Playwrite US Modern has a single `wght` axis from 100 to 400 and therefore no bold. The site sets its
hero at 700, its section headings at 700 and its project titles at 600. Applying this typeface to any of
them would return 400 and let the browser synthesise a heavier face, which is why FR-002 requires the
weight to be declared rather than inherited. That constraint is the reason this feature is a footer
change and not a typographic one, and it is why no weight token is added.

### Why the font is not loaded the way Inter is

`globals.css` opens with `@import url('https://fonts.googleapis.com/css2?family=Inter...')`. That is an
`@import` inside a render-blocking stylesheet, so the browser must fetch the CSS, discover the import,
then fetch the font. Adding Playwrite the same way would put a second serialised round trip in front of
first paint for a font used by two words. FR-011 requires a `<link>` in `index.html` instead, which
fetches in parallel with the stylesheet. Inter's own import is left alone: changing it is a separate
concern and touching it here would put an unrelated change inside this feature.

## Project Structure

```
src/
├── styles/
│   └── tokens.css            # +--font-hand, next to --font-sans
└── components/layout/Footer/
    ├── Footer.tsx            # +<StyledSignature> around the name
    └── Footer.styles.ts      # +StyledSignature
index.html                    # +preconnect +stylesheet for Playwrite
```

No new folder, no new component, no new file.

## Phase 0: Measurement first

The height question is answered by measuring rather than by guessing. A handwriting face sets taller than
Inter, and the copyright line shares a flex row with the social links.

- **T001** Measure the copyright line's height in Inter, then again with Playwrite applied, at 320 and
      1440, and record the difference.
- **T002** If the height changes, reserve it on the copyright line so the swap cannot move the row.

This phase exists because the specification states SC-002 as a measurable outcome and the implementation
has to know the number before it can decide whether it needs a reserved line height at all.

## Phase 1: Tokens and font loading

- **T003** Add `--font-hand` to `tokens.css` as Playwrite followed by `--font-sans`, so the fallback is
  declared once rather than in each component that uses it (FR-003).
- **T004** Add the `<link>` tags to `index.html`: `preconnect` to `fonts.gstatic.com` for the font files
  themselves, and the stylesheet link with `display=swap` (FR-004, FR-011).

## Phase 2: The footer

- **T005** Add `StyledSignature` to `Footer.styles.ts`: `font-family: var(--font-hand)` and an explicit
  `font-weight: 400` (FR-001, FR-002).
- **T006** Wrap only the name in `Footer.tsx`, leaving the `©` and the year outside it in the paragraph's
  own style (FR-005, FR-006, FR-010).
- **T007** Reserve the line height if T001 measured one.

## Phase 3: Tests

- **T008** Component test: the copyright's text content is unchanged and the name is wrapped in the
  signature element (SC-005).
- **T009** Component test: the signature declares Playwrite and weight 400 rather than inheriting.
- **T010** E2E: computed `font-family` and `font-weight` on the name with the font loaded (SC-001).
- **T011** E2E: footer geometry identical before and after the font loads, at four viewports (SC-002).
- **T012** E2E: with the font blocked, the name is visible and its family resolves to the fallback
  (SC-004).
- **T013** E2E: `body` is still Inter and no heading's weight moved (SC-006).
- **T014** E2E: no new heading or landmark in the markup (SC-010).

## Phase 4: Verification

- **T015** typecheck, lint, unit, component, build.
- **T016** E2E in chromium and webkit.
- **T017** axe at 1440, 768, 390 and 320, re-reading the copyright's contrast rather than assuming
  Inter's result carries over (SC-007).
- **T018** Record the bundle growth against the 5kB budget (SC-009).

## Verification approach

Every success criterion that can be measured is measured. The ones that cannot are asserted in a
component test against the DOM, and the geometry ones are measured in a browser because a CSS assertion
establishes intent rather than result. SC-001 and SC-006 are the two that would otherwise be satisfied
by a stylesheet that says the right thing and renders nothing, which is why both are E2E.