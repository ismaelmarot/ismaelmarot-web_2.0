# Tasks: Project Icon Strip on the Landing Page

**Input**: Design documents from `/specs/011-project-icon-strip/`

**Prerequisites**: spec.md

## Phase 1: Specification

- [x] T001 [P] Measure the Projects section on production before writing anything: zero images inside `#projects-summary` at 1440x900 and 390x844, and the `featured` slot absent entirely
- [x] T002 [P] Confirm the section is a `SectionSummary` and not the carousel, so the strip is a preview rather than a second copy of `/projects`
- [x] T003 [P] Download and inspect the six artworks: 192, 1024, 256, 379x366, 192 and 192px, every one with an alpha channel
- [x] T004 Write the specification, including that transparent corners and a non-square source are the two facts the frame has to solve
- [x] T005 Record that the section already accepts `featuredItems` and that the technology marquee uses it, so the shared component needs no change

## Phase 2: Component

- [x] T006 [P] Confirm `useIntersectionObserver` and `useReducedMotion` already exist and need no new hook
- [x] T007 Create `ProjectIconStrip.tsx` with its styles, test and barrel
- [x] T008 [P] Verify `SectionSummary`'s featured slot is `max-width: 1024px` and that 656px of frames fit inside it
- [x] T009 Add the 96px frame with a 22% radius and `#E8E8ED` background, the same decision the carousel makes at the same size
- [x] T010 Fit the artwork with `object-fit: cover` and `overflow: hidden`, since one source is 379x366 and every one has transparent corners
- [x] T011 Wire the entrance to the observer with a 60ms stagger, 500ms duration and Apple's curve
- [x] T012 Add the hover at `scale(1.06)` with a deepened shadow, and remove it on touch viewports where a sticky hover reads as a bug
- [x] T013 Add the horizontal row below 700px with scroll snapping, a hidden scrollbar and the left-to-right mask
- [x] T014 [P] Find that the two techniques the row needed already existed in the project, and reuse them rather than reinvent them: the marquee's mask and the category filter's hidden scrollbar
- [x] T015 Pass the strip through `featuredItems` on the Projects section of the landing page
- [x] T016 Render nothing when the project list is empty, and keep a frame for a project whose icon fails to load

## Phase 3: Accessibility

- [x] T017 [P] Add `role="list"` and `role="listitem"` rather than an `aria-label` on a plain div, which is prohibited and which this project got wrong once already on the heatmap
- [x] T018 Name every icon in its alternative text, and make nothing a link since the section already carries one call to action
- [x] T019 [P] Guard `useIntersectionObserver` where the API is missing, reporting the element as in view rather than throwing, so a missing global cannot leave a section with no images in it

## Phase 4: Tests

- [x] T020 Write nine component tests: the count, the frame, the fit, the alternative text, no links, the empty case, the failed icon, the stagger and the scrolling row
- [x] T021 [P] Fix two tests of my own that pointed at the wrong element: the mask and the scroll container are on the row, not on the frame
- [x] T022 Write eleven browser tests that measure the strip at four viewports, the stagger in a real browser, the reduced-motion state and the scrolling row
- [x] T023 [P] Assert the entrance does not repeat, using `getAnimations()` rather than `animationName`, which stays present after the animation has finished and proves nothing
- [x] T024 Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:component` and `npm run build`

## Phase 5: Verification

- [x] T025 Confirm the six frames are 96x96 with a 21px radius and `cover` at 1440, 768, 390 and 320
- [x] T026 Confirm the stagger reads 0, 60, 120, 180, 240 and 300ms in the browser
- [x] T027 [P] Confirm the icons do not animate while the section is off screen, which at 1440x900 starts exactly at the fold
- [x] T028 [P] Confirm the entrance does not replay on a return scroll, and that the node is not re-created
- [x] T029 Confirm reduced motion yields no animation, no transform and a visible strip
- [x] T030 Confirm the page has no horizontal overflow at any of the four viewports
- [x] T031 [P] Confirm the browser test fails when the stagger is removed, and find that two earlier attempts at this check were invalid because `tsc` had failed and the build never ran
- [x] T032 [P] Fix a one-pixel rounding in an existing Hero test rather than relaxing it: the leftover arrives rounded and is then halved, and the relationship being asserted is exact
- [x] T033 [P] Confirm the Hero's mobile flush is still guarded by seven tests that fail when it is removed
- [x] T034 Run axe at 1440, 768, 390 and 320
- [x] T035 Capture 1440 and 390 and inspect them

## Verification Results

| Criterion | Result |
|-----------|--------|
| SC-001 six frames | Pass at 1440, 768, 390 and 320 |
| SC-002 96x96 and 21px | Pass: all six identical at every viewport |
| SC-003 fitted not stretched | Pass: `object-fit: cover` on all six |
| SC-004 no border | Pass |
| SC-005 stagger | Pass: 0, 60, 120, 180, 240, 300ms, read from the browser |
| SC-006 reduced motion | Pass: `animation: none`, `transform: none`, transition 0s, visible |
| SC-007 scrolls on a phone | Pass at 390: 704 against 342, masked, no scrollbar, all six reachable |
| SC-008 no scroll on desktop | Pass at 1440: 1024 against 1024 |
| SC-009 alternative text | Pass: all six name their project |
| SC-010 axe | Pass: 0 violations at 1440, 768, 390 and 320 |
| SC-012 full suite | Pass: 99 unit, 345 component and 73 browser |

## Notes

- **T003 is what made the frame a decision rather than a decoration.** One artwork is 379x366 and
  another is 1024px wide, and all six have transparent corners. Without measuring that first, the
  strip would have gone in as six plain images and looked wrong in a way that is hard to name.
- **T014 is the reuse that made this cheap.** The mask that stops a cut frame reading as clipped, and
  the hidden scrollbar on a horizontal row, were both already in the project for other components. A
  scrollable row on a phone is a solved problem here.
- **T017 is the same mistake twice.** The heatmap had `aria-label` on a plain div and axe reported it
  on 371 cells. This time it was caught by reading that comment before writing the component.
- **T023 is the measurement lesson of this feature.** The first version read `animationName` and
  appeared to show the entrance replaying on a return scroll. `getAnimations()` showed the animation
  was `finished`: the rule is still attached and the name was never evidence of a re-run.
- **T031 took three attempts, and the first two were wrong in a way worth recording.** Removing the
  stagger changed nothing observable because `tsc` rejected the now-unused `$index`, so `npm run build`
  aborted and the preview served the previous `dist` every time. A test that cannot fail because the
  build silently did not run is worse than no test, and the cause looked exactly like a passing
  result.
- **T032 is a correction to an existing test of mine rather than a relaxation.** A one-pixel
  discrepancy at 768x1024 turned out to be rounding in my own arithmetic, not in the layout:
  26.88 + 114.4665 is 141.34 and the browser lays it out at 141. The relationship is exact and is
  now asserted within a pixel, with the reason written down.
