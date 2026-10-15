# Feature Specification: The Navigation's Hover

**Feature Branch**: `022-navigation-hover`

**Created**: 2026-10-15

**Status**: Implemented

**Input**: A maintainer report on the navigation: *"cuando está en fondo negro, los links se
subrayan. no quiero que ocurra eso. deben reaccionar igual que cuando tienen el fondo en blanco. sin
subrayado al hacer hover. y sí se deben poner en azul."*

## The gap this specification fills

The navigation's hover is the only thing about the header that behaves differently depending on what is
behind it, and the difference was deliberate. `Navigation.styles.ts` said:

> Defaults to none, so the light theme is untouched. The header sets it to underline only while it is
> over a dark region, **where every colour is white and the colour hover has nothing to move to**.

The reasoning was sound at the time. The hover colour is `--color-text-primary`, and the header's dark
theme overrides that token to `#ffffff`, so a hovered link was white on black: **no visible change at
all**. An underline was the only affordance left.

**The premise no longer holds once the hover moves to a colour that the dark theme does not override.**
The underline was a workaround for a missing hover colour, and the fix is the hover colour.

## What this is deliberately not

**It does not add or remove a hover to the mobile menu.** That one already turns `--color-accent` and is
untouched.

**It does not remove the header's dark theme.** It keeps its black background, its white text, its blur
and its dark-region detection, and it gains one more overridden token.

**It does not touch the navigation's markup, its items, or the header's height.** One declaration changes
in one file and one token is overridden in another.

## The colour is two values, and that is forced

**No single blue in this repository passes WCAG AA on both a white header and a black one.** Measured:

| token | on black | on white |
|---|---|---|
| `--color-accent` `#0071E3` | **4.47:1** ✗ | 4.70:1 ✓ |
| `--color-accent-hover` `#0062C4` | 3.54:1 ✗ | 5.93:1 ✓ |
| `--color-accent-text` `#0062C4` | 3.54:1 ✗ | 5.93:1 ✓ |
| `--color-accent-text-hover` `#0059B0` | 3.06:1 ✗ | 6.87:1 ✓ |

Every accent in the system was tuned against a white background. The site's own blue is **0.03 short** of
4.5:1 on black, and the darker ones are worse.

Nor is there a lighter blue that fixes it, because a blue light enough for black is too light for white:

| candidate | on black | on white |
|---|---|---|
| `#0071E3` | 4.47:1 ✗ | 4.70:1 ✓ |
| `#0A84FF` | **5.76:1** ✓ | 3.65:1 ✗ |
| `#2997FF` | 6.96:1 ✓ | 3.02:1 ✗ |
| `#5AC8FA` | 11.08:1 ✓ | 1.90:1 ✗ |

**So the behaviour is identical and the value is not**: the light header's hover is `--color-accent`
unchanged, and the dark header's overrides that one token to `#0A84FF`, Apple's system blue for dark
surfaces. That is the arrangement the header's dark theme already uses for five other tokens, so it adds
no new idea to this file — it follows one.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See where the pointer is, whichever header is behind (Priority: P1)

A visitor moves the pointer over a navigation link. The link changes colour and nothing else. This is the
same whether the header is over the landing page's black band or over a white section further down.

**Why this priority**: This is the request. Two states behaving differently is the defect.

**Independent Test**: Load `/`, hover a link with the header over the black band and again with the
header over a white band, and read the computed colour and `text-decoration` in both.

**Acceptance Scenarios**:

1. **Given** the header over the black band, **When** a navigation link is hovered, **Then** it turns blue and no underline appears.
2. **Given** the header over a white section, **When** a navigation link is hovered, **Then** it turns blue and no underline appears.
3. **Given** either header, **When** the pointer leaves the link, **Then** the link returns to its resting colour.
4. **Given** either header, **When** the link is not hovered, **Then** its resting appearance is unchanged from before this feature.

---

### User Story 2 - Read the link under any header (Priority: P1)

A visitor who cannot distinguish a colour change — a screen reader, a monochrome display, a visitor who
has not noticed the pointer — can still tell which link they are on, or can accept that they cannot and
find the page by the header's own contrast instead.

**Why this priority**: Removing an affordance is only safe if what replaces it is genuinely available, and
that has to be stated rather than assumed.

**Independent Test**: Read the computed contrast of the hovered link against its header in both states.

**Acceptance Scenarios**:

1. **Given** the hovered link on the black header, **Then** its contrast against `#000000` is at least 4.5:1.
2. **Given** the hovered link on the white header, **Then** its contrast against `#FFFFFF` is at least 4.5:1.
3. **Given** a keyboard user, **When** they tab to a navigation link, **Then** the link has a visible focus indicator, which this feature does not touch.

---

### User Story 3 - Find the same hover everywhere the navigation appears (Priority: P2)

The header, the mobile menu and the footer all use the same link. They behave the same way.

**Why this priority**: It is a consequence of sharing one component rather than a feature of its own,
and a reader who hovers a footer link should not meet a third behaviour.

**Acceptance Scenarios**:

1. **Given** the footer navigation, **When** a link is hovered, **Then** it turns blue and is not underlined.
2. **Given** the mobile menu, **When** a link is hovered, **Then** it is unchanged, because it already turned blue before this feature.

