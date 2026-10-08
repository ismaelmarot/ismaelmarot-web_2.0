# Implementation Plan: Rotating the project icon strip

**Branch**: `013-project-icon-rotation` | **Date**: 2026-10-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/013-project-icon-rotation/spec.md`

## Summary

The Proyectos band shows six app icons. This makes the row renew: six fixed slots, and every four seconds
each slot's icon fades out, a different app's icon fades in, and the apps move at random. No slot ever
keeps the app it was showing.

The design decision that carries the feature is that the slots stay put and only the assignment changes,
which is what makes it cheap. Research §5 sets out what permuting the array would cost: the entrance
stagger measured by feature 011's SC-005, node identity asserted in the browser tests, and the phone
scroller's snap points.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19
**Primary Dependencies**: styled-components 6.1, no additions
**Storage**: N/A — `src/data/projects.json` is unchanged
**Testing**: Vitest (unit + component), Playwright (E2E), Testing Library
**Target Platform**: Static site, GitHub Pages, evergreen browsers
**Performance Goals**: CLS < 0.1 across rotations, not only on load (SC-007)
**Constraints**: No new dependency (FR-019); every feature 011 criterion still holds; no test of feature
011 deleted (SC-012); bundle growth <=1kB (SC-013)

## Constitution Check

*GATE: passed. Re-checked after design.*

| Principle | Compliance |
|---|---|
| I. Component-First | The rotation is part of the strip's single responsibility: which app each slot shows. |
| II. Type Safety | The assignment is `number[]`, positional with the slots. |
| III. Testing | Unit for the assignment function, component for the timing and the pauses, E2E for what only a browser can measure. |
| IV. A11y & Performance | Reduced motion removes the rotation entirely; four pauses; CLS measured. |
| V. Design Principles | Apple-style fade and easing, no decoration added. |
| VI. YAGNI | No carousel controls, no new hook library, no reordering machinery. |
| Component Structure | Two new files inside the existing folder; the folder keeps its five-file shape. |
| Styling | styled-components in the existing `*.styles.ts`. |
| Path Aliases | All internal imports via `@/`. |
| Dependencies | `package.json` untouched. |

**Complexity Tracking**: nothing to record, no gate failed.

### A decision that deviates from the component-folder convention

`iconRotation.ts` is a sixth file in a folder the constitution describes as five. It is not an extra
layer or a generic utility: it is a pure function with one caller, sitting beside the component that
calls it, and it exists so the guarantee in FR-003 can be asserted without a timer or a rendered DOM.
That is the same reason this project's other stateful components keep their logic in a `use*` file
rather than inline. The alternative, putting the function in the hook, would bury a counting algorithm
behind React state where it could only be tested through rendering.

## Project Structure

### Documentation (this feature)

```text
specs/013-project-icon-rotation/
├── spec.md                       # with 13 requirements and 13 success criteria
├── research.md                   # the derangement arithmetic and the alternatives
├── plan.md                       # this file
├── quickstart.md                 # how to verify by hand
└── tasks.md
```

And one amendment to a neighbour:

```text
specs/011-project-icon-strip/spec.md   # Amendment 4: "no autoplay" superseded, rest kept
```

### Source Code

```text
src/components/sections/ProjectIconStrip/
├── ProjectIconStrip.tsx         # modified: fixed slots, assignment from the hook
├── ProjectIconStrip.styles.ts   # modified: opacity in the frame's transition
├── iconRotation.ts              # new: pure function, the guarantee
├── useIconRotation.ts           # new: interval, pauses, the two-phase fade
├── ProjectIconStrip.test.tsx    # modified: rotation cases added
└── index.ts                     # unchanged

tests/unit/
└── project-icon-rotation.test.ts    # new: the guarantee, with a seeded rng

tests/e2e/
└── project-icon-strip.spec.ts       # modified: rotation cases added, nothing deleted
```

**Structure Decision**: the two new files live inside the existing component folder rather than in
`src/utils/`, because they exist only for this component and the constitution warns against generic
modules.

## Phase 1 Design: contracts

```ts
/** How many apps fit in the row. */
export const ESPACIOS = 6;

/** How long an arrangement lasts, in milliseconds. */
export const INTERVALO_MS = 4000;

/** How long one half of the fade takes, in milliseconds. */
export const FASE_MS = 240;

/**
 * Which app each slot shows: `espacios` indexes into the app list, positional with the slots.
 *
 * `rng` is injectable so the guarantee is asserted without a timer or a stub of Math.random.
 */
export function siguienteAsignacion(
  total: number,
  espacios: number,
  previa: number[],
  rng?: () => number
): number[]
```

`previa` is positional: entry `i` is the app slot `i` was showing. It is required rather than optional
because FR-003 is a claim about what each slot held, and a function that cannot see the previous
assignment cannot honour it.

The hook returns what the component needs and nothing more:

```ts
export interface UseIconRotationResult {
  /** Which app each slot shows. */
  asignacion: number[];
  /** 1 while the icons are visible, 0 during the first half of the fade. */
  opacidad: number;
}
```

`opacidad` is a number rather than a boolean because it is handed straight to a styled-component
prop, and a boolean would mean deriving `opacity: 0` or `opacity: 1` in the component.

## Phase 1 Design: data flow

```text
projects.json -> Project[] -> useIconRotation -> asignacion: number[] -> slot i shows projects[asignacion[i]]
                                                -> opacidad: 0 | 1     -> frame opacity
```

`opacidad` is separate from `asignacion` on purpose. The fade out has to complete before the apps
change, so the two are separate pieces of state moving on separate clocks: the interval fires the
sequence, and the assignment only changes halfway through it.

## Risks

| Risk | Mitigation |
|---|---|
| Adding `opacity` to the frame's transition breaks feature 011's SC-006 (`0s` under reduced motion) | The reduced-motion block already declares `transition: none`. Asserted rather than assumed. |
| The entrance keyframe and the rotation fade fight over `opacity` | The rotation is a transition, not an animation. The entrance also finishes 800ms in while the first rotation is 4s in. |
| Changing six image sources adds layout shift | Frames are a fixed 96x96 with `overflow: hidden`. SC-007 measures it over three rotations. |
| The entrance stagger is measured by position and rotation would break it | The slots never reorder, so `$index` stays the slot index. Verified by feature 011's unchanged SC-005 assertion. |
| A rejected random draw loops | Bounded retries, then a repair that fills each slot with the first app that is neither used nor its own previous one. |
| One app in the data | Zero derangements exist. FR-008: no timer is created. |
