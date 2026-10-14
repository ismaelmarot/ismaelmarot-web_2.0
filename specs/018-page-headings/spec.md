# Feature Specification: One Heading per Page

**Feature Branch**: `018-page-headings`

**Created**: 2026-10-14

**Status**: Implemented

**Input**: A finding, not a request. `specs/017`'s verification asked whether the accessibility audit
covers more than the landing page, and the answer exposed that four of the seven routes have no `<h1>`
at all. The audit reports zero violations because it only ever visits `/`, where the Hero's `<h1>` exists.

## The gap this specification fills

Measured in a real browser against the production build, not inferred from the source:

| Route | Headings today | Has `<h1>` |
|---|---|---|
| `/` | `h1 "Ismael Marot"`, then `h2` ×4 | Yes |
| `/about` | `h2 "Sobre mí"` | **No** |
| `/projects` | `h2 "Proyectos"`, `h3` ×6 | **No** |
| `/projects/1176188329` | `h1 "trash2treasure"`, `h2` ×2 | Yes |
| `/technologies` | `h2 "Tecnologías"`, `h3` ×4 | **No** |
| `/contact` | `h2 "Contacto"` | **No** |
| any unknown route | `h1 "404"` | Yes |

**Four of seven routes open with an `<h2>`.** The audit's tags are `wcag2aa`, `wcag21aa` and
`best-practice`, and `page-has-heading-one` is a `best-practice` rule. It has never fired because the only
route audited is the one route that happens to satisfy it.

**This is the second time the audit's silence has turned out to be silence rather than health**, and the
first is recorded in `specs/003`'s own history: a broken short-viewport fallback shipped for weeks with
every component test green. An audit that visits one page out of seven reports the health of one page.

## What this is deliberately not

**It is not a redesign.** No element changes position, size, colour or spacing. Every change is a tag
name in a styled-component's base or in an `as` prop.

**It is not a `VisuallyHidden` heading.** Adding a hidden `<h1>` to each page would satisfy the rule and
leave a screen-reader user hearing "Projects" twice on `/projects` — once from the hidden heading and once
from the section's own visible one. The existing `common/VisuallyHidden` component would have made this
easy and it would have been the wrong answer.

**It does not touch the landing page.** `/` already has one `<h1>` followed by four `<h2>`s, which is the
correct hierarchy and is left exactly as it is.

**It does not touch the project detail page or the 404.** `StyledDetailName` is already `styled.h1` and
the 404's is too.

## Why no configuration is needed

The obvious implementation is a `headingLevel` prop threaded from each page into its section. **It is not
needed, and adding it would be the unnecessary abstraction the constitution's Maintainability section
forbids.**

Each of the four sections is imported by exactly one file, and that file is the page for that route:

```
sections/About       -> pages/About/About.tsx        -> /about
sections/Contact     -> pages/Contact/Contact.tsx    -> /contact
sections/Projects    -> pages/Projects/Projects.tsx  -> /projects
sections/Technologies-> pages/Technologies/Technologies.tsx -> /technologies
```

The landing page does not import any of them. It builds its four bands from `SectionSummary`, which is a
different component and keeps its `<h2>`. So on the only route each of these sections renders on, **the
section is the page**, and its own heading is the page's `<h1>`. A prop would offer a choice that no
caller makes and no future caller should make.

`ProjectRow` and `Contributions` are the same case one level down: `ProjectRow` is imported only by
`sections/Projects`, and `Contributions` only by `sections/Technologies`.

## The cascade, which is the part that is easy to get wrong

Promoting `h2` to `h1` and stopping there would leave `/projects` and `/technologies` jumping from `h1` to
`h3`, which is its own violation under the same `best-practice` tag. The levels shift by one, everywhere,
on those two routes:

```
/projects       h1 "Proyectos"    h2 ×6 project names        (was h2, h3 ×6)
/technologies   h1 "Tecnologías"  h2 "Contribuciones…"       (was h2, h3)
                                h2 "Lenguajes"              (was h3)
                                h2 "Frameworks"             (was h3)
```

`/about` and `/contact` have nothing beneath their heading, so they are one change each.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate by heading as a screen-reader user does (Priority: P1)

