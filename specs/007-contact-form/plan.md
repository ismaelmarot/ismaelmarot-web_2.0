# Implementation Plan: Contact Form

**Branch**: `007-contact-form` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-contact-form/spec.md`

## Summary

Add a contact form to the existing contact section so visitors can write to the owner
directly, instead of only reaching him through a linked profile.

Delivery goes through Web3Forms, a service for static sites, called with `fetch`. No
dependency is added: that is what rules out EmailJS, which needs its SDK, and it is what
FR-025 and the constitution require.

The work is smaller than it looks. `Button` already accepts a submit type, already shows a
spinner, and already disables itself while loading, which covers the in-progress state and
the duplicate-submission guard that the brief called out as requirements. What genuinely does
not exist yet is any form primitive, and any colour for error or success.

One finding changes the shape of the task: the deploy workflow passes no environment to the
build step, so a key read from `import.meta.env` would be `undefined` in production while
working perfectly on the developer's machine. The workflow has to grow an `env` block, and the
form has to degrade visibly when the key is absent rather than failing on submit.

## Technical Context

**Language/Version**: TypeScript 5, React 18, Vite
**Primary Dependencies**: none added. `fetch` is used directly
**Storage**: none. Visitor data is never persisted locally or in the repository (FR-022)
**Testing**: Vitest unit, Testing Library component, Playwright for the browser check
**Target Platform**: any modern browser, deployed to GitHub Pages under `/ismaelmarot-web_2.0/`
**Project Type**: static single-page web application
**Performance Goals**: no perceptible change in load; the form adds no runtime dependency (SC-009)
**Constraints**: no backend, no server-side code, no database (FR-019); WCAG 2.1 AA (FR-017);
no horizontal scrolling at 320px (FR-018)
**Scale/Scope**: one form, three fields plus a consent box, one section of one page

## Constitution Check

*GATE: passes. Re-checked after design; no violations found.*

| Principle | How this plan complies |
|---|---|
| I. Component-first | `ContactForm` and `FormField` each get their own folder with styles, hook, tests and barrel |
| II. Type safety | Form types extend `src/types/contact.ts`; the new env variable is declared in `ImportMetaEnv` |
| III. Testing | Pure validator gets unit tests, `ContactForm` gets component tests, the delivered flow gets a browser check |
| IV. Accessibility and performance | FR-014 to FR-017 are requirements, not follow-ups; no dependency means no bundle cost |
| V. Design principles | Reuses `Button`, the spacing scale and the existing section composition |
| VI. Simplicity and maintainability | No schema library for three fields; no CAPTCHA; no abstraction for a single consumer |

**Dependency rule**: satisfied with nothing added. `fetch` covers delivery.

**Styling rule**: `styled-components` only, component styles in `*.styles.ts`.

**Path alias**: all internal imports use `@/`.

## Design

### Integration point

The form is a sibling of the existing contact methods, inside the same section, in
`src/components/sections/Contact/Contact.tsx`. The methods stay exactly as they are (FR-027).

Two properties of the existing section drive the layout. `StyledContact` is capped at
600px and centred, so the form sets `text-align: left`; a centred label column is not
readable. And the section uses `fullViewport`, which applies `min-height: 100dvh`; that is a
minimum rather than a cap, so the section grows once the form is added instead of clipping it.

The decision to keep the 600px column rather than widen the section is deliberate. Widening
would change the identity of a section that already looks deliberate, and FR-028 forbids
touching the rest of the site.

### Layering

```text
Contact section
└── ContactForm          render + its own hook
    ├── FormField        label, association, error, hint  (new ui primitive)
    ├── Button           reused as-is
    ├── validateContactForm   pure
    ├── submitContactForm     the only file that knows the provider
    └── getAccessKey          build-time configuration
