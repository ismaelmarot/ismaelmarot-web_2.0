# Feature Specification: Project Showcase Scenes on the Landing Page

**Feature Branch**: `012-project-showcase`

**Created**: 2026-10-07

**Status**: Implemented. A flat-bezel prototype was built first and discarded; this document describes the
replacement the user approved after supplying a visual reference.

**Input**: "Luego de los iconos, quiero una seccion dividida en 4 partes al estar en desktop y 1 sola en
mobil. En cada una de ellas una imagen de esas que hay online 3D con animacion de iPhones e imagenes
dentro. donde iran apareciendo la primera imagen de cada proyecto y a su lado una leve descripcion. Los
fondos pueden ser en los colores blanco o negro que venimos trabajando"

**Superseding input**: the user attached four Apple product pages as the target and said *"Este efecto es
el que quiero lograr"*: a tilted Apple Watch Ultra; a MacBook Air whose screen floats away from its base at
an angle; several iPad Air fanned out in perspective; and two iPhones overlapping with saturated red and
purple gradient blobs behind them.

**Route decision**: after the reference, the user chose a **CSS 3D scene** and instructed: *"entonces no
uses el marco de celular"*.

## The visual target, and what is actually reachable

The reference images are **3D product renders**: real geometry, volumetric light, physically accurate
materials. CSS cannot reproduce that. It can reproduce the *composition*, which is what makes those pages
feel the way they do:

| Reference property | Reachable in CSS 3D | How |
| --- | --- | --- |
| Device angled in space | Yes | `perspective` on the stage, `rotateY`/`rotateX` on the layer |
| Layered depth, several devices | Yes | Two panels at different angles in one `preserve-3d` stack |
| Floating / levitating | Yes | `transform` keyframe on the stack |
| Soft coloured backdrop | Yes | Low-opacity `radial-gradient` blobs |
| Photorealistic materials, light | **No** | Requires WebGL, models with an unusable licence, and +170KB |

**This specification deliberately targets the composition, not photorealism.** The honest claim is that
these read as premium 3D product scenes on the web, not that they are renders.

**Why not WebGL**: `three.js` is ~170KB gzip, six GLB models are 12–48MB of assets, Apple's own models are
proprietary, and Sketchfab's "Free Standard" licence does not clearly permit portfolio use. Six simultaneous
WebGL contexts on one page is also the usual cause of the browser's context-loss warning. The bundle is
452KB today and this feature was not allowed to triple it.

**Why no phone frame**: `react-device-bezels` was installed and then removed. It renders a flat frontal
bezel, which is the opposite of the reference. It also created a problem the data exposed: `trash2treasure`
has an iOS frame and status bar already baked into every screenshot, so a phone bezel nests a phone frame
inside a phone frame. Removing the bezel fixes this for free and lets one primitive fit all six apps.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See the apps as finished products (Priority: P1)

A visitor reaches the showcase and sees the apps presented the way a product page presents a product:
floating at an angle, against colour, with depth, rather than as thumbnails in a list.

**Why this priority**: This is the request. The screenshots already exist in the data and were used nowhere
on the landing page.

**Independent Test**: Open `/` and verify four 3D scenes render below the icon row, each showing one
project's screenshot floating at an angle over a coloured backdrop, each captioned with its name and a
short description.

**Acceptance Scenarios**:

1. **Given** the Projects section on the landing page, **When** it scrolls into view, **Then** four 3D scenes appear below the icon row
2. **Given** any scene, **When** it is inspected, **Then** the screenshot is tilted in 3D and is not a flat frontal rectangle
3. **Given** any scene, **When** it is inspected, **Then** a second panel sits behind the screenshot at a different angle, so the scene has depth
4. **Given** any scene, **When** it is inspected, **Then** a coloured backdrop sits behind the panels
5. **Given** any scene, **When** it is inspected, **Then** a project name and short description appear beneath it, and both belong to the project in that scene

---

### User Story 2 - Watch more than four of the six (Priority: P1)

A visitor who stays on the section watches the scenes change, and no project repeats in the same column on
consecutive cycles.

**Why this priority**: Four of six are visible at a time. Without rotation two projects would never be seen.

**Independent Test**: Open `/`, watch three full cycles, and verify no column shows the same project twice
in a row and that all six projects are seen.

**Acceptance Scenarios**:

1. **Given** the showcase is on screen, **When** a cycle completes, **Then** four different projects are shown
2. **Given** two consecutive cycles, **When** they are compared, **Then** no column shows the same project in both
3. **Given** a visitor scrolls away and back, **When** the showcase is visible again, **Then** the cycle did not restart
4. **Given** fewer than four projects exist, **When** the showcase renders, **Then** it shows what exists and does not repeat to fill the gap

---

