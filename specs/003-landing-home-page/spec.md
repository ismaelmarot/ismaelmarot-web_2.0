# Feature Specification: Landing Home Page

**Feature Branch**: `003-landing-home-page`

**Created**: 2026-10-02

**Status**: Draft

**Input**: User description: "La página debe tener Landing (donde se ve un resumen del resto de las secciones, con botón de link para ir a las páginas específicas). Las páginas deben ser: Sobre mí, Proyectos, Tecnologías, Contactos, Github"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover and Navigate from Landing (Priority: P1)

A visitor arrives at the website and sees a landing page that presents a summary of each main section (About, Projects, Technologies, Contact). Each summary includes a clear call-to-action button that navigates to the corresponding full page.

**Why this priority**: This is the core purpose of the landing page — to serve as an entry point that orients the visitor and directs them to the relevant content pages. Without this, the site fails its primary navigation function.

**Independent Test**: Can be fully tested by loading the homepage and verifying that each section summary is displayed with a working CTA that navigates to the correct page.

**Acceptance Scenarios**:

1. **Given** a visitor loads the homepage, **When** the page renders, **Then** the Hero section displays Ismael's name, professional title, and a brief value proposition
2. **Given** a visitor scrolls through the landing page, **When** each section summary comes into view, **Then** a title, brief description, and CTA button are visible for About, Projects, Technologies, and Contact
3. **Given** a visitor clicks the "Conocé más" CTA in the About summary, **When** the navigation completes, **Then** the About page loads with full content
4. **Given** a visitor clicks the "Ver proyectos" CTA in the Projects summary, **When** the navigation completes, **Then** the Projects page loads with the full project gallery
5. **Given** a visitor clicks the "Ver tecnologías" CTA in the Technologies summary, **When** the navigation completes, **Then** the Technologies page loads with the full technology listing
6. **Given** a visitor clicks the "Contactar" CTA in the Contact summary, **When** the navigation completes, **Then** the Contact page loads with full contact information

---

### User Story 2 - Navigate Between Pages via Navbar (Priority: P1)

A visitor can use the navbar to move between all main pages (Home, About, Projects, Technologies, Contact) and access the external GitHub profile.

**Why this priority**: Navigation is essential for a multi-page site. Visitors need a consistent way to move between pages without relying solely on landing page CTAs.

**Independent Test**: Can be fully tested by clicking each navbar link and verifying the correct page loads.

**Acceptance Scenarios**:

1. **Given** a visitor is on any page, **When** they click "Home" in the navbar, **Then** the landing page loads
2. **Given** a visitor is on any page, **When** they click "Sobre mí" in the navbar, **Then** the About page loads
3. **Given** a visitor is on any page, **When** they click "Proyectos" in the navbar, **Then** the Projects page loads
4. **Given** a visitor is on any page, **When** they click "Tecnologías" in the navbar, **Then** the Technologies page loads
5. **Given** a visitor is on any page, **When** they click "Contacto" in the navbar, **Then** the Contact page loads
6. **Given** a visitor clicks the logo/brand name, **When** the navigation completes, **Then** the landing page loads
7. **Given** a visitor clicks the GitHub CTA in the navbar, **When** the link activates, **Then** the GitHub profile opens in a new tab

---

### User Story 3 - View Full Content on Individual Pages (Priority: P1)

A visitor who navigates to a specific page (About, Projects, Technologies, Contact) sees the complete content for that section, not just a summary.

**Why this priority**: The individual pages are where the visitor finds the detailed information they are looking for. The landing page summaries are only useful if they lead to substantive content.

**Independent Test**: Can be fully tested by navigating to each page and verifying the full content is displayed.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the About page, **When** the page loads, **Then** the full About content is displayed including the complete introduction and stats
2. **Given** a visitor navigates to the Projects page, **When** project data loads, **Then** the full project gallery is displayed with all projects, descriptions, technologies, and links
3. **Given** a visitor navigates to the Technologies page, **When** the page loads, **Then** all technologies are displayed grouped by category
4. **Given** a visitor navigates to the Contact page, **When** the page loads, **Then** all contact methods are displayed with functional links

---

### User Story 4 - Experience Responsive Layout Across Devices (Priority: P2)

A visitor accesses the site from desktop, tablet, or mobile and experiences consistent, usable navigation and content presentation on all devices.