A screen-reader user who lists the headings of any page gets one top-level heading and everything beneath
it in order. On `/projects` they meet "Projects", then each project. On `/technologies` they meet
"Technologies", then its categories.

**Why this priority**: This is the feature. A page that opens at `<h2>` gives a screen-reader user no
answer to "what am I on?" until they reach a heading that is already a subsection of nothing.

**Independent Test**: Load each route, list its `h1`, `h2`, `h3` in document order, and assert exactly one
`h1` and no skipped level.

**Acceptance Scenarios**:

1. **Given** `/about`, **When** its headings are listed, **Then** there is exactly one `h1` and it reads "Sobre mí".
2. **Given** `/projects`, **When** its headings are listed, **Then** there is exactly one `h1`, "Proyectos", followed by one `h2` per project.
3. **Given** `/technologies`, **When** its headings are listed, **Then** there is exactly one `h1`, "Tecnologías", and every category beneath it is an `h2`.
4. **Given** `/contact`, **When** its headings are listed, **Then** there is exactly one `h1` and it reads "Contacto".
5. **Given** `/`, **When** its headings are listed, **Then** there is still exactly one `h1` and four `h2`, unchanged.

---

### User Story 2 - Meet the same page as before (Priority: P1)

Nothing about the pages changes except the tag names. The About page still shows three stats, the projects
page still shows six in published order, the technologies still group by category and still show the
contribution calendar.

**Why this priority**: This is the risk in a change that touches seven components. A visitor must not be
able to tell.

**Independent Test**: Load each route before and after and compare the rendered text.

**Acceptance Scenarios**:

1. **Given** any route, **When** it renders, **Then** its visible text is byte-identical to before.
2. **Given** any route, **When** the CSS is compared, **Then** no declaration changes.
3. **Given** `/projects`, **When** a project name is selected in the accessibility tree, **Then** it still reads "Car Expense Tracker".

---

### User Story 3 - Have the audit able to see this (Priority: P1)

The accessibility audit visits all seven routes, so a heading defect on any of them is reported rather than
invisible. The audit's output names the route.

**Why this priority**: Fixing four routes and auditing one leaves the same hole open for the next route.
This is the part of `specs/017`'s finding that is about the tooling rather than the markup.

**Independent Test**: Remove an `<h1>` from any route and confirm the audit reports it.

**Acceptance Scenarios**:

1. **Given** the audit, **When** it runs, **Then** it visits every route rather than one.
2. **Given** a violation, **When** it is printed, **Then** the line names the route and the viewport it was found at.
3. **Given** a server request for a client-side route, **When** the audit's server receives it, **Then** it serves `index.html` rather than a 404, because a history-routed app has no file at that path.

---

### Edge Cases

- **A route with no headings at all.** None exists. The four sections each render one, and the two that
  already had an `h1` keep it.
- **The `as` prop disagreeing with the styled base.** Every one of these components sets `as="h2"` on a
  `styled.h2`, which is redundant. Both are changed together, because the `as` prop wins at runtime and
  changing only the base would be a change that does nothing. The redundancy is recorded here rather than
  cleaned up, because removing it is a separate concern from the heading level.
- **`Contributions` used outside `Technologies`.** It is not. Its title is `styled.h3` and becomes `h2`,
  which is correct on its only route.
- **A future section added to the landing page.** It renders through `SectionSummary` and gets an `h2` by
  that component's own markup, not by anything in this specification.
- **The project detail page's `<h1>`.** It is the project's name and stays. A project page that opened with
  a generic "Project" heading and then named the project at `h2` would be worse for a screen reader.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every route MUST render exactly one `<h1>`.
- **FR-002**: Heading levels MUST NOT skip: no route may go from `h1` to `h3`.
- **FR-003**: The landing page's heading structure MUST NOT change. One `h1` and four `h2`.
- **FR-004**: The project detail page's and the 404 page's `<h1>` MUST NOT change.
- **FR-005**: No heading text MUST change. `Sobre mí`, `Proyectos`, `Tecnologías`, `Contacto` and every
  project and category name stay as they are.
- **FR-006**: No CSS declaration, spacing value, colour or font size may change.
- **FR-007**: No component may gain a heading-level prop. The four sections are used on one route each
  and their heading is that route's `<h1>`.
