# Tasks: The Contact Band's Composition

**Input**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)
**Status**: Implemented, verified except Firefox

## Phase 1 — Measure before deciding

- [x] T001 Read `ContactBand.tsx` and `ContactBand.styles.ts` as they were after `specs/021`
- [x] T002 Find the Hero's "Web Developer" token: `--text-display-project`, `clamp(2rem, 4vw, 3.5rem)`
- [x] T003 Confirm `--text-display-email` has exactly one consumer
- [x] T004 Measure the address at ten sizes on the rendered page
- [x] T005 Measure the available column at five viewports

## Phase 2 — Write

- [x] T006 `spec.md` — the arrangement is what made the size possible, and the arithmetic that follows
- [x] T007 `spec.md` — why the question stayed at 16px
- [x] T008 `spec.md` — the reading-order conflict and `order` as the resolution
- [x] T009 `plan.md` — what replaces the token's comment and what that costs
- [x] T010 `tasks.md` and `checklists/requirements.md`

## Phase 3 — Content

- [x] T011 `SiteConfig.contactTagline`
- [x] T012 the string in `site-config.ts`
- [x] T013 `useContactBand` returns it, overridable by prop

## Phase 4 — The token

- [x] T014 `--text-display-email: var(--text-display-project)`
  <!-- SUPERSEDED by spec.md Amendment 4, 2026-10-16. Done as written and later replaced: the ceiling is
       still the Hero's token, but reached through a clamp that also carries the floor and the ramp.
       The one-line form this task wrote is no longer the code. -->

- [x] T015 The mobile override, with the measured ceilings
  <!-- SUPERSEDED by spec.md Amendment 4, 2026-10-16. Done as written: the @media (max-width: 767px)
       override existed and was verified. It was then deleted. There is no media query on the token
       now; the step down is the ramp of a single declaration. -->

- [x] T016 The old comment replaced — its arithmetic described a column that no longer exists
  <!-- SUPERSEDED by spec.md Amendment 4, 2026-10-16. Done as written, and rewritten again: the
       replacement comment has since been re-measured. At a 768 viewport WebKit's scrollbar leaves
       clientWidth at 760, so `@media (max-width: 767px)` does match and the two-rule token put the
       address at 24px against the Hero's 32px; Chromium sees 768 and matches nothing. The comment now
       says that, with both columns, instead of the structural argument alone. -->

## Phase 5 — The band

- [x] T017 `StyledContactBandRow` → `auto 1fr`, `order: -1`
- [x] T018 `StyledContactBandCopy` and `StyledContactBandDescription`
- [x] T019 `StyledContactBandInner` → flex column, because `align-self` does nothing in a block
- [x] T020 `StyledContactBandCta` aligned right, left on mobile
- [x] T021 `StyledContactBandFooter` removed; the networks moved into the row
- [x] T022 DOM reordered: the question first, the row second, the row raised by `order`

## Phase 6 — Tests

- [x] T023 `ContactBand.test.tsx` — the networks row's `data-testid` is gone, the assertion moved to the list
- [x] T024 `ContactBand.test.tsx` — `1fr 1fr` → `auto 1fr`, with the reason it is load-bearing
- [x] T025 `ContactBand.test.tsx` — the token assertion's reason updated; the assertion itself untouched
  <!-- NOT DONE AS WRITTEN. The assertion was not left untouched: it now pins the literal clamp and
       asserts that exactly one declaration of the token exists. The reason it could stay token-shaped
       while the ceiling moved is that the ceiling was a token; the reason it must pin the literal now
       is that it is the only assertion distinguishing the shipped token from the one it replaced, the
       E2E being unable to. See spec.md Amendment 4. -->

- [x] T026 Five new component tests
- [x] T027 `contact-band-layout.spec.ts` — 23 tests that measure, across five viewports
  <!-- Updated by spec.md Amendment 4: the size assertion's crossover moved from 768 to 600 and
       toBeCloseTo became toBe. The 768 kept on redesALaIzquierda is a different mechanism — it is
       the grid breakpoint at ContactBand.styles.ts:102, not the token's crossover. -->

- [x] T028 lint, typecheck, 151 unit, 470 component, build
  <!-- Re-verified 2026-10-16 against Amendment 4: lint, typecheck, 151 unit, 470 component, 29
       ContactBand, build. All green. -->

- [x] T029 E2E: 278 in Chromium and WebKit, 278 in both mobile projects
  <!-- Record of what ran when the feature was delivered. PARTIALLY RE-VERIFIED against Amendment 4 by
       T031: chromium, webkit, Mobile Chrome and Mobile Safari all pass on the shipped token. The two
       remaining projects were not — see T031. The 23-test WebKit run of contact-band-layout.spec.ts
       had already passed before T031 was attempted.

       Two things this record does not establish, stated here because the box says done. It names four
       projects and playwright.config.ts configures five: Firefox is not among them, and T031 shows why
       — Firefox does not start on this machine at all, which is a pre-existing environment defect
       recorded in specs/018/tasks.md:120. And no artifact for the "278" survives in the repository —
       the playwright-report directory is gitignored and predates this feature's commit. Treat the count
       as the author's record of the run, not as a figure this specification can be checked against. -->

