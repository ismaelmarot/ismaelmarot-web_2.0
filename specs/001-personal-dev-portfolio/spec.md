# Feature Specification: Personal Developer Portfolio

**Feature Branch**: `001-personal-dev-portfolio`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "Create a personal developer portfolio website for Ismael Marot. The purpose of the website is to present Ismael as a web developer and showcase the applications and projects he has built. The website should include: 1. A home/hero section introducing Ismael as a web developer. 2. An About section with a concise personal and professional introduction. 3. A Projects section showing the applications and projects Ismael has built. 4. Project information should be based on Ismael's GitHub repositories, including relevant repository information such as project name, description, technologies, links and other useful metadata when available. 5. Projects should support visual presentation through screenshots or images. 6. A Technologies section showing the main technologies and tools used by Ismael. 7. A Contact section with appropriate ways to contact or find Ismael online. 8. Clear navigation between the main sections. 9. Responsive behavior for desktop, tablet and mobile devices. 10. Smooth and intentional animations and transitions. 11. The visual experience should be inspired by Apple's design principles: simplicity, strong visual hierarchy, generous spacing, refined typography, subtle motion and polished interactions. It must not copy Apple's website or proprietary designs. 12. The website should prioritize the projects and their visual presentation rather than excessive text. 13. The interface should feel modern, professional, clean and personal. 14. The website should be accessible and usable with keyboard navigation. 15. The website should provide appropriate loading, empty and error states when project information cannot be retrieved. 16. The website should be deployable as a static website through GitHub Pages. 17. The initial version should remain simple and avoid unnecessary features or complexity. The specification should focus on user needs, behavior, content and acceptance criteria. Do not decide specific implementation libraries or architecture unless they are required to describe the user experience."

---

## Visual Design System

This section defines the official visual system for the portfolio. It is a binding part of the product requirements and must be implemented faithfully.

### Visual Direction

The portfolio MUST embody an aesthetic inspired by Apple's design principles:

- Minimalist
- Elegant
- Clean
- Modern
- Premium
- Generous visual space
- Strong typographic hierarchy
- Carefully balanced composition

The inspiration is limited to general design principles. The implementation MUST NOT copy Apple's designs, branding, components, copy, or assets literally. The interface MUST feel like a carefully crafted digital product, not a generic portfolio template.

### Typographic System

**Primary Typeface**: Inter (mandatory)

**Permitted Weights Only**:
- 400 — Regular
- 500 — Medium
- 600 — Semibold
- 700 — Bold

No other weights may be introduced without explicit documented justification.

#### Typographic Scale

| Role | Size | Weight |
|------|------|--------|
| Hero headline | `clamp(3.5rem, 8vw, 7rem)` | 700 |
| Section titles | `clamp(2.5rem, 5vw, 4.5rem)` | 700 |
| Project titles | `clamp(2rem, 4vw, 3.5rem)` | 600 |
| Large subtitles | `clamp(1.25rem, 2vw, 1.75rem)` | 400 |
| Body text | `1rem` | 400 |
| Secondary text | `0.875rem` | 400 |
| Labels & navigation | `0.75rem` | 500 |

These values constitute the official visual system. Arbitrary sizes MUST NOT be introduced without justification within the design system.

### Color Palette

The official palette is:

| Token | Hex | Usage |
|-------|-----|-------|
| Background Primary | `#FFFFFF` | Main page background |
| Background Alternate | `#F5F5F7` | Alternate section backgrounds |
| Text Primary | `#1D1D1F` | Primary content text |
| Text Secondary | `#6E6E73` | Secondary content text |
| Text Tertiary | `#86868B` | Tertiary/muted text |
| Border | `#D2D2D7` | Borders, dividers |
| Black | `#000000` | Pure black when needed |
| White | `#FFFFFF` | Pure white when needed |
| Accent | `#0071E3` | Links, actions, interactive states, small highlights |

**Accent Usage Constraint**: The accent color MUST be used sparingly — primarily for links, actions, interactive states, and small highlights. It MUST NOT become a dominant interface color.

### Spacing and Composition

The interface MUST prioritize:

- Abundant negative space
- Expansive compositions
- Clear separation between content blocks
- Strong visual hierarchy
- Easily scannable content
- Few but meaningful visual elements

Dense interfaces MUST be avoided.

### Home Sections — Viewport Height Rule

Each main section of the HOME page MUST occupy at minimum:

```
min-height: 100dvh;
```

The sections are:

- Hero
- About / Sobre mí
- Projects / Proyectos
- Technologies / Tecnologías
- Contact / Contacto

A section MAY grow beyond `100dvh` when content requires it. Each section MUST feel like an independent visual "scene." Mechanical repetition of the same composition across all sections is PROHIBITED.