---

### Edge Cases

- **A browser that does not recompute custom properties on hover.** The hover colour is a `var()`
   reference, resolved at hover time, so it follows the theme in force at that moment rather than the one
   the page loaded with.
- **The header over the black band at the very top of the page.** This is where `$overDark` is true and is
   the state the request describes.
- **The header over the black band part-way down.** `useHeader` keeps the dark theme while the region's
   bottom edge is below the header's, and this feature inherits that. Nothing here changes the detection.
- **The footer variant.** It shares the hover, so it turns blue too. Recorded rather than prevented.
- **`--color-accent-text` in the dark theme.** The header already overrides it to white for other
   elements. This feature does not touch it: the navigation reads `--color-accent`, and overriding that one
   token is enough.
- **Forced colours mode.** A visited link may be overridden by the user agent. Nothing here prevents
   that and none is added.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A navigation link's hover MUST change its colour and MUST NOT change its text decoration.
- **FR-002**: The hover colour MUST be `--color-accent`.
- **FR-003**: `text-decoration` MUST be `none` on hover in every theme. The `--link-hover-decoration`
  variable MUST be removed from the header's dark theme, and the hover declaration that read it MUST be
  removed from the navigation.
- **FR-004**: The header's dark theme MUST override `--color-accent` to a value whose contrast against
  `#000000` is at least 4.5:1.
- **FR-005**: No change may be made to `--color-accent`, `--color-accent-hover`, `--color-accent-text` or
  `--color-accent-text-hover`. They are used elsewhere in the system and they are correct for white.
- **FR-006**: The link's resting colour, size, weight and the header's height MUST NOT change.
- **FR-007**: The mobile menu's hover MUST NOT change. It already uses the accent.
- **FR-008**: The header's dark-region detection, its black background, its blur and its border MUST NOT
  change.
- **FR-009**: No new dependency and no new token.
- **FR-010**: The comment that justified the underline MUST be rewritten rather than deleted, because it
  records the reason the underline existed and the reason it no longer does.

### Key Entities

- **Hover**: the link's change of appearance under the pointer or keyboard focus. One colour change and
  no decoration, in both themes.
- **Accent**: `--color-accent`, one token whose value the dark theme overrides. This is the only lever.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A hovered navigation link's computed `text-decoration-line` is `none` with the header over
  the black band.
- **SC-002**: The same with the header over a white section.
- **SC-003**: The hovered link's computed colour over the black header is `#0a84ff`.
- **SC-004**: The hovered link's computed colour over the white header is `rgb(0, 113, 227)`.
- **SC-005**: `#0a84ff` against `#000000` is at least 4.5:1. Measured: 5.76:1.
- **SC-006**: `#0071E3` against `#FFFFFF` is at least 4.5:1. Measured: 4.70:1.
- **SC-007**: `--link-hover-decoration` appears nowhere in the repository's source.
- **SC-008**: The navigation's resting computed colour is unchanged from before this feature.
- **SC-009**: axe reports zero violations at 1440, 768, 390 and 320 on every route.
- **SC-010**: Lint, type checking, the unit tests, the component tests and the build pass, and no
  existing assertion is deleted.

### On what is and is not backed by these criteria

**SC-001 to SC-004 are measured in a browser**, because the hover state is not reachable from jsdom and
because "which header is behind the pointer" is a scroll-position question that only a rendered page
answers.

**SC-005 and SC-006 are arithmetic on two colours** and are recorded in this document.

**SC-009 and SC-010 are the repository's own audit and its own suites.**

**Nothing here is asserted about how the change looks.** No screenshot is compared and no visual
description is offered beyond the two measured colours.

## Assumptions

- **"Reaccionar igual" means the same behaviour, not the same number.** Two blues rather than one, because
  one blue cannot reach AA on both surfaces. The request asked for the reactions to be equal and that is
  what this delivers.
- **The footer's navigation is part of "the navigation".** It shares the component, so it shares the
  hover. Recorded rather than prevented, and separable if the maintainer wants it.
- **The underline was a workaround and not an affordance of its own.** Nothing on the site links it, no
  test asked for it beyond the one that asserted the variable existed, and the comment that introduced it
  explains it as the only thing left once colour stopped being available.
- **`#0A84FF` rather than a computed value.** It is Apple's system blue for dark surfaces, it is a
  literal like the five other overrides in that block, and it is measured rather than eyeballed.

## Amendments

### Amendment 1 - The justification for the underline is now false, and it is kept rather than deleted

**Added by**: during implementation, 2026-10-15.

The comment above `text-decoration` in `Navigation.styles.ts` explained the underline as the only
affordance available because, on a dark header, "every colour is white and the colour hover has nothing
to move to".

**That sentence stops being true the moment the hover colour is one the dark theme does not override.**
The comment is rewritten rather than deleted, because a reader who later asks "why does the dark header
override `--color-accent`?" needs both halves: what the underline was for, and why it is no longer
needed. A comment that only says what the code now does is the same as no comment.

**`Header.test.tsx` asserted the variable existed**, which is how this was noticed: a test named for the
dark theme's full treatment was checking one declaration that this feature deletes. It is updated to
assert the accent override instead, which is the same slot in the same theme.
