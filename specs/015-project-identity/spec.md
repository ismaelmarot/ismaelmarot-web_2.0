# Feature Specification: How a project is written and how its icon is seen

**Feature Branch**: `015-project-identity`

**Created**: 2026-10-11

**Status**: Implemented

**Input**: Two maintainer requests, delivered as `62466e0` and `73fcc31` and later found to have no
specification behind them. The first: "en cada proyecto, los nombres de los proyectos que tienen guion
escribelos bien, por ejemplo cash-counter debe decir Cash Counter, los que no tienen guion como
trash2treasure dejalos igual". The second: "en cada Proyecto, cada icono debe tener el shadow sutil que
venimos usando".

## The gap this specification fills

A project was written two different ways on the same page.

The name came out of `projects.json` as a repository name, which for two of the six apps is a slug:
`car-expense-tracker` and `cash-counter` were rendered into card titles and into the project detail
heading exactly as written, so a title read `cash-counter`. A title that reads as a filename is not a
title.

The icon went the other way. The home icon strip had carried a `0 1px 2px rgba(0, 0, 0, 0.04)` shadow
since it was built, while the project card's frame and the project detail's icon had none, so the same
six icons looked like two different sets depending on which page they appeared on.

This specification covers both, because they are the same question asked twice: how is a project
presented as a piece of work.

## What this is deliberately not

**The repository names do not change.** `projects.json` is untouched. `cash-counter` is still
`cash-counter` there, because that is its name on the forge and every link in the data points at it.

**Nothing that is not visible changes.** Every `alt` and every `aria-label` keeps the raw name. A
visitor using a screen reader is told `cash-counter` and `Icono de cash-counter`, not `Cash Counter`,
because the thing they may want to look up or type is the repository name.

**No URL, route or id is affected.** Routes are built from the numeric id and outbound links from the
`url` field. A display string that changed a route would be a different bug entirely.

**It is not a redesign of either card.** Card geometry, name size, line count and description are as
they were; this specification changed a string in one helper and one declaration in two stylesheets.

## The rule, and what makes it narrow

Two of the six names carry hyphens and four do not, and the four that do not are not lowercased by
accident:

| In `projects.json` | Rendered | Why |
|---|---|---|
| `car-expense-tracker` | Car Expense Tracker | has a hyphen |
| `cash-counter` | Cash Counter | has a hyphen |
| `trash2treasure` | trash2treasure | no hyphen; lowercase is the real name |
| `LinkIO` | LinkIO | no hyphen; the capitals are the name |
| `QEntry` | QEntry | no hyphen; capitals are the name |
| `NauticAcademy` | NauticAcademy | no hyphen; capitals are the name |

So the rule is not "capitalise the name". It is **"if the name carries a hyphen, write it as words"**,
and a general title-case is explicitly wrong here, because it would flatten `LinkIO` to `Linkio`,
`QEntry` to `Qentry` and `NauticAcademy` to `Nauticacademy`. The unit test asserts those three byte for
byte.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read a project name as a name (Priority: P1)

A visitor browses `/projects` and opens a project. Every name reads as a name. `Cash Counter` is two
words rather than a slug, `Car Expense Tracker` is three, and the four names that are already written
the way their authors wrote them are untouched. The text they read is the only thing that changed.

**Why this priority**: A slug in a heading is the defect. The shadow is a refinement; this is the one
that is wrong rather than merely plain.

**Independent Test**: Load `/projects` at 1440x900, read the six headings, and assert two of them are
written as words and four are byte-identical to `projects.json`. Then open a project and assert the
detail heading agrees with the card.

**Acceptance Scenarios**:

1. **Given** the six projects, **When** `/projects` renders, **Then** `cash-counter` reads `Cash Counter`
   and `car-expense-tracker` reads `Car Expense Tracker`.
