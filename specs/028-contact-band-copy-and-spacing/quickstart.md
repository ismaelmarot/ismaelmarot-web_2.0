# Quickstart: The Contact Band's Copy and Spacing

**Feature**: `028-contact-band-copy-and-spacing` | **Date**: 2026-10-17

Runnable validation for the contact band's copy and spacing change. Every command runs from the
repository root.

## Prerequisites

- Node.js >= 20
- Dependencies installed (`npm install`)
- Playwright browsers installed for the E2E (`npx playwright install`)

## Setup

```bash
npm install
npm run build
```

## Validation

### 1. Static checks

```bash
npm run lint
npm run typecheck
```

Expected: no errors, no warnings.

### 2. Component tests

```bash
npm test -- ContactBand
```

Expected: all `ContactBand` tests pass. The ones that hold this feature's mechanism:

- the tagline text comes from `siteConfig` and reads `Hablemos y pongámonos manos a la obra`
- the description's CSS reads `font-size: var(--text-large-subtitle)` and never `--text-body`
- the inner's CSS reads `gap` through `tokens.space[12]`
- the question still reads `--text-display-section` and is the band's only `h2`

### 3. E2E

```bash
npm run test:e2e -- contact-band-layout
npm run test:e2e -- home-scroll-snap
```

Expected: both suites pass. `contact-band-layout` measures the rendered page directly; the new
assertions in it are the ones this feature depends on:

- the rendered sentence's font size equals the rendered "Me interesa…" description's at 1440
- the button-to-row distance measures 48px (the `space[12]` step), with sub-pixel slack
- the question stays the largest text in the band at every viewport
- the band stays exactly one screen tall at every viewport
- no viewport overflows horizontally

### 4. Visual check, desktop

Run `npm run dev`, open the Home page, and scroll to the last band.

- The sentence reads **Hablemos y pongámonos manos a la obra** — with the accent on `á`.
- The sentence's size matches the "Me interesa crear tecnología…" text in the "Sobre mí" band above it.
- The gap between the block (question, sentence, button) and the row of icons and the mail is visibly
  wider than the gaps inside the block.

### 5. Visual check, phone

Open the same page at 390px wide.

- The band still stacks in reading order: question, sentence, button, icons, mail.
- Nothing overflows horizontally; the sentence wraps, not overflows.
- Snap-scrolling one screen at a time still lands the band flush.

## If something fails

- **The tagline renders without the accent** → check `src/data/site-config.ts`; the component gives the
  config the last word.
- **The sentence reads 16px** → check `StyledContactBandDescription`'s `font-size`; the token must be
  `--text-large-subtitle`, and the E2E's size comparison against "Sobre mí" catches exactly this.
- **The gap is still 40px** → check `StyledContactBandInner`'s `gap`; `tokens.space[12]` and the E2E's
  button-to-row measurement catch exactly this.
- **A viewport overflows** → the sentence's wider token may have pushed a wrap point; check that
  `max-width: 60ch` is intact on `StyledContactBandDescription` before touching the token.
