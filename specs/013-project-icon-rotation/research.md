# Research: Rotating the project icon strip

**Feature**: `013-project-icon-rotation` | **Date**: 2026-10-08 | **Spec**: [spec.md](./spec.md)

Phase 0 of planning. Everything here was counted or measured.

## 1. The data

Six apps, six with icons, from `src/data/projects.json`. All six frames are 96x96 with a 21px radius,
which is feature 011's and is unchanged. The icons range from 192px to 1024px and one is 379x366, which
is why `object-fit: cover` exists and why it stays.

Six apps in six slots is the case that shapes this whole feature, and it is worth being precise about
why.

## 2. Why six apps in six slots is not a rotation in the usual sense

The request is that the icon in a slot disappears and another one appears. Taken literally, "appears"
means a different app than the one that was there. With six apps and six slots, **every app is already
on screen**, so there is nothing else that could appear.

That is not a bug to work around, it is the arithmetic of the case. Two readings are possible and they
behave differently:

| Reading | What a visitor sees | With 6 apps in 6 slots |
|---|---|---|
| Six apps rotate into six slots, drawing from the whole set | The set is always all six, so the *arrangement* changes | A rearrangement |
| Six slots, six apps, and a seventh that appears later | The set grows as apps are added | Nothing, until a 7th app exists |

The maintainer's answer to "what happens with the six I have today" was "rotate the six", and to "how
many change at a time" was "all six". Read together with "when more apps are added it will be better",
the intended behaviour is the first row with the second row as its future case: **every slot must show a
different app from the one it had, and with exactly six apps that means the arrangement is a
permutation.**

The specification therefore does not promise that a seventh app is needed before anything happens. It
promises that every slot changes, and that promise is what makes the feature visible today and keeps
working when the data grows.

## 3. The guarantee, and how much room there is for it

The hard guarantee, FR-003, is that no slot keeps the app it had. Over `total` apps in `total` slots
that is a **derangement**, a permutation with no fixed point.

Counted exactly:

| Apps | Derangements | Share of all permutations |
|---|---|---|
| 1 | 0 | 0% |
| 2 | 1 | 50% |
| 3 | 2 | 33% |
| 4 | 9 | 37.5% |
| 5 | 44 | 36.7% |
| 6 | **265** | 36.8% |

**265 of 720 for six apps.** The guarantee has comfortable room, so rejection sampling converges quickly
and a bounded retry loop terminates early with high probability.

**Total = 1 has zero derangements.** One icon cannot change to a different icon because there is no
other icon. This is a genuine degenerate case, not a rounding error, and it is FR-008: with one app, or
with no more apps than slots, the row does not rotate. A timer that fired anyway would re-render the
same single icon every four seconds for the life of the page.

## 4. What happens when there are more apps than slots

The interesting case is 7 apps in 6 slots, because it is the next one to arrive and it is where "every
slot changes" starts to cost something. Counted: **2119** assignments of 6 distinct apps from 7 in which
every slot differs from what it had.

So with 7 apps, all six slots still change. With more apps the count grows fast, so the guarantee is not
in danger as the data grows.

Where it does become impossible to satisfy *and* to prefer unseen apps: FR-006's preference for apps
that are not on screen is only achievable when `total - slots >= slots`, i.e. 12 apps in 6 slots. Below
that, at least some slots must show an app that was recently on screen. **That is why FR-006 is a
preference and FR-003 is the guarantee**: one is arithmetic, the other is a promise.

## 5. Slots, not a reorder

The single most consequential decision, and the one that makes this feature cheap.

The request could have been satisfied by permuting the array that renders the row. That was rejected, and
the reason is what it would cost:

- **The entrance stagger.** `StyledIconFrame` takes `$index` and computes `animation-delay: $index * 60ms`,
  which feature 011's SC-005 measures as `['0s', '0.06s', '0.12s', '0.18s', '0.24s', '0.3s']`. If the array
  were permuted, `$index` would be a different app's index on every rotation, so the delay would change
  on a running animation and the measured stagger would no longer be the stagger.
