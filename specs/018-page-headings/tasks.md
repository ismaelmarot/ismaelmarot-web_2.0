# Tasks: One Heading per Page

**Input**: Design documents from `specs/018-page-headings/`

**Prerequisites**: plan.md, spec.md

**Tests**: Required. Nine assertions updated, one new browser file, and the accessibility audit
extended from one route to seven.

## Format

`[ID] [P?] [Story] Description` — [P] parallelisable, [Story] maps to US1–US3.

## Phase 1: Measure before touching

- [x] T001 List the headings of all seven routes in a real browser against the production build, rather
      than grepping for `as="h1"` in the source
- [x] T002 Find that four routes open with an `<h2>` and that the project's detail page already has an
      `h1`, so the first count of five was wrong by one
- [x] T003 Confirm the audit's tags include `best-practice`, which carries `page-has-heading-one`, and
      that it visits only `/` — the one route that happens to satisfy the rule
- [x] T004 Write the specification, including that no configuration is needed because each section is
      used on exactly one route

## Phase 2: The headings

- [x] T005 [P] `About` and `Contact`: `h2` → `h1`, both the styled base and the redundant `as` prop
- [x] T006 [P] `Projects`: `h2` → `h1`
- [x] T007 [P] `Technologies`: `h2` → `h1`, and its category titles `h3` → `h2`
- [x] T008 [P] `Contributions`: its title `h3` → `h2`, because it renders only inside `Technologies`
- [x] T009 [P] `ProjectRow`: the project name `h3` → `h2`, because it renders only inside `Projects`
- [x] T010 Confirm that `/`, `/projects/:id` and the 404 are untouched

## Phase 3: The assertions that name a level

- [x] T011 [P] `pages/About`, `pages/Contact`, `pages/Technologies`: level 2 → 1
- [x] T012 [P] `pages/Projects`: level 2 → 1 for the page heading, level 3 → 2 for the project names
- [x] T013 [P] `sections/Projects`: level 3 → 2
- [x] T014 [P] `tests/e2e/projects-viewport.spec.ts`: two `querySelector('h3')` → `'h2'`
- [x] T015 Confirm `Home.test.tsx` and `SectionSummary.test.tsx` were **not** touched, since the landing
      page keeps its `h2` bands — that they were left alone is what shows the change stayed inside the
      four standalone routes

## Phase 4: The audit

- [x] T016 Give the audit's in-process server the same fallback `public/404.html` implements in the
      browser: a path with no extension is a client-side route, so serve `index.html` and let the router
      resolve it. A path that carries an extension is a missing file and still 404s
- [x] T017 Visit all seven routes at all four viewports, 28 combinations, instead of one route at four
- [x] T018 Print the route name with every result, so a report cannot be read as covering the site
- [x] T019 Discover the detail route from the projects page rather than writing its id down, so a
      renamed repository does not break the audit
- [x] T020 Check the expected `<h1>` before axe runs, and report a route that failed to render as a
      routing failure rather than auditing the wrong page and finding it healthy

## Phase 5: The browser file

- [x] T021 `tests/e2e/routes.spec.ts`: every route loads, answers 200, carries exactly one `h1`, shows a
      `<main>`, keeps its URL and logs nothing
- [x] T022 Assert no heading level skips, per route
- [x] T023 The detail route, discovered from the projects page, plus a separate test that an unknown id
      renders the 404 while keeping the URL

## Phase 6: Verification

- [x] T024 `npm run lint` and `npm run typecheck`
- [x] T025 `npm run test` — 133 unit
- [x] T026 `npm run test:component` — 411
- [x] T027 `npm run build`
- [x] T028 Measure the heading inventory in a browser: seven routes, one `h1` each, no skips
- [x] T029 Compare the built CSS before and after: **byte-identical**
- [x] T030 The audit over 28 route-and-viewport combinations: 0 violations
- [x] T031 **Break `/contact` on purpose, confirm the audit fails with exit 1, restore it, confirm exit 0**
- [x] T032 Confirm axe itself also reports it, independently of the new pre-check: 1 violation,
      `page-has-heading-one`, impact `moderate`
- [x] T033 `tests/e2e/routes.spec.ts` across the browsers that run here

## Verification Results

| Criterion | Result |
|-----------|--------|
| SC-001 one `h1` per route | Pass: 7 of 7, measured in Chromium |
| SC-002 no skipped level | Pass: `[1]`, `[1]`, `[1,2×6]`, `[1,2]`, `[1,2×7]`, `[1]`, `[1]` |
| SC-003 landing page unchanged | Pass: still `h1` + four `h2` |
| SC-004 text unchanged | Pass: the CSS diff is empty, which is what proves no element moved |
| SC-005 CSS identical | Pass: `dist/assets/*.css` byte-identical before and after |
| SC-006 audit over 7 routes | Pass: 28 combinations, 0 violations |
| SC-007 the audit can fail | Pass: exit 1 with the defect, exit 0 without |
| SC-008 lint, typecheck, tests, build | Pass: 133 unit, 411 component |
| SC-009 axe at 4 viewports | Pass: every route, every viewport |

## Notes

**T031 is the task that proves SC-006 means something.** An audit that reports zero violations on a page
it never visits is indistinguishable from one that reports zero violations on a page it visits. Breaking
`/contact` on purpose and watching the exit code go to 1 is the only way to tell the two apart, and it is
the task this whole specification would have failed without.

**The audit now fails twice over on a missing `h1`**: once from the pre-check T020, which names the route
and says the route did not render, and once from axe's `page-has-heading-one`, which T032 confirmed
independently. The pre-check fires first because its message is better. Both are reported here because a
reader checking whether `page-has-heading-one` was ever seen firing would find only the pre-check in the
logs and might think the tag was not doing anything.

**Two of my own mistakes happened during this feature and both are recorded rather than quietly fixed.**

- **T002 was wrong before it was right.** The first count said five routes had no `<h1>`. Grepping for
  `as="h1"` missed `StyledDetailName`, which is declared `styled.h1` and needed no override. Measuring the
  rendered page said four. A five-route count would have justified editing a component that was already
  correct. See the spec's Amendment 1.
- **T020 through T032 first broke the audit entirely.** Rewriting `scripts/audit-a11y.mjs` dropped the
  `new` from `new AxeBuilder(...)`, and every run died with "Class constructor AxeBuilder cannot be
  invoked without 'new'". The committed file had it; the rewrite lost it, because the rewrite was done
  from a reading of the file rather than from the file itself. Caught in one run, and the lesson is the
  one `specs/011` records at T031: a change that looks like it cannot fail and reports no change is a
  change that never reached the thing it was aimed at.

**Firefox still cannot run on this machine**, which `specs/014`'s Amendment 2 records. The new browser
file's fifteen tests pass in Chromium, WebKit, Mobile Chrome and Mobile Safari; its Firefox ones fail to
launch with the same `Could not find profile folder` as every other file in the suite.

**The `as` props are still redundant.** `as="h1"` on a `styled.h1` says the same thing twice, and it was
true of `as="h2"` on a `styled.h2` before this change. Changing both together is what made the change take
effect; removing the redundancy is a separate cleanup this specification does not do.