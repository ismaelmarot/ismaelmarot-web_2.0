# Feature Specification: GitHub Projects Showcase

**Feature Branch**: `004-github-projects-showcase`

**Created**: 2026-10-02

**Status**: Draft

**Input**: User description: "la seccion de Proyectos debe mostrar proyectos de mi github en https://github.com/ismaelmarot - Nombre - descripcion - icono - go Live / Go Live App (button link) - Github Repo (button link) todo con diseno estilo apple"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse GitHub Projects (Priority: P1)

A visitor navigates to the Projects section of the portfolio and sees a grid of project cards fetched from the GitHub profile (https://github.com/ismaelmarot). Each card displays the project name, description, a representative icon, and two call-to-action buttons: "Go Live" / "Go Live App" (linking to the deployed application) and "Github Repo" (linking to the source repository). The visual design follows Apple-inspired aesthetics: clean typography, generous whitespace, subtle shadows, rounded corners, and smooth hover animations.

**Why this priority**: This is the core value proposition of the feature — visitors can immediately see what the developer has built and navigate to live demos or source code.

**Independent Test**: Can be fully tested by loading the Projects section and verifying that project cards render with all required fields (name, description, icon, both buttons) and that each button links to the correct destination.

**Acceptance Scenarios**:

1. **Given** the Projects section is loaded, **When** the page renders, **Then** a grid of project cards is displayed, each showing name, description, icon, "Go Live" / "Go Live App" button, and "Github Repo" button
2. **Given** a project card is visible, **When** the user clicks "Go Live" or "Go Live App", **Then** a new browser tab opens with the deployed application URL
3. **Given** a project card is visible, **When** the user clicks "Github Repo", **Then** a new browser tab opens with the GitHub repository URL
4. **Given** the Projects section is displayed, **When** the user views it on a desktop viewport, **Then** the layout uses a responsive grid with Apple-style visual design (clean typography, generous whitespace, subtle shadows, rounded corners)

---

### User Story 2 - Responsive Apple-Style Design (Priority: P2)

The Projects section adapts gracefully to different screen sizes while maintaining Apple-inspired design principles. On mobile, cards stack in a single column; on tablet, two columns; on desktop, three or more columns. Hover effects provide subtle elevation and shadow changes consistent with Apple's design language.

**Why this priority**: Ensures the section looks polished and professional across all devices, which is critical for a portfolio's first impression.

**Independent Test**: Can be fully tested by resizing the browser viewport and verifying the grid adapts correctly while maintaining visual consistency.

**Acceptance Scenarios**:

1. **Given** the Projects section is loaded on a mobile viewport (<768px), **When** the page renders, **Then** project cards display in a single column layout
2. **Given** the Projects section is loaded on a tablet viewport (768px–1024px), **When** the page renders, **Then** project cards display in a two-column grid
3. **Given** the Projects section is loaded on a desktop viewport (>1024px), **When** the page renders, **Then** project cards display in a three-or-more column grid
4. **Given** a project card is hovered, **When** the user moves their cursor over it, **Then** the card exhibits a subtle elevation/shadow change animation

---

### User Story 3 - Graceful Handling of Missing Data (Priority: P3)

When a project does not have a live deployment URL, the "Go Live" / "Go Live App" button is either hidden or disabled. When a project lacks a description, a fallback message is shown. The section handles GitHub API failures gracefully without breaking the page layout.

**Why this priority**: Not all projects will have live demos or complete metadata; the UI must remain polished even with incomplete data.

**Independent Test**: Can be fully tested by verifying that projects without a live URL do not show a broken or misleading button, and that the section renders correctly even if the data source is temporarily unavailable.

**Acceptance Scenarios**:

1. **Given** a project has no live deployment URL, **When** its card is rendered, **Then** the "Go Live" / "Go Live App" button is hidden or visually disabled
2. **Given** a project has no description, **When** its card is rendered, **Then** a fallback text (e.g., "No description available") is displayed
3. **Given** the GitHub data source is unavailable, **When** the Projects section loads, **Then** a user-friendly error or empty state is shown without breaking the page layout

---

### Edge Cases

- What happens when a project has a very long description that overflows the card? (Should be truncated with ellipsis or clamped)
- How does the system handle projects with non-ASCII or special characters in their names/descriptions?
- What happens when the GitHub profile has more projects than initially displayed? (Pagination, "Load More", or scroll-based loading)
- How does the section behave when a project's icon image fails to load? (Fallback placeholder icon)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a Projects section that lists repositories from the GitHub profile at https://github.com/ismaelmarot
- **FR-002**: Each project card MUST display the project name
- **FR-003**: Each project card MUST display the project description
- **FR-004**: Each project card MUST display a representative icon for the project
- **FR-005**: Each project card MUST include a "Go Live" or "Go Live App" button that links to the deployed application URL (when available)
- **FR-006**: Each project card MUST include a "Github Repo" button that links to the GitHub repository URL
- **FR-007**: Both buttons MUST open their respective links in a new browser tab
- **FR-008**: The Projects section MUST follow Apple-inspired design principles: clean typography, generous whitespace, subtle shadows, rounded corners, and smooth hover animations
- **FR-009**: The Projects section MUST be responsive across mobile, tablet, and desktop viewports
- **FR-010**: The system MUST handle projects without a live deployment URL by hiding or disabling the "Go Live" / "Go Live App" button
- **FR-011**: The system MUST display a fallback message for projects without a description
- **FR-012**: The system MUST handle data source failures gracefully without breaking the page layout
- **FR-013**: Long descriptions MUST be truncated or clamped to prevent card overflow
- **FR-014**: A fallback placeholder icon MUST be shown when a project icon fails to load

### Key Entities *(include if feature involves data)*

- **Project**: Represents a GitHub repository displayed in the section. Key attributes: name, description, icon URL, live deployment URL (optional), repository URL
- **Project Card**: The visual container for a single project, containing the icon, name, description, and action buttons

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can view all projects from the GitHub profile within the Projects section without navigating away from the page
- **SC-002**: A visitor can open a project's live deployment or GitHub repository in a new tab in a single click
- **SC-003**: The Projects section renders correctly and maintains visual integrity across mobile (320px+), tablet (768px+), and desktop (1024px+) viewports
- **SC-004**: The Projects section achieves a Lighthouse performance score of 90+ with no layout shifts during card rendering
- **SC-005**: All interactive elements (buttons) meet WCAG 2.1 AA accessibility standards including keyboard navigation and screen reader support

## Assumptions

- The GitHub profile at https://github.com/ismaelmarot is public and its repositories are accessible without authentication
- Project icons are derived from the repository's associated metadata (e.g., repository topic images, Open Graph images, or a default icon per project type)
- The "Go Live" / "Go Live App" button label varies depending on the project type: "Go Live" for web apps, "Go Live App" for mobile apps
- The portfolio website is a static site; project data is fetched at build time or runtime from the GitHub API
- The existing design system (styled-components, design tokens in `src/styles/`) will be used for Apple-style visual consistency
- No pagination is required for v1; all projects from the profile are displayed in a scrollable grid
- The GitHub API rate limits are acceptable for the expected traffic of a personal portfolio