- **Node identity.** `tests/e2e/project-icon-strip.spec.ts:141` asserts `mismoNodo` — that returning to
  the section does not recreate the node. A permutation keyed by project id still preserves nodes, but the
  stagger problem alone is enough to decide it.
- **The phone carousel.** Below 700px the row is a horizontal scroller with `scroll-snap-type: x
  proximity` and a mask. Permuting the array changes what sits under the reader's finger at each scroll
  position. Keeping the DOM order fixed means the scroller's content and its snap points never move.

**Holding six fixed slots and changing only the assignment of apps to slots** makes all three concerns
disappear rather than needing a fix. `$index` becomes the slot index, which never changes. React updates
the `src` of an existing `<img>` in place. The scroller's geometry is untouched.

This is also what the request literally describes: the icon that is there disappears and another one
appears. A permutation is a different visible event.

## 6. Why a transition on opacity and not a second animation

`StyledIconFrame` already animates. The entrance is a keyframe on `opacity` and `transform`, held by
`animation-fill-mode: both`.

A rotation needs the same property to do a second, recurring job. Two `animation` values cannot coexist
on one element, and two keyframes on `opacity` would fight over the same declaration.

So the rotation uses a **transition** on `opacity` instead, driven by two state changes rather than by a
keyframe:

1. `opacidad` goes to 0. The transition runs for 240ms.
2. On a timer matching that duration, the assignment changes and `opacidad` returns to 1. The transition
   runs again.

A transition and an animation on different properties, or even on the same property at different times,
do not conflict. And the entrance finishes 800ms after the row arrives while the first rotation is 4s in,
so they do not even overlap in time.

**A timer rather than `transitionend`**: `transitionend` fires per property and per element, and a
cancelled transition fires `transitioncancel` instead, so the swap would need guarding. A timer matching
the duration is one timer per cycle, is cancelled on unmount with everything else, and cannot be left
hanging by a property that happened not to change.

## 7. The risk reduced motion introduces

Feature 011's SC-006 asserts that under reduced motion every frame has `transition-duration` of `0s`.
Adding `opacity` to the frame's transition is exactly the kind of change that would break it.

It does not, and the reason is that the reduced-motion block already declares `transition: none`:

```css
@media (prefers-reduced-motion: reduce) {
  animation: none;
  transform: none;
  transition: none;
}
```

`transition: none` zeroes every duration including the new one. The assertion holds without being
changed, which is the outcome to prefer over amending a criterion to fit a change. It is still asserted,
because "still holds" is worth knowing and worth catching if a later edit touches that block.

## 8. Layout shift

SC-007 measures cumulative layout shift, and feature 011 already measures it because six images are
added where there were none. Rotation adds a second source: the `src` of an image changes, twenty times
over a minute.

It should not shift anything, because the frame is a fixed 96x96 with `overflow: hidden` and the image is
`width: 100%; height: 100%`. An image whose source changes occupies the same box before and after. The
mask on the phone row and the scroll position are also untouched, because the slots do not move.

That is an argument, not a measurement. It is in the specification as a success criterion so the browser
measures it over three rotations rather than the implementation asserting it.

## 9. Alternatives rejected

| Alternative | Why not |
|---|---|
| Permute the rendered array | Breaks the entrance stagger, changes what sits under the finger in the phone scroller, and is not what the request describes |
| Reorder with FLIP sliding | The request says icons disappear and others appear. Sliding needs every slot's position measured before and after, and conflicts with the `transform: scale(1.06)` hover |
| Add the seventh app so something can appear | Inventing data to make a feature visible is the wrong direction. The feature is specified to work with six |
| Show five of six so one is always hidden | Hides a project permanently. The maintainer chose to rotate the six |
| Rotate by one position each time | Rejected by the maintainer in favour of all six changing at once |
| Random shuffle of apps into slots | The same thing as a permutation here, and it cannot guarantee no slot keeps its app without rejection sampling, which the derangement does |
| Reuse the technology marquee's pause control | That control was discussed and cancelled in feature 011, and it belongs to a different component |