2. **Given** the other four projects, **When** `/projects` renders, **Then** `trash2treasure`, `LinkIO`,
   `QEntry` and `NauticAcademy` render exactly as they appear in the data.
3. **Given** a project's detail page, **When** it renders, **Then** the heading and the sentence that
   says the project does not publish formal versions both use the written form.
4. **Given** a screen reader, **When** it reaches any project, **Then** the name it announces is the
   repository name, not the written form.

---

### User Story 2 - See the same icon the same way everywhere (Priority: P1)

A visitor sees a project's icon on `/projects` as a card, on the project's own page, and in the row of
icons on the home page. All three are the same image sitting on the same tile, with the same shadow,
the same 22% corner radius and the same background. An icon that fails to load leaves the same tile
behind rather than a bare glyph on the page.

**Why this priority**: The icon is the project's most recognisable asset and the site already spent
five specs on the frame that holds it. A shadow that differs by page undoes that without anyone
noticing, because nothing looks broken.

**Independent Test**: Load `/projects` and a project detail page, wait for fonts and images, and read the
computed `box-shadow` of both frames. Assert all three places resolve to
`rgba(0, 0, 0, 0.04) 0px 1px 2px 0px`, and assert the radii are 22% of each frame's width.

**Acceptance Scenarios**:

1. **Given** the home icon strip, **When** it renders, **Then** its tiles keep the shadow they have had
   since feature 011, unchanged by this feature.
2. **Given** a project card on `/projects`, **When** it renders, **Then** its 96px icon frame carries the
   same shadow as the strip's tiles.
3. **Given** a project detail page, **When** it renders, **Then** its icon carries the same shadow, on a
   frame rather than on the image box.
4. **Given** an icon that fails to load, **When** the placeholder appears, **Then** it occupies a tile
   with the same background, radius and shadow, not a gap.

---

### User Story 3 - Lose nothing on a small screen (Priority: P2)

A visitor on a phone reads the written names and sees the tiles. Writing `car-expense-tracker` as three
words makes the title longer, and a longer title could wrap to a third line and make one card taller
than its neighbours, which is the defect the carousel and dark-card specs each spent an amendment
preventing.

**Why this priority**: It is the measurable risk of User Story 1, and the specs that came before this
one record exactly this failure having happened more than once.

**Independent Test**: Load `/projects` at 320x640 and assert every card in the column measures the same
height, and that no card grew a row.

**Acceptance Scenarios**:

1. **Given** `/projects` at 320px, **When** it renders, **Then** every card measures the same height.
2. **Given** `/projects` at any supported viewport, **When** the names render written as words, **Then**
   the card heights are identical to before this feature.
3. **Given** a name long enough to wrap, **When** it does, **Then** it wraps within the reserved lines
   rather than pushing the card taller.

---

### Edge Cases

- **A leading or trailing hyphen.** `'-leading'` and `'trailing-'` are the inputs that decided the
  implementation. Without filtering empty segments they return `' Leading'` and `'Trailing '`, which
  render as text indented by a space. None of the six current names has one; a future repository could.
- **A name with no hyphen and no capitals**, such as `trash2treasure`. It is returned untouched, which is
  the whole point of the guard and the reason the test asserts it byte for byte.
- **A name that is already written**, such as `Test Project`, or one that is upper case, such as
  `UPPER-CASE`. The second becomes `UPPER CASE`, because it carries a hyphen; the first is returned
  untouched. The rule keys on the hyphen, not on whether the result would look better.
- **An empty string.** Returns empty, and does not throw.
- **An icon whose URL is empty or fails.** The card falls back to a placeholder that must keep the
  tile, which it did not before this feature.
- **An icon whose artwork has transparent corners.** The detail's icon box is square, so a shadow
  applied to the image itself would trace the rectangle rather than the icon. This is why the detail
  gained a frame.
