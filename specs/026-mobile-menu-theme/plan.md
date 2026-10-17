# Implementation Plan: The Mobile Menu Takes the Header's Theme

**Branch**: `026-mobile-menu-theme` | **Date**: 2026-10-16 | **Spec**: [spec.md](./spec.md)

## Summary

One shared fragment, one prop, three selectors. The header's nine overrides move out of the header's
styled component into `src/styles/theme.ts`; the menu reads them through a prop the header already holds;
and the interaction colour reaches hover, press and keyboard focus in both themes.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3
**Primary Dependencies**: none added (FR-010)
**Storage**: none
**Testing**: Vitest for the component, Playwright for the rendered colours — the whole feature is a claim
about two colours in two states
**Target Platform**: Static site, GitHub Pages
**Constraints**: the header's three treatments must not change (FR-009); the menu's portal target, its
focus behaviour and its motion must not change (FR-010)

## Constitution Check

*GATE: passed.*

| Principle | Compliance |
|---|---|
| I. Component-First | No new component. `MobileMenu` gains one boolean prop; its five files keep their roles. |
| II. Type Safety | `overDark: boolean`, passed to the styled component as the transient `$overDark`, mirroring how `Header.tsx:45` passes its own. |
| III. Testing | Component tests read the emitted CSS through `getCssForElement`, because jsdom cannot expand custom properties. The E2E measures computed styles, because a declaration assertion would pass on a value that is never painted. |
| IV. A11y & Performance | The substance. `:focus-visible` is one of the three interaction states because on iOS a tap does not match it; contrast is recomputed rather than assumed. |
| V. Design Principles | Same surfaces as the surface they sit under; no new motion, no new decoration. |
| VI. YAGNI | No third accent, no new token, no prop drilling past the one call site. |
| Styling | styled-components only. The shared fragment is a `css` fragment, not a new mechanism. |
| Shared Styling | `src/styles/theme.ts` is the shared styling module the constitution asks for. |
| Path Aliases | `@/styles/theme`, matching how `@/styles/tokens` is imported everywhere. |
| Dependencies | `package.json` untouched. |

## The reading mechanism was never broken

`src/styles/tokens.ts` holds no hexadecimal values for colour. Every entry is a `var(--…)` string —
`tokens.ts:12`, `:45`, `:48`. `MobileMenu.styles.ts:19` and `:95` already read exactly the properties
`Header.styles.ts:52-53` overrides.

**What fails is reach, not reading.** The portal at `Header.tsx:88-96` puts the panel under
`document.body`, outside the subtree. The repository says so in production at `Header.styles.ts:40-41`.

That is why the fix is a fragment and a prop, and not a colour table: the menu needs the same nine
properties, and it needs them to land somewhere they can cascade.

## One fragment, two consumers

`src/styles/theme.ts` exports one `css` fragment holding the nine overrides, plus
`--color-background: #000000`.

**Why `--color-background` joins them.** `StyledMobileMenu` already sets
`background-color: ${tokens.colors.background}` at `MobileMenu.styles.ts:19`. Adding the property to the
fragment makes that existing line resolve to black in the dark theme **without being edited**. Nothing
inside the header subtree consumes `--color-background`, so adding it there changes nothing the header
renders — which `Header.test.tsx:160-212` verifies by continuing to pass untouched.

**Why a shared fragment rather than a second copy.** Writing the nine values into `MobileMenu.styles.ts`
as well would satisfy the type checker and violate the constraint that colours are not duplicated. Two
copies of a palette are exactly the thing that drifts.

## The header comes out of this feature unchanged

The extraction is the only edit that touches a file the header owns, and it is the one change with the
power to alter the header by accident. Two things keep that from happening.

**The move is a relocation, not a rewrite.** The nine declarations at `Header.styles.ts:49-57` keep their
values and their order; `background-color: #000000`, `backdrop-filter: none` and `border-bottom: none`
stay in the header's own block, where they belong to its layout rather than to its palette.

**`--color-background` is inert inside the header.** Adding it to the fragment is what makes the menu's
existing `background-color` line resolve to black without being edited. Verified before writing this
plan: nothing in `Header.tsx`, `Header.styles.ts`, `Navigation.tsx` or `Navigation.styles.ts` reads
`--color-background` or `tokens.colors.background`, and none of the four dark-theme tests mentions it. The
header sets its own black literally at `Header.styles.ts:45`.

**The evidence is those four tests passing unedited.** They assert `background-color: rgb(0, 0, 0)`,
`--color-fg: #ffffff`, `--color-text-secondary: #ffffff` and `--color-accent: #0a84ff` through
`getCssForElement`. If the extraction changed what the header renders, one of them goes red. **T009 is
that gate, and it is written so that a change to a test would itself be the failure** — a test edited to
pass proves nothing, so the task is to run them, not to adapt them.

## Scope, stated as what will not be touched

| Not touched | Why |
|---|---|
| `src/styles/tokens.css` | The dark values are overrides, not tokens. Adding them to `:root` would give the whole page two themes |
| `src/styles/tokens.ts` | Its colours are `var(…)` strings already; there is nothing to add |
| `playwright.config.ts` | The five projects are the ones `specs/022` verified against |
| The portal target | Moving it inside the header subtree would put the menu inside the stacking context its `z-index` relies on |
| `useMobileMenu.ts` | Its focus trap is already broken and is out of scope; fixing it here would change behaviour, not colour |
| The header's three treatments | They are the reference this feature reads |