**Why this priority**: Multi-device support is a baseline expectation for professional portfolios. The landing page and all individual pages must adapt their layout appropriately.

**Independent Test**: Can be fully tested by viewing the site at common breakpoints (mobile ~375px, tablet ~768px, desktop ~1440px) and verifying all pages are accessible and usable.

**Acceptance Scenarios**:

1. **Given** a visitor views the site on mobile, **When** they interact with the navbar, **Then** a mobile-appropriate menu pattern is used (e.g., hamburger menu)
2. **Given** a visitor views the site on desktop, **When** they use keyboard navigation, **Then** all interactive elements are reachable and operable via Tab/Enter keys
3. **Given** a visitor resizes the browser window, **When** layout adjusts, **Then** content reflows without horizontal scrolling or overlapping elements
4. **Given** a visitor views the landing page on mobile, **When** section summaries stack vertically, **Then** each summary remains readable with proper spacing and touch targets

---

### User Story 5 - Experience Polished Visual Design (Priority: P2)

A visitor experiences a minimalist, elegant, and modern visual design inspired by Apple's principles across all pages.

**Why this priority**: Visual quality elevates perceived professionalism and trust. The design must be consistent across the landing page and all individual pages.

**Independent Test**: Can be fully tested by visual inspection of all pages and verifying design tokens, typography, spacing, and color usage are consistent.

**Acceptance Scenarios**:

1. **Given** a visitor views any page, **When** the page renders, **Then** the design uses the established color palette, typography scale, and spacing tokens
2. **Given** a visitor scrolls through the landing page, **When** sections come into view, **Then** subtle entrance animations play (respecting reduced-motion preferences)
3. **Given** a visitor has "Reduce Motion" enabled, **When** they visit any page, **Then** non-essential animations are disabled or reduced

---

### Edge Cases

- What happens when project data fails to load on the Projects page? → Show error state with retry option
- What happens when no projects are available? → Show friendly empty state message
- What happens when a visitor uses a screen reader? → All content is accessible with proper semantic HTML and ARIA attributes
- What happens when JavaScript is disabled? → Core content remains accessible as static HTML
- What happens when a visitor navigates directly to a sub-page URL? → The page loads correctly (deep linking support)
- What happens when a visitor clicks a CTA while already on the target page? → No navigation occurs or page refreshes gracefully

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The website MUST have a dedicated Landing/Home page that serves as the entry point
- **FR-002**: The Landing page MUST display a Hero section with Ismael's name, professional title, tagline, and primary CTAs
- **FR-003**: The Landing page MUST display a summary section for About with a title, brief description, and CTA linking to the About page
- **FR-004**: The Landing page MUST display a summary section for Projects with a title, brief description, and CTA linking to the Projects page
- **FR-005**: The Landing page MUST display a summary section for Technologies with a title, brief description, and CTA linking to the Technologies page
- **FR-006**: The Landing page MUST display a summary section for Contact with a title, brief description, and CTA linking to the Contact page
- **FR-007**: The Landing page MUST NOT contain the full content of any section — only summaries and navigation CTAs
- **FR-008**: The website MUST have a dedicated About page with full content (introduction, stats, experience details)
- **FR-009**: The website MUST have a dedicated Projects page with the full project gallery
- **FR-010**: The website MUST have a dedicated Technologies page with technologies grouped by category
- **FR-011**: The website MUST have a dedicated Contact page with all contact methods and functional links
- **FR-012**: The navbar MUST include links to: Home, About, Projects, Technologies, Contact
- **FR-013**: The navbar MUST include a CTA linking to the external GitHub profile (opens in new tab)
- **FR-014**: The logo/brand name in the navbar MUST link back to the Landing/Home page
- **FR-015**: The website MUST support deep linking — each page must be accessible via its own URL
- **FR-016**: The website MUST be fully responsive across desktop (≥1024px), tablet (768px-1023px), and mobile (<768px) breakpoints
- **FR-017**: Each page MUST maintain the established visual design system (colors, typography, spacing, radii)
- **FR-018**: The website MUST be fully keyboard navigable with visible focus indicators
- **FR-019**: The website MUST meet WCAG 2.1 AA accessibility standards
- **FR-020**: Animations MUST respect the user's "Reduce Motion" system preference
- **FR-021**: The Projects page MUST display a loading state while fetching repository data
- **FR-022**: The Projects page MUST display an error state with retry option when data fetching fails
- **FR-023**: The Projects page MUST display an empty state when no projects are available
- **FR-024**: The Footer MUST be present on all pages with copyright and social links
- **FR-025**: The Landing page section summaries MUST use the existing Section/Container component patterns
- **FR-026**: Page transitions MUST be smooth and not cause layout shifts or flickering