#### Hero Section

The Hero MUST be the most visually impactful section. It MUST use:

- Large typography
- Abundant negative space
- Developer's name
- Professional role
- Brief message
- Primary CTA
- Clean composition

It MUST feel like a digital product cover, not a traditional CV header.

#### About Section

The About section MUST have its own visual composition. It MUST avoid:

- Large text blocks
- CV-style layouts
- Excessive information

It MUST prioritize:

- Brief introduction
- Relevant information
- Clean visual composition
- Typographic hierarchy

#### Projects Section

Projects MUST be one of the visually protagonistic sections. It MUST prioritize:

- Large images/previews
- Large titles
- Minimum necessary information
- Technologies
- Links
- Expansive compositions

It MUST avoid grids of many small cards. Projects MUST feel like the portfolio's primary pieces.

#### Technologies Section

The Technologies section MUST NOT appear as a generic logo list. It MUST use the visual system to present technologies cleanly and organized. It MAY use:

- Icons
- Categories
- Groupings
- Micro-interactions

But MUST NOT generate visual excess.

#### Contact Section

The Contact section MUST function as the visual closing of the portfolio. It MUST be:

- Simple
- Clean
- Spacious
- Direct

It MUST prioritize:

- Primary message
- CTA
- Contact links

### Responsive Behavior

The visual system MUST explicitly adapt to:

- Mobile
- Tablet
- Desktop

Responsive behavior MUST NOT be solved by simply reducing sizes. The following MUST adapt:

- Typography
- Spacing
- Composition
- Grids
- Images
- Navigation
- Vertical distribution

The typographic scale defined via `clamp()` MUST be used to achieve fluid scaling. Sections MUST retain the minimum `100dvh` concept at all breakpoints, allowing growth when content requires it.

### Animations and Transitions

Animations MUST be:

- Subtle
- Smooth
- Natural
- Elegant

Permitted:

- Fade
- Subtle translate
- Subtle scale
- Viewport entrance appearance
- Hover transitions
- Micro-interactions

Prohibited:

- Exaggerated animations
- Abrupt movements
- Excessive parallax
- Constant animations
- Decorative effects without purpose

The system MUST respect `prefers-reduced-motion`.

### Negative Visual Rules

The interface MUST avoid:

- Strong shadows
- Unnecessary decorative gradients
- Excessive borders
- Excessive cards
- Dashboard-like appearance
- Excessive colors
- Unnecessary visual elements
- Typefaces outside the system
- Typographic weights outside the system
- Arbitrary sizes
- Dense layouts

### Visual Validation and Tokens

The implementation MUST allow visual validation of the visual system and HOME page before proceeding to secondary functionality.

The visual system MUST be centralized via reusable tokens for:

- Typography
- Weights
- Sizes
- Colors
- Spacing
- Breakpoints
- Radii
- Transitions
- Motion

Arbitrary visual values MUST NOT be duplicated across components.

## User Scenarios & Testing

### User Story 1 - Discover Ismael and His Work (Priority: P1)

A visitor arrives at the website and immediately understands who Ismael is as a web developer and can quickly browse his featured projects.

**Why this priority**: This is the primary purpose of the portfolio - to introduce the developer and showcase their work. Without this, the site fails its core mission.

**Independent Test**: Can be fully tested by loading the homepage and verifying the hero section, about section, and projects section are all present with correct content, and delivers immediate understanding of Ismael's identity and work.

**Acceptance Scenarios**:

1. **Given** a visitor loads the homepage, **When** the page renders, **Then** the hero section displays Ismael's name and role as a web developer
2. **Given** a visitor scrolls past the hero, **When** the About section comes into view, **Then** a concise personal and professional introduction is visible
3. **Given** a visitor navigates to the Projects section, **When** project data loads successfully, **Then** a gallery of projects displays with name, description, technologies, and links
4. **Given** a visitor views a project card, **When** project images are available, **Then** screenshots or visual previews are shown

---

### User Story 2 - Explore Project Details (Priority: P1)

A visitor wants to learn more about a specific project, including its technologies, source code, and live demo.

**Why this priority**: Projects are the core content of a developer portfolio. Visitors need to drill into details to assess skills and experience.

**Independent Test**: Can be fully tested by clicking on a project and verifying detailed information is accessible, and delivers project-specific value.

**Acceptance Scenarios**:

1. **Given** a visitor views the Projects section, **When** they select a project, **Then** detailed project information displays (name, description, technologies, GitHub link, live demo link if available)
2. **Given** a project has associated screenshots, **When** the project detail view opens, **Then** images are displayed in a visually appealing manner
3. **Given** a project has a GitHub repository, **When** the visitor clicks the repository link, **Then** they are taken to the GitHub page for that project

