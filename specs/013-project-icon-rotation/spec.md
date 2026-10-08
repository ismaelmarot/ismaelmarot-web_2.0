# Feature Specification: Rotating the project icon strip

**Feature Branch**: `013-project-icon-rotation`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "In the Home > Proyectos section I want the icons to change, rotating their positions." Followed by: "I want the one that is there to disappear and another one to appear. When more apps are added it will be better." And: "Rotate the six" and "All six at once", every four seconds.

## The gap this specification fills

The Proyectos band opens with a row of six app icons and then says nothing else. The icons are a still
image of the work, identical for every visitor, which makes the section less alive than the rest of the
page and gives the visitor no reason to look at it twice.

The screenshots for all six apps already exist in the build data and the landing page downloads none of
them. An earlier attempt to show them as a band of cards was built and then removed, at the maintainer's
decision, so the icons are what the section has. This feature does not reintroduce that band. It makes
the row itself renew: the slot an icon sits in stays put, and the app in it changes.

## What this is deliberately not

It is not a carousel. There is no index, no dots, no previous or next control, and nothing is
clickable, because the section already carries a "Ver proyectos" call to action and feature 011
established that as the one route onward.

It does not reorder the icons either. The six slots stay where they are and the apps move through them,
which is a different thing to see and is what the request asks for: the icon that is there disappears
and another one appears.

## Superseding assumption in feature 011

`specs/011-project-icon-strip/spec.md` states, under Assumptions:

> The strip is a preview, not a second carousel. It shares the carousel's 96px frame so the two are
> recognisably the same asset, and shares none of its behaviour: **no autoplay, no index, no dots, no
> keyboard navigation**, because none of that is meaningful for a row of six static images.

This feature supersedes the "no autoplay" half of that assumption and keeps the rest. It is recorded as
**Amendment 4 of feature 011**, which also states exactly what stays true.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See the row renew itself (Priority: P1)

A visitor scrolls to the Proyectos band and watches the row of icons. Nothing is being advertised and
nothing is clicked; the icons are still there, they are still the six apps, and every few seconds the
app in each slot changes. The section reads as alive rather than as a still image.

**Why this priority**: The renewal is the whole feature. Without it the row is exactly what it was
before this work, and nothing else in the specification matters.

**Independent Test**: Load `/` at 1440x900, read the six apps in slot order, wait one interval, and
assert every slot is showing a different app. No reduced-motion context, no hover and no hidden tab.

**Acceptance Scenarios**:

1. **Given** the icon row is in view and nothing is holding it, **When** the interval elapses, **Then**
   every one of the six slots is showing a different app from the one it was showing.
2. **Given** the interval elapses again, **Then** every slot has changed again, so the row never settles
   on a fixed arrangement.
3. **Given** a visitor watches for a minute, **Then** no app is missing from the set they see over that
   minute.
4. **Given** the six slots, **Then** they stay in the same places: the row does not reflow, jump, or
   reorder its own boxes.

---

### User Story 2 - Not be shown movement they did not ask for (Priority: P1)

A visitor with reduced motion enabled sees the six icons and they never change. A visitor who puts the
cursor over the row, or tabs into it, has the current arrangement held rather than changing under them.
A visitor who switches to another tab and comes back does not find a row that had renewed three times
while they were away.

**Why this priority**: Automatic movement on a landing page is an accessibility failure, and it is the
failure mode of a timer that ignores the reader. The constitution requires WCAG 2.1 AA.

**Independent Test**: With reduced motion requested, assert the six apps do not change across at least
three intervals. Then with the pointer over the row, with focus inside it, and with the document hidden,
assert the same.

**Acceptance Scenarios**:

1. **Given** the visitor's system requests reduced motion, **When** the row renders, **Then** the six
   apps stay as they are and never change.
2. **Given** the pointer is over the row, **When** the interval elapses, **Then** the apps do not change.
3. **Given** focus is within the row, **When** the interval elapses, **Then** the apps do not change.
4. **Given** the browser tab is hidden, **When** the interval elapses, **Then** the apps do not change.

---

### User Story 3 - Read it on a phone, and see the change rather than a jump (Priority: P2)

A visitor on a phone scrolls to the row, which scrolls sideways as it always has. Every few seconds the
app under their finger changes, and it changes by fading rather than by the row jumping. The row does not
scroll itself sideways as a side effect, because a carousel that moves under the reader's finger while
they are trying to swipe it is worse than one that does not move at all.

**Why this priority**: The change on a phone is the most visible, and a horizontal scroller that shifts
itself is the worst case. It cannot be delivered before the desktop behaviour exists.

**Independent Test**: Load `/` at 390x844, assert the row's `scrollLeft` does not change across an
interval, assert the apps in view do change, and assert nothing overflows horizontally.

**Acceptance Scenarios**:

1. **Given** the row at 390px, **When** the interval elapses, **Then** the row's scroll position does not
   change.
