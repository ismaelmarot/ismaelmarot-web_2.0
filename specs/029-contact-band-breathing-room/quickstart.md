# Quickstart: The Contact Band's Breathing Room

**Feature**: `029-contact-band-breathing-room` | **Date**: 2026-10-17

Runnable validation for the band's wider inner air. Every command runs from the repository root.

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
npm run test:component -- ContactBand
```

Expected: all `ContactBand` tests pass. The one that holds this feature's mechanism:

- the inner's CSS reads `gap` through `tokens.space[16]`, and the gap no longer resolves
  `var(--space-12)`

### 3. E2E

```bash
npm run test:e2e -- contact-band-layout
npm run test:e2e -- home-scroll-snap
```

Expected: both suites pass. The assertions this feature depends on:

- the button-to-row distance measures 64px (±1) at every viewport, and is greater than 40
- the band stays exactly one screen tall at every viewport
- no viewport overflows horizontally

### 4. Visual check, desktop

Run `npm run dev`, open the Home page, and scroll to the last band.

- The gap between the block (question, sentence, button) and the row of icons and the mail is visibly
  wider than the gaps inside the block — roughly twice the copy block's own internal rhythm.
- The band still fills one screen; the content does not squeeze or scroll.

### 5. Visual check, phone

Open the same page at 390px wide.

- The band still stacks in reading order: question, sentence, button, icons, mail.
- Nothing overflows horizontally; the wider gap is carried inside the full-screen shell.

## If something fails

- **The gap still measures 48px** → check `StyledContactBandInner`'s `gap`; the value must be
  `tokens.space[16]`.
- **The distance exceeds 64px by more than 1px** → a margin was added somewhere; check that
  `StyledContactBandCopy` carries no `margin` and the CTA carries only `margin-top: space[2]`.
- **The band scrolls past one screen on a short viewport** → check the shell's `padding-block` and
  `min-height: 100dvh` are intact before touching the gap.