---

### User Story 3 - Browse Technologies and Skills (Priority: P2)

A visitor wants to quickly see what technologies, frameworks, and tools Ismael works with.

**Why this priority**: Technical recruiters and peers often scan for specific tech stacks. This section provides a quick skills overview.

**Independent Test**: Can be fully tested by navigating to the Technologies section and verifying a categorized list of technologies is displayed, and delivers skills assessment value.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the Technologies section, **When** the section loads, **Then** technologies are grouped by category (e.g., languages, frameworks, tools, databases)
2. **Given** technologies are displayed, **When** a visitor views them, **Then** each technology shows its name and optionally proficiency level or years of experience

---

### User Story 4 - Contact Ismael (Priority: P2)

A visitor wants to reach out to Ismael for collaboration, hiring, or questions.

**Why this priority**: A portfolio's secondary goal is to enable professional connections. Contact information must be accessible.

**Independent Test**: Can be fully tested by navigating to the Contact section and verifying functional contact methods are present, and delivers connection value.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the Contact section, **When** the section loads, **Then** contact methods are displayed (email, LinkedIn, GitHub, etc.)
2. **Given** a visitor clicks an email link, **When** their default mail client opens, **Then** the recipient is pre-filled with Ismael's email address
3. **Given** a visitor clicks a social link, **When** the link activates, **Then** they are taken to the corresponding profile page

---

### User Story 5 - Navigate Seamlessly Across Devices (Priority: P1)

A visitor accesses the site from desktop, tablet, or mobile and experiences consistent, usable navigation and content presentation.

**Why this priority**: Modern web traffic is multi-device. Responsive behavior is a baseline expectation for professional portfolios.

**Independent Test**: Can be fully tested by viewing the site at common breakpoints (mobile ~375px, tablet ~768px, desktop ~1440px) and verifying all sections are accessible and usable, and delivers cross-device value.

**Acceptance Scenarios**:

1. **Given** a visitor views the site on mobile, **When** they interact with navigation, **Then** a mobile-appropriate menu pattern is used (e.g., hamburger menu)
2. **Given** a visitor views the site on desktop, **When** they use keyboard navigation, **Then** all interactive elements are reachable and operable via Tab/Enter keys
3. **Given** a visitor resizes the browser window, **When** layout adjusts, **Then** content reflows without horizontal scrolling or overlapping elements

---

### User Story 6 - Experience Polished Interactions (Priority: P2)

A visitor experiences smooth, intentional animations and transitions that enhance usability without distraction.

**Why this priority**: Motion design inspired by Apple's principles elevates the perceived quality and professionalism of the portfolio.

**Independent Test**: Can be fully tested by interacting with the site (scrolling, hovering, clicking, navigating) and verifying animations are smooth, purposeful, and respect reduced-motion preferences, and delivers delightful UX value.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls through sections, **When** elements enter the viewport, **Then** they animate in with subtle, staggered motion
2. **Given** a visitor hovers over interactive elements, **When** the hover state activates, **Then** a smooth transition provides visual feedback
3. **Given** a visitor has "Reduce Motion" enabled in system preferences, **When** they visit the site, **Then** non-essential animations are disabled or reduced

---

### User Story 7 - Handle Data Loading Gracefully (Priority: P2)

A visitor experiences appropriate feedback when project data is loading, unavailable, or fails to load.

**Why this priority**: GitHub API data fetching can fail or be slow. Proper states maintain trust and usability.

**Independent Test**: Can be fully tested by simulating slow network, API errors, and empty data scenarios, and delivers robust UX value.

**Acceptance Scenarios**:

1. **Given** project data is being fetched, **When** the fetch is in progress, **Then** a loading indicator displays in the Projects section
2. **Given** project data fails to load, **When** the error occurs, **Then** an error message displays with a retry option
3. **Given** no projects are available (empty state), **When** the Projects section renders, **Then** a friendly empty state message displays

---

### Edge Cases

- What happens when GitHub API rate limits are exceeded? → Show cached data if available, otherwise error state with retry
- What happens when a repository has no description? → Display a generic placeholder or infer from repo name/topics
- What happens when a repository has no screenshots? → Show a placeholder visual or technology badge collage
- How does the site handle very long project descriptions? → Truncate with "read more" or clamp lines with ellipsis
- What happens when a visitor uses a screen reader? → All images have alt text, headings are semantic, landmarks are present
- What happens when JavaScript is disabled? → Core content (hero, about, projects list) remains accessible as static HTML

## Requirements

### Functional Requirements

