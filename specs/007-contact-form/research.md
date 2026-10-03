# Phase 0 Research: Contact Form

**Feature**: 007-contact-form
**Date**: 2026-10-03

## 1. Delivery service

The specification deliberately names no provider. The brief asked for a comparison based on
simplicity, GitHub Pages compatibility, security and suitability for a personal portfolio.

### Source quality

Most of what a web search returns for this question is vendor comparison marketing, where
each vendor grades its competitors. That is not evidence. The facts below come from the two
providers' own pages:

- Formspree: `https://formspree.io/plans`, fetched directly.
- Web3Forms: `https://docs.web3forms.com/getting-started/api-reference` and
  `https://docs.web3forms.com/getting-started/faq`, primary documentation.

Claims that could only be verified by marketing pages are marked as unverified.

### Candidates

| | Formspree | Web3Forms | EmailJS |
|---|---|---|---|
| Needs a runtime dependency | No, plain HTTP | No, plain HTTP | **Yes, the `emailjs-com` SDK** |
| Endpoint | `POST https://formspree.io/f/<id>` | `POST https://api.web3forms.com/submit` | SDK-mediated |
| Free tier, per its own words | 50 submissions/month, "for testing and development" | 250 submissions/month, free, no card | Not applicable |
| Paid entry point | **$10/month** for the plan named "for personal or portfolio sites" | $5/month yearly | Not applicable |
| JSON response for async submit | Yes | Yes, `{"success":true,"message":"Email sent successfully!"}` | Yes |
| Plain HTML POST, works without JavaScript | Yes, with a thank-you redirect | Yes, documented, and recommends the redirect field | No, needs the SDK |
| Honeypot | Custom honeypot is a paid tier feature. Free tier has "basic spam filtering" | Built-in `botcheck` field, free | Not applicable |
| Restrict submissions to your own domain | **Yes, on the free tier** | Paid tier | Not applicable |
| Credential nature | Form id, public in the page source | Documented as public: "an access key is used to send emails to a particular email. It doesn't store any sensitive data" | Public key plus service IDs |

### Decision: Web3Forms

Rejected **EmailJS** outright. It is the only candidate that requires shipping a library to
do something `fetch` already does, and FR-025 plus the constitution's dependency rule
forbid that. It loses before quality is even compared.

Between the two that need no dependency, Formspree's own pricing page describes its free
tier as being for testing and development, and the tier it offers "for personal or
portfolio sites" costs $10/month. Web3Forms offers 250 submissions a month free with no
card, which is roughly what a portfolio's contact form will ever use.

The tie-breaker that decided it is spam handling on the free tier. Formspree's custom
honeypot is a paid feature; Web3Forms ships a `botcheck` field in the free plan. A public
submission endpoint with no domain restriction and no honeypot is a spam magnet, and the
domain restriction that would fix it is exactly what Formspree gives away for free and
Web3Forms charges for.

**Documented trade-off**: with Web3Forms, restricting the endpoint to the portfolio's own
domain is a paid feature. The honeypot is the mitigation. If spam becomes a real problem,
switching the endpoint is a change to one function, because the form is written against a
single submit call.

**Fallback**: Formspree remains the alternative if the owner prefers it. It would mean the
$10/month Personal plan, or accepting a 50/month free tier the vendor labels as for testing.

### Unverified

- Exact 2026 prices for Web3Forms paid tiers came from comparison pages, not its own pricing
  page. Only the free tier figure is used in this plan.
- Delivery rates and spam filter quality are anecdotal in the sources.

## 2. Integration point in the existing code

Read before deciding anything.

| Finding | Consequence |
|---|---|
| `src/components/sections/Contact/Contact.tsx` renders a `Section` with `Container size="lg"`, `composition="centered"`, `fullViewport`, containing a headline, an intro and the list of contact methods | The form is a new sibling of `StyledContactMethods`, inside the same section |
| `StyledContact` is `max-width: 600px` and `text-align: center` | The form must set `text-align: left`; a centred label column is unreadable |
| `fullViewport` applies `min-height: 100dvh` | It is a minimum, not a cap, so the section simply grows once the form is added. No change needed, but it must be checked visually |
| No form primitives exist. `src/components/ui` holds only `Badge`, `Button`, `Card`, `Icon` | Field, label and error components have to be created under the constitution's per-component folder structure |
| `Button` already accepts `type`, has an `isLoading` prop with a spinner, and passes `disabled={disabled \|\| isLoading}` | FR-007 and FR-008, the in-progress state and duplicate-submission guard, need no new dependency and no new component |
| `useContact()` returns only a ref | The form's state belongs in its own hook, per the constitution's one-hook-per-component rule |
| `src/types/contact.ts` holds the contact domain types | Form types go alongside them rather than in the component |

## 3. Deployment finding: the build has no environment

This is the one that would have broken in production.

`vite` inlines `VITE_*` variables at build time. The deploy workflow's build step is:

```yaml
- name: Build project
  run: npm run build
```

It passes no environment. The only secret in that file goes to the data-fetch step, not the
build. So a key read from `import.meta.env.VITE_WEB3FORMS_ACCESS_KEY` would be `undefined`
in the deployed bundle while working perfectly on the developer's machine.

The deploy workflow has to grow an `env:` block on the build step. `src/vite-env.d.ts`
already declares an `ImportMetaEnv` interface, so adding the key there is an established
pattern. `.env` and `.env.local` are already gitignored, so the key cannot leak into a commit.

The user-visible consequence matters as much as the build fix: when the key is absent the
form must say so, rather than failing on submit with an error that looks like the service
is down.

Note that this is not a secret in the usual sense. Web3Forms documents its access key as
public, describing it as an alias for an email address. It ends up in the page source either
way. The workflow change is needed for correctness, not to hide anything.

## 4. Validation without a dependency

FR-025 forbids new runtime dependencies, so no schema library. The form needs three fields
and one checkbox, which is well under the point where a validator library pays for itself.
A validator function returning a record of field to message, called on submit and again on
change once a field has been flagged, satisfies FR-006 and FR-013.

Email format checking is a regular expression, written to accept the addresses people
actually type, including `+` suffixes and subdomains, rather than a stricter pattern that
rejects valid mail.

## 5. Accessibility decisions worth recording

- `aria-invalid` on a field that failed, plus `aria-describedby` pointing at the message,
  is how FR-015 gets satisfied without inventing a widget.
- FR-016 needs a live region for the state changes: the in-progress, success and failure
  messages are separate nodes with `role="status"` and `role="alert"` respectively. A single
  polite region would let the error text arrive while focus was elsewhere and go unheard.
- The honeypot field must be hidden from real users **and** from assistive technology, with
  `tabIndex={-1}` and `aria-hidden`, otherwise it becomes an unexplained empty field in the
  tab order.
- A request timeout is needed. Without it a hanging request leaves the form in the
  in-progress state forever, which is the one state from which the visitor cannot recover.