# Implementation Plan: Projects Full-Screen Carousel

**Branch**: `008-projects-carousel` | **Date**: 2026-10-03 | **Spec**: [/specs/008-projects-carousel/spec.md](../spec.md)

**Input**: Feature specification from `/specs/008-projects-carousel/spec.md`

## Summary

The projects section stops being a vertical list of six 167px rows on a white page and becomes a full-screen showcase: one project per screen, moved with native snapping, with the card's height derived from whatever remains of the viewport after the heading, the filter and the dots. Cards lose their border and are defined by a two-layer shadow alone, sitting on `#F5F5F7` so the shadow reads. Icons move from raw 48px square PNGs into an 88px rounded frame with a hairline border, which is what makes the square sources read as rounded. A row of dots plus the arrow keys provide navigation and communicate how many projects exist.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3

**Primary Dependencies**: styled-components 6.1, react-router-dom 7.18. No new dependencies.

**Storage**: Static JSON (`src/data/projects.json`, build-time artifact). Unchanged by this feature.

**Testing**: Vitest (unit), Testing Library (component), Playwright (E2E), axe-core (a11y)

**Target Platform**: Web (static site on GitHub Pages at the domain root, `https://ismaelmarot.github.io`)

**Project Type**: Web application (SPA)

**Performance Goals**: Lighthouse 90+, LCP < 2.5s, CLS < 0.1. The 88px icon frame makes late icon resolution the most likely source of layout shift, so CLS is measured on settle.

**Constraints**: WCAG 2.1 AA, no new dependencies, use existing design tokens, styled-components only, `@/` path alias. Native scrolling only: no carousel library, no drag shim, no wheel translation.

**Scale/Scope**: Personal portfolio, 6 published projects.

## Investigation Findings

These came out of measuring the live site and decoding the icon files, and they determine the design. They are recorded here because several of them contradict assumptions that were previously written into the code as comments.

### `fullViewport` is a floor, not a lock

`Section.styles.ts` implements the prop as a minimum, and says so in its own comment:

```
/* Full viewport height - allows content to grow beyond */
min-height: 100dvh;
```

Measured on production, the projects section is already **1024 × 167px per row, six rows, roughly 1200px of content inside a 900px viewport**. The section has therefore never occupied exactly one screen. The Hero achieves it by combining the same prop with `verticalAlign="center"` and short content; `Projects` uses `verticalAlign="top"` and outgrows the floor. This is why the section needs restructuring rather than a new prop.

### The icons are not rounded, and the code comment saying otherwise is false

`ProjectRow.styles.ts` currently asserts that app icons "are already designed with their own rounded shape and may not be square, so the image is never cropped or re-rounded". Decoding the alpha channel of all six PNGs contradicts this:

| Project | Dimensions | Transparent pixels | Corner pixels |
|---------|-----------|--------------------|---------------|
| trash2treasure | 192×192 | 4.3% | transparent |
| cash-counter | 192×192 | 0.9% | transparent |
| NauticAcademy | 192×192 | 5.7% | transparent |
| QEntry | 379×366 | 19.5% | transparent |
| car-expense-tracker | 1024×1024 | 38.3% | transparent |
| **LinkIO** | 256×256 | **0.0%** | **opaque** |

Every file is a square canvas. Five have slightly transparent corners, which at 48px is a radius of roughly 3–8px and does not read as rounded. LinkIO is fully opaque and completely square. This is the defect the request describes, and it is the reason a frame with `overflow: hidden` is required: the frame, not the artwork, has to define the silhouette.

The practical limit: for the five partly-rounded files the visible radius is the smaller of the frame radius and the artwork's own radius, so those will read as slightly less rounded than LinkIO. Because the frame, the card and the section are all white or near-white, that difference is not perceptible. LinkIO going from a hard square to a clean rounded tile is the visible win.

### A rounded frame requires a content change, not just a style change

Filling the frame with `object-fit: cover` crops the source. QEntry at 379×366 loses about 4%. This is accepted deliberately: the frame is the requested effect, and a 4% crop on a single icon is invisible. The existing test that asserts the artwork is "never cropped" states the opposite of the new intent and must be rewritten rather than deleted.

### `--shadow-xs` cannot carry a card this size

The only available shadows are `0 1px 2px rgba(0,0,0,0.05)`, `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`, and the focus ring. At a card height of roughly 570px, a 2px shadow is imperceptible. Two new tokens are required, and they are part of this feature rather than a later cleanup.

### `overflow-x: auto` clips `box-shadow`

A scroll container clips its overflow in both axes. The card's hover elevation would be cut off at the strip's edges. The strip therefore needs vertical padding with a compensating negative margin, so the shadow has room inside the scroll box without moving the layout.

### `composition="projects"` sets `align-items: flex-start`

That would collapse the strip to its content width. The strip needs `align-self: stretch` to fill the section.

### The height can be derived, so no magic numbers are needed