- [x] T030 a11y: 0 violations across 7 routes at 4 viewports
  <!-- Record of what ran when the feature was delivered. RE-VERIFIED against Amendment 4 as T032: 0
       violations on all 28 audits, every route carrying its expected h1. -->

## Phase 7 — Re-verify against Amendment 4

- [ ] T031 Run the full E2E suite against the shipped token, in all five configured projects —
  chromium, firefox, webkit, Mobile Chrome and Mobile Safari — not just `contact-band-layout.spec.ts`.
  Amendment 4 moved the size assertion's crossover from 768 to 600 and made it `toBe` rather than
  `toBeCloseTo`, and every project executes it. T029 is the record of the earlier run, not of this one,
  and that run named four of the five projects.

  Run it the way CI does — one worker, with retries. Observed on this machine while writing Amendment 4:
  with the default five parallel workers, three tests fail intermittently with `page.goto` exceeding
  30 seconds while waiting for `load` on localhost:4173; with a single worker the same 23 tests pass.
  Those are timeouts reaching the preview server, not assertions, and no cause was established for the
  contention — only that one worker removes it. CI already runs one worker, which is consistent with
  this not having been seen there.

  **Run 2026-10-16, `--workers=1`: 555 passed, 140 failed, 21.2 minutes.**

  - chromium 138/139, firefox 0/139, webkit 139/139, Mobile Chrome 139/139, Mobile Safari 139/139.
  - **Firefox cannot launch on this machine**, so none of its 139 tests ran. Every one fails with
    `browserType.launch: Failed to launch the browser process` → `Could not find profile folder` →
    exitCode 1, in 1–2ms. Diagnosis below. It is an environment defect, not a test or product defect,
    and it is why T029's record names four projects rather than five.
  - The single chromium failure was `routes.spec.ts:48` on `/ruta-que-no-existe`, failing on a console
    error `Failed to load resource: net::ERR_CONNECTION_RESET`. Re-run three times in isolation: passed
    every time. Same family as the preview-server contention above, and not on anything this feature
    changed.

  **Diagnosis of the Firefox failure, 2026-10-16.** The message is misleading: it is not about the
  profile path.

  | Checked | Result |
  |---|---|
  | The binary answers `--version` | yes — Mozilla Firefox 155.0 |
  | `-profile` pointing at a directory that exists | still fails, 0/3 |
  | Playwright's expected revision | 1543, and 1543 is what is installed; no mismatch |
  | `INSTALLATION_COMPLETE` / `DEPENDENCIES_VALIDATED` markers | present, same as the working browsers |
  | A fresh re-download of the browser | identical failure — **not a corrupt download** |
  | Disk space, quarantine attributes, codesign | no quarantine; missing `_CodeSignature` is normal here, since `webkit-2359` lacks it too and WebKit works |
  | **Any headless mode**, by flag or by environment | **fails 0/3** — `-headless`, `MOZ_HEADLESS=1`, with and without `-profile` |
  | Not headless at all | starts 3/3 |
  | **The system Firefox 126.0, same machine, same flags** | **headless works 3/3** |
  | The newest Firefox Playwright ships (157.0, from `playwright-core@1.64.1`) | also fails 0/3 |

  So the environment does support headless Firefox — Firefox 126 proves it on this machine. What cannot
  start headless here is Playwright's Firefox build, at two different revisions. That points at the
  build rather than at one bad download, and this machine runs **macOS 27.0.1 (26A434)**.

  **Not resolvable from the project side.** Changing `playwright.config.ts` to avoid the failing path
  would be altering the test setup to accommodate a broken browser rather than to hide a failure, and
  the two revisions tested mean downgrading Playwright would not help either. This needs either a
  different machine or CI, where the build is known to run.

  **Still open: the 139 Firefox tests have not been run against this amendment anywhere.** They need a
  machine or CI run where Firefox starts. Amendment 4's changed assertion executes in that project, so
  it is unverified there — including whether Firefox shows the scrollbar behaviour Amendment 4 measured
  in WebKit, which is unknown precisely because the browser will not run.
- [x] T032 Run the accessibility audit against the shipped implementation: `npm run test:a11y`, zero
  axe violations across the seven routes at the four viewports. T030 is the record of the earlier run.
  <!-- Run 2026-10-16 against the shipped token: 0 violations on all 28 audits — 7 routes
       (home, about, projects, technologies, contact, 404, and /projects/1176188329 resolved from the
       projects page) at 1440x900, 768x1024, 390x844 and 320x640. Every route carried the h1 the audit
       expects, so no route was skipped. Re-verified, not inherited. -->
