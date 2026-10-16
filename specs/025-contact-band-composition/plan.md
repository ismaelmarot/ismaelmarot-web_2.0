# Implementation Plan: The Contact Band's Composition

**Branch**: `025-contact-band-composition` | **Date**: 2026-10-16 | **Spec**: [spec.md](./spec.md)

## Summary

One token, one grid, one paragraph. The address moves to the Hero's size, the networks move up beside
it, and a sentence appears under the question.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3
**Primary Dependencies**: none added (FR-016)
**Storage**: none
**Testing**: the browser, because the whole feature is a claim about widths
**Target Platform**: Static site, GitHub Pages
**Constraints**: four text tokens must not change (FR-014); the band keeps one heading and its height
(FR-008, FR-013)

## Constitution Check

*GATE: passed.*

| Principle | Compliance |
|---|---|
| I. Component-First | No new component. The band already owns every piece it renders. |
| II. Type Safety | `contactTagline: string` on `SiteConfig`, like `title` and `tagline`. |
| III. Testing | The E2E measures the rendered width. A stylesheet assertion would pass on a value that overflows — and the component test does assert the stylesheet, because it is the only assertion that can tell this token from the one it replaced. See Testing below. |
| IV. A11y & Performance | **The substance is a11y**: the heading stays first in the DOM, so the page's outline survives the rearrangement. |
| V. Design Principles | The band ends the page the way the Hero starts it. |
| VI. YAGNI | No breakpoint on the token at all, and none of its own in the component. |
| Styling | Two grid declarations changed in one file. |
| Path Aliases | Unchanged. |
| Dependencies | `package.json` untouched. |

## The decision the whole feature rests on

**The request was to make the address the size of the Hero's "Web Developer". Taken literally and applied
unchanged, it overflows at every viewport.**

`--text-display-project` is `clamp(2rem, 4vw, 3.5rem)`. Its floor is 32px, and the address measures 406px
at 32px. A 390px phone has 358px after the container's padding and a 320px phone has 288px.

**What made the request possible was the layout, not the size.** The old arrangement gave the address
half a row — 596px — because it shared with the question, and that is why `specs/021` capped it at 40px
and recorded that 44px overflowed by 3. The requested arrangement puts four 44px network marks beside it,
so `auto 1fr` leaves roughly 960px. At 960, 56px needs 711 and fits with room.

**Below the crossover the column is the full width and there is nothing to widen**, so the size has to
step down. It does so through the ramp rather than through a breakpoint: `--text-display-email` is
`clamp(1.125rem, 5.9vw, var(--text-display-project))`, which gives 23.0px at 390 and 18.9px at 320.

**One declaration carries all three.** The component grows no media query of its own, and neither does
the token: the ceiling is the Hero's token, so above the crossover the two are the same size by
construction rather than by a breakpoint that has to be kept in agreement (FR-003). This replaces the
original plan's `@media (max-width: 767px)` step of `clamp(1.375rem, 6.6vw, 1.625rem)`; see `spec.md`
Amendment 4.

## Where `order` earns its keep

**The drawing and the reading order disagree.** The drawing puts four social links at the top; the DOM
would then announce GitHub, LinkedIn, Instagram and an email address before saying what the section is.

`order` resolves it: the heading stays first in the DOM, the networks are raised into the top row by
CSS. One copy of the markup, so the desktop and mobile arrangements cannot drift apart (FR-009).

**The alternative — reordering the markup to match the drawing — is one line shorter and worse**, because
the page's outline starts with a list of platforms.

## What replaces the comment, and what that costs

`tokens.css` carried twenty-seven lines explaining why the address's ceiling was 40px, with a measured
table showing 44px overflowing a 596px column by 3px. **That arithmetic described the old arrangement and
is wrong for the new one.**

**The comment is replaced and the table becomes a test.** `tests/e2e/contact-band-layout.spec.ts` asserts
the address's bounding box is inside its column at 1440, 1024, 768, 390 and 320.

**This is a real trade.** A comment is a record of one measurement on one day. A test fails when the
number is wrong, which is strictly better — but the specific 44px-by-3px figure is gone, so it is
recorded in Amendment 2 of the spec instead of in a stylesheet where it would have kept being wrong.

## The token change is safe in a way worth checking

**`--text-display-email` has exactly one consumer**: `ContactBand.styles.ts`. Changing its value moves
nothing else.

**And the two tests that assert `font-size: var(--text-display-email)` stayed green while the ceiling
moved**, because they asserted that the size comes from a token rather than what the token says. That
was true of the change this plan originally described.

**It stopped being true of the change that replaced it.** `ContactBand.test.tsx` now pins the literal
clamp and asserts there is exactly one declaration of the token, so it did need rewriting. The reason
is in `spec.md` Amendment 4: whether the two rules and one token can be told apart at all depends on
the browser. In WebKit at 768 the scrollbar leaves the media query 760 and the E2E fails on 24px
against 32px; in Chromium it sees 768 and the E2E would have passed. An assertion that only one engine
can catch is not the one to hold the shape, and to hold the shape it has to name it.

## Testing

**Component** — the sentence comes from `siteConfig`; the heading is the band's only `h2` and first in
the DOM; the button is right-aligned; the description uses `--text-secondary`.

**E2E** — the address's font size equals the Hero's "Web Developer" line at 1440 and 768; the address
fits its column and renders on one line at five viewports; the networks sit left of the address and both
sit above the question.

**The E2E is the feature's real check on the outcome.** Everything about this is widths, and a
stylesheet assertion would pass on a value that overflows.

