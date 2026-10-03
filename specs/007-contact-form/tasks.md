---

description: "Task list for feature 007 contact form"
---

# Tasks: Contact Form

**Input**: Design documents from `/specs/007-contact-form/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/contact-form.md, quickstart.md

**Tests**: Included. Constitution principle III requires tests for important logic and
critical components, and every feature in this repository ships with them. Test tasks are
written before the implementation they cover and must fail first.

**Organization**: Tasks are grouped by user story so each story can be implemented,
tested and delivered on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel, different files with no dependency between them
- **[Story]**: Which user story the task belongs to
- File paths are exact

## Path Conventions

Single project at the repository root: `src/`, `tests/`

- Unit tests go in `tests/`, matching `include: ['tests/**/*.test.{ts,tsx}']`
- Component tests live beside their component, matching `include: ['src/**/*.test.{ts,tsx}']`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create the folder structure for `ContactForm` and `FormField`, each with its `.tsx`, `.styles.ts`, hook, test and `index.ts` barrel, as the constitution requires
- [X] T002 [P] Declare `VITE_WEB3FORMS_ACCESS_KEY` in the `ImportMetaEnv` interface in `src/vite-env.d.ts`
- [X] T003 [P] Pass `VITE_WEB3FORMS_ACCESS_KEY` from repository secrets into the build step of `.github/workflows/deploy.yml`

**Why T003 matters**: the build step currently receives no environment, so a key read from
`import.meta.env` is `undefined` in the deployed bundle while working perfectly locally. The
form then renders its unavailable state in production only. This task is the difference
between the feature working and being dead on the day it ships.

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Add `ContactFormValues`, `SubmissionStatus`, `ValidationErrors` and `SubmissionResult` to `src/types/contact.ts`
- [X] T005 [P] Add error and success colour tokens to `src/styles/tokens.css` and expose them in `src/styles/tokens.ts`, computing each value against white and `--color-bg-muted` at AA (FR-017)
- [X] T006 [P] Implement `src/components/sections/ContactForm/submitContactForm.ts` as the only place that knows the provider: it never throws, honours the `AbortSignal`, resolves on timeout, and returns visitor-safe Spanish messages (FR-019, FR-020)
- [X] T007 [P] Implement `src/components/sections/ContactForm/contactFormConfig.ts` exposing `getAccessKey`, trimming the value and returning `undefined` when absent or blank (FR-023)
- [X] T008 Implement `src/components/ui/FormField/FormField.tsx` and `FormField.styles.ts`, using the render-prop shape so the label association, the error link and the invalid flag are written once for three fields (FR-015)
- [X] T009 Write `src/components/ui/FormField/FormField.test.tsx` covering label association, the invalid state, `aria-describedby`, and hint versus error

**Note on T005**: the brand blue fails as small text on the muted background, which is why
`--color-accent-text` exists. Compute the error and success values the same way and only
commit values that clear the threshold.

**Checkpoint**: Foundation ready — user story implementation can now begin

## Phase 3: User Story 1 - Send a message (Priority: P1) 🎯 MVP

**Goal**: A visitor fills in the form, sends it once, sees progress and gets a confirmation.

**Independent Test**: With valid data and consent accepted, exactly one submission is
delivered, the control shows progress, the confirmation appears and the fields clear.
Verified with `fetch` mocked.

### Tests for User Story 1 ⚠️ write these FIRST, ensure they FAIL

- [X] T010 [US1] Write failing component tests in `src/components/sections/ContactForm/ContactForm.test.tsx` for rendering the three fields and the consent box, the sending state, the confirmation clearing the fields, the duplicate submission guard, the fields clearing after success (FR-009), and the honeypot being hidden from assistive technology

### Implementation for User Story 1

- [X] T011 [US1] Implement `src/components/sections/ContactForm/useContactForm.ts` holding the values, the status and the submit handler, returning early when a request is already in flight (FR-008)
- [X] T012 [US1] Implement `src/components/sections/ContactForm/ContactForm.tsx` with the form element, the three fields, the consent checkbox, and the `botcheck` honeypot marked `aria-hidden` with `tabIndex={-1}` (FR-001, FR-002)
- [X] T013 [US1] Implement `src/components/sections/ContactForm/ContactForm.styles.ts`, left-aligned inside the existing 600px column and reusing the spacing scale (FR-024)
- [X] T014 [US1] Reuse `Button` with `type="submit"` and `isLoading`, without modifying `Button` itself, so the control disables itself and shows its spinner (FR-007, FR-008)
- [X] T015 [US1] Add the informative note beside the consent box telling the visitor that the message is relayed through a third-party service (FR-021)
- [X] T016 [US1] Create the `src/components/sections/ContactForm/index.ts` barrel
- [X] T017 [US1] Render `ContactForm` inside `src/components/sections/Contact/Contact.tsx` below the existing methods, leaving those methods untouched (FR-027, FR-028)
- [X] T018 [US1] Render the unavailable message when `getAccessKey` returns `undefined`, and issue no request in that state

**Checkpoint**: User Story 1 should be fully functional and testable independently

## Phase 4: User Story 2 - Be told what to fix when the data is invalid (Priority: P2)

**Goal**: A rejected submission names each problem next to the field that caused it, and
nothing is sent.

**Independent Test**: Submit the empty form, then submit one with a malformed email address.
Every problem is identified individually and no request is made.

### Tests for User Story 2 ⚠️ write these FIRST

- [X] T019 [P] [US2] Write failing unit tests in `tests/unit/validate-contact-form.test.ts` for required fields, email format, trimming, length limits and consent
- [X] T020 [P] [US2] Write failing component tests in `src/components/sections/ContactForm/ContactForm.test.tsx` for the invalid state, per-field clearing on change, and nothing being sent while invalid

### Implementation for User Story 2

- [X] T021 [US2] Implement `src/components/sections/ContactForm/validateContactForm.ts` as a pure function returning `ValidationErrors` with Spanish messages, accepting `+` suffixes and subdomains, and normalising surrounding whitespace and capitalisation (FR-003, FR-005, FR-026)
- [X] T022 [US2] Run validation on submit, and again per field on change once that field has been flagged, so a corrected problem stops being reported (FR-013)
- [X] T023 [US2] Block submission entirely when validation fails (FR-002)
- [X] T024 [US2] Render each message beside its own field through `FormField`, with `aria-invalid` set (FR-006, FR-015)
- [X] T025 [US2] State each field's maximum length before the visitor types (FR-004)

**Checkpoint**: User Stories 1 AND 2 both work independently

## Phase 5: User Story 3 - Recover from a failed submission (Priority: P3)

**Goal**: A failure is explained in plain language, nothing typed is lost, and retrying needs
no extra step.

**Independent Test**: Force a delivery failure, then confirm the message is visible, the
entered content survives, and a second attempt works without retyping.

### Tests for User Story 3 ⚠️ write these FIRST

- [X] T026 [US3] Write failing component tests in `src/components/sections/ContactForm/ContactForm.test.tsx` for the failure message, the preserved values, and the retry without retyping

### Implementation for User Story 3

- [X] T027 [US3] Map every `SubmitContactResult` reason to a Spanish message free of provider wording (FR-010)
- [X] T028 [US3] Keep the entered values on failure and leave submission available, so the retry needs no extra step (FR-011, FR-012)
- [X] T029 [US3] Announce progress and success through `role="status"` and failure through `role="alert"`, as separate live regions so an error is not lost when focus is elsewhere (FR-016)
- [X] T030 [US3] Resolve a hung request through the timeout into the failure state instead of leaving the form sending forever (FR-011)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T031 [P] Run the accessibility pass: full keyboard order, visible focus at every stop, and zero WCAG 2.1 A/AA violations in the empty, invalid, sending and unavailable states (FR-014, FR-017, SC-007)
- [ ] T032 [P] Check the responsive behaviour at 320px, 375px and 768px: no horizontal scrolling, controls large enough to tap (FR-018, SC-008)
- [ ] T033 [P] Confirm the contact section still reads well with the taller block, since `min-height` is a minimum and not a cap
- [ ] T034 [P] Confirm `package.json` is unchanged and no dependency or user-interface framework was added (FR-025, SC-009)
- [ ] T035 [P] Confirm `.env` and `.env.local` are untracked and the access key appears nowhere in the repository (FR-022)
- [ ] T036 Run the full suite: `npm test`, `npm run test:component`, `npm run lint`, `npm run typecheck`, `npm run build`
- [ ] T037 Run the manual verification list in `quickstart.md`
- [ ] T038 Update `spec.md` status and add implementation notes recording the service decision and the workflow change

---

## Dependencies & Execution Order

### Human prerequisite, outside the task list

Creating the account, verifying the destination email, adding the repository secret and
putting the key in `.env.local` are all manual. Until they are done, a real submission cannot
be made, so the end-to-end happy path is verified with `fetch` mocked and the live delivery is
confirmed after the secret exists. Every other state, including the failure path with the
network blocked, is verifiable before that.

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies, can start immediately
- **Foundational (Phase 2)**: depends on Setup, and **blocks all user stories**
- **User Stories (Phases 3 to 5)**: all depend on Foundational; they can then run in parallel,
  or in priority order P1 to P3
- **Polish (Phase 6)**: depends on the stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: starts after Foundational, no dependency on the others
- **User Story 2 (P2)**: starts after Foundational, independently testable. It adds validation
  on top of a working form rather than depending on US1 being finished first
- **User Story 3 (P3)**: starts after Foundational, independently testable. It adds the failure
  path on top of a working form

The validator sits in US2 rather than in Foundational on purpose: putting it in the
foundation would make US1 depend on validation to exist, and US1 would stop being a viable
MVP on its own.

### Within Each User Story

- Tests must be written and fail before the implementation they cover
- The provider seam and the field primitive exist before any story renders them
- The hook before the markup, because the markup only reflects state
- Story complete before moving to the next priority

### Parallel Opportunities

- T002 and T003 touch different files and can run together
- T005, T006 and T007 touch different files and can run together
- T019 and T020 are different files and can run together
- T031 through T035 are read-only verifications and can run together

---

## Parallel Example: Foundational phase

```bash
# These three touch different files:
Task: "T005 Add error and success colour tokens to src/styles/tokens.css and expose them in src/styles/tokens.ts"
Task: "T006 Implement src/components/sections/ContactForm/submitContactForm.ts"
Task: "T007 Implement src/components/sections/ContactForm/contactFormConfig.ts"
```

## Implementation Strategy

### MVP First, User Story 1 only

1. Phase 1 Setup
2. Phase 2 Foundational
3. Phase 3 User Story 1
4. **STOP and VALIDATE**: a visitor can send one message and is told it went through
5. Deploy if the secret is ready

### Incremental Delivery

1. Setup plus Foundational, foundation ready
2. User Story 1, validate, deploy: sending works
3. User Story 2, validate: invalid input is explained instead of silently failing
4. User Story 3, validate: a failure no longer loses the visitor's message
5. Polish: accessibility, responsive, full suite

Each story adds visible value without breaking the previous one.

---

## Implementation Notes, Phases 1 and 2

- The build step of the deploy workflow had no `env:` block at all, so this was not a case
  of a missing secret name but of the build receiving no environment whatsoever. Verified by
  parsing the workflow with `js-yaml` and asserting the key resolves under the build step.
- `VITE_WEB3FORMS_ACCESS_KEY` is declared optional. It genuinely can be absent, in CI and in
  a local checkout without `.env.local`, so declaring it required would have made the type
  lie and contradicted `getAccessKey(): string | undefined`.
- Status colours were computed against both backgrounds rather than picked by eye:
  `--color-danger #C8102E` reaches 5.88:1 on white and 5.40:1 on muted, `--color-success
  #157347` reaches 5.87:1 and 5.39:1. Both clear AA as small text, which matters because the
  validation messages render at label size.