### Key Entities

- **Page**: Represents a distinct route/view in the application. Attributes: path, title, content sections
- **Section Summary**: Represents a preview card on the landing page. Attributes: title, description, CTA label, target route
- **Navigation Item**: Represents a link in the navbar. Attributes: label, href, external flag, aria label
- **Project**: Represents a software project/repository. Attributes: name, description, technologies, GitHub URL, screenshots
- **Technology**: Represents a tool, language, or framework. Attributes: name, category, proficiency
- **Contact Method**: Represents a way to reach Ismael. Attributes: type, label, URL, icon

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify Ismael's role and navigate to any main page within 5 seconds of page load
- **SC-002**: All pages (Home, About, Projects, Technologies, Contact) are accessible and functional on mobile, tablet, and desktop viewports
- **SC-003**: All CTAs on the landing page successfully navigate to their corresponding pages
- **SC-004**: Keyboard-only navigation allows a user to reach all interactive elements and complete primary tasks on every page
- **SC-005**: Page achieves a Lighthouse Performance score ≥90, Accessibility score ≥95, Best Practices ≥90, SEO ≥90
- **SC-006**: Zero critical accessibility violations (axe-core or equivalent automated scan)
- **SC-007**: All contact links (email, GitHub, LinkedIn) open the correct destination when activated
- **SC-008**: Deep linking to any sub-page URL loads the correct page without errors
- **SC-009**: The visual design system (colors, typography, spacing) is consistent across all pages
- **SC-010**: Animations run at 60fps (no jank) on mid-range devices from the last 3 years

## Amendment 1 - The Name and Title Sit on a Black Band

**Applied**: 2026-10-04, after implementation and deployment.

**Request**: "Ahora la vista Home tiene el siguiente diseno: Ismael Marot / Web Developer / Building
accesible... / botones. quiero que lo que dice Ismael Marot y Web Developer este con fondo negro", after
an earlier and larger request for a split screen had been reformulated as "just those two on black".

FR-002 is unaffected: the Hero still displays the name, the professional title, the tagline and the
primary CTAs, and all four remain on the page. This amendment changes only their presentation.

### What moved and what did not

The name and the title move out of the content container and into a black band above it. The tagline
and the buttons stay exactly where they were, on white. Nothing is added, removed or reworded.

### Requirements added by this amendment

- **FR-016**: The name and the title MUST sit on a `#000000` band that spans the full viewport width,
  edge to edge.
- **FR-017**: The text on that band MUST be `#FFFFFF`, at no less than 4.5:1 against the band. White on
  black measures 21:1.
- **FR-018**: The tagline and the CTAs MUST remain on the white background, outside the band.
- **FR-019**: The band MUST be a direct child of the Hero section rather than of the content container,
  and MUST reach full width with `width: 100%` rather than `100vw`. The section already measures exactly
  the viewport's client width, so `100vw` is unnecessary and would add a scrollbar's width of horizontal
  overflow on platforms with classic scrollbars.
- **FR-020**: The band MUST NOT introduce horizontal scrolling at any viewport width.
- **FR-021**: The band's inner content MUST reuse the shared container, so its gutters cannot drift away
  from the rest of the page if the container's widths or padding change.
- **FR-022**: The band MUST carry 64px of vertical padding at 768px and above, and 48px below it.
- **SC-011**: The band measures the same width as the viewport at 320, 390, 768, 1024, 1280, 1440 and
  1600, including at 1600 where the container is inset by 160px on each side.
- **SC-012**: `documentElement.scrollWidth - clientWidth` is 0 at every one of those widths.
- **SC-013**: The name and the title compute `#FFFFFF` on a `#000000` background.
- **SC-014**: The tagline still computes on white, and the Hero still fills the viewport height without
  overflowing at 320x640, the tightest case.

