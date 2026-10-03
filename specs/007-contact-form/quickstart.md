# Quickstart: Contact Form

**Feature**: 007-contact-form
**Date**: 2026-10-03

## What you need before this works locally

An access key. The form renders a "not configured" message without one, and never attempts a
request, so this is the only setup step.

1. Create a form at `web3forms.com` and verify the email address the submissions should go to.
2. Copy the access key.
3. Create `.env.local` in the repository root:

```
VITE_WEB3FORMS_ACCESS_KEY=00000000-0000-0000-0000-000000000000
```

The key is a bare UUID with no prefix. Copy it exactly as Web3Forms shows it: a `w3f_` prefix
belongs to the separate W3Forms product, and pasting one here produces a key that is silently
wrong rather than obviously wrong.

`.env` and `.env.local` are already gitignored. The key cannot reach a commit by accident, and
`.env.example` documents the variable without carrying a value.

No `npm install` step: the form adds no dependency.

## Running it

```bash
npm run dev            # form works if the key is present
npm run test:component # component tests
npm test               # validator unit tests
npm run lint
npm run typecheck
npm run build
```

## Before the first deploy

The build in `.github/workflows/deploy.yml` currently receives no environment. Without this
change the key is `undefined` in the deployed bundle while working locally, and the form
degrades to its unavailable state in production only.

1. Add the key as a repository secret named `VITE_WEB3FORMS_ACCESS_KEY`.
2. Add to the build step of the deploy workflow:

```yaml
- name: Build project
  run: npm run build
  env:
    VITE_WEB3FORMS_ACCESS_KEY: ${{ secrets.VITE_WEB3FORMS_ACCESS_KEY }}
```

## Manual verification

Run `npm run dev`, open `/contact`, and walk this list. Every row is a requirement, not a
nicety.

| # | Do this | Expect |
|---|---|---|
| 1 | Submit empty | One message beside each of the four fields, nothing sent |
| 2 | Type `nombre@` and submit | The email field is flagged, the others are not |
| 3 | Fill everything, tick consent, submit | Spinner, control disabled, then a confirmation and empty fields |
| 4 | Double-click the send control while sending | One message delivered, not two |
| 5 | Fill valid data, submit with the network disabled | Error in plain language, typed content still there |
| 6 | Retry after a failure | Sends without retyping |
| 7 | Untick consent and submit | Blocked, consent requirement pointed out |
| 8 | Press Enter inside a text field | Sends |
| 9 | Tab from the top of the form | Logical order, focus visible at every stop |
| 10 | Submit at 320px wide | No sideways scrolling, controls large enough to tap |
| 11 | Read the form with a screen reader | Labels, errors, progress and outcome all announced |

Row 4 is the one that fails silently if `Button` ever stops disabling itself, so assert it in
a test rather than trusting the eye.

## Testing notes

- `fetch` is mocked per test. Nothing in the suite may reach the network.
- The validator is a pure function, so its tests need no DOM and no mocks.
- jsdom does not resolve `import.meta.env`, so the key must be stubbable, or every test
  exercises the unavailable path and none exercise the form.
- Assertions on the emitted CSS text are the established pattern in this repository for
  things jsdom cannot compute, including colour contrast decisions.

## Files this feature touches

New:

```text
src/components/sections/ContactForm/
src/components/ui/FormField/
```

Modified:

```text
src/components/sections/Contact/Contact.tsx
src/components/sections/Contact/Contact.styles.ts
src/types/contact.ts
src/vite-env.d.ts
src/styles/tokens.css
src/styles/tokens.ts
.github/workflows/deploy.yml
```

Unchanged on purpose: `Button`, `Section`, `Container`, `site-config.ts` and the existing
contact methods. If the implementation starts editing `Button`, the plan was wrong.