- **A project added later with a hyphenated name.** It is formatted by the same rule with no code change.
  A project added with a hyphen at the start or end is covered by the edge case above.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A project name that contains a hyphen MUST be rendered with each hyphen replaced by a
  space and each resulting word's first letter capitalised.
- **FR-002**: A project name that contains no hyphen MUST be rendered exactly as stored, with no case
  change of any kind.
- **FR-003**: Empty segments produced by leading, trailing or repeated hyphens MUST be removed, so no
  leading, trailing or doubled space can appear in the rendered name.
- **FR-004**: `projects.json` MUST NOT be modified. The stored names are the repository names.
- **FR-005**: The written form MUST be used in exactly three places: the card title on `/projects`, the
  detail page heading, and the sentence on the detail page that states the project does not publish
  formal versions.
- **FR-006**: Every `alt` and every `aria-label` naming a project MUST continue to use the stored name.
  This covers the icon strips, the card's action labels, the category chips and the carousel dots.
- **FR-007**: The project's id, its URLs and its route MUST be unaffected by the rendered form.
- **FR-008**: The project icon's frame on `/projects` MUST carry `0 1px 2px rgba(0, 0, 0, 0.04)`, the
  value the home icon strip already used.
- **FR-009**: The project detail's icon MUST carry the same shadow.
- **FR-010**: The detail's shadow MUST be carried by a frame with a background and a 22% radius, not by
  the image element, because the artwork has transparent corners and a square image box would show a
  rectangle.
- **FR-011**: The detail's frame radius MUST be scaled from the card's rather than copied from it, so the
  two keep the same proportion: 21px at 96px and 16px at 72px.
- **FR-012**: The icon placeholder on `/projects` MUST carry the same background, radius and shadow as the
  frame it replaces, so a failed icon does not change the card's appearance.
- **FR-013**: No other value of `--shadow-xs` or any other shadow token may change. The shadow is a
  literal because the strip's value is not a token and introducing one would change the strip too.
- **FR-014**: Icon frame geometry MUST NOT change: 96px on the card, 80px below 520px, 72px in the
  detail, with the existing media query.
- **FR-015**: No new dependency, no new component, and no change to the typography scale.
- **FR-016**: The detail's image MUST keep filling its frame with `object-fit: cover`, as the card's
  does, rather than floating inside a square with transparent margins.

### Key Entities

- **Stored name**: the `name` field in `projects.json`, which is the repository name. Unchanged by this
  feature and the source of every accessible label.
- **Written name**: what a visitor reads. Derived from the stored name at render time by
  `formatProjectName`, and never persisted.
- **Frame**: the tile the icon sits on. Existed on the card and in the strip; this feature gives the
  detail one, so that the three places agree.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On `/projects`, two of the six headings read as words and four are byte-identical to
  `projects.json`, verified by reading the rendered headings.
- **SC-002**: `LinkIO`, `QEntry` and `NauticAcademy` render with their capitals intact, which is the
  condition that separates this rule from a title-case.
- **SC-003**: Removing the hyphen guard makes a unit test fail with `expected 'Trash2treasure' to be
  'trash2treasure'`. Recorded because a test that passes against a broken guard is not a test.
- **SC-004**: `formatProjectName('-leading')` returns `Leading` and `formatProjectName('trailing-')`
  returns `Trailing`, with no leading or trailing space.
- **SC-005**: Every `alt` and `aria-label` on the deployed site reads with the stored name. Verified in a
  browser during implementation against the live site.
- **SC-006**: The computed `box-shadow` of the card's icon frame, the detail's icon frame and the home
  strip's tile are each `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px`, measured in a browser.
- **SC-007**: The detail's frame radius is 16px at 72px against the card's 21px at 96px, both 22%.
- **SC-008**: Card heights at 320 and 1440 are 328px and 381px, identical before and after the change.
  `Car Expense Tracker` already wrapped to three lines at 320px while hyphenated and still does.
- **SC-009**: With an icon request aborted, the card placeholder measures 96px with the frame's
  background, radius and shadow, rather than a bare glyph.
