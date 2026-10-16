# Feature Specification: The Deployment Path

**Feature Branch**: `024-deployment-path`

**Created**: 2026-10-15

**Status**: Implemented

**Input**: A maintainer instruction: *"generate the deploy method yourself and document it with SDD."*

## What this specification is about, and what it is not

**It is a description of a pipeline that already works.** The maintainer asked for a deploy method to be
created. The finding was that one already exists, runs three times a day, and had shipped the previous
feature while this specification was being written. **This specification documents that pipeline and
corrects the documentation that describes a different one.**

**It changes no workflow, adds no secret, and adds no automation.** The maintainer was offered automatic
deployment and chose documentation only. That is recorded here as a decision rather than a gap.

## Why the deployment was not obvious

`vite.config.ts` says the site is published from `ismaelmarot.github.io`, and no deploy configuration
exists anywhere in this repository. The workflow lives in the **other** repository, on the repository
that holds no source. So the path from a commit to a live page crosses a repository boundary that nothing
inside this one describes, and the only mention of deployment in twenty-three specifications was a
quickstart that named a workflow which does not exist.

## The pipeline, as it is

```
ismaelmarot/ismaelmarot-web_2.0     source; no GitHub Pages
        │
        │  deploy.yml checks out ref: main of the source repository
        ▼
ismaelmarot/ismaelmarot.github.io    destination; output only
        │  fetch:github → npm run build → upload-pages-artifact → deploy-pages
        ▼
https://ismaelmarot.github.io/
```

**The split is deliberate and is stated in the workflow's own comment**: this repository holds the
deployment workflow so that the destination stays pure output and the source stays pure source. The
workflow checks the source out at `ref: main`, so it never reads a single file from the repository it
lives in.

**`build_type` is `workflow`**, which means GitHub Pages serves the artifact uploaded by
`actions/deploy-pages` and never the branch. This is the load-bearing fact for the legacy content
described below.

**There are no secrets.** `gh secret list` on the destination returns nothing. The workflow uses the
automatic `secrets.GITHUB_TOKEN`, which needs no configuration and is why `fetch:github` authenticates
with it.

## The three triggers, and the one that never fires

| Trigger | Configuration | Fires |
|---|---|---|
| `schedule` | `15 */4 * * *` | four times a day |
| `workflow_dispatch` | — | only when a human runs it |
| `push` to destination `main` | `branches: [main]` | **never** |

**The third trigger cannot fire in normal operation**, because the destination is a repository of output:
nobody commits to it. It is a live trigger with no trigger. It remains in the file and is recorded here
rather than removed, because removing a trigger is a change to a pipeline in another repository and this
specification does not make changes.

### The cron is a data trigger wearing a deployment's clothes

**The schedule exists because of `specs/019-contribution-freshness`, not because of code.** The
contribution calendar compares each cell against the visitor's current date, so a build goes stale on its
own even if nobody touches the source.

**So the cron is not a deploy trigger and must not be read as one.** It cannot be removed without breaking
data freshness. It cannot be relied on to ship code, because the moment it fires has nothing to do with
the moment the code was written.

**The consequence, stated plainly: code reaches production between zero and four hours after it is
merged, and that interval is unrelated to when it was written.** A merge at 23:59 waits until 00:15.
A merge at 00:14 waits nearly four hours.

## The repository holds a site that can never be served

**The destination's root contains a hand-written static site**: an `index.html` and an `im_web/`
directory, committed to the repository and older than the React application.

**It is not served, and cannot be served by pushing to the destination.** `build_type: workflow` means
Pages uses the uploaded artifact, and the workflow rebuilds from the source before uploading, so the
destination's own files are never the artifact.

**The one action that would publish it is changing the Pages configuration to serve from the branch.**
Nothing in this repository would break, no CI check would fail, and no run would report anything: the
workflow would keep succeeding while serving a different site. A visitor would be the first to see it.

This is recorded because it is the one deployment failure that leaves no trace in the logs. The
mitigation is knowledge of the layout, which is what this specification is.