### Accepted consequences

- **The name is no longer vertically centred in the Hero.** The four elements used to form one centred
  block of 434px. With the band, the black surface sits above the tagline and the pair reads as two
  layers rather than one stack. This is what was asked for, and it is not reversible without removing
  the band.
- **The site now carries two blacks.** The project cards use `#1D1D1F` and this band uses `#000000`.
  Pure black was chosen deliberately because a full-width band is what Apple uses for full-bleed dark
  sections, and the two are one step apart rather than a visible clash.
- **SC-009, "consistent across all pages", is strained by this amendment.** A second surface colour is
  introduced on the Home page only. It is recorded here rather than left for a reviewer to find.

---

## Amendment 2 - The Band Reaches the Top and the Header Turns With It

**Applied**: 2026-10-04, after implementation and deployment.

**Request**: "Quiero que esa banda negra ocupe hasta arriba de todo. la barra de navegacion, al estar
arriba de todo deberia verse en el mismo negro con tipografia blanca. Al hacer scroll y salir de la
seccion con fondo negro deberia pasar al blanco que tiene ahora. Ademas, sin borde inferior: solo
deberia tener el borde al pasar a fondo blanco."

Amendment 1 made the band full width. This amendment makes it full height as well, so the fixed header
rests on it, and gives the header a dark treatment while it does.

### Why the band was not at the top, and why padding was not the reason

Measured, the band sat at y=161 on a 1440px viewport while the section's padding-top is 80px. The
other 81px came from `verticalAlign`, which defaults to `center`: the content block was centred inside
the viewport, so the band could never reach the top. Removing the padding alone would have left it at
y=81. The section therefore switches to `top` alignment, and the content below the band takes
`margin-block: auto` so the tagline and the buttons stay centred in the space that remains, which is
where they sat before.

The section's bottom padding is then declared explicitly rather than left to `size="xl"`. `padding-block`
and `padding-top` are both single properties whose order in the cascade decides the result, and leaving
it to `size="xl"` would make the override depend on stylesheet order.

### Why the switch cannot be a scroll offset

The existing threshold is `window.scrollY > 20`, which exists because the hero was white. With a black
band of 355px at 1440, a threshold of 20 would turn the header white while the band was still behind
it. The switch is therefore driven by geometry: the header is dark while the region's bottom edge is
below the header's own bottom edge.

Measured thresholds, being the band height less the header's 52px:

| Viewport | Band height | Switch at |
|----------|-------------|-----------|
| 1440 | 355px | 303px |
| 1024 | 300px | 248px |
| 390 | 212px | 160px |

### Every colour in the header failed on black

This was the largest part of the change and it was not obvious from the request. Measured against
`#000000`:

| Element | Colour today | Contrast | Result |
|---------|--------------|----------|--------|
| Logo | `#1D1D1F` | 1.25:1 | fails |
| Navigation items | `#6E6E73` | 4.14:1 | fails |
| GitHub CTA | `#0062C4` | 3.54:1 | fails |

All three had to change. Because every style in the header subtree already references `var(--color-*)`
rather than a literal, the whole treatment is a set of custom property overrides on the header itself,
which cascade to the navigation, the brand and the menu button. No prop is threaded down and
`Navigation`'s public API does not change.

### Requirements added by this amendment

- **FR-023**: The band MUST begin at the top of the document with no gap, so that the fixed header
  rests on it rather than over white.
- **FR-024**: While the header overlaps a region marked `data-header-contrast="dark"`, it MUST use a
  `#000000` background, white text, and NO bottom border.
- **FR-025**: When the header stops overlapping that region, it MUST return to the light treatment it
  has today: white background, dark text and a 1px bottom border.
- **FR-026**: Pages without a dark region MUST NOT change behaviour at all.
- **FR-027**: Text over the dark region MUST be `#FFFFFF`, which measures 21:1.
- **FR-028**: Every interactive element in the header MUST keep a visible hover and focus state over the
  dark region.
- **FR-029**: The switch MUST be driven by the region's bottom edge crossing the header's bottom edge,
  and MUST NOT be a fixed scroll offset.
- **SC-015**: The band starts at y:0 at 320, 390, 768, 1024, 1280, 1440 and 1600.
- **SC-016**: At `scrollY` 0 and at `scrollY` 150 on a 390px viewport, the header is black with white
  text and a zero bottom border.
