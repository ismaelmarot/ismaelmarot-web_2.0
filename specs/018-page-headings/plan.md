# Implementation Plan: One Heading per Page

**Branch**: `018-page-headings` | **Date**: 2026-10-14 | **Spec**: [spec.md](./spec.md)

## Summary

Seven styled-components change their base tag and seven redundant `as` props follow them. The
accessibility audit stops visiting one route and starts visiting seven, which requires its server to learn
what a history-routed app is.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3
**Primary Dependencies**: styled-components 6.1. No additions
**Testing**: Vitest (component), Playwright (E2E and axe). Nine assertions name a heading level and all nine change
**Target Platform**: Static site, GitHub Pages
**Performance Goals**: Unchanged. No CSS value moves
**Constraints**: No text change (FR-005); no CSS change (FR-006); no heading-level prop (FR-007); base tag and
`as` prop move together (FR-008); audit keeps its tags and its exit code (FR-011)

## Constitution Check

*GATE: passed.*

| Principle | Compliance |
|---|---|
| I. Component-First | No new component. Seven existing components change a tag. |
| II. Type Safety | Nothing new is typed. `as` is a styled-components prop and already typed. |
| III. Testing | Nine assertions updated, each asserting a level and each documented below. One new E2E file measures the whole inventory. |
| IV. A11y & Performance | This is the WCAG heading structure. No performance cost: a tag name is bytes either way, and the two strings are the same length. |
| V. Design Principles | No visible change. |
| VI. YAGNI | **No prop.** The four sections each render on one route, so the choice a prop would offer has no callers. |
| Styling | The change is to the styled-components' base tags. No declaration moves. |
| Path Aliases | Unchanged. |
| Dependencies | `package.json` untouched. |

## The decision: no prop, and why that is the whole plan

The instinct on a change like this is to add `headingLevel` to each section and let the page pass it. **That
would be wrong here, and the reason is worth writing down.**

Each of the four sections is imported by exactly one file, and that file is the page for its route:

```
sections/About        -> pages/About/About.tsx               -> /about
sections/Contact      -> pages/Contact/Contact.tsx           -> /contact
sections/Projects     -> pages/Projects/Projects.tsx         -> /projects
sections/Technologies -> pages/Technologies/Technologies.tsx -> /technologies
```

The landing page imports **none** of them. It composes `SectionSummary` instead, which keeps its own `<h2>`.
So there is exactly one caller per section and that caller's route is the section's own page. A prop would
offer a choice that no caller makes and that no future caller should make: the section *is* the page on
every route where it appears, so its heading *is* the page's `<h1>`. `ProjectRow` and `Contributions` are
the same case one level down.

This is the constitution's principle VI applied to a decision rather than to a class. An empty hook was the
unnecessary abstraction in `specs/017`; a prop with one caller is the same thing.

## The cascade

Promoting `h2` to `h1` and stopping would leave `/projects` at `h1` → `h3` and `/technologies` at
`h1` → `h3`, which fails `heading-order` under the same tag that flags `page-has-heading-one`. The levels
shift by one, everywhere, on those two routes:

| Route | Before | After |
|---|---|---|
| `/about` | `h2` | `h1` |
| `/contact` | `h2` | `h1` |
| `/projects` | `h2`, `h3` ×6 | `h1`, `h2` ×6 |
| `/technologies` | `h2`, `h3` ×4 | `h1`, `h2` ×4 |

`/`, `/projects/:id` and the 404 are untouched.

## The base tag and the `as` prop

Every one of these components sets `as="h2"` on a `styled.h2`, which is redundant: the `as` prop overrides
the base and both happen to say the same thing. **Both are changed, because only the `as` prop renders.**

Changing the base alone would produce a diff that looks correct and changes nothing. This is recorded
because it is the kind of change that passes review, and because the redundancy is a separate cleanup that
this specification does not do.

## The audit's server

Extending the audit's route list runs into a fact about the build. `dist/` contains `index.html`,
`404.html`, `assets/` and `favicon.svg` — **there is no file at `dist/about`**. The audit's in-process
server maps a path to a file, so `/about` would be served as an empty 404 and the audit would measure the
404 page seven times and report it clean.

The fix is the same one `public/404.html` already implements in the browser: when a requested path has no
extension, serve `index.html` and let the client route resolve it. About four lines, in the `catch` of the
existing server, and it keeps the property the file's long comment argues for — an in-process server with
no fixed sleep in front of the audit.

## Testing, and the nine assertions that change

Nine assertions across six files name a heading level. **All nine assert a level rather than content**, and
each is updated to the new level:

| File | Line | From | To |
|---|---|---|---|
| `sections/Projects/Projects.test.tsx` | 73, 79 | level 3 | level 2 |
| `pages/About/About.test.tsx` | 33 | level 2 | level 1 |
| `pages/Contact/Contact.test.tsx` | 13 | level 2 | level 1 |
| `pages/Projects/Projects.test.tsx` | 29 | level 2 | level 1 |
| `pages/Projects/Projects.test.tsx` | 41, 59 | level 3 | level 2 |
| `pages/Technologies/Technologies.test.tsx` | 20 | level 2 | level 1 |
| `tests/e2e/projects-viewport.spec.ts` | 141, 184 | `querySelector('h3')` | `querySelector('h2')` |

`Home.test.tsx:40` and `SectionSummary.test.tsx:27` assert level 2 and **do not change**, because the
landing page keeps its `h2` bands. That they were left alone is the check that the change stayed inside the
four standalone routes.

**A test that has to change is not automatically a smell**, but it is a signal that has to be read rather
than silenced. Each of these nine asserts the level, and the level is what this specification changes.

## What this plan does not claim

**No visual measurement is taken**, because there is nothing visual to measure. SC-005's claim is that the
built stylesheet is declaration-for-declaration identical, and it is checked by comparing the build output
rather than by describing a screenshot.

**The heading inventory is measured in Chromium only.** The E2E file runs it across all five projects the
config declares, but Firefox cannot launch on this machine, which `specs/014`'s Amendment 2 records.