## The deep-link 404 is not a failure

A request for `/contact` returns **HTTP 404**, and `curl` shows it. **The page still works.**

GitHub Pages has no rewrite rule for a history-routed application. It serves `404.html` for any path it
cannot resolve, and that file — committed here as `public/404.html` — stashes the requested path in
`sessionStorage` and calls `window.location.replace('/')`. The script in `index.html`'s `<head>` then
replays it before the router initialises.

**Verified against production**: `https://ismaelmarot.github.io/contact` returns 404 and renders the
contact page, whose `h1` is "Contacto".

**This is recorded because it looks like a failure to anyone checking with `curl` or a link checker**, and
the natural response to a 404 — "the deploy is broken" — is wrong.

## The workflow verifies nothing after deploying

The job ends at `actions/deploy-pages@v4`. There is no smoke test, no request to the published URL, no
comparison of the served asset against the built one.

**The published result is therefore unverified at the moment it is published**, and the only verification
is a human opening the site. `quickstart.md` in this specification supplies that procedure.

**`main` has no branch protection.** The destination workflow checks out `ref: main`, so whatever is on
that ref is what gets published. Nothing prevents a push to a red state from becoming a deployment.

## The documentation that is being corrected

`specs/001-personal-dev-portfolio/quickstart.md` describes a deployment that was never built:

| Line | States | Reality |
|---|---|---|
| 292-294 | "Push to `main`, watch the workflow, verify the `deploy` job" | pushing to this repository does not deploy, and there is no `deploy` job |
| 298 | `lint → typecheck → test → build → deploy` | the CI jobs are Lint, TypeCheck, Tests, Build, E2E Tests, Accessibility |
| 356 | `deploy: # GitHub Pages (main branch only)` | no such npm script exists |
| 359-365 | required status checks under branch protection | `main` has no protection; `gh api .../branches/main/protection` returns "Branch not protected" |

**The reason this matters more than a stale note**: a reader following Scenario 9 to its end has pushed,
waited, and concluded the deployment succeeded. The site they are looking at is up to four hours old and
none of the steps they took had anything to do with it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ship a change now (Priority: P1)

A maintainer has merged a change and wants it on the site now rather than at the next cron tick.

**Why this priority**: It is the request that produced this specification.

**Independent Test**: Run the documented command and observe a deploy run appear in the destination
repository.

**Acceptance Scenarios**:

1. **Given** a change merged to `main` in the source repository, **When** the documented command is run, **Then** a deploy run starts in the destination repository.
2. **Given** a deploy run in progress, **When** it completes, **Then** the published site serves the change.
3. **Given** the deploy succeeded, **When** nothing further is done, **Then** the next cron run does not undo it.

---

### User Story 2 - Know what is actually live (Priority: P1)

A maintainer asks whether a given change is on the site. The answer requires knowing that a push alone
does not deploy, and that the last deploy reads `main` as it was at that moment.

**Why this priority**: The previous quickstart answered this question wrong, by implying a push was
sufficient.

**Acceptance Scenarios**:

1. **Given** a change merged at 23:59 and the next cron at 00:15, **When** the site is checked at 00:05, **Then** the change is not yet live.
2. **Given** a deploy run, **When** its timestamp is compared with a commit's, **Then** the change is live only if it predates the run.

---

### User Story 3 - Check a deployment actually worked (Priority: P2)

A deploy run reports success. Someone needs to confirm the site is serving the new build rather than a
cached or stale one.

**Why this priority**: The workflow does not check. Without a documented procedure, "success" is the only
signal and it is a weak one.

**Acceptance Scenarios**:

1. **Given** a successful deploy, **When** the published CSS is fetched, **Then** it contains the declarations of the change.
2. **Given** a successful deploy, **When** a deep link is opened in a browser, **Then** it renders the route rather than an error.
3. **Given** a stale deployment, **When** the published asset is fetched, **Then** it lacks the change and the procedure reports it.

---

### User Story 4 - Keep this specification true (Priority: P2)