- **SC-017**: Past the measured threshold, the header is white with dark text and a 1px bottom border.
- **SC-018**: On `/projects` and `/about`, the header behaves exactly as it did before.
- **SC-019**: axe reports zero violations, and no header text measures below 4.5:1 against the black.

### White leaves no room to brighten, so hover became an underline

The header's existing hover moves a link from `--color-text-secondary` to `--color-text-primary`,
which is a subtle darkening on a light background. Over black, with everything white, there is nothing
brighter to move to. Hover is therefore expressed as an underline, introduced through a single custom
property that defaults to `none`, so the light theme does not change by a single pixel.

### Accepted consequences

- **The GitHub CTA loses its colour distinction.** With everything white it reads like a navigation
  item, distinguishable only by its underline on hover. This follows from the choice of white for the
  whole palette. Leaving the CTA at `#4DA3FF`, which measures 8:1 on black, would restore it.
- **The tagline and buttons move up by 161px on a 1440px viewport**, because the band now occupies the
  space the vertical centring used to leave at the top. The Hero's vertical composition changes as a
  direct result of the header resting on the band.

## Amendment 3 - The Hero Is Distributed Like the Rest of the Page

**Applied**: 2026-10-04.

**Request**: "Ismael Marot + Web Developer quedo muy arriba. Utilizando metodologia SDD y practicas
profecionales de diseno web, fijate de distribuir mejor la seccion home para una vista profesional
estilo appe."

This is a defect report rather than a preference, and measuring confirmed it. The Hero was the only
section on the page whose content was not vertically balanced.

### The cause was a misplaced declaration, not a taste difference

Amendment 2 gave the content below the band `margin-block: auto`, intending to centre it in the space
that remained. Auto margins only distribute free space on a flex item, and `StyledHero` is a grandchild
of the section: the direct child is the `Container`. The declaration therefore did nothing at all. The
content began immediately after the band's margin, at 395px, which is 355 plus 40.

Measured against the other sections, all of which centre their content with `padding-block: 64px`:

| Section | Empty above | Empty below |
|---------|-------------|-------------|
| **hero** | **0px** | **322px** |
| projects-summary | 319px | 318px |
| technologies-summary | 208px | 207px |
| about-summary | 319px | 318px |
| contact-summary | 319px | 318px |

Four sections at 319/318 and the Hero at 0/322 is not a design position, it is a broken one.

### The band also crowded the fixed header

The name began at y:64 with the fixed header ending at y:52, leaving 12px. On a 390px viewport the
name began at y:40, which is above the header's own bottom edge. A fixed header floating over the band
means the band has to reserve the header's height plus breathing room.

### The measure, and why it is derived rather than written

The clearance between a fixed element and the content beneath it should be one step of the spacing
scale, not an arbitrary number. The header's 52px is currently hardcoded in `StyledInner` and exists
nowhere as a token, so this amendment introduces `--header-height` and expresses the band's top padding
as the header's height plus a spacing step:

- 768px and up: `calc(var(--header-height) + var(--space-12))`, which is 52 + 48 = **100px**
- below 768px: `calc(var(--header-height) + var(--space-8))`, which is 52 + 32 = **84px**

Deriving it means that if the header's height ever changes, the band follows it instead of silently
breaking. The resulting clearances are 48px and 32px, both on the scale.

The band's bottom padding stays at 64px, matching the `padding-block` of the four other sections. The
asymmetry between 100 above and 64 below is deliberate: the name and title sit slightly above the
band's optical centre to compensate for the fixed header above them. That is optical balancing.

### Requirements added by this amendment

- **FR-030**: The Hero's content below the band MUST be vertically distributed in the space that
  remains, by placing the auto margins on the section's direct flex child rather than on a descendant.
- **FR-031**: The band's top padding MUST be `calc(var(--header-height) + spacing)` at every viewport, so
  the name never sits closer to the header than one spacing step.
- **FR-032**: `--header-height` MUST be a token, used both by the header and by the band, so the two
  cannot drift apart.
- **FR-033**: The band's bottom padding MUST stay at 64px, matching the other sections.
- **FR-034**: The Hero's empty space above and below its content MUST be within 1px of each other at
  1440px and at 390px, which is the balance the other four sections already achieve.
