# Feature Specification: Contact Form

**Feature Branch**: `007-contact-form`

**Created**: 2026-10-03

**Status**: Retirada

> **Retirada el 2026-10-03.** La implementación se completó, se probó y se desplegó, y luego se
> retiró. El motivo es que ningún proveedor de relay sin servidor entrega desde un subdominio
> `*.github.io` en plan gratuito: Web3Forms bloquea ese origen por política de antiabuso y lo
> documenta como algo que no se aprueba sin plan de pago, y la entrega tampoco se produjo con su
> segundo modo de envío. Un formulario visible que siempre falla es peor que no tener formulario,
> así que el contacto queda como métodos directos con enlace `mailto`.
>
> El trabajo se conserva en `b4679e0` por si vuelve a hacer falta con un plan de pago, un dominio
> propio u otro proveedor. Todo el diseño, la validación y los estados eran correctos e
> independientes del proveedor; solo la entrega no tenía salida gratuita.

**Input**: User description: "Add a contact form to my portfolio website. The website is a static React + TypeScript + Vite application deployed on GitHub Pages. The contact section must allow visitors to send a message to me using: Name, Email, Message, Submit button. The form must: Validate required fields. Validate email format. Show validation errors. Show a loading/submitting state. Prevent duplicate submissions while submitting. Show a success state after a successful submission. Show an error state if submission fails. Be keyboard accessible. Work correctly on desktop, tablet and mobile. Because the website is deployed on GitHub Pages, it must NOT require a custom backend, database, server, or server-side code. Use a third-party service designed for static websites, such as Formspree, Web3Forms, or EmailJS. The implementation should: Use the existing project architecture. Reuse existing components. Reuse existing styled-components and design tokens. Avoid unnecessary dependencies. Avoid introducing a new UI framework. Avoid unrelated refactoring. The contact form should visually match the existing portfolio. Before implementation, inspect the existing codebase and determine the appropriate integration point and architecture. The external form service should be selected during the planning phase based on simplicity, GitHub Pages compatibility, security, and suitability for a personal portfolio."

Resolved decisions: consent checkbox plus an informational note about the third-party relay; all labels and messages in Spanish to match the contact section; no account yet, so the service is chosen during planning.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Send a message (Priority: P1)

A visitor opens the contact section of the portfolio, fills in their name, email address and message, accepts the consent box and sends it. They get a visible confirmation that their message went through, and the message reaches the owner's inbox.

**Why this priority**: This is the entire point of the feature. Without it the contact section only offers ways to reach the owner indirectly, and every other story is a refinement of this flow.

**Independent Test**: Can be fully tested by sending one valid message and observing both the on-screen confirmation and the arrival of the message, without any other story implemented.

**Acceptance Scenarios**:

1. **Given** the contact page with every field empty, **When** the visitor fills in a name, a valid email address and a message and accepts the consent box, **Then** the message is delivered and a confirmation is shown on screen.
2. **Given** a submission is in progress, **When** the visitor activates the send control again, **Then** no second message is sent and the control remains unavailable until the first attempt finishes.
3. **Given** a message was sent successfully, **When** the confirmation is shown, **Then** the fields are cleared so the visitor can compose another message.

---

### User Story 2 - Be told what to fix when the data is invalid (Priority: P2)

A visitor forgets a field or mistypes the email address. Instead of nothing happening, or one generic message, each problem is pointed out next to the field that caused it, so the visitor knows exactly what to change.

**Why this priority**: Without it, invalid submissions either fail silently or produce a single opaque error. It is the difference between a visitor retrying successfully and a visitor giving up.

**Independent Test**: Can be fully tested by submitting an empty form, then a form with a malformed email address, and observing that each problem is identified individually.

**Acceptance Scenarios**:

1. **Given** an empty form, **When** the visitor tries to send, **Then** every required field is identified with its own message and nothing is sent.
2. **Given** a malformed email address, **When** the visitor tries to send, **Then** the email field is identified with a message describing the expected format and nothing is sent.
3. **Given** the consent box is not accepted, **When** the visitor tries to send, **Then** the consent requirement is identified and nothing is sent.
4. **Given** the visitor corrects the flagged problems, **When** they send again, **Then** the message goes through without the earlier problems reappearing.