- [x] T033 Re-measure the two figures this specification got wrong while it was being written, both of
  which Amendment 4 did not touch and which no test pins: `--text-display-project` at 768 (this
  document said 31px, which cannot be right against its own 32px floor) and the number of characters in
  the address (this document says twenty-four; it is twenty-three).
  <!-- Done 2026-10-16. Evidence: `src/styles/globals.css:13` sets `html { font-size: 16px }`, so
       `2rem` is 32px and the floor is real; at 768 `4vw` is 30.72px, below the floor, so
       `clamp(2rem, 4vw, 3.5rem)` resolves to **32.00px**. Measured on the rendered page in Chromium and
       in WebKit: hero 32.00px at 768, in both. The document's 31px was never achievable.

       Character count: `src/data/site-config.ts:8` holds `'ismaelmarot@hotmail.com'`, which is 23
       characters. The document said twenty-four, in `spec.md` and in `plan.md`. Both corrected.

       Both figures are now stated as measured rather than as derived, and no test pins either — the
       32px floor is inherited from the Hero's token and the character count is a property of the string
       in `site-config.ts`. Neither is asserted anywhere. -->
- [x] T034 Decide what the analytical 600 in the E2E's size assertion is a criterion for, and write it
  down. `spec.md` does not currently mention it: the ramp's crossover is near 542px and 600 is a
  deliberate margin below it, chosen so the test does not depend on computing the crossover exactly.
  The grid's 768 is a different mechanism again and is already explained in the test.
  <!-- Done 2026-10-16, documented in `spec.md` under "The analytical 600 in the E2E, and the three
       numbers that are not the same".

       Measured on the shipped token, Chromium and WebKit agreeing: at 542 the address is 31.98px and
       the Hero 32.00px, and at 543 both are 32.00px. The boundary is `32 / 0.059` = 542.37px, which is
       where `5.9vw` reaches the Hero's 32px floor and the ceiling takes over.

       The 600 sits 58px above that boundary on purpose, for the reason the task names: pinning the
       assertion to 542.37 would make it break when `5.9vw` or the Hero's token is edited, for a reason
       no reader could see. 600 asserts which side of the boundary the test is on, and the margin means
       it is asserting the construction rather than a coincidence.

       The section also tabulates all three numbers — 542.37 derived, 600 analytical, 767/768 the grid's
       real breakpoint at `ContactBand.styles.ts:102` — because two of them look like the third and are
       not it. -->

## What is still open against this amendment

**The 139 Firefox E2E tests.** Firefox does not start on this machine — `Could not find profile
folder` — which is pre-existing and recorded in `specs/018/tasks.md:120`. T031 therefore cannot pass
here, and Amendment 4's changed assertion executes in that project. It needs a run where Firefox
starts, which is what CI provides.

Everything else re-verified 2026-10-16: SC-011's five checks, SC-012's accessibility audit, and the
E2E suite in chromium, webkit, Mobile Chrome and Mobile Safari.

## Notes

- **The first measurement was wrong and it was wrong in a way that looked right.** It measured the address
  text alone and produced a table saying 26px fits 390 with 28px to spare. The link also holds a 28px
  arrow and a 12px gap, so the real ceiling at 390 is 25px and at 320 is 19.5px. The rendered page
  wrapped the address on two lines at both mobile viewports and the E2E caught it.
- **The fix was to binary-search the rendered band for the largest size that does not wrap**, rather than
  to compute it from a probe. Four viewports were measured — 320 → 19.5px, 360 → 22.7px, 390 → 25px,
  430 → 28.2px — and the ramp that respects all four was `clamp(1.125rem, 5.9vw, 1.5rem)`. The probe had
  been the thing producing the wrong numbers, so it was the thing to remove. That ramp is itself
  superseded by `spec.md` Amendment 4: the `1.5rem` ceiling is gone, replaced by the Hero's token. The
  four measurements stand, because they are what the current ramp was fitted to.
- **`align-self` did nothing until `StyledContactBandInner` became a flex column.** The button was
  rendered at the left in the first build while the component test and the stylesheet both said it was
  right. A unit test on the declaration would have passed; only measuring where the button actually
  landed found it.
- **The DOM came out backwards.** The row was written first, which made the networks the first thing in
  the band — the opposite of the decision. `order: -1` on the row is what puts it on top while the
  heading stays first.
- **The component assertion for DOM order was removed rather than worked around.** `no-node-access`
  forbids reaching for siblings, and the E2E already measures it on the real page. The component keeps
  the part it can say cleanly — the links' order — and the comment says where the rest went.
- **`tokens.fontWeights.regular` does not exist.** It is `normal`. A `tsc` error, not a guess.
- **The token assertion survived the ceiling move untouched, and stopped surviving at Amendment 4.** It
  read `var(--text-display-email)` rather than a literal, so raising what that resolved to changed no
  test — the abstraction working, and the reason only the assertion's *reason* needed rewriting. It
  does not hold any more: the component test now pins the literal and asserts a single declaration.
  The E2E is no help here, because whether it can tell the two versions apart depends on the browser —
  in WebKit at 768 it can, because the scrollbar leaves the media query at 760, and in the other four
  projects it cannot. The abstraction and the pinning are not in tension — a test that has to hold the
  shape in every engine has to name it.
- **One component test left the file.** `la pregunta es el primer elemento de la banda en el DOM` became
  an E2E measurement, because the E2E can measure order on a real page and the component test could
  only approximate it.
