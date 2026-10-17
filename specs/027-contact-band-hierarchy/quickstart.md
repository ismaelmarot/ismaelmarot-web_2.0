# Quickstart: The Contact Band's Hierarchy

**Feature**: `027-contact-band-hierarchy` | **Date**: 2026-10-16

Runnable validation for the contact band's new hierarchy. Every command runs from the repository root.

## Prerequisites

- Node.js >= 20
- Dependencies installed (`npm install`)
- A browser for the visual checks; Playwright browsers installed for the E2E (`npx playwright install`)

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

Expected: all `ContactBand` tests pass. The ones that hold the mechanism:

- the question reads `--text-display-section` and is the band's only `h2`
- the sentence reads `--text-body`
- the email's visible text is the display address and its `href` is the mailto target
- the email is `justify-self: end`
- the call to action is `align-self: flex-start`
- the row is `auto 1fr` and collapses below 767px

### 3. End-to-end layout

```bash
npm run test:e2e -- contact-band-layout
```

Expected: all tests pass at 1440, 1024, 768, 390 and 320. The ones that hold the outcome:

- the rendered question equals the rendered "Sobre mí" section title at 1440
- the email is smaller than the question at every viewport
- the vertical order is question, sentence, call to action, networks/email row
- the networks are left of the email and the email is flush right
- the address never wraps and never overflows at any viewport

### 4. Visual check

```bash
npm run dev
```

Open `/` and scroll to the bottom band. On desktop:

1. The question is large and top-left.
2. The sentence is beneath it, at body size.
3. The black `ir →` pill is beneath the sentence, at the left.
4. The networks are at the left of the bottom row and the address is flush right.
5. The address reads `ismaelmarot@contacto.com`; pressing it opens a mail client addressed to
   `ismaelmarot@hotmail.com`.

Then narrow the window below 768px and confirm the band stacks in one column with no horizontal scroll.

### 5. Accessibility

```bash
npm run test:a11y
```

Expected: zero violations on every route at every viewport, every route carrying its expected `h1`.

## What to look for when reviewing

- The question and the "Sobre mí" title are the same size.
- The email is one step smaller than the question, not the same size.
- The address is flush right on desktop and left-aligned on mobile.
- The band still occupies one screen and still snaps.