```

### Validation

`validateContactForm(values): ValidationErrors` returns a record keyed by field name, in
Spanish. Empty record means valid. Runs on submit, and again per field on change once that
field has been flagged, which is how a corrected problem stops being reported (FR-013).

The email check accepts what people actually type, including `+` suffixes and subdomains. A
stricter pattern would reject valid addresses, which is worse than accepting an unusual one.

### Submission

`submitContactForm` is the seam. It never throws, it honours an `AbortSignal`, and it has a
timeout, because a request that hangs leaves the form in the one state the visitor cannot
recover from. Failure messages are visitor-facing and free of provider wording.

The duplicate guard has two layers. `Button` disables itself while loading, and the submit
handler returns early if a request is already in flight. The first is the visible affordance,
the second is the actual guarantee; a test covers the guarantee rather than the affordance.

### Anti-spam

A honeypot field, `botcheck`, hidden from people and from assistive technology, with
`tabIndex={-1}`. No CAPTCHA: it adds a dependency, it adds friction to a portfolio's contact
form, and the provider already filters on its side.

### Configuration

The key comes from `VITE_WEB3FORMS_ACCESS_KEY`, declared in `ImportMetaEnv`, supplied to the
build step of the deploy workflow as a repository secret. When absent, the form renders an
unavailable message and never requests. That state is separate from `failed`, because
retrying cannot help a visitor whose form is not configured.

### Accessibility

Each field's label is associated with its control, `aria-invalid` marks a failure, and
`aria-describedby` points at the message, all inside `FormField` so it is implemented once
for three fields. Progress and outcome are announced through separate live regions, `status`
for progress and success, `alert` for failure; a single polite region would let an error
arrive while focus was elsewhere and go unheard.

## Project Structure

### Documentation (this feature)

```text
specs/007-contact-form/
├── spec.md                       # the specification
├── plan.md                       # this file
├── research.md                   # service comparison and codebase findings
├── data-model.md                 # values, status, errors, configuration
├── quickstart.md                 # setup, manual verification, files touched
├── contracts/contact-form.md     # provider, validation, component, field, config
└── checklists/requirements.md    # specification quality checklist
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── sections/
│   │   ├── Contact/                        # modified: renders the form
│   │   │   ├── Contact.tsx
│   │   │   ├── Contact.styles.ts
│   │   │   ├── useContact.ts
│   │   │   └── Contact.test.tsx
│   │   └── ContactForm/                    # new
│   │       ├── ContactForm.tsx
│   │       ├── ContactForm.styles.ts
│   │       ├── useContactForm.ts
│   │       ├── validateContactForm.ts
│   │       ├── submitContactForm.ts
│   │       ├── contactFormConfig.ts
│   │       └── ContactForm.test.tsx
│   └── ui/
│       └── FormField/                      # new primitive
│           ├── FormField.tsx
│           ├── FormField.styles.ts
│           └── FormField.test.tsx
├── types/contact.ts                         # modified: form types
├── styles/tokens.css, tokens.ts             # modified: error and success colours
└── vite-env.d.ts                            # modified: declare the env variable

.github/workflows/deploy.yml                 # modified: pass the key to the build
```

**Structure Decision**: the existing single-package layout is kept. `ContactForm` lives under
`sections` because it is part of the contact feature, not a general utility, while `FormField`
goes under `ui` because it is a reusable visual primitive and the constitution treats those
separately.

## Colour tokens

FR-017 requires error and success to pass AA, and the portfolio has no such tokens. This is
the same problem that produced `--color-accent-text` in feature 006: the brand blue is fine
for a control but fails as small text on the muted background.

So the values have to be chosen against both backgrounds, white and `#F5F5F7`, at the sizes
they will be used. That calculation is a task, not an assumption, and it is the same one done
before. Only pass the values that clear the threshold; the site already has a precedent for
the fix and for documenting why.

## Complexity Tracking

No constitution violations, so nothing to justify here. Two decisions worth recording because
they look like complexity and are not:

**A hand-written validator instead of a schema library.** Three fields and a checkbox. A
library would be a dependency, a bundle cost and a second way to express what one function
already says.

**A render prop in `FormField`.** It looks indirect for a text field. It exists so the label
association, the error link and the invalid flag are written once rather than copied across
three call sites, where they would drift.

## Risks

| Risk | Response |
|---|---|
| The key is missing in production and the form is dead there | Workflow change is part of the work, plus an unavailable state that says so |
| The public endpoint receives spam | Honeypot plus provider-side filtering; switching provider is a change to one function |
| The section was designed for a short, centred block and now holds a form | Keep the 600px column, left-align the form, and check the result at 320px, 768px and desktop |
| Error and success colours fail contrast on the muted background | Calculate against both backgrounds before committing values, as in feature 006 |
| A hanging request traps the visitor in the in-progress state | Timeout that resolves into the failure state |

## Verification

1. `npm test`, `npm run test:component`, `npm run lint`, `npm run typecheck`, `npm run build`.
2. Duplicate submission asserted in a test, not only by looking at the disabled control.
3. Browser check: `web3forms` sends a real request once the key exists, so until then verify
   the empty, invalid, sending and unavailable states, and the failure path with the network
   blocked.
4. No horizontal scrolling at 320px, 375px and 768px.
5. Zero WCAG 2.1 A/AA violations on the contact page in each state.
6. Full keyboard pass, in order, with focus visible at every stop.

## Next

`/speckit.tasks` to break this into the ordered, individually verifiable task list.