- A lighter red was tried for the invalid field border and dropped: no tint reaches the 3:1
  that WCAG 1.4.11 wants from a non-text indicator on the muted background, and the nearest
  candidate managed 2.88:1 there. The border reuses `--color-danger` and the error text
  carries the meaning, so no separate token was added.
- `tokens.ts` already carried `error`, `errorBg`, `success` and `successBg` aliases in its
  backward-compatibility block. Nothing referenced them, and both `error` and `success`
  resolved to `var(--color-accent)`, so `tokens.colors.success` would have painted a success
  message blue. They collided with the new `success` key, and the dead misleading aliases were
  removed rather than renamed around.
- `submitContactForm` reports the failure reason without forwarding the provider's message,
  because that message is written for site owners rather than visitors. A timeout is
  distinguished from an external cancellation, so unmounting does not read as a failure the
  visitor caused.


### Phase 3, User Story 1

- `fetch` is called through a small seam and stubbed per test, so nothing in the suite reaches
  the network. The duplicate-submission test asserts one single call while the control is
  already disabled, because that proves the guard lives in the handler and not only in the
  appearance of the button.
- The form replaces itself with a short explanation when the build carries no access key,
  rather than showing three fields and a button that cannot work. The notice points at the
  email address, which the section above still offers.
- The honeypot keeps `aria-hidden` on both the wrapper and the input: inheritance into the
  subtree is handled inconsistently across screen readers. jsdom cannot verify the visual
  clipping because it does not evaluate stylesheets, so the browser check confirms the wrapper
  is 1x1 with `overflow: hidden` and that the field never appears in the tab order.
