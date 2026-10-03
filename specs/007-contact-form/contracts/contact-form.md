# Contracts: Contact Form

**Feature**: 007-contact-form
**Date**: 2026-10-03

## Provider boundary

Everything the form knows about the delivery service is behind one function. This is the
seam that keeps a provider change from reaching the component, and it is the only place a
provider name appears.

```ts
// src/components/sections/ContactForm/submitContactForm.ts
export interface SubmitContactInput {
  values: ContactFormValues;
  accessKey: string;
  signal: AbortSignal;
}

export type SubmitContactResult =
  | { ok: true }
  | { ok: false; reason: 'network' | 'timeout' | 'rejected' | 'provider'; message: string };

export function submitContactForm(input: SubmitContactInput): Promise<SubmitContactResult>;
```

### Obligations of the implementation

- Must never reject. A thrown error is a bug, because every caller would have to guard it
  and a throw during teardown is how a form gets stuck in its in-progress state.
- Must never surface provider text. The `message` in a failure is already visitor-facing and
  free of status codes, field names from the provider, and endpoints.
- Must honour `signal`, so the timeout can cancel a hanging request.
- Must resolve within the timeout with `reason: 'timeout'`, not hang (FR-011).

## Validation boundary

Pure functions, no React, no network. Unit tested directly.

```ts
// src/components/sections/ContactForm/validateContactForm.ts
export function validateContactForm(values: ContactFormValues): ValidationErrors;
```

Returning an empty object means valid. Spanish messages, per FR-026.

## Component boundary

```ts
// src/components/sections/ContactForm/ContactForm.tsx
export interface ContactFormProps {
  /** Rendered when no access key is configured at build time */
  unavailableMessage?: string;
}
```

Deliberately small. The form owns its values, its validation and its submission state; it
takes no values and no callbacks from the outside, so there is one place where the behaviour
lives and one place to test.

## Field boundary

One component covering the label, the control, the hint and the error, used by all three
fields, so the label to control association is implemented once.

```ts
// src/components/ui/FormField/FormField.tsx
export interface FormFieldProps {
  id: string;
  label: string;
  /** Shown under the control when there is no error */
  hint?: string;
  error?: string;
  required?: boolean;
  children: (props: { id: string; describedBy: string | undefined; invalid: boolean }) => React.ReactNode;
}
```

The render-prop shape is the reason. It keeps the association logic in `FormField` while
letting the caller supply the actual `<input>` or `<textarea>`, which is what satisfies
FR-015 without duplicating `id`, `aria-describedby` and `aria-invalid` at three call sites.

## Configuration boundary

```ts
// src/components/sections/ContactForm/contactFormConfig.ts
export function getAccessKey(): string | undefined;
```

Reads the build-time variable and trims it. Returns undefined when absent or blank, which is
what drives the unavailable state.

## Environment contract

| Variable | Required | Where declared | Where supplied |
|---|---|---|---|
| `VITE_WEB3FORMS_ACCESS_KEY` | In production | `src/vite-env.d.ts` | Repository secret, passed to the build step of `.github/workflows/deploy.yml` |

Without the workflow change the key is `undefined` in the deployed bundle even though it
works locally. That is the single most likely way this feature ships broken.

## Provider request shape

Not part of the component contract. Recorded so the boundary function can be written against
it. From the provider's own API reference.

```
POST https://api.web3forms.com/submit
Content-Type: application/json
Accept: application/json

{
  "access_key": "<key>",
  "name": "...",
  "email": "...",
  "message": "...",
  "botcheck": ""            // non-empty means a bot filled the hidden field
}

200 -> { "success": true, "message": "Email sent successfully!" }
400 -> { "success": false, "message": "<reason>" }
```

The `botcheck` field is the provider's own spam mechanism, free on their plan, which is why
the decision in `research.md` settled on this provider.