FR-010 is verified by what the commits do not contain. That is not a measurement and this plan does not
claim it is one.

## Why the prop, and why only this one

The header computes `overDark` from the `[data-header-contrast="dark"]` region's bottom edge against the
header's own height (`useHeader.ts:37-48`), and holds it in the same hook that owns `menuOpen`
(`useHeader.ts:9-10`). At `Header.tsx:36` it is already in scope when the button is pressed, and
`toggleMenu` does not touch it.

The header deliberately themed itself by custom property so that "no component has to know which theme
it is in" (`Header.styles.ts:32-33`). The portal makes that cascade impossible, so one boolean has to
cross the boundary. It is the only prop this feature adds, and it goes to the one component that needs it.

## The entrance animation, and why it loses its white veil

`menuSolidify` starts at `background-color: rgba(255, 255, 255, 0.55)` (`MobileMenu.styles.ts:37`). Over a
black panel **that white veil is the flash** the request asks to remove.

Reducing the alpha of a `var()` needs `color-mix()` or a new token; neither is worth it for a 360ms entry.
The start becomes `background-color: transparent` with `backdrop-filter: blur(18px)` unchanged.

It is theme-independent by construction — there is no colour left that can be wrong in one theme — and the
panel is opaque from the first painted frame that is not the blurred reveal. **This is a deliberate change
to the entrance, not a preservation of it**, and the blurred reveal is what remains of the original.

## Interaction states, and why there are three

`&:hover`, `&:active`, `&:focus-visible` all take `tokens.colors.accent`.

- `:focus-visible` alone would never fire on iOS, where a tap does not match it.
- `:active` alone would miss a pointer and would not answer a keyboard user.
- `:hover` alone is the only one that serves a pointer, and the stuck-hover risk that usually rules it out
  on touch does not apply here: `MobileMenu.tsx:58` closes the menu on navigation, so the element
  unmounts before the page comes back.

**The focus ring follows, and that is not a new rule.** `tokens.colors.focus` is
`'var(--color-accent)'` (`tokens.ts:63`), and `MobileMenu.styles.ts:74,119` draw the outline with it.
Forcing `--color-accent: #0a84ff` on the dark surface therefore moves the ring from `#0071E3` to
`#0a84ff` there, and leaves it at `#0071E3` on the light one. Both land above 4.5:1 on the surface they
are drawn on, which is the same pair `specs/022` measured. Recorded so that a keyboard user seeing the
ring change colour reads it as intended.

**Only two elements have that ring.** `Navigation.styles.ts` declares no `:focus-visible` rule and no
`outline` anywhere, so the navigation items the menu renders carry no ring — before this feature or
after. What they have is the `:focus-visible` colour this plan adds. That is enough for a keyboard user
to see where they are, and it is what T025 measures. Giving the items an outline would be a behaviour
change rather than a colour one, so it is not made here; `spec.md` records it rather than letting
SC-005 imply a ring that does not exist.

**The current-section treatment survives.** `Navigation.styles.ts:106` `&.active:hover` has specificity
(0,2,0) against (0,1,0) for the new selector list, so it still wins over the interaction colour.

## Two declarations of the same link

`Navigation.styles.ts:75-95` styles the items the menu renders. `MobileMenu.styles.ts:91-122` styles
only the call to action, which `MobileMenu.tsx:61` renders with it. Same resting colour, same hover, two
declarations. **Both change**, and a test asserts they agree rather than leaving that to inspection.

## Testing

**Component** — `MobileMenu.test.tsx` reads the emitted CSS with `getCssForElement`, the helper that
exists for exactly this (`src/test-utils/css.ts`). jsdom cannot resolve `var()`, so computed styles are not
available for custom properties in this codebase. The four dark-header tests at `Header.test.tsx:160-212`
must pass **unmodified**: they are the evidence that extracting the fragment changed nothing.

**End-to-end** — a new `tests/e2e/mobile-menu-theme.spec.ts`, modelled on `navigation-hover.spec.ts`,
including its `colorCerca` helper and the 12-per-channel tolerance WebKit requires. Both states are
produced by preparation, not by scroll while the menu is open:

| Case | Preparation | Header state |
|---|---|---|
| Dark | `/` at scroll 0 — the hero's 355px band covers the 52px navbar | black |
| Light | `/about` scrolled past 20px — no dark region and `isScrolled` | white |

The viewport is a phone width, because `useHeader.ts:61-79` only renders the button while `isCompact`.

**Neither `tests/e2e/keyboard.spec.ts:60` nor `useMobileMenu.ts` is changed.** The first opens the menu
behind an `if (await isVisible())` that lets it pass empty, and the second has a `menuRef` that is never
connected. Both are pre-existing and recorded in the specification as out of scope.

## What this plan does not do

- **It does not change the header's colours.** It moves nine declarations to a module both surfaces read.
- **It does not move the portal.** That would put the menu inside the stacking context its z-index relies on.
- **It does not fix the focus trap.** Pre-existing, unrelated to colour, recorded in the specification.
- **It does not introduce a third accent.** Two values, one behaviour, the pair `specs/022` measured.
- **It does not assert how the result looks.** No screenshot is compared, on either surface.