- Keyboard order measured in a real browser: nombre, email, mensaje, consentimiento, enviar,
  then the existing contact methods and the site navigation. Zero axe WCAG A/AA violations.
- A full-page screenshot appeared to show the fixed header overlapping the section. It was a
  stitching artefact of capturing a `position: fixed` element, not a layout bug: the header
  ends at 52px and the first block starts at 80px. Verified with a viewport screenshot.
- `.env.local` was created locally with a placeholder key so the form renders. It is
  gitignored. Until it holds the real key, a real submission will fail at the provider.

### Phases 4 and 5, validation and failure

- The email pattern is deliberately permissive: it requires a local part, an at sign, a
  domain and a plausible top level domain, and rejects the mistakes that actually happen.
  It accepts `+` suffixes, subdomains and capitalisation, because a visitor told their own
  address is invalid stops trusting the form.
- Field errors carry no live-region role. `aria-invalid` plus `aria-describedby` makes the
  error announced when focus lands on the field, and a live region would announce it a
  second time at the moment it appears. The form announces its own outcome separately:
  `role="status"` for progress and success, `role="alert"` for failure.
- Focus moves to the first field that failed. Without it, an error appearing away from where
  the visitor is looking is never announced at all.
- A field is re-checked only once it has been flagged. Validating from the first keystroke
  would tell someone still typing their email that it is wrong.
