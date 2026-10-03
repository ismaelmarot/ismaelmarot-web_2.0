# Feature Specification: Project Detail Page

**Feature Branch**: `006-project-detail`

**Created**: 2026-10-02

**Status**: Implemented

**Input**: User description: "el boton de link debe ser (view) e ir a una vista con el siguiente formato: (boton de volver) (boton de compartir) / (icono de la app) NOMBRE / Categorias, / --- (iconos de las plataformas) Descripcion / Link al repositorio web / link a la app web o descarga / --- INFORMACION / Categorias Lenguajes Size (lsita de categorias) (lenguajes) (el tamano sacado de github) / (iconos de viewportes soportados)". Follow-up: "Maximo 6 capturas", "tamano de la app, si no se puede, por en de git", and Version History limited to the projects that actually publish releases.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand what an app is before leaving the portfolio (Priority: P1)

A visitor who picked an app from the list opens its own page and gets the full picture in one place: its icon and name, what it is categorised as, which devices it runs on, what it does, where its code lives, and where to actually use or download it. Nothing important requires leaving the portfolio except the two outbound links.

**Why this priority**: This is the whole reason the page exists. The list deliberately shows only a name and a description, so this page carries the rest of the information.

**Independent Test**: Open a project's page and verify the name, icon, categories, platform icons, description, repository link, app-or-download link, screenshots and the information block all match the project's data.

**Acceptance Scenarios**:

1. **Given** a visitor selects "Ver proyecto" on a project, **When** the page opens, **Then** it shows the app icon, the project name and the project's categories
2. **Given** a project targets one or more platforms, **When** its page is displayed, **Then** each platform is indicated with its own icon
3. **Given** a project has a description, **When** its page is displayed, **Then** the full description is readable rather than truncated
4. **Given** any project, **When** its page is displayed, **Then** a link to the repository is offered and a link to the app or its download is offered
5. **Given** a visitor opens the page directly from a link or a reload, **When** it loads, **Then** the same project is shown rather than an error

---

### User Story 2 - Judge fit before downloading (Priority: P2)

Before committing to an app, a visitor wants to see it and to know whether it will run on their device. The page therefore carries up to six screenshots of the app and an explicit statement of the viewports it supports, so a desktop-only utility can be recognised as such without installing anything.

**Why this priority**: It is the difference between "I know the app exists" and "I know whether it is for me". It costs visitors nothing to add and prevents wasted downloads.

**Independent Test**: Open a project that publishes screenshots and one that does not, and verify the gallery shows at most six images in the first case and is absent in the second, and that the supported viewports are always stated.

**Acceptance Scenarios**:

1. **Given** a project publishes screenshots, **When** its page is displayed, **Then** up to six screenshots are shown
2. **Given** a project publishes more than six screenshots, **When** its page is displayed, **Then** only six are shown and the rest are not loaded
3. **Given** a project has no screenshots, **When** its page is displayed, **Then** no empty gallery area is shown
4. **Given** any project, **When** its page is displayed, **Then** every viewport the project supports is indicated with its own icon, and the same holds for the platforms

---

### User Story 3 - Find the facts and get back out (Priority: P3)

A visitor who wants the specifics can see the project's categories, its language and its size, and can share the page with someone else or return to the list without losing their place. Projects that publish formal versions show their version history.

**Why this priority**: The facts and the share action complete the page, and the version history is a bonus that only some projects can offer.

**Independent Test**: Open a project that publishes releases and one that does not, verify the information block on both, verify the share action, and verify going back returns to the list.

**Acceptance Scenarios**:

1. **Given** a project with curated metadata, **When** its page is displayed, **Then** an information block lists its categories, its language and its size
2. **Given** a project publishes formal versions, **When** its page is displayed, **Then** the most recent version is listed first together with its publication date and a link to that version
3. **Given** a project publishes no formal versions, **When** its page is displayed, **Then** the version history explains that there are none rather than showing an empty area
4. **Given** a visitor activates the share control, **When** the device supports sharing, **Then** the page is offered to the visitor's own sharing tools, and otherwise the page address is copied and the visitor is told it was copied
5. **Given** a visitor activates the back control, **When** it is used, **Then** the visitor returns to the project list in its default state
6. **Given** a project is a web app, **When** its size is presented, **Then** the size comes from the downloadable app when one is published, and from the repository when it is not, and the visitor can tell which of the two they are seeing

---

### Edge Cases