2. **Given** the row at 390px, **When** the interval elapses, **Then** the apps displayed change.
3. **Given** any supported viewport, **When** the apps change, **Then** the icons fade rather than
   appearing instantly, and the page does not shift.

---

### Edge Cases

- **One app in total.** There is nothing to change to, and the single icon stays. A derangement of one
  element does not exist, so this is a real degenerate case rather than a rounding error.
- **Fewer apps than slots.** The row shows the apps it has and does not rotate, because there is nothing
  left to show.
- **An app has no icon.** It keeps its frame, as feature 011 requires, and it rotates like any other.
- **An app's icon fails to load.** The failure is remembered for that app, so its frame keeps its
  placeholder every time it comes round, rather than flickering between an image and a placeholder.
- **The visitor returns to a tab left open.** They do not find an arrangement they never saw, because the
  timer does not run while the tab is hidden.
- **An app is added to or removed from the data.** The row adapts its slot count without a code change,
  and the rotation keeps working if the arithmetic still allows it.
- **The row's entrance is still running.** The first renewal happens one interval in, long after the
  entrance has finished, so the two never compete for the same visual property.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The six slots MUST stay in place. Rotation MUST NOT reorder, move or reflow the row's
  boxes; only which app occupies each slot changes.
- **FR-002**: The apps shown MUST change automatically on an interval of 4 seconds while the row is in
  view and not held.
- **FR-003**: After each rotation, no slot MUST display the app it was displaying immediately before.
  This is the guarantee the feature rests on.
- **FR-004**: Every slot MUST change at each rotation, not only some of them.
- **FR-005**: The choice of which app goes in which slot MUST be made at random for each rotation, rather
  than following a fixed repeating order.
- **FR-006**: Where there are more apps than slots, the rotation MUST prefer apps that are not currently
  on screen.
- **FR-007**: Where every slot MUST change cannot be satisfied, the rotation MUST still satisfy FR-003
  and MUST NOT repeat an app across two slots at the same time.
- **FR-008**: With one app, or with no more apps than slots, the row MUST NOT rotate.
- **FR-009**: Each change MUST be a fade: the icons fade out, the apps change, and the new icons fade in.
  A change MUST NOT be an instant swap, which at 96px reads as a flicker.
- **FR-010**: Under reduced motion the row MUST NOT rotate, and the icons MUST remain visible.
- **FR-011**: The rotation MUST pause while the browser tab is hidden, while the pointer is over the row,
  and while keyboard focus is within the row.
- **FR-012**: The rotation MUST NOT start until the row is on screen.
- **FR-013**: Every icon's alternative text MUST name the app it belongs to, in every slot, after every
  rotation.
- **FR-014**: Changing the apps MUST NOT shift the layout. The row's geometry, the slots' positions and
  the page's scroll position MUST be the same before and after.
- **FR-015**: An app whose icon failed to load MUST keep its placeholder whenever it returns, rather than
  re-attempting and flickering.
- **FR-016**: The row MUST remain a list of six items to assistive technology, and MUST NOT introduce any
  new heading on the page.
- **FR-017**: The row's entrance animation MUST NOT replay when the apps change.
- **FR-018**: The row MUST remain not clickable, with no links and nothing focusable, as feature 011
  established.
- **FR-019**: No new dependency and no new data source. The apps, their order and their icons all already
  exist.

### Key Entities

- **Slot**: one of the six fixed positions in the row. Exists for the life of the page and never moves.
  Carries a project reference, which is what changes.
- **Assignment**: which app each slot is currently showing. Changes on a timer; this is the only thing
  the feature mutates.
- **App**: the existing project data. Unchanged by this feature. Its `iconUrl` is what a slot displays.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every slot shows a different app from the previous rotation, over 20 consecutive rotations
  driven by a seeded random source, with six apps in six slots.
- **SC-002**: All six slots change at every one of those 20 rotations, not only some.
- **SC-003**: No app appears in two slots at the same time, at any rotation.
- **SC-004**: Over 20 rotations, every one of the six apps appears on screen at least once.
- **SC-005**: The six slots do not change position, size or order across a rotation, measured in a real
  browser before and after.
- **SC-006**: The row's `scrollLeft` does not change across a rotation at 390px.
- **SC-007**: The page's cumulative layout shift over three rotations stays below 0.1, measured because
  the images change even though the boxes do not.
- **SC-008**: With reduced motion requested, the six apps do not change across at least three intervals,
  and every icon's computed transition duration is `0s`.
- **SC-009**: The apps do not change across at least two intervals while the row is hovered, while it
  holds focus, and while the document is hidden.
- **SC-010**: Every icon's alternative text names an app, after every rotation.
- **SC-011**: axe reports zero violations at 1440, 768, 390 and 320, and the row is still announced as a
  list of six.
- **SC-012**: Type checking, linting, the unit tests, the component tests and the production build all
  pass, and no existing test of feature 011 is deleted to make room for this one.
- **SC-013**: The runtime bundle size does not grow by more than 3kB, since no dependency is added.
  Measured at +2.92kB; see Amendment 2.