- Correcting the outstanding problem clears its message but does not send anything: the
  visitor presses send again, which is what stops a stray click from delivering a message.
- The honeypot, the form and its tests surfaced a false positive worth recording: the
  timeout test mocked `fetch` with a promise that never settles and ignored the abort signal.
  A real fetch rejects when aborted, so the timeout could never fire and the test proved
  nothing while appearing to exercise the path. The mock now honours the signal.
- A failing test that installed fake timers left them installed and hung every later test in
  the file. An `afterEach` now restores real timers, so one failure cannot cascade.
- The implementation of the failure path landed with US1, because the provider seam was built
  there. US3's value turned out to be the tests that prove it, which is where a silent gap
  would have cost a visitor their composed message.

- End-to-end delivery is BLOCKED, and the cause is the provider's free-tier policy, not this
  code. Web3Forms answers every request from a github.io subdomain with no
  Access-Control-Allow-Origin on the preflight, so the browser never sends the POST. Confirmed
  three ways: curl, a browser from localhost, and a browser from the real
  https://ismaelmarot.github.io origin. The request contract matches their documented
  client-side integration, there is no CSP on this site, and their own troubleshooting guide
  states the free plan does not allow the free sub-domain, only a custom domain or a paid plan.
  The earlier reading of an IP block was wrong and is superseded: the production test disproved
  it. Resolving this means choosing between the provider's paid plan, a custom domain, or a
  different provider, and the last one is local to submitContactForm.ts by design.
  Two consequences were acted on regardless of the cause:
  - The network failure message no longer tells the visitor to check their connection. A
    rejected fetch cannot distinguish an offline visitor from a provider outage from a
    provider refusing us at the network layer, so the old copy asserted a cause we cannot
    know and sent people to reboot a working router.
  - Feature 007 stays short of `Implemented` until a real submission is confirmed from the
    deployed site on an ordinary connection. Everything else is verified.

## Notes

- [P] marks tasks that touch different files with no dependency between them
- [Story] maps each task to its user story for traceability
- Tests go first and must fail before the implementation
- Stop at any checkpoint to validate the story independently
- `Button`, `Section`, `Container` and `site-config.ts` are not modified. If an implementation
  starts editing `Button`, the plan was wrong and the task needs revisiting
- `fetch` must be mocked in tests; nothing in the suite may reach the network
- jsdom does not resolve `import.meta.env`, so the access key has to be stubbable or every
  test exercises the unavailable path and none exercises the form
- There is one commit per phase, or per logical group, and none before the checkpoint passes