---

### User Story 3 - Recover from a failed submission (Priority: P3)

The delivery service is unavailable, the connection drops, or something unexpected goes wrong. The visitor gets an honest, non-technical explanation, their typed message is still there, and they can try again without rewriting everything.

**Why this priority**: Failures are rare but the cost of losing a composed message is high, and a visitor who loses their text is unlikely to retype it.

**Independent Test**: Can be fully tested by forcing a delivery failure, then checking that the error is visible, the entered content survives, and a second attempt is possible.

**Acceptance Scenarios**:

1. **Given** a complete and valid form, **When** delivery fails, **Then** a visible error explains that the message could not be sent, without exposing technical internals.
2. **Given** a failed submission, **When** the visitor looks at the form, **Then** the name, email and message they typed are still there.
3. **Given** a failed submission, **When** the visitor retries, **Then** the same content can be sent again without retyping.

---

### Edge Cases

- The visitor activates send twice in quick succession, or presses the Enter key repeatedly while typing: only one message is ever delivered.
- The device is offline, the service is down, the request times out, or the service answers with an error: the failure state appears rather than a false confirmation.
- The visitor presses Enter inside a text field instead of using the send control: the form is sent, as a keyboard user would expect.
- The visitor pastes or types a message far longer than the field allows: the maximum length is stated in advance and the content is cut rather than silently truncated on send.
- The email address contains stray spaces, capital letters or a plus suffix: it is accepted and normalised, since these are common and legitimate.
- The consent box is left unchecked: sending is blocked and the requirement is pointed out.
- A visitor who only uses the keyboard reaches and operates every control in a logical order and can always see where focus is.
- A screen reader announces each validation error, the in-progress state and the final outcome.
- A 320px-wide screen: the form fits without sideways scrolling and the controls remain large enough to tap.
- The visitor submits, succeeds, and then writes a second message: the form does not carry leftover content into the new message.

## Requirements *(mandatory)*

### Functional Requirements

**Fields and validation**

- **FR-001**: Visitors MUST be able to send a message from the contact section using a name, an email address and a message body.
- **FR-002**: The name, the email address, the message body and the consent confirmation MUST all be required; an empty value in any of them blocks submission.
- **FR-003**: The system MUST check the email address for a valid format and MUST reject clearly malformed values without contacting any service.
- **FR-004**: Each input MUST have a maximum length stated before the visitor types, and MUST refuse content beyond it.
- **FR-005**: Email addresses MUST be accepted regardless of surrounding whitespace and capitalisation.

**Feedback and states**

- **FR-006**: Every rejected submission MUST identify each problem next to the field that caused it, not only as a single combined message.
- **FR-007**: The system MUST show a visible state while a submission is in progress, so the visitor knows the message is being sent.
- **FR-008**: While a submission is in progress, the system MUST ignore further submission attempts so no duplicate message is delivered.
- **FR-009**: After a message is accepted for delivery, the system MUST show a visible confirmation and clear the fields.
- **FR-010**: If delivery fails, the system MUST show a visible error that a non-technical visitor can understand and act on.
- **FR-011**: After a failure, the system MUST preserve everything the visitor typed so the message can be retried without retyping.
- **FR-012**: A retry after a failure MUST be possible without any extra step.
- **FR-013**: Validation problems MUST be resolved as soon as they are corrected, and MUST NOT reappear once fixed.

**Accessibility**

- **FR-014**: The whole flow MUST be completable using only the keyboard, with a logical focus order and a visible focus indicator on every control.
- **FR-015**: Each field MUST have a programmatically associated label, and each validation message MUST be programmatically associated with the field it describes.
- **FR-016**: Changes of state, including validation errors, the in-progress state, the confirmation and the failure, MUST be announced to assistive technology.
- **FR-017**: The contact section MUST meet WCAG 2.1 level AA, including colour contrast for labels, errors, the confirmation and the failure.
- **FR-018**: The form MUST work at 320px, 375px, 768px and wider viewports without horizontal scrolling, and its controls MUST be large enough to tap on a touch screen.