`size="xl"` contributes 80px of block padding, 160px in total. Rather than writing `height: calc(100dvh - 160px - ...)`, the section becomes a flex column of `min-height: 100dvh`, the strip takes `flex: 1` with `min-height: 0`, and the card takes `height: 100%`. The height then follows whatever the heading, filter and dots actually occupy, which also keeps it correct when the filter wraps to two lines on a narrow phone. `min-height: 0` lets the card body scroll internally if a short viewport still cannot fit.

Expected result: about **570px** on a 900px-tall desktop viewport, and about **310px** on a 640px-tall phone where the filter wraps. Both are consequences of filling the screen, not arbitrary values.

### `useIntersectionObserver` is not usable here

The hook exists in `src/hooks/useIntersectionObserver.ts` and is used in **no** component. It handles a single element, so tracking six cards would mean calling it in a loop and breaking the rules of hooks. The current index is computed from `scrollLeft` throttled with `requestAnimationFrame` instead, which is less code than adapting the hook. The unused hook is left alone as out of scope.

### Dynamic viewport and mandatory snap may fight each other

`dvh` changes when a mobile browser's address bar collapses, which changes the card height mid-gesture and can make a `mandatory` snap settle between cards. The plan starts with `mandatory` and relaxes to `proximity` on narrow viewports only if the browser check reproduces a misaligned landing. This is recorded as a risk rather than a decision, because it should not be pre-emptively coded around.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | New `ProjectDots` component in its own folder. Current-index state lives in a `useProjectsCarousel` hook beside the strip, not inside the card |
| II. Type Safety | PASS | No data model change; `Project` is untouched. The hook returns a typed index and a typed ref |
| III. Testing Strategy | PASS | Component tests for the strip, the dots and every card state; four existing tests are rewritten to the new intent, none deleted |
| IV. Accessibility & Performance | PASS | Group label, `tabindex`, arrow keys, named dots with `aria-current`, no `aria-live` and no autoplay. CLS measured because the icon frame grows from 48px to 88px |
| V. Design Principles | PASS | Shadow and whitespace carry the hierarchy instead of a border. The reference is Apple's product showcase, not a copy of any specific Apple surface |
| VI. Simplicity & Maintainability | PASS | No dependency, no carousel library, no drag shim. Native scroll, `rAF` throttle, two CSS tokens. The unused `useIntersectionObserver` is deliberately not adopted or refactored |
| Styling (styled-components) | PASS | All styles in `*.styles.ts` |
| Path Aliases (`@/`) | PASS | All internal imports use `@/` |
| Dependencies | PASS | No new packages; `scroll-snap` and `requestAnimationFrame` are platform APIs |

**Result**: All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/008-projects-carousel/
├── spec.md      # Feature specification
├── plan.md      # This file
└── tasks.md     # Task list
```

### Source Code (repository root)

```text
src/
├── styles/
│   └── tokens.css                          # + --shadow-card, --shadow-card-hover
└── components/sections/
    ├── Projects/
    │   ├── Projects.tsx                    # strip wrapper, dots, background muted
    │   ├── Projects.styles.ts              # strip, snap, dots layout
    │   ├── useProjects.ts                  # + reset index and scroll on filter change
    │   └── useProjectsCarousel.ts          # NEW: current index from scrollLeft + arrow keys
    ├── ProjectDots/                        # NEW component folder
    │   ├── ProjectDots.tsx
    │   ├── ProjectDots.styles.ts
    │   └── ProjectDots.test.tsx
    └── ProjectRow/
        ├── ProjectRow.tsx                  # icon wrapped in a frame
        ├── ProjectRow.styles.ts            # card geometry, shadow, icon frame
        └── ProjectRow.test.tsx             # 4 tests rewritten, new frame assertions
```

### Tests Updated

```text
src/components/sections/ProjectRow/ProjectRow.test.tsx
  - icon 48px assertion becomes 88px
  - "never crops the artwork" is rewritten to assert the frame defines the silhouette
  - name size assertion moves to 32px
src/components/sections/Projects/Projects.test.tsx
  - strip group label, tabindex and snap assertions
  - dots render and reflect the filtered list
```

## Complexity Tracking

| Item | Decision | Alternative rejected |
|------|----------|---------------------|
| Current index source | `scrollLeft` + `requestAnimationFrame` | One `IntersectionObserver` per card; the existing hook is single-element and unused, and a hook call in a loop is illegal |
| Movement | Native scroll with snap | Carousel library, autoplay with pause control. Autoplay would make WCAG 2.2.2 apply and needs `aria-live` |
| Navigation | Dots plus arrow keys | Arrows only (no count), or nothing (desktop looks like one project) |
| Icon rounding | 88px frame, `overflow: hidden`, `cover` | `border-radius` on the `img` alone, which cannot clip LinkIO because it is opaque |
| Card height | Flex-derived | Fixed 420px, or `calc(100dvh - ...)`; both break when the filter wraps |
| Card edge | Shadow on `#F5F5F7` | Borderless on white, where the card has no edge at all |