### User Story 3 - Read it on a phone (Priority: P1)

A visitor on a phone gets one scene at a time, full width, rather than four squeezed side by side.

**Why this priority**: Four scenes at 390px would be ~90px each, too small to read or to appreciate the 3D.

**Independent Test**: Open `/` at 390px and verify exactly one scene per row.

**Acceptance Scenarios**:

1. **Given** a viewport below 1024px, **When** the showcase renders, **Then** the scenes stack in a single column
2. **Given** a viewport below 1024px, **When** the page is measured, **Then** there is no horizontal overflow
3. **Given** a single-column scene, **When** it is inspected, **Then** the caption is directly beneath its own screen

---

### User Story 4 - Control or avoid the movement (Priority: P1)

A visitor can stop the rotation by hovering or focusing it, a visitor on a phone tab cannot be shown a
cycle they did not see, and a visitor who has asked for reduced motion sees static scenes with no rotation
and no floating.

**Why this priority**: The rotation runs on a 6s loop, which is exactly the movement WCAG 2.2.2 covers. The
reference itself auto-rotates with no visible control, which is why none is added here either, but the
mechanisms that cost nothing must all be present.

**Independent Test**: Hover the showcase and verify the cycle stops; emulate `prefers-reduced-motion: reduce`
and verify nothing moves.

**Acceptance Scenarios**:

1. **Given** the showcase is hovered, **When** a cycle would advance, **Then** it does not
2. **Given** focus is inside the showcase, **When** a cycle would advance, **Then** it does not
3. **Given** the document is hidden, **When** time passes, **Then** no cycle elapses
4. **Given** reduced motion is enabled, **When** the showcase renders, **Then** the scenes are visible, the cycle never changes, and no element carries a transform
5. **Given** the showcase renders, **When** it is inspected, **Then** it contains no play/pause button

---

### Edge Cases

- **Fewer projects than columns**: shows what exists and does not repeat, because a repeat contradicts
  User Story 2.
- **A project with no screenshot**: the front panel keeps its size with a neutral surface; the back panel
  and the caption still render.
- **A failed screenshot**: identical to the missing one, in place, so the grid does not reflow.
- **Screenshots of different aspect ratios**: the six first captures measure 0.462, 0.563, 0.584, 0.575,
  0.462 and 0.632 width-to-height. All are portrait, so one portrait panel fits all of them, and `contain`
  shows each whole rather than cropping the tallest and letterboxing nothing.
- **A project id with no accent of its own**: the accent is derived from the id, so a project added later
  still gets a colour and two projects cannot collide.
- **Screenshot weight**: the first capture is 69KB–508KB. Six are lazy and asynchronously decoded, and the
  section is below the fold on every viewport measured.
- **Reduced motion and the backdrop**: the coloured blobs stay, because a static colour is not motion. Only
  transforms and transitions are removed.
- **The shared section is untouched**: this is another `featuredItems` child, so `SectionSummary` needs no
  change.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The landing page's Projects section MUST render the showcase directly below the icon row,
  inside the same `featuredItems` slot, and MUST NOT change `SectionSummary`.
- **FR-002**: The showcase MUST show four scenes at 1280px and above, two from 1024px to 1279px, and one
  below 1024px. Four at exactly 1024px was rejected: a caption beside a scene leaves ~230px per column,
  which is too narrow to read.
- **FR-003**: Each column MUST show a different project from every other column at the same moment, and MUST
  NOT show, in the same column, a project that the immediately preceding cycle showed.
- **FR-004**: The cycle MUST advance every 6 seconds, driven by an explicit counter rather than by
  inspecting the currently visible projects, and MUST stop permanently under `prefers-reduced-motion: reduce`.
- **FR-005**: Each scene MUST be built in CSS 3D with `perspective` and `transform`, and MUST NOT use
  `react-device-bezels`, WebGL, `three.js`, or any other rendering dependency. The showcase MUST add zero
  bytes to the bundle beyond its own CSS.
- **FR-006**: Each scene MUST NOT render a phone bezel, notch, status bar or device chrome of any kind. The
  screenshot is the scene's front panel, presented on its own.
- **FR-007**: Each scene MUST contain at least two panels at different 3D angles within one `preserve-3d`
  stack, so the scene reads as layered depth rather than as a single tilted rectangle.
- **FR-008**: Each scene MUST sit over a soft coloured backdrop built from low-opacity radial gradients, and
  each project MUST keep its own accent across cycles rather than taking the colour of its column.
- **FR-009**: The screenshot MUST be fitted with `object-fit: contain` and MUST NOT be cropped, stretched or
  letterboxed into an unreadable strip, because every source is portrait with a differing ratio.
