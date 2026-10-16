# Tasks: The Deployment Path

**Input**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md) · **Procedure**: [quickstart.md](./quickstart.md)
**Status**: Complete

## Phase 1 — The investigation, before any writing

- [x] T001 Confirm no deploy configuration exists in this repository
- [x] T002 Confirm `vite.config.ts` names `ismaelmarot.github.io` as the publishing repository
- [x] T003 Clone the destination repository and read its `deploy.yml`
- [x] T004 Confirm Pages `build_type` is `workflow` and `status` is `built`
- [x] T005 List the deploy triggers that have actually run, with event type
- [x] T006 List the six job names in `.github/workflows/ci.yml`
- [x] T007 Check for a `deploy` script in `package.json`
- [x] T008 Check branch protection on `main`
- [x] T009 List secrets on the destination repository
- [x] T010 Check the destination's root for content that is never served
- [x] T011 Read `public/404.html` and the replay script in `index.html`

## Phase 2 — Verify against the live site rather than against a green tick

- [x] T012 Fetch the published CSS and look for `scroll-snap-type`
- [x] T013 Fetch the published JavaScript and look for `#0a84ff`
- [x] T014 Fetch the published JavaScript and confirm `--link-hover-decoration` is gone
- [x] T015 Open a deep link in a browser and confirm the route renders
- [x] T016 Compare the deploy run's timestamp with the commit's

## Phase 3 — Write

- [x] T017 `spec.md` — topology, and why the workflow lives in the other repository
- [x] T018 `spec.md` — the three triggers, with the third marked as never firing
- [x] T019 `spec.md` — the cron is a data trigger, with the four-hour consequence stated
- [x] T020 `spec.md` — `build_type: workflow` and the one action that would breach it
- [x] T021 `spec.md` — no post-deploy verification; no branch protection; no secrets
- [x] T022 `spec.md` — the deep-link 404 is expected, with the mechanism
- [x] T023 `spec.md` — the limitation, stated in the body and not in an appendix
- [x] T024 `plan.md` — why documentation and not automation
- [x] T025 `quickstart.md` — the deploy command
- [x] T026 `quickstart.md` — the four checks, the first of which reads the published asset
- [x] T027 `quickstart.md` — what to do when each kind of failure happens
- [x] T028 `quickstart.md` — the things that look like failures and are not
- [x] T029 `tasks.md` and `checklists/requirements.md`

## Phase 4 — Correct `specs/001`

- [x] T030 Scenario 9 rewritten with the real CI job names and the real deploy command
- [x] T031 The phantom `deploy:` npm script removed from the CI/CD block
- [x] T032 The six real job names substituted, capitals included
- [x] T033 The branch protection claim corrected, with the reason it matters

## Phase 5 — Verify

- [x] T034 Every command in `quickstart.md` run against production
- [x] T035 `deploy.yml` confirmed as the filename, and the workflow confirmed `active`
- [x] T036 lint, typecheck, 151 unit, 465 component, build

## Notes

- **T012 to T016 are why this specification says the work is live rather than inferring it from a green
  run.** The 23:03Z deploy succeeded, and a green run only says the workflow finished. The published CSS
  containing `scroll-snap-type:y proximity` and the published JavaScript containing `#0a84ff` is what
  actually establishes it. A green tick and a wrong deployment look identical from the run list.
- **T008 found a fourth stale claim that was not in scope.** `specs/001` claimed branch protection with
  required checks; `main` has none. It is the correction with consequences, because the deployment reads
  `ref: main`.
- **T034 caught a stray non-ASCII sequence** typed into the quickstart by accident, which is the kind of
  thing that survives review because it renders.
- **The deploy command was not run.** `gh workflow run` would publish, and the ask was to document the
  mechanism. The command's target was validated instead: `deploy.yml` is the file in the destination and
  the workflow is `active`.