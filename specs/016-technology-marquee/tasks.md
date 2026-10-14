# Tasks: The Technology Marquee on the Landing Page

> **Retrospective.** Every task below was carried out and deployed before this list existed, in
> `4e3ae15`, `4968883` and `432d83f` on 2026-10-03. It is a record of the work, not a plan for it. The
> one task that was never completed is left open, and the spec says why.

**Input**: Design documents from `specs/016-technology-marquee/`

**Prerequisites**: spec.md, plan.md

**Tests**: Required, and written. Twelve component tests. No browser test — see the last task.

## Format

`[ID] [P?] [Story] Description` — [P] parallelisable, [Story] maps to US1/US2/US3/US4.

## Phase 1: Specification

- [x] T001 Establish that the Technologies section was a still grid of chips and that the request was to
      make it move, which no existing specification asked for
- [x] T002 Confirm that no specification anywhere in `specs/` covered the marquee, and that three
      later features cite the component as pre-existing
- [x] T003 Read `specs/011`'s assumption and `specs/013`'s research row, and establish that both record
      the pause control as cancelled when it was never cancelled
- [x] T004 Write the specification, including that the reuse `specs/013` declined was available and that
      saying so is the point of writing this at all

## Phase 2: The loop

- [x] T005 Render the complete category list twice inside each row's track, which is what makes `-50%`
      land on the boundary where copy one begins again
- [x] T006 Use the shared `marqueeScroll` keyframe from `globals.css` rather than declaring one, so the
      icon strip and this feature cannot drift apart
- [x] T007 Drive the duration from the `--duration-marquee` token rather than a literal, at 80s, which is
      slow enough to read as ambient
- [x] T006 [P] Carry identical content in both rows so they travel at the same speed, and reverse the
      keyframes on the second row instead of writing a second animation
- [x] T009 Confirm that one copy is already wider than the section allows at every viewport, so the
      loop closes with no measurement and no `ResizeObserver`

## Phase 3: Accessibility

- [x] T010 Cite WCAG 2.2.2 level A failure F16 in the hook's own JSDoc, so the reason for the hook
      survives anyone refactoring it
- [x] T011 Render one control for both rows rather than one per row, as W3C recommends for several moving
      elements
- [x] T012 Name the control for the action it performs and refuse `aria-pressed`, because a toggle whose
      label changes with its state reads two contradictory things at once
- [x] T013 Mark the control's glyph `aria-hidden`, so the label is the whole accessible name rather than
      the label plus the glyph's name
- [x] T014 Hide the duplicate half of each row from assistive technology, which is the only reason the
      doubled content is acceptable at all
- [x] T015 Make pausing a change to a styled prop and nothing else, so the technologies are never removed
      from the page (FR-012)
- [x] T016 Under reduced motion, set `animation: none` and render no control at all, because a control
      that pauses nothing lies about what it does

## Phase 4: Presentation

- [x] T017 Fade both edges of each row with a `mask-image`, reusing the technique already in the project
      for the icon strip's scrolling row, so a chip crossing the boundary is masked rather than sliced
- [x] T018 Quieten the marquee the same day it shipped, in `4968883`
- [x] T019 Draw the control as a circle in `432d83f`, so it reads as a control rather than as another pill
- [x] T020 Extract `TechnologyPill` out of `TechnologyCard.tsx`, because the card and the chip have
      different jobs and the chip has no text of its own
- [x] T021 Return nothing when no technology carries a populated category

## Phase 5: Tests

- [x] T022 Write twelve component tests: two rows, doubled content, the hidden half, the shared
      keyframes and duration, the two directions, the control's name, the hidden glyph, the glyph swap,
      the stop, the resume and the empty case
- [x] T023 Assert that the two rows share one keyframe and one duration, which is what keeps them at the
      same speed rather than merely looking similar

## Phase 6: Verification

- [x] T024 Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:component` and
      `npm run build`
- [ ] T025 Watch a full 80-second cycle in a browser and confirm neither row shows a seam
      <!-- Never performed, and left open. This is the feature's only observable property and no
           assertion anywhere reaches it: reading `-50%` in a stylesheet is not the same as watching a
           chip cross the boundary for eighty seconds. Recorded in the spec's "On what is and is not
           backed by these criteria" rather than ticked. -->
- [ ] T026 Measure the landing page's layout shift with the marquee present and absent
      <!-- Never performed for this feature specifically. `scripts/audit-a11y.mjs` and the Playwright
           suites measure the page on every commit, but neither names this feature and neither was run as
           part of its work. SC-009 is covered by the pipeline in general and unverified for this feature
           in particular. -->

## Notes

**T005 is the task that made the feature free.** Rendering the list twice, so that a `-50%` translation
lands on a boundary where copy one begins again, replaced a `ResizeObserver`. Nothing about the loop
depends on a measurement, which is why no measurement appears in this feature's tests.

**T014 is the task that made the doubled content acceptable.** Two copies of thirty technologies in two
rows is eight announcements of one list. Without `aria-hidden` on the second copy this feature would have
been worse than the still grid it replaced.

**T012 is the same decision `specs/009` made independently, six days earlier, for the same control.** Two
features arrived at "name it for the action, not the state" without either citing the other. It is the
site's convention now and it is written down here.

**T020 left one deviation from the constitution, and it is recorded rather than quietly fixed.**
`TechnologyPill.tsx` sits inside `TechnologyCard/`'s folder instead of having its own. It is 122 lines
with its own concerns and should have its own folder; moving it changes code that `specs/001` and
`specs/004` own, so it belongs to a feature that intends to change it rather than to this document.

**T025 is the honest gap.** Everything in this feature that a DOM assertion can reach has a test. The one
thing that cannot — whether the loop looks seamless to a person watching it for eighty seconds — does not.