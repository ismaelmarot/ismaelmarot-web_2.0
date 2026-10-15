# Implementation Plan: The Navigation's Hover

**Branch**: `022-navigation-hover` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

## Summary

Two declarations. One line of CSS in the navigation's link hover, one token overridden in the header's
dark theme, and a comment rewritten to say why the thing it described is gone.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3
**Primary Dependencies**: styled-components 6.1. No additions (FR-009)
**Storage**: none
**Testing**: Vitest (component) and the browser, because a hover is not reachable from jsdom
**Target Platform**: Static site, GitHub Pages
**Performance Goals**: Unchanged. One custom property resolution at hover time
**Constraints**: The four existing accent tokens are untouched (FR-005); resting appearance, height and
dark-region detection are untouched (FR-006, FR-008)

## Constitution Check

*GATE: passed.*

| Principle | Compliance |
|---|---|
| I. Component-First | No new component. The link already exists; only its hover changes. |
| II. Type Safety | Nothing new is typed. |
| III. Testing | The colour is read from computed styles in a browser, because a hover cannot be rendered in jsdom, and the variable's disappearance is asserted against the source. |
| IV. A11y & Performance | **The substance of this feature is accessibility.** The two values are chosen so both reach AA against the surface they land on, which one value could not. |
| V. Design Principles | A hover that does not underline. The underline was a workaround, not a look. |
| VI. YAGNI | No new token. The dark blue is a literal inside a block that already holds five. |
| Styling | Two declarations. No new stylesheet, no new file. |
| Path Aliases | Unchanged. |
| Dependencies | `package.json` untouched. |

## The decision that makes the rest

**There is no single blue that works on both surfaces, and that is arithmetic rather than preference.**

The site has four accent tokens and all four were tuned against white. The site's own `#0071E3` misses
4.5:1 on black by 0.03. Every lighter blue that fixes black — `#0A84FF`, `#2997FF`, `#5AC8FA` — falls
below 4.5:1 on white, and `#5AC8FA` reaches 1.90:1 there.

So the behaviour is equal and the value is not. The navigation reads `--color-accent`; the light theme
leaves it at `#0071E3` and the dark theme overrides that one token to `#0A84FF`. **This is not a new idea
in the header's dark block**, which already overrides `--color-fg`, `--color-fg-muted`,
`--color-text-secondary`, `--color-text-primary`, `--color-accent-text`, `--color-accent-text-hover`,
`--color-bg-muted` and `--color-border`. It becomes the ninth token in a block that exists precisely so
that a component never has to know which theme it is in.

**The alternative — one blue in both — is a 4.47:1 contrast failure on every page load where the header
is over the landing page's black band.** It was considered and rejected, and the number is in the
specification rather than in a comment.

## Why the variable goes instead of being set to `none`

`--link-hover-decoration` exists in two places: the header's dark block sets it to `underline`, and the
navigation's hover reads it with a `none` default. Setting the override to `none` would leave both
declarations in place, and a variable that resolves to its own default everywhere is a variable with no
reason to exist. **Both are deleted**, and the test that asserted the override existed is rewritten to
assert the accent instead — the same slot in the same theme block.

## Why the comment is rewritten rather than deleted

The comment above the decoration explains why the underline existed. Deleting it leaves a reader who
later wonders why the dark theme overrides `--color-accent` with nothing to tell them that the underline
was once compensating for a hover colour that did not exist there. **A comment that only describes what
the code now does is the same as no comment**, and the reason a thing was removed is the half that is
useful a year later.

## Testing, and what it does not reach

**Component** — that the navigation's hover declaration contains the accent and no decoration variable,
and that the variable appears nowhere in `src`.

**Browser** — the two computed colours, one with the header over the black band and one with it over a
white section, and the computed `text-decoration-line` in both. A hover is a pointer state; jsdom has no
pointer and no computed cascade, so anything asserted there would be about the source rather than about
the link.

**Not measured**: how the change looks. No screenshot is compared and no description is offered beyond
the two colours and the absence of the underline.

## What this plan does not do

**It does not add a hover to the mobile menu**, which already turns the accent.

**It does not change the footer's navigation deliberately** — it changes because the component is shared,
and that is recorded in the specification rather than engineered around.

**It does not touch the four existing accent tokens.** They are correct where they are used, and
recolouring them to suit one component would move contrast under every other element that reads them.