**Delivery**

- **FR-019**: The site MUST remain fully static: delivering a message MUST NOT require a custom backend, a database, a server or any server-side code.
- **FR-020**: Messages MUST be relayed through a service designed for static websites, chosen during planning.
- **FR-021**: The visitor MUST be told, next to the form, that the message is relayed through a third-party service.
- **FR-022**: Nothing the visitor submits may be stored in the project repository or bundled into the site.
- **FR-023**: The visitor MUST NOT be required to supply any service credential, key or account.

**Consistency with the existing portfolio**

- **FR-024**: The form MUST reuse the existing visual language of the portfolio, including its existing components, its styling approach and its colour and spacing tokens.
- **FR-025**: The implementation MUST NOT introduce a new user-interface framework or any new runtime dependency beyond the ones already in use.
- **FR-026**: Labels, messages, validation text and the confirmation and failure states MUST be written in Spanish, matching the surrounding contact section.
- **FR-027**: The existing contact methods, meaning the email address, the GitHub profile and the LinkedIn profile, MUST remain available to the visitor.
- **FR-028**: The work MUST stay confined to the contact feature and MUST NOT include unrelated changes to the rest of the site.

### Key Entities

- **Contact message**: what the visitor writes. Composed of name, email address, message body, whether consent was given, and when it was sent.
- **Submission state**: where a single attempt currently stands. One of inactive, validating, sending, accepted or failed.
- **Delivery service**: the third-party endpoint that accepts a message and relays it to the owner's inbox. Its provider and the owner's account are decided during planning.
- **Validation problem**: a single reason a message cannot be sent, tied to the field that caused it, with text the visitor can act on.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can go from opening the contact section to seeing a delivery confirmation in under 60 seconds.
- **SC-002**: 100% of valid submissions are acknowledged on screen; no valid submission is silently discarded.
- **SC-003**: Zero duplicate messages are delivered under repeated activation of the send control, however fast the visitor presses it.
- **SC-004**: Every invalid submission identifies each problem individually, with text that tells the visitor what to change.
- **SC-005**: 100% of failures show a visible message, preserve the entered content, and allow a retry.
- **SC-006**: The entire flow is completable with the keyboard alone, verified step by step, and the focus indicator is visible at every stop.
- **SC-007**: The contact section has zero automated WCAG 2.1 A/AA violations when the form is empty, when it shows validation errors, and while it is sending.
- **SC-008**: The contact section shows no horizontal scrolling at 320px, 375px or 768px.
- **SC-009**: Adding the form introduces no new runtime dependency and no perceptible change in how fast the page loads.
- **SC-010**: A visitor who reaches the contact section can tell, before sending, that a message is expected to reach a real person.

## Assumptions

- The delivery service is chosen during planning from the services designed for static websites, comparing simplicity, compatibility with static hosting, security and fit for a personal portfolio. The owner creates the account and provides the endpoint. Until that exists, the flow can only be exercised against a stand-in.
- Delivery depends on a third party, so the portfolio can promise that the message was accepted and relayed, but cannot promise that it lands in the owner's inbox.
- Labels, messages and states are written in Spanish because the surrounding contact section is already in Spanish, even though most labels elsewhere on the site are in English.
- The existing contact methods stay. The form is added next to them, not in place of them.
- The consent box is required, and a short note explains that the message is relayed through a third-party service. The consent requirement is a deliberate choice for a portfolio that collects an email address and a free-text message from visitors in the European Union.
- Whether the form should degrade to a plain, no-JavaScript submission is a question for planning, not an assumption: at least one candidate service supports it, and it would be wasteful to rule it out without looking.
- Out of scope: visitor accounts, saved drafts, file attachments, routing to several recipients, any interface for reviewing spam, and analytics on submissions.
- A visitor on a slow connection is expected to wait for the in-progress state rather than seeing an unexplained delay.