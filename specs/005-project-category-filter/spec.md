# Feature Specification: Projects List with Category Filtering

**Feature Branch**: `005-project-category-filter`

**Created**: 2026-10-02

**Status**: Implemented

**Input**: User description: "Quiero mejorar la sección Projects de mi portfolio. Los proyectos se obtienen desde GitHub, pero quiero agregar metadata editorial propia a cada proyecto: categories, viewport, platform. Las categorías son Social, Navigation, Finances, Tools, Work, Education. 'All' debe ser un filtro especial que representa todos los proyectos, no una categoría almacenada. La sección debe permitir filtrar los proyectos por categoría sin recargar la página. La metadata editorial debe mantenerse localmente en el portfolio y no depender de GitHub." Follow-up: "En proyectos debe estar arriba las categorias para seleccionar y debajo listadas las apps. El listado debe contener: (icono app) nombre (boton de ver) / categorias. [los botones de ver app y de repo] se pierden de la lista y pasan a la ficha de cada app."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the projects as a compact list (Priority: P1)

A visitor scanning the portfolio wants to see the whole body of work at once and recognise each project from its icon and name, instead of reading a wall of cards. Each project appears as one row showing its app icon, its name, a single action to open the project, and the categories it belongs to. Projects appear in the order the portfolio owner publishes them.

**Why this priority**: This is the layout the portfolio owner asked for and the surface every other decision builds on. It replaces the current card grid, so it must land first.

**Independent Test**: Load the Projects section and verify one row per project, each with its icon, its name, its categories and a working action, in the published order.

**Acceptance Scenarios**:

1. **Given** the Projects section is displayed, **When** the visitor looks at the list, **Then** each project occupies a single row showing its icon, its name, its description and an action to open the project
2. **Given** a project belongs to several categories, **When** its row is displayed, **Then** all of its categories appear beneath its description
3. **Given** the section is displayed, **When** the visitor selects the action on a project, **Then** they are taken to that project's own page
4. **Given** several projects are displayed, **When** the visitor reads the list, **Then** the order matches the order in which the projects are published by the portfolio owner
5. **Given** the section is displayed, **When** a project has no icon, **Then** the row shows a placeholder in the icon's place without changing the row's alignment

---

### User Story 2 - Narrow the list to a category (Priority: P1)

A visitor looking for a particular kind of work (for example, only their finance tools, or only educational apps) does not want to scroll past everything else. The category selector sits above the list, and choosing a category immediately reduces the list to the matching projects. Choosing "All" brings the complete list back.

**Why this priority**: It is the reason the curated categories exist. Without it the curation is invisible to visitors.

**Independent Test**: Load the Projects section, select a category, and verify only the projects belonging to that category remain, that "All" restores the full list, and that the page never reloads.

**Acceptance Scenarios**:

1. **Given** the Projects section shows every project, **When** a visitor selects the "Finances" category, **Then** only the projects tagged with Finances are displayed
2. **Given** a category filter is active, **When** the visitor selects "All", **Then** every project is displayed again, exactly as before the filter was applied
3. **Given** a category filter is active, **When** the visitor selects a different category, **Then** the previously displayed projects are replaced by the newly matching ones, with no moment where both sets are shown
4. **Given** any category is selected, **When** the visitor interacts with the page, **Then** the page does not reload and the visitor's scroll position and language selection are preserved
5. **Given** the section is displayed, **When** the visitor looks at the category control, **Then** one option is offered for each of the six categories plus the "All" option, presented in English, and the active option is visibly and programmatically identifiable as active

---

### User Story 3 - Keep the list usable when metadata is missing (Priority: P2)

New work appears in the profile README before it has been curated, and not every category is guaranteed to have projects. The list must stay coherent either way: an uncategorised project still appears, and a category that matches nothing says so instead of showing an empty area.

**Why this priority**: The portfolio keeps syncing new projects, so uncategorised entries are the normal case over time rather than an exception.

**Independent Test**: Display a project with no curated metadata, and select a category that no project belongs to, and verify the section stays usable and explains the empty result.

**Acceptance Scenarios**:

1. **Given** a published project without curated metadata, **When** the Projects section is displayed, **Then** the project is still listed and shows no category rather than broken or misleading information
2. **Given** a category that no project belongs to, **When** the visitor selects it, **Then** the section shows a message explaining there are no projects in that category, instead of an empty area
3. **Given** a project without curated metadata, **When** the visitor selects any specific category, **Then** that project is not shown, because it belongs to no category
4. **Given** the curated metadata fails to load or is unreadable, **When** the Projects section is displayed, **Then** every project is still listed and the section remains fully usable

---

### Edge Cases