A maintainer reads this specification in six months and knows whether to trust it.

**Why this priority**: See the limitation below. Nothing enforces it.

**Acceptance Scenarios**:

1. **Given** a future change to `deploy.yml`, **When** this specification is read, **Then** it names the file to change and says that the change is in another repository.
2. **Given** a reader who wants to ship code, **When** they read `quickstart.md`, **Then** they have a command and four checks that do not depend on this specification being remembered.

### Edge Cases

- **The cron and a manual dispatch overlap.** `concurrency: group: 'pages'` with
  `cancel-in-progress: false` queues them, so the second waits rather than cancelling the first.
- **The scheduled runs start late.** The destination workflow's own comment records this: a declared
  03:15 cron measured at 08:37Z, 09:44Z, 09:55Z, 10:28Z and 10:40Z. The interval between deploys is
  therefore four hours plus the queue delay, which is GitHub's and not ours.
- **A deploy reads `main` as it is when the run starts**, not when it was scheduled. A run queued behind
  another publishes whatever `main` holds by the time it begins.
- **`fetch:github` runs on every deploy**, including a manual one. A deploy is also a data refresh, so
  the contribution calendar is never more stale than the last deploy.
- **The destination's `README.md` and legacy files are not in the artifact.** They are reachable in the
  repository and absent from the site, which looks inconsistent until `build_type` is understood.
- **A failed CI does not stop a deploy.** The two are in different repositories and neither watches the
  other. A red merge that is pushed to `main` will be published by the next run regardless.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `spec.md` MUST state the pipeline's topology and name both repositories.
- **FR-002**: `spec.md` MUST list the three triggers and MUST state that the `push` trigger does not fire
  in normal operation.
- **FR-003**: `spec.md` MUST state that the schedule exists for data freshness, name
  `specs/019-contribution-freshness`, and MUST NOT present the cron as a code deployment trigger.
- **FR-004**: `spec.md` MUST state the resulting code deployment latency of zero to four hours as a
  consequence of FR-003, rather than leaving it as a configuration detail.
- **FR-005**: `spec.md` MUST record `build_type: workflow` and the condition under which the destination's
  legacy static site would become visible.
- **FR-006**: `spec.md` MUST record that the destination has no secrets and that the automatic
  `GITHUB_TOKEN` is used.
- **FR-007**: `spec.md` MUST record that the workflow performs no post-deployment verification, and
  `quickstart.md` MUST supply a procedure that does.
- **FR-008**: `quickstart.md` MUST give a command that deploys on demand.
- **FR-009**: `quickstart.md` MUST give checks that distinguish a fresh deployment from a stale one.
- **FR-010**: `quickstart.md` MUST state that a deep link returning HTTP 404 is expected and is not a
  failure, with the mechanism.
- **FR-011**: `specs/001-personal-dev-portfolio/quickstart.md` MUST be corrected at lines 292-294, 298,
  356 and 359-365 so that it no longer describes a `deploy` job, a `deploy` npm script, or branch
  protection that does not exist.
- **FR-012**: No workflow file, in this repository or any other, may be changed.
- **FR-013**: No secret may be added.
- **FR-014**: No automation linking a source commit to a deployment may be added.
- **FR-015**: The CI job names quoted MUST be the names in `.github/workflows/ci.yml`.

### Key Entities

- **Source repository**: `ismaelmarot/ismaelmarot-web_2.0`. Holds the application, the CI, and no
  deployment configuration.
- **Destination repository**: `ismaelmarot/ismaelmarot.github.io`. Holds the deploy workflow and output.
  Never the source.
- **Deployment**: the destination's `main` workflow reading the source's `main`. Its three triggers, of
  which one is dead and one is for data.
- **Published result**: whatever `deploy-pages` uploaded. Unverified at the moment of publication.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: No specification in `specs/` describes a CI job named `deploy`, an npm script named
  `deploy`, or branch protection on `main`. Verified by reading the corrected `specs/001` quickstart
  against the six job names in `ci.yml`.