- **SC-010**: Type checking, linting, the unit tests, the component tests and the production build all
  pass, and no existing test is deleted.
- **SC-011**: axe reports zero violations at 1440, 768, 390 and 320.

### On what these criteria are and are not backed by

**There is no browser test for either feature.** SC-001, SC-005, SC-006, SC-008 and SC-009 were
verified by measuring in a real browser during implementation, against the production build and then
against the deployed site, and those measurements are recorded in the two commits. They are not
automated, and no E2E file covers them today.

The reason to say so rather than leave it implicit is the one this repository has already been bitten
by: a component test that asserts a stylesheet contains a string passes whether or not anything renders,
and `specs/003-landing-home-page`'s band shipped a broken short-viewport fallback for weeks while
every component test was green. The tests that exist here are unit tests on the helper and component
tests on the CSS. They are worth having and they are not the same thing as SC-001 or SC-006.

## Assumptions

- **The written form is a display concern only.** It exists because a slug in a heading is not a title,
  and it is derived at render time so the data keeps saying what the repository is called.
- **Capitalisation in a repository name is deliberate.** `LinkIO`, `QEntry` and `NauticAcademy` are
  names, not lowercase strings that happen to lack hyphens, and the rule protects them rather than
  correcting them.
- **The strip's shadow value is the site's definition of "subtle".** It predates this feature and is
  what the request referred to, so the two new places match it exactly rather than approximately.
- **A literal rather than a token.** `--shadow-xs` is `0.1` and would read as grime on a 96px tile, and
  the strip's value is not a token, so introducing one for two of three call sites would make the third
  inconsistent for no gain.
- **The detail's icon needed a frame, not only a shadow.** This was measured rather than assumed: the
  artwork has transparent corners, and a shadow on the square image box traces the rectangle.
- **The card placeholder's tile was a latent defect.** Its comment claimed it was kept identical to the
  frame so a failed icon could not change the geometry, and measured, it had no background, no radius
  and no shadow. This feature makes the comment true rather than rewriting it.

### Amendment 1 - Two things that were wrong before they were specified, and one that hid a defect

This feature was implemented without a specification and documented afterwards. Three findings from the
implementation are recorded here, because each is a way the next feature can go wrong in the same way.

**A test that passed while measuring nothing.** `Projects.test.tsx` asserted the card heading read
`Car Expense Tracker` using a fixture whose `name` was already the hand-formatted string. The file would
have passed with `formatProjectName` deleted, because nothing in it ever exercised the function. Its
fixture now carries the raw names from `projects.json`, which is the case that did not exist before.
The generalisable point is that a fixture written in the shape the assertion expects cannot fail.

**A comment that stated a property the code did not have.** `StyledProjectIconFallback` was documented as
"kept identical to the frame so a failed icon never changes the card geometry". Measured, it had no
background, no radius and no shadow, so a broken icon dropped the tile and left a bare glyph on the card.
The fallback now carries the frame, which is what the comment already claimed. A comment asserting a
property is worth measuring at least once.

**The first measurement was a false negative.** The first attempt to measure whether the detail's shadow
would move the layout applied a font to a `<span>` that did not exist in the markup, and reported no
change at all: the string never reached a rendered element. The real measurement put the family on the
name itself and found the line growing 21px to 22px. The measurement was not wrong because the browser
misbehaved but because the thing being measured was never applied.

### Amendment 2 - What this feature did not cover, recorded so it is not assumed

The two commits this specification documents shipped without one, so the following shipped without one
too and remain undocumented: the project name formatting and the icon shadow were delivered in
`62466e0` and `73fcc31`; `95399f5`, which made the Contact page say the same thing as the home page, was
never considered for a specification either; and the browser environment cannot run Firefox at all, which
is recorded in `specs/014-playwrite-signature`'s Amendment 2 rather than repeated here.