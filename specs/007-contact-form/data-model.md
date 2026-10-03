# Phase 1 Data Model: Contact Form

**Feature**: 007-contact-form
**Date**: 2026-10-03

Types live in `src/types/contact.ts`, alongside the contact types that already exist there.
Nothing is persisted: the portfolio keeps no visitor data (FR-022).

## ContactFormValues

What the visitor typed. Held in component state and cleared after a successful send.

| Field | Type | Required | Max length | Notes |
|---|---|---|---|---|
| `name` | `string` | Yes | 100 | Trimmed before validation |
| `email` | `string` | Yes | 254 | Trimmed; format checked |
| `message` | `string` | Yes | 2000 | Trimmed; empty after trimming counts as empty |
| `consent` | `boolean` | Yes | n/a | Explicit acceptance, defaults to false |

The maximums are what FR-004 requires the visitor to be told before typing. 254 is the
longest email address the standard permits, so the limit rejects nothing legitimate.

## SubmissionStatus

Where one attempt currently stands. FR-007 and FR-008 both hang off this.

| Value | Meaning | What the visitor sees |
|---|---|---|
| `idle` | Nothing in flight | The empty or restored form |
| `invalid` | Validation rejected it; nothing was sent | One message per field, beside the field |
| `sending` | A request is in flight | The send control disabled with a spinner |
| `sent` | The service accepted it | A confirmation, fields cleared |
| `failed` | The service did not accept it | An error, typed content kept |

`sending` is the only state that blocks a further submit. `invalid`, `sent` and `failed` do
not block sending, so a retry after a failure needs no extra step (FR-012).

A sixth, separate condition covers a missing access key. It is not part of the visitor's
attempt, so it is tracked apart from `SubmissionStatus`: see *Configuration*.

## ValidationErrors

A record of field name to message, in Spanish (FR-026). Only the fields that failed appear
in it, which is what lets FR-006 point at each problem individually.

| Key | Message intent |
|---|---|
| `name` | The name is required |
| `email` | The email is required, or its format is wrong |
| `message` | The message is required |
| `consent` | Consent is required |

The record is cleared per key as the visitor corrects that field, which is how FR-013 is
met: a fixed problem stops being reported without the visitor having to resubmit.

## SubmissionResult

The service's answer, normalised. The provider's own response shape is not allowed to leak
into component state.

| Field | Type | Notes |
|---|---|---|
| `ok` | `boolean` | The outcome |
| `message` | `string` | Safe to show the visitor, already free of provider jargon |
| `fieldErrors` | `ValidationErrors` | Empty for most failures; populated if the provider names a field |

`fieldErrors` exists so a provider that rejects a specific field can be mapped onto the
right input, rather than degrading every failure to a banner.

## Configuration

Where the service credentials come from, which is a build concern rather than a submission
one.

| Key | Source | Behaviour when absent |
|---|---|---|
| `VITE_WEB3FORMS_ACCESS_KEY` | Build-time environment variable, declared in `src/vite-env.d.ts` | The form renders disabled with a message saying the form is not configured, and never attempts a request |

The absent case is modelled separately from `failed` on purpose. A visitor whose form cannot
work at all must not be told to try again later, because retrying cannot help.

## Relationships

- `ContactFormValues` produces a `ValidationErrors` on submit, and one `SubmissionStatus`.
- One `SubmissionStatus` maps to at most one `SubmissionResult`.
- `SubmissionResult.fieldErrors` merges into the visible `ValidationErrors`.
- `Configuration` is read once and does not change during the session.