- **SC-002**: `quickstart.md` contains a command that names the destination repository explicitly.
- **SC-003**: `quickstart.md` contains a check that reads the published CSS for a declaration, rather
  than only asserting that the site loads.
- **SC-004**: `spec.md` names all three triggers and states the dead one.
- **SC-005**: `spec.md` states the `build_type: workflow` condition under which the legacy site would be
  published.
- **SC-006**: The four claims in FR-011 were each checked against the repository before being written:
  the six job names against `ci.yml`, the missing `deploy` script against `package.json`, and the absent
  branch protection against the GitHub API.
- **SC-007**: Lint, type checking, the unit tests, the component tests and the build pass, and no
  existing assertion is deleted.

### On what is and is not backed by these criteria

**SC-006 is the only criterion that is really a check.** Everything in this specification is a claim about
two repositories, and a claim about a repository that is not this one cannot be re-verified from here.

**Nothing here is tested, because nothing here can be.** See the limitation below.

## The limitation, stated rather than worked around

**`deploy.yml` is in another repository, so no test in this repository can check that this specification
is still true.**

A test would have to read a file it cannot see, or compare prose against a copy of the workflow committed
here — and a copy is a second thing to keep in step, which is worse than no check because it fails
silently when the real one changes.

**The consistency between this specification and `deploy.yml` is therefore maintained by the
specification, not by CI.** That is a real weakness and it is recorded here instead of being papered over
with a test that cannot fail.

## Assumptions

- **The split into two repositories is the design, not a workaround.** It is stated as deliberate in the
  workflow's own comment, and nothing suggests otherwise.
- **`build_type: workflow` stays.** It is what keeps the legacy content unreachable. Nothing depends on
  changing it, and everything documented here depends on it not changing.
- **The 4-hour cron stays.** Removing it would break the freshness guarantee in `specs/019` to solve a
  latency the maintainer has decided not to solve.
- **No post-deploy verification will be added** to the workflow. It lives in another repository and the
  maintainer chose documentation over automation. `quickstart.md` compensates.
- **The legacy `index.html` and `im_web/` stay committed.** They are harmless while `build_type` is
  `workflow`, and deleting them is a change to another repository.

## Amendments

### Amendment 1 - The deploy mechanism already existed, and the ask was answered by finding it

**Added by**: during implementation, 2026-10-15.

The instruction was to create a deployment method. The pipeline was located instead, in
`ismaelmarot/ismaelmarot.github.io/.github/workflows/deploy.yml`, running four times a day.

**It had already shipped the previous feature.** The 23:03Z scheduled run picked up a commit merged at
22:57Z, and the published assets carry the change — verified by reading `#0a84ff` and
`scroll-snap-type: y proximity` out of the live CSS, and the absence of `--link-hover-decoration` out of
the live JavaScript.

**So this specification documents rather than creates**, and the SDD documentation that does not match
reality is corrected rather than replaced. Recording this because the difference matters: the deliverable
is not a new pipeline, it is an accurate account of an existing one.

### Amendment 2 - A fourth stale claim, found while verifying the first three

**Added by**: during implementation, 2026-10-15.

FR-011 listed three corrections to `specs/001`. Checking the surrounding text for a fourth turned up the
required status checks at lines 359-365, which claim branch protection on `main`.

**`main` has no protection.** `gh api repos/ismaelmarot/ismaelmarot-web_2.0/branches/main/protection`
returns "Branch not protected".

**It matters because the destination workflow checks out `ref: main`.** Nothing stands between a push to a
failing state and the next deployment. The claim that protection exists may have been what made the gap
safe to leave.

### Amendment 3 - The dead trigger is recorded rather than removed

**Added by**: during implementation, 2026-10-15.

`push` to the destination's `main` is a configured trigger that cannot fire, because nobody commits to a
repository of output.

**It was left in place.** Removing it is a change to a workflow in another repository, and FR-012 rules
that out. It is documented instead, so that a future maintainer who pushes to the destination — perhaps
with a README edit — learns from this document that it redeploys, rather than learning it from an
unexplained run.