- **FR-010**: Each scene MUST be accompanied by the project's name and its existing short `description`, and
  the two MUST belong to the project in that scene.
- **FR-011**: The scene MUST use only surfaces and text colours that already exist as tokens, and MUST NOT
  introduce a new text colour. The accent gradients are the only new colour values and they are decorative,
  never behind text.
- **FR-012**: Screenshots MUST be lazy-loaded and asynchronously decoded.
- **FR-013**: The scenes MUST become visible when the section reaches the viewport, driven by
  `useIntersectionObserver` with `triggerOnce`, so a visitor who never scrolls to them is not shown an
  animation.
- **FR-014**: Where `IntersectionObserver` is unavailable the scenes MUST render visible.
- **FR-015**: The showcase MUST remain accessible: names and descriptions MUST be readable by a screen
  reader, and the scenes MUST NOT be the only route to a project, since the section keeps its own call to
  action.
- **FR-016**: A missing or failed screenshot MUST leave the front panel at its size over a neutral surface,
  and MUST NOT remove the name, the description or the back panel.
- **FR-017**: The timer MUST pause while the document is hidden, on hover and on focus-within, and MUST NOT
  jump when it becomes visible again.
- **FR-018**: Under reduced motion the floating animation and the entrance MUST NOT run, and no element of
  the showcase MUST carry a transform.
- **FR-019**: The showcase MUST render nothing when the project list is empty.
- **FR-020**: The showcase MUST NOT render a play/pause control. The reference auto-rotates without one, and
  the user declined a matching control on the technology marquee. Hover, focus, document-hidden and reduced
  motion all pause it, and the content is reachable independently through the section's call to action.

### Key Entities

- **Scene**: one project's presentation: a coloured backdrop, a 3D stack of two panels, the front one
  holding the screenshot, and a caption. It is the unit of layout, of rotation and of the entrance.
- **Back panel**: the coloured panel behind the screenshot, standing in for the second device in the
  reference. It carries the project's accent and no artwork.
- **Cycle**: one arrangement of four projects. The rotation advances a counter between cycles.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Four scenes render below the icon row at 1440x900 and 1280x800, two at 1024x768, and one per
  row at 768x1024, 390x844 and 320x640.
- **SC-002**: Every front panel has a computed `transform` that is a 3D matrix and is not `none`, and its
  parent stage has a `perspective` above 0. The scene is tilted, not flat.
- **SC-003**: Every scene contains two panels at different computed transforms, so no scene is a single
  rectangle.
- **SC-004**: Every screenshot is `object-fit: contain` and is neither cropped nor distorted: its rendered
  box preserves the source ratio inside the panel.
- **SC-005**: Across three cycles with six projects and four columns, each project appears exactly twice and
  no column repeats its previous project. Asserted on the pure rotation function, without a timer.
- **SC-006**: Each scene's name and description match the project in that scene, across three cycles.
- **SC-007**: Each project keeps its own accent when it moves between columns.
- **SC-008**: Under reduced motion every scene is visible, the projects do not change after eight seconds,
  and no showcase element carries a transform.
- **SC-009**: Hovering the showcase stops the cycle; blurring resumes it.
- **SC-010**: The showcase has no horizontal overflow at 320px, and total layout shift stays below 0.1.
- **SC-011**: Every screenshot has a non-empty `alt` naming its project, and no scene is a link.
- **SC-012**: axe reports zero violations at 1440, 768, 390 and 320.
- **SC-013**: The icon row above is unchanged: six frames at 96x96 with their three-layer shadow, and its own
  entrance still runs.
- **SC-014**: The showcase adds no runtime dependency: `package.json` gains no entry, and the bundle does not
  grow by more than the component's own CSS.
- **SC-015**: The suite passes, and no existing test is deleted rather than rewritten.

## Assumptions

- Four columns is the desktop arrangement because the request asks for four divisions; the rotation is what
  makes that viable with six projects. Two columns at 1024–1279px is a judgement call between the request's
  four and its mobile readability.
- The caption sits beneath the scene rather than beside it. Beside is what the request said, but at four
  columns a side-by-side caption leaves ~230px, which is why the layout is stacked in the grid and the
  caption stays directly adjacent to its own scene.
- The accent palettes are soft and low-opacity over the existing light surface, so the section still reads as
  the white and black the site already uses while each scene gains colour. Colour is decoration only and is
  never behind text.
- Only the first screenshot of each project is used, fitted whole. The others exist in the data and are on
  `/projects`.
- The scenes are not clickable. The section's existing call to action is the route onward.
- The floating animation is a slow, small bob rather than a dramatic spin, because a portfolio that moves
  constantly is harder to read and WCAG 2.2.2 applies to it.
- The showcase stays inside the Projects section rather than becoming its own page section, because the
  request places it directly after the icons.