- **FR-008**: Both the styled-components base tag and the redundant `as` prop MUST change together, since
  the `as` prop is what renders.
- **FR-009**: The accessibility audit MUST visit every route, not one, and MUST print the route with each
  violation.
- **FR-010**: The audit's server MUST serve `index.html` for a client-side route, because the built site is
  a history-routed app with no file at `/about`. Without this the audit would measure the 404 page seven
  times.
- **FR-011**: The audit MUST keep failing the build on any violation, and MUST keep its existing tags.
- **FR-012**: Every assertion that names a heading level must be updated to the new level. Nine exist
  across six files, and each asserts a level rather than content.
- **FR-013**: No new dependency. No new component.

### Key Entities

- **Route**: one URL and its page. Seven exist, and this specification is about the four that had no `<h1>`.
- **Heading level**: what this specification changes, and the only thing it changes.
- **Section**: the component that is the entire body of a standalone route, which is why its heading is
  that route's `<h1>` rather than a configurable one.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every route reports exactly one `h1`, measured in a browser across all seven.
- **SC-002**: No route reports a skipped heading level.
- **SC-003**: The landing page reports one `h1` and four `h2`, identical to before this change.
- **SC-004**: The rendered text of every route is identical to before.
- **SC-005**: The stylesheet produced by the build is identical to before, declaration for declaration.
- **SC-006**: The audit reports zero violations across all seven routes at four viewports.
- **SC-007**: Removing an `<h1>` from any route makes the audit fail with a non-zero exit code.
- **SC-008**: lint, typecheck, the unit tests, the component tests and the build pass.
- **SC-009**: axe reports zero violations at 1440, 768, 390 and 320 on every route.

### On what is and is not backed by these criteria

**SC-001 through SC-005 are measured, not asserted.** The heading inventory above was taken in Chromium
against the production build before this change, and `tests/e2e/routes.spec.ts` measures it again after.

**SC-006 and SC-009 are the same run** — the audit is the axe run — and they are the first time either is
claimed for more than the landing page.

**SC-007 is the criterion that proves the audit is able to fail.** An audit that reports zero violations
on a page it never visits looks exactly like one that reports zero violations on a page it visits. SC-007
distinguishes them by breaking a heading on purpose and watching the number move.

## Assumptions

- **A page's `<h1>` is that page's own name.** Not a generic word and not a hidden duplicate. The About
  page is "Sobre mí", the projects page is "Proyectos", and both were already saying so; they were saying
  it at the wrong level.
- **One `h1` per route, not per site.** The landing page and each standalone page each have their own.
- **The heading level is not a design decision.** Promoting a tag does not change a single pixel, so this
  is not the kind of change that needs visual review. It does need a screen-reader review, which SC-001
  stands in for.
- **`role="heading"` with `aria-level` is not used.** The native tags are correct here and would be more
  brittle to substitute.
- **The audit stays in the same process and on the same port.** Extending its route list does not change
  how it is started or what fails the build.

## Amendments

### Amendment 1 - The count was wrong the first time it was stated, and measuring found it

**Added by**: during implementation, 2026-10-14.

The finding that prompted this specification said **five** routes had no `<h1>`. Measuring said **four**.

The fifth was `/projects/:id`. The count came from grepping for `as="h1"` across `src/`, and
`StyledDetailName` in the project detail is declared `styled.h1` rather than `as="h1"` — it needed no
override, so the grep never saw it. The page did have an `<h1>`; the project name, correctly, and at the
correct weight for a page heading.

**This is recorded because the error is the kind that survives into a decision.** A five-route count would
have justified editing a component that was already correct, and the edit would have looked reasonable in
the diff. The measurement cost one browser run and it is what kept `StyledDetailName` untouched.

It is also the third time in this repository's recent history that a count taken from the source and a
count taken from the rendered page have disagreed — the other two are `specs/009`'s `goTo` defect, found
by moving the viewport rather than by reading the stylesheet, and `specs/015`'s Amendment 1, where a first
measurement reported no change because the thing being measured was never applied. The pattern is
consistent enough to be worth stating as a rule: **when the question is what the visitor gets, measure the
page.**