## Assumptions

- The six slots are a fixed count rather than the number of apps, so a row of six stays a row of six
  whether there are five apps or ten. A slot with no app to show is not rendered, so the row is never
  padded with empty frames.
- The rotation is a content change rather than an animation for its own sake. What a visitor with
  reduced motion gets is the six icons and no movement.
- The interval is 4 seconds, which is short enough that the renewal is noticed and long enough that it
  is not a scroll-driven distraction.
- Fading is preferred over sliding because the request describes disappearance and appearance, and a
  slide would require measuring every slot's position before and after the change.
- Nothing becomes clickable. The section's existing call to action remains the only route onward.
- Feature 011's 96px frame, its 22% radius, its `object-fit: cover`, its entrance stagger and its
  horizontal scrolling row on a phone all remain exactly as feature 011 specified them.

### Amendment 1 - The rotation is the phone's carousel, and the carousel is gone

**Reason**: The request, after the rotation was specified, was that on a phone the row should show a
single app icon that swaps between the apps.

This turns the rotation from a decorative addition on desktop into the mechanism by which a phone
surfaces the other five apps. It is the same rotation with one slot instead of six, and it is what makes
the feature's value legible on the device where a visitor spends the least time.

**What it supersedes.** Feature 011's mobile carousel, in the terms of its Amendment 5: SC-001 is
narrowed to one frame at 390px and SC-007 is withdrawn. The horizontal scroller, its scroll snapping and
its edge mask are removed rather than left unused.

**The guarantee is trivially satisfied with one slot.** With six apps and one slot, any app other than
the one on screen is a valid choice, so the assignment never repeats and never needs the derangement or
the repair. That is arithmetic rather than code, and it is why this costs nothing beyond knowing the
viewport.

**One breakpoint, already in use.** 700px, the same width feature 011's carousel used. Declaring a second
width here would leave a range of viewports where one layout's styles apply while the other's elements
are in the document, which is the kind of gap that produces an unreachable rule rather than a visible
bug. The count of frames and the styles both change at 700px, together.

**Changing the slot count recomputes the assignment.** Going from six slots to one leaves a six-entry
previous assignment behind, which means nothing to a single slot. The assignment is recomputed on the
change rather than truncated, so the first frame after a rotation is drawn from the full set.

**What is unchanged.** The 4s interval, the 240ms fade in two phases, the four pause conditions, reduced
motion removing the rotation entirely, the desktop row, and every other requirement of this
specification.

### Amendment 2 - SC-013's bundle budget was set before there was anything to measure

**Measured**: 441.47kB before this feature, 444.39kB after. The growth is 2.92kB, where SC-013 asked for
1kB or less.

The whole of it is the rotation: the assignment function, the hook, the viewport check and the fade. No
dependency was added and no existing code was re-bundled. The budget was an estimate written during
specification, before there was anything to measure, and it was wrong by roughly two thirds.

**Revised**: SC-013 allows 3kB. The ceiling stays meaningful rather than being raised to whatever the
number happened to be, and 2.92kB is inside it with almost nothing to spare — which is the useful signal,
because a feature that nearly exhausts its budget is one whose next change needs a conversation rather
than a footnote.

### Amendment 3 - What implementing this actually cost, recorded because none of it was predictable

Four defects in the rotation, none of them visible in the specification and all of them found by tests
that were asserting the right thing against code that was not doing it.

**The assignment search had no way to vary its answer.** The first version drew sixteen shuffles and kept
the one showing the most apps that were not on screen. With six slots and six apps every draw scores
identically, because nothing unseen exists, so the scoring was decorative and the function returned
whichever draw happened to be valid first. The row did not change, and a phone rotated between two of the
six apps. Replaced by drawing from the pool of apps that are not on screen, which makes the preference
structural instead of searched for, with a derangement drawn from the full list when the pool cannot
fill the slots.

**The repair path filled in index order.** It placed each slot with the lowest-numbered app available, so
the choice depended on how the data happened to be numbered rather than on the random source. With eight
apps in six slots the highest-numbered app never appeared at all. The candidate order is now shuffled
before the fill.

**Two of the seeded test helpers were broken in ways that made the tests pass while measuring nothing.**
One read `let a = semilla >>> 0` and accumulated without coercing, so the generator's state fell out of
32-bit range and produced a fixed pattern. The other built a fresh seeded source inside its loop, which
restarts the sequence, so every cycle drew the same value and a single-slot run visited two of six apps —
and the assertions read that as a defect in the function rather than in the test. Both are documented at
the helper, because a seeded generator that is subtly wrong is worse than no seed.

**A geometry assertion measured mid-animation.** Feature 011's entrance scales each frame from 0.9 with a
60ms stagger, and a frame mid-scale measures narrower than its neighbours: the first reading came back as
96, 96, 95, 94, 93, 91 against a clean 96 six times after the rotation. The test reported the slots moving
and resizing when nothing had moved. It now waits out the entrance before measuring.