- **FR-001**: The website MUST display a hero section with Ismael's name, professional title, and a brief value proposition
- **FR-002**: The website MUST include an About section with a concise personal and professional introduction
- **FR-003**: The website MUST display a Projects section populated from Ismael's GitHub repositories
- **FR-004**: Each project MUST display at minimum: project name, description, primary technologies, GitHub repository link
- **FR-005**: Each project SHOULD display a live demo link when available
- **FR-006**: Each project SHOULD support visual presentation through screenshots or images
- **FR-007**: The website MUST include a Technologies section showing technologies grouped by category
- **FR-008**: The website MUST include a Contact section with functional contact methods (email, social profiles)
- **FR-009**: The website MUST provide clear navigation between all main sections (Home, About, Projects, Technologies, Contact)
- **FR-010**: The website MUST be fully responsive across desktop (≥1024px), tablet (768px-1023px), and mobile (<768px) breakpoints
- **FR-011**: The website MUST include smooth, intentional animations for scrolling, hover states, and transitions
- **FR-012**: Animations MUST respect the user's "Reduce Motion" system preference
- **FR-013**: The website MUST be fully keyboard navigable with visible focus indicators
- **FR-014**: The website MUST meet WCAG 2.1 AA accessibility standards
- **FR-015**: The Projects section MUST display a loading state while fetching repository data
- **FR-016**: The Projects section MUST display an error state with retry option when data fetching fails
- **FR-017**: The Projects section MUST display an empty state when no projects are available
- **FR-018**: The website MUST be deployable as a static site to GitHub Pages
- **FR-019**: The website MUST prioritize visual presentation of projects over excessive textual content
- **FR-020**: The visual design MUST follow principles of simplicity, strong hierarchy, generous spacing, refined typography, and subtle motion — without copying Apple's proprietary designs
- **FR-021**: Each main section of the HOME page (Hero, About, Projects, Technologies, Contact) MUST occupy at minimum 100% of the viewport height (conceptually min-height: 100dvh), allowing content to grow beyond this minimum if needed, ensuring sections feel like independent visual "scenes" during scroll
- **FR-022**: Each HOME section MUST have its own distinct visual composition with sufficient negative space, and content MUST be properly centered and vertically distributed where appropriate
- **FR-023**: The full-viewport section behavior MUST be maintained across mobile, tablet, and desktop breakpoints

### Key Entities

- **Project**: Represents a software project/repository. Attributes: name, description, primary language, technologies/topics, GitHub URL, live demo URL (optional), screenshot URLs (optional), stars/forks count (optional), last updated date
- **Technology**: Represents a tool, language, or framework. Attributes: name, category (language, framework, tool, database, etc.), proficiency indicator (optional)
- **Contact Method**: Represents a way to reach Ismael. Attributes: type (email, social, etc.), label, URL or value, icon identifier

## Success Criteria

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify Ismael's role and view at least 3 projects within 10 seconds of page load
- **SC-002**: All sections (Hero, About, Projects, Technologies, Contact) are accessible and functional on mobile, tablet, and desktop viewports
- **SC-003**: Keyboard-only navigation allows a user to reach all interactive elements and complete primary tasks (view project details, navigate sections, open contact links)
- **SC-004**: Page achieves a Lighthouse Performance score ≥90, Accessibility score ≥95, Best Practices ≥90, SEO ≥90
- **SC-005**: Project data loads and displays within 3 seconds on a typical broadband connection (simulated 3G: within 5 seconds)
- **SC-006**: Animations run at 60fps (no jank) on mid-range devices from the last 3 years
- **SC-007**: Zero critical accessibility violations (axe-core or equivalent automated scan)
- **SC-008**: The site builds and deploys successfully to GitHub Pages with zero build errors
- **SC-009**: All contact links (email, GitHub, LinkedIn) open the correct destination when activated
- **SC-010**: Each main HOME section (Hero, About, Projects, Technologies, Contact) fills at least the full viewport height on initial load across all device breakpoints, with content visually centered and distributed

## Assumptions

- Ismael has a public GitHub profile with repositories that represent his work
- Repository metadata (description, topics, languages) is sufficiently populated for meaningful display
- Screenshots/project images will be provided separately (not fetched automatically from GitHub)
- The site will be hosted on GitHub Pages with a custom domain or `username.github.io` pattern
- No backend or server-side rendering is required — fully static deployment
- Content (About text, contact info, selected projects) will be provided by Ismael
- "Reduce Motion" preference is detected via `prefers-reduced-motion` media query
- Browser support targets modern evergreen browsers (last 2 versions of Chrome, Firefox, Safari, Edge)
- No authentication, user accounts, or dynamic user-generated content needed
- Analytics/tracking is out of scope for initial version
- CMS or content editing interface is out of scope — content managed via code/data files