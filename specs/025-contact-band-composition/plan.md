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
| III. Testing | The E2E measures the rendered width. A stylesheet assertion would pass on a value that overflows. |
| IV. A11y & Performance | **The substance is a11y**: the heading stays first in the DOM, so the page's outline survives the rearrangement. |
| V. Design Principles | The band ends the page the way the Hero starts it. |
| VI. YAGNI | One media query, on the token, not on the component. |
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

**Below 768px the column is the full width and there is nothing to widen**, so the size has to step down.
The step is `clamp(1.375rem, 6.6vw, 1.625rem)`: 22px at 320, 25.7px at 390.

**One token carries both.** The component does not grow a media query of its own, so there is one place
where the address's size is decided (FR-003).

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

**And the two tests that assert `font-size: var(--text-display-email)` stay green without being touched**,
because they assert that the size comes from a token rather than what the token says. That is the right
abstraction and it survived the change; had they asserted the literal number, this feature would have
needed two rewrites instead of none.

## Testing

**Component** — the sentence comes from `siteConfig`; the heading is the band's only `h2` and first in
the DOM; the button is right-aligned; the description uses `--text-secondary`.

**E2E** — the address's font size equals the Hero's "Web Developer" line at 1440 and 768; the address
fits its column and renders on one line at five viewports; the networks sit left of the address and both
sit above the question.

**The E2E is the feature's real check.** Everything about this is widths, and a stylesheet assertion
would pass on a value that overflows.

## What this plan does not do

**It does not let the address wrap.** Every number above exists so that it does not have to. A wrapped
email address mid-domain is worse than a slightly smaller one.

**It does not detect a longer address.** The ceiling is arithmetic for twenty-four specific characters.
Changing the address silently invalidates it and nothing will report that.

**It does not touch the four other display tokens**, two of which other sections read.

**It does not change the band's height**, and the existing assertion that it is `100dvh` is untouched and
must keep passing.