- **SC-020**: The clearance between the header's bottom edge and the name's top is between 32px and
  64px at 320, 390, 768, 1024, 1280, 1440 and 1600.
- **SC-021**: The name's top is below the header's bottom edge at every one of those widths, so the two
  never overlap.
- **SC-022**: The empty space above and below the tagline-and-buttons block differ by no more than 1px
  at 1440px and 390px.
- **SC-023**: The band still spans the viewport width and still starts at y:0.
- **SC-024**: The full suite passes, including the tests written for Amendments 1 and 2.

### Deliberately unchanged

The name stays at 112px. It measures 629px inside a 1280px container, so it sits on one line with
room to spare, and the report was about position rather than size. Reducing it would cost impact
without fixing anything. The other four sections are already balanced and are not touched.

---

## Amendment 4 - The Band Is a Proportion of the Screen

**Applied**: 2026-10-04.

**Request**: "sigue ocupando poco espacio"

Amendment 3 balanced the Hero correctly, and the report that followed was not about balance but
about presence. Measuring confirmed it: the band was sized entirely by its content, so it covered 43%
of a 900px viewport and only 30% of an 844px phone. A dark region that occupies under a third of a
phone screen reads as a text block with padding, not as the black surface the rest of the design
implies.

### The measure

The band now carries `min-height: 55dvh` and centres its content, so the black is a deliberate
proportion of the screen rather than a by-product of the type inside it. `min-height` rather than
`height`, so a viewport too short to hold 55% grows to fit its content instead of clipping the name.

55% rather than a larger share for two reasons: the remaining 45% still has to hold the tagline, the
buttons and their gaps, which is 183px plus 80px of section padding at 1440px; and the dark region has
nothing below the title, so past roughly half the screen the black stops framing the name and starts
reading as emptiness.

Centring the content inside the taller band moves the name down, from y:100 to y:152 at 1440px. The
clearance from the fixed header therefore grows from 48px to about 100px, and to 186px at 768px where
the band is tallest relative to its content. That was checked visually at 1440, 768 and 390 and reads
as deliberate poster spacing rather than as a defect.

### Short viewports fall back to content height

At 320x640 the arithmetic breaks in one place only: the 55% is 352px, the content below needs a
further 250px, and there the name wraps to two lines and the description takes three. The section
overshot the screen by 34px. Below a viewport height of 720px the band reverts to content-driven
height, which measures 312px of black, 49% of the viewport, and puts the section back at exactly
640 of 640.

### Requirements added by this amendment

- **FR-035**: The band MUST occupy a proportion of the viewport rather than only its content height.
- **FR-036**: The band's height MUST be a minimum rather than a fixed height, so a short viewport grows
  to fit its content instead of clipping the name.
- **FR-037**: The name and title MUST be centred within the band.
- **FR-038**: Below a viewport height of 720px the band MUST fall back to content-driven height, so the
  Hero never exceeds one screen.
- **SC-025**: The band measures between 49% and 55% of the viewport height at 320, 390, 768, 1024,
  1280, 1440 and 1600.
- **SC-026**: The Hero's empty space above and below its content still matches to within 1px at every
  one of those widths.
- **SC-027**: The Hero never exceeds the viewport height at 320x640, the tightest case.
- **SC-028**: The suite passes, including the tests written for Amendments 1, 2 and 3.

---

## Assumptions

- The existing design tokens, typography scale, and color palette will be reused without modification
- The existing component architecture (Section, Container, Header, Footer, Navigation) will be adapted for multi-page use
- A client-side routing solution will be used (no server-side rendering)
- The GitHub link in the navbar points to `https://github.com/ismaelmarot` and opens in a new tab
- The landing page section summaries will feature 2-3 featured projects as a preview (using existing `featuredProjectIds` config)
- The Technologies summary on the landing page will show a curated selection (e.g., top 6-8 technologies) rather than the full list
- The existing projects.json data source and GitHub fetch logic will be reused for the Projects page
- The existing site-config.ts will be extended to support page-specific metadata
- Browser support targets modern evergreen browsers (last 2 versions of Chrome, Firefox, Safari, Edge)
- No authentication, user accounts, or dynamic user-generated content needed
- Analytics/tracking is out of scope for initial version
