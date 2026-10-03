# Implementation Plan: Dark Project Cards with Auto-Advance

**Branch**: `009-projects-carousel-dark` | **Date**: 2026-10-03 | **Spec**: [/specs/009-projects-carousel-dark/spec.md](../spec.md)

**Input**: Feature specification from `/specs/009-projects-carousel-dark/spec.md`

## Summary

The project card becomes a near-black surface with light text, a 120px icon frame and a round plus button instead of a labelled pill, with no hover reaction at all. The strip starts moving by itself every 7 seconds, which is the case WCAG 2.2.2 covers, so a play/stop toggle becomes an obligation rather than a convenience, and previous/next controls join the existing dots. Every control is keyboard reachable and none of them change appearance under the pointer.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3

**Primary Dependencies**: styled-components 6.1, react-router-dom 7.18. No new dependencies.

**Storage**: Static JSON (`src/data/projects.json`). Unchanged.

**Testing**: Vitest (unit), Testing Library (component), Playwright (E2E), axe-core (a11y)

**Target Platform**: Web (static site on GitHub Pages at the domain root)

**Project Type**: Web application (SPA)

**Performance Goals**: Lighthouse 90+, LCP < 2.5s, CLS < 0.1. The icon frame grows 88px to 120px, so late icon resolution is the shift risk.

**Constraints**: WCAG 2.1 AA, no new dependencies, existing design tokens, styled-components only, `@/` path alias. One timer at a time.

**Scale/Scope**: Personal portfolio, 6 published projects.

## Investigation Findings

### A dark card changes what the shadow is for

The card has no border by request, so its edge is drawn entirely by the contrast against the section. That only works while the section stays light: `#1D1D1F` on `#F5F5F7` reads as a distinct object, whereas two near-blacks would fuse and force a border back. This is why the section background is unchanged even though the cards invert.

### The text tokens are all dark and all global

`--color-text-primary` resolves to the foreground ink and `--color-text-secondary` to a muted ink. Both are dark, so inside a card they would be unreadable. Inverting them globally would invert the whole site, so the card gets its own scoped tokens instead: card surface, card foreground, card muted foreground and card hairline. That keeps the change local and makes the dark card a deliberate surface rather than a flipped theme.

### Three icons will show a bright square inside a dark frame

From the alpha decode in the previous feature: `car-expense-tracker` is 38.3% transparent and `QEntry` 19.5%, meaning both are rounded app icons with substantial opaque area. The other three are 0.9% to 5.7% transparent, so nearly the whole canvas is artwork. On a near-black frame those two will read as bright tiles, which is correct but worth seeing before it ships rather than assuming.

### Transparent artwork corners now resolve against the frame, not the page

Previously the frame was white and the card white, so a transparent corner was invisible. The frame is now dark and sits on a dark card, so the same corner resolves against the frame's own background. The frame therefore needs a background slightly lighter than the card, otherwise the icon reads as artwork floating with no tile.

### The existing hook already owns the movement primitives

`useProjectsCarousel` exposes `goTo`, `step` and the current index. Auto-advance needs only a timer that calls `step(1)` and wraps, so the new controller adds state and one interval rather than duplicating navigation. `step` already clamps, and wrapping from the last project back to the first needs the clamp lifted or handled by the caller.

### Reduced motion means not starting at all

The previous feature disabled `scroll-behavior` under `prefers-reduced-motion`, which stops the animation but leaves the card still changing every 7 seconds. That is not reduced motion, that is the same motion more slowly. Under reduced motion the carousel must not auto-advance at all, which means the toggle has to report stopped on load rather than showing a stop glyph for something that will never run.

### Focus pausing has to cover the controls, not just the strip

A visitor who tabs to the next control has focus inside the section, and if pausing only watched the strip the carousel would keep advancing out from under them. The check is for focus anywhere in the section.

### One timer, not two

Toggling quickly can leave an interval running if the effect is not written so that cleanup always clears. The controller keeps the playing state as the only input to an effect whose cleanup clears the timer, which makes two live timers impossible by construction.

### The plus glyph does not exist yet

`pause`, `play`, `chevronLeft` and `chevronRight` are already in the icon set, reused from the marquee. There is no `plus`, so it is added following the existing 24x24 stroked style.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | New `useProjectsAutoAdvance` hook beside the strip; controls live in the existing `ProjectDots` folder, renamed in intent to hold all carousel controls |
| II. Type Safety | PASS | No data model change; the controller returns a typed playing state and a typed toggle |
| III. Testing Strategy | PASS | Component tests for the toggle glyphs, the arrow controls and the card surface; the previous feature's carousel tests keep passing |
| IV. Accessibility & Performance | PASS | Pause mechanism present and keyboard reachable, no `aria-live`, reduced motion disables auto-advance entirely, focus and hidden-tab pausing, 4.5:1 text on the card |
| V. Design Principles | PASS | Hierarchy carried by one dark surface and scale rather than by decoration; no hover motion anywhere |
| VI. Simplicity & Maintainability | PASS | No dependency, no carousel library. One `setInterval` behind one playing flag, cleared by one effect cleanup |
| Styling (styled-components) | PASS | All styles in `*.styles.ts` |
| Path Aliases (`@/`) | PASS | All internal imports use `@/` |
| Dependencies | PASS | No new packages |

**Result**: All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/009-projects-carousel-dark/
├── spec.md
├── plan.md      # This file
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── styles/
│   └── tokens.css                       # + card surface and foreground tokens
└── components/
    ├── ui/Icon/useIcon.tsx              # + plus glyph
    └── sections/
        ├── Projects/
        │   ├── Projects.tsx             # controls row, toggle, arrows
        │   ├── Projects.styles.ts       # control row, no-hover control styles
        │   ├── useProjectsCarousel.ts   # wrap from last to first
        │   └── useProjectsAutoAdvance.ts# NEW: playing state, one timer, pausing
        ├── ProjectDots/                 # becomes the carousel control set
        │   ├── ProjectDots.tsx
        │   ├── ProjectDots.styles.ts
        │   └── ProjectDots.test.tsx
        └── ProjectRow/
            ├── ProjectRow.tsx           # round plus action
            ├── ProjectRow.styles.ts     # dark surface, 120px frame, no hover
            └── ProjectRow.test.tsx
```

## Complexity Tracking

| Item | Decision | Alternative rejected |
|------|----------|---------------------|
| Dark surface | Card-scoped tokens | Flipping the global text tokens, which would invert every section |
| Auto-advance | One `setInterval` behind a playing flag | A carousel library, and a second timer for wrapping |
| Toggle naming | Changing `aria-label` per the marquee | `aria-pressed`, which reads worse with a glyph that already states the state |
| Reduced motion | Do not auto-advance at all | Disabling only the scroll animation, which leaves the card still moving |
| Hover | No rule at all | A hover rule with no visual change, which is dead CSS |
| Pause triggers | Focus in section, hidden document, reduced motion | Hover pausing, which conflicts with the request for no hover behaviour |