- The visitor arrives at the address of a project that does not exist, or was removed: the not-found page is shown instead of a broken detail page.
- A project publishes screenshots in a different quantity, including none or more than six.
- A project supports one platform, one viewport, or has a single category: each is displayed without placeholders for the missing ones.
- A project has no language recorded: the information block omits the language rather than showing an empty value.
- A project has neither a deployed app nor any published version: the app-or-download link is not offered, and the repository link is the only outbound link.
- A project publishes several downloadable files for different devices: the link leads to the page listing all of them so the visitor can choose, rather than forcing one file.
- The visitor's device has no sharing support and does not allow writing to the clipboard: the visitor is told the action could not complete instead of nothing happening.
- The visitor uses only the keyboard: the back control, the share control, the gallery and the outbound links are all reachable and operable.
- A project is renamed or its language changes upstream: the curated categories, viewports and platforms stay attached to the same project.
- A project with a very long name or a very long description at narrow widths: the page stays legible with no horizontal scrolling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Selecting a project's "view" control MUST open that project's own page
- **FR-002**: The page MUST offer a control to return to the project list
- **FR-003**: The page MUST offer a share control that shares the page address when the device supports sharing and copies it otherwise
- **FR-004**: The page MUST show the project's icon and name
- **FR-005**: The page MUST show every category the project belongs to
- **FR-006**: The page MUST show an icon for each platform the project targets
- **FR-007**: The page MUST show the project's full description
- **FR-008**: The page MUST offer a link to the project's repository
- **FR-009**: The page MUST offer a link to the deployed app when one exists, or to the project's published downloads when the app is not deployed
- **FR-010**: When a project offers both a deployed app and published downloads, the visitor may reach either
- **FR-011**: The page MUST show at most six screenshots of the project, and MUST NOT load any further screenshot beyond the sixth
- **FR-012**: A project with no screenshots MUST NOT show a screenshot area
- **FR-013**: The page MUST show an icon for each viewport the project supports
- **FR-014**: The page MUST show an information block containing the project's categories, its language and its size
- **FR-015**: The size MUST be the size of the downloadable app when the project publishes one, and the size of the repository otherwise, and the visitor MUST be able to tell which of the two is being shown
- **FR-016**: A project with no language recorded MUST omit the language from the information block
- **FR-017**: The page MUST list a project's published versions, most recent first, each with its publication date and a link to that version
- **FR-018**: A project with no published versions MUST state that there are none rather than showing an empty area
- **FR-019**: A project with neither a deployed app nor published versions MUST NOT offer an app-or-download link
- **FR-020**: Where a project publishes several downloadable files, the download link MUST lead to the place listing all of them rather than forcing one file
- **FR-021**: Requesting the page of a project that does not exist MUST show the not-found page
- **FR-022**: The curated categories, viewports and platforms MUST remain attached to the correct project across rebuilds and regardless of upstream changes to that repository
- **FR-023**: The page MUST remain usable and legible at mobile, tablet and desktop sizes, MUST NOT scroll horizontally, and MUST respect reduced-motion preferences
- **FR-024**: Every interactive element MUST be reachable and operable with the keyboard alone, and the active state of the share control MUST be programmatically identifiable

### Key Entities

- **Project**: A published repository, with the details that come from it (name, description, icon, language, repository address, deployed app address, size) and, when curated, its categories, viewports and platforms
- **Screenshot**: One image of the running app, published by the project and referenced by its README, capped at six per project
- **Published Version**: A formal release of a project, carrying a version label, a publication date and one or more downloadable files with their sizes
- **App Size**: The size of a downloadable file published with a version, preferred over the repository size when present

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor goes from the project list to a project's page in one interaction, and back in one interaction
- **SC-002**: Every project's page shows its name, icon, categories, platform icons, viewport icons, full description and both outbound links
- **SC-003**: No project's page ever loads more than six screenshots
- **SC-004**: 100% of projects that publish downloadable files show that file's size; 100% of the rest show the repository size, and in both cases the visitor is told which
- **SC-005**: Every project that publishes versions lists them with dates and links; the rest state plainly that there are none
- **SC-006**: The share control succeeds in offering the share sheet or copying the address in 100% of cases where the page is displayed
- **SC-007**: Requesting a project that does not exist shows the not-found page in 100% of cases
- **SC-008**: The page introduces no accessibility regression against the project's existing conformance
- **SC-009**: The page shows no horizontal scrolling and keeps every control reachable at 320px, 768px and 1024px

## Out of Scope for This Feature

- Editing any project data from the portfolio; the page is read-only for visitors
- Version history for projects that do not publish versions, beyond stating that there are none
- Deep-linking to a particular version or screenshot
- Any visitor-facing way to download a build directly to a chosen device; the page links to the place where the visitor chooses

## Assumptions

- Version history comes from the formal versions a project publishes, and projects that publish none are shown an explicit empty state rather than a fabricated history.
- App size comes from a published downloadable file where one exists; no attempt is made to measure or estimate the size of a deployed web app, because that figure is not available.
- Screenshots and version labels are read from the project's own README, since that is where the owner already publishes them.
- The curated metadata authored for the list continues to be the source of categories, viewports and platforms on this page.
- Sharing uses the visitor's own device sharing tools when available, because the portfolio collects nothing about visitors and stores no preferences.
- The page is addressed so that it can be opened directly and linked to, and reloading it shows the same project.