- A project belongs to several categories (four of the six published projects do): it must appear in each of its categories, never duplicated within one category.
- The visitor selects the category that is already active: nothing changes and no errors occur.
- Curated metadata refers to a project that is no longer published: the entry is ignored and nothing orphan appears in the interface.
- Curated metadata refers to a project that was never published: the entry is ignored.
- A published project has no curated metadata yet.
- The owner publishes a new project and has not curated it yet.
- The set of categories changes in a future release: projects carrying a retired category behave as uncategorised projects rather than disappearing.
- The visitor uses only the keyboard: the category control and the per-row action are fully operable without a pointer.
- The visitor has enabled reduced motion: changing the filter does not animate.
- The visitor reloads the page while a category is active: the filter returns to "All".
- A very long project name at narrow widths: the row stays legible and its action stays reachable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Projects section MUST present the projects as a single-column list of rows
- **FR-002**: Each row MUST show the project's icon, its name, its description, an action to open the project, and the categories the project belongs to
- **FR-003**: Selecting a row's action MUST take the visitor to that project's own page
- **FR-004**: The complete list and every filtered list MUST preserve the order in which the portfolio owner publishes the projects
- **FR-005**: A project with no icon MUST still occupy an aligned row, using a placeholder in the icon's place
- **FR-006**: The system MUST offer a category selector above the list, offering exactly these six categories: Social, Navigation, Finances, Tools, Work and Education
- **FR-007**: The category selector MUST offer an "All" option
- **FR-008**: "All" MUST NOT be stored as a category of any project; it represents the complete set of projects
- **FR-009**: Selecting a category MUST display only the projects that belong to at least that one category
- **FR-010**: Selecting "All" MUST display every project, regardless of whether it has curated metadata
- **FR-011**: Changing the category selection MUST NOT reload the page
- **FR-012**: The active category MUST always be "All" when the page is first displayed or reloaded, and the selection MUST NOT be written to the address bar
- **FR-013**: The category selector MUST be operable with the keyboard alone, and the active option MUST be programmatically identifiable as active for assistive technologies
- **FR-014**: Category labels MUST be presented in English
- **FR-015**: Each curated project MUST be able to declare one or more categories, one or more viewports and one or more platforms
- **FR-016**: The supported values for a project's viewport are desktop, tablet and mobile
- **FR-017**: The supported values for a project's platform are web, mac and pc
- **FR-018**: Curated project metadata MUST be maintained by the portfolio owner in a single place inside the portfolio and MUST NOT be read from GitHub
- **FR-019**: The set of listed projects MUST remain identical whether the curated metadata is present, absent or unreadable, so a missing or unreadable metadata never removes a project from the complete list
- **FR-020**: A project that belongs to no category MUST NOT appear when a specific category is selected
- **FR-021**: A project belonging to several categories MUST appear exactly once within each of those categories
- **FR-022**: Selecting a category that no project belongs to MUST present an explanatory message rather than an empty area
- **FR-023**: Curated metadata MUST remain attached to the correct project across rebuilds and regardless of changes to that repository's name, description, statistics or presentation
- **FR-024**: The portfolio MUST NOT treat any project as featured, and MUST NOT present a different layout or ordering for a subset of projects
- **FR-025**: The list and the category selector MUST remain usable and legible at mobile, tablet and desktop sizes, and MUST respect reduced-motion preferences

### Key Entities

- **Project**: A published repository shown as a row, with its GitHub-derived details (name, description, links, icon) and, when curated, its editorial metadata
- **Project Category**: One of the six values Social, Navigation, Finances, Tools, Work, Education. Belongs to the portfolio, not to the repository
- **Curated Metadata**: The portfolio owner's own editorial information about a project: its categories, supported viewports and target platforms
- **Category Selector**: The control placed above the list that offers "All" and the six categories and determines which projects are listed

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can narrow the list down to a single category in one interaction, with the result appearing immediately and without the page reloading
- **SC-002**: Every curated project shows all of its categories beneath its name in its row
- **SC-003**: Selecting "All" restores the complete list exactly, with no project lost or duplicated
- **SC-004**: 100% of the interactive elements in the list and the category selector are reachable and operable using only the keyboard, and the active category is announced as active
- **SC-005**: Selecting a category with no matching projects produces an explanatory message in 100% of cases, never a blank area
- **SC-006**: A published project with no curated metadata is still listed when "All" is selected in 100% of cases
- **SC-007**: Curated metadata for all six published projects survives a full rebuild of the portfolio data with no manual correction
- **SC-008**: The list and the category selector are operable and legible at 320px, 768px and 1024px viewport widths with no loss of function
- **SC-009**: No project appears in a different position depending on the selected category
- **SC-010**: The Projects section introduces no regression in accessibility conformance or in page load performance compared with its current state

## Out of Scope for This Feature

- The project detail page and everything it shows beyond the name: screenshots, viewport and platform icons, description, technologies and version history belong to the project detail feature
- Persisting the visitor's chosen category between visits or in the address bar
- Letting visitors or any visitor-facing action edit the curated metadata

## Assumptions

- The set of projects listed is decided by the projects published in the GitHub profile README, and the six projects the owner listed for curation are exactly the ones currently published there, so every listed project has curated metadata at launch.
- When a project is published in the profile README but has not yet been curated, it is still listed under "All" without categories rather than being hidden, so newly published work is never silently missing from the portfolio.
- Projects continue to be sourced from GitHub exactly as they are today, and the curated metadata is an addition layered on top of that data rather than a replacement for it.
- Curated metadata is authored and maintained solely by the portfolio owner, in one file, as new apps are created.
- A project can belong to any number of categories, including none.
- The categories are a fixed, closed set for this release; adding a category is a content change, not a visitor-facing action.
- The row's action opens the project detail page delivered by the following feature; until that feature exists the action leads to the project's repository, and the change is confined to that one destination.
- Removing the featured treatment removes the only project-level visual distinction, so every row carries identical structure.
- The row also carries the project's description, so the information the previous cards showed is not lost when the list replaces them.
- No data is collected about visitors and no accounts, tracking or saved preferences are involved.