**It is only partly a check on the mechanism.** In WebKit at 768 it does catch the two-rule token,
because that engine's scrollbar makes the media query fire at 760. In the other four projects it would
not have. The component test is what holds the mechanism everywhere. The grid still has a breakpoint
of its own, at `ContactBand.styles.ts:102`, and `redesALaIzquierda` asserts against that one — a
different number from the 600 the size assertion uses, on purpose.
`spec.md` has the full account of all three: the 542.37px crossover that is derived arithmetic, the
600 that is chosen 58px above it so the assertion cannot break when a constant is retuned, and the
768 that belongs to the grid.

## What this plan does not do

**It does not let the address wrap.** Every number above exists so that it does not have to. A wrapped
email address mid-domain is worse than a slightly smaller one.

**It does not detect a longer address.** The ceiling is arithmetic for twenty-three specific characters.
Changing the address silently invalidates it and nothing will report that.

**It does not touch the four other display tokens**, two of which other sections read.

**It does not change the band's height**, and the existing assertion that it is `100dvh` is untouched and
must keep passing.

## What was verified against the shipped token

Run 2026-10-16, against the built `dist/`, after Amendment 4:

| Check | Result |
|---|---|
| lint · typecheck · build | pass |
| 151 unit · 470 component · 29 ContactBand | pass |
| E2E chromium · webkit · Mobile Chrome · Mobile Safari | 139/139 each, locally |
| E2E firefox | **0/139 locally — the browser will not start headless here** |
| a11y, 7 routes × 4 viewports | 0 violations |

**CI run 38918677044, on this commit.** Lint, TypeCheck, Tests, Build and Accessibility green. E2E
**red**: `Running 695 tests using 1 worker`, 691 passed, 3 failed, 1 flaky.

| | |
|---|---|
| Firefox | **ran, and passed.** 695 is 5 projects x 139, and Firefox is in no failure. The 139 tests this plan could not run locally are accounted for |
| The address vs the Hero at 768 | **passes in all five projects.** The same assertion failed in WebKit on the previous run of this branch — the defect this plan's token change removes |
| `hero-band.spec.ts:97`, 60% at 375x667 (expected 667, received 714) | fails in chromium and Mobile Chrome; flaky in webkit. **Pre-existing** — fails on the previous run too |
| `contact-band-layout.spec.ts:123`, tablet, networks left of the address | **fails in webkit, and this is in the feature's own suite.** Expected true, received false. Corrected in the working tree — the assertion was branching on the viewport instead of the width the CSS breakpoint sees — but unconfirmed, since CI has not run the correction |

Two figures this plan and the specification state were re-measured rather than derived: the Hero's
token resolves to 32.00px at 768 in both Chromium and WebKit, not the 31px the document originally
carried, and the address is 23 characters rather than twenty-four. The address→Hero equality boundary
is 542.37px, measured at 31.98px / 32.00px differing and 32.00px / 32.00px equal one pixel apart.

**The Firefox gap was local, and CI closed it.** Locally the browser will not start headless, and the
message it gives names the profile folder when the profile is not the cause: the binary answers
`--version`, an existing `-profile` directory fails identically, every headless configuration fails 0
of 3 while the same binary without headless starts 3 of 3, re-downloading changes nothing, and the
system Firefox 126.0 runs headless 3 of 3 on the same machine. CI runs Firefox and it passed.

**What is still open is this feature's own assertion in WebKit.** `redesALaIzquierda` asserted at 768
that the row has two grid columns, and `ContactBand.styles.ts:102` decides that with
`max-width: 767px`. macOS reports `clientWidth` 768 at that viewport, the rule does not match, and the
test passes. Linux CI's classic scrollbar consumes width, so the rule matches, the row collapses, and
the assertion is false.

**The cause is the test asking for the wrong number.** The assertion branched on `vp.width`, the
viewport Playwright was told to set, while the CSS branches on the width a media query sees. They are
equal on macOS and differ by 15px on Linux, which is why this passed locally and failed in CI — and it
is the same scrollbar mechanism as the type-side finding above, on the layout side.

**The layout does not move.** Two columns need 212 + 32 + 476 = 720 and a 753 clientWidth leaves 705
after padding, so stacking at that width is required rather than a defect. Forcing two columns would
overflow by 15px, which FR-004 forbids, and the only way to make it fit is to drop the separation from
32px to 16px for 1px of slack — a trade `tokens.css` already rejected once for the mobile step. So the
grid keeps its breakpoint and `medir()` now reports `anchoDisponible`, which the assertion branches on,
with an `else` that asserts the stacked case rather than nothing.

**This cannot be confirmed locally.** macOS has no classic scrollbar, so the old and the new assertion
behave identically there: the change is verified not to regress, not verified to fix CI. WebKit on Linux
is the only place it can be confirmed, and CI has not run it.

## Decisions in this plan that no longer describe the code

Recorded rather than deleted, because the reasoning they hold is still true and only the numbers moved.
See `spec.md` Amendment 4 for the measurements behind each.

- **The mobile step was a media query.** `clamp(1.375rem, 6.6vw, 1.625rem)` under
  `@media (max-width: 767px)`. Replaced by the ramp of a single `clamp`, which needs no breakpoint. The
  reasoning that survives is the one about two viewports having different room and the address having
  one length; the numbers do not.
- **The component tests would not have needed rewriting.** True of the ceiling change, not of the
  change that replaced it.
- **The mobile step's own arithmetic.** `1.375rem` is 22px and `6.6vw` is 25.7px at those viewports —
  these are the clamp's output, not measurements, and both numbers sit above the ceilings the rendered
  band actually has (19.5px at 320, 25px at 390). That gap is why the step was replaced.
