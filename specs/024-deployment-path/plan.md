# Implementation Plan: The Deployment Path

**Branch**: `024-deployment-path` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

## Summary

Two documents and four corrections. No workflow, no secret, no automation. The deliverable is an account
of a pipeline that already runs four times a day.

## Technical Context

**Language/Version**: Markdown
**Primary Dependencies**: none
**Storage**: none
**Testing**: none, and that is a finding rather than an omission — see below
**Target Platform**: GitHub Pages
**Constraints**: FR-012 rules out touching a workflow; FR-013 and FR-014 rule out secrets and automation

## The finding that shaped the plan

**The maintainer asked for a deployment method to be created, and one already existed.**

It lives in `ismaelmarot/ismaelmarot.github.io/.github/workflows/deploy.yml`, not in this repository,
which is why twenty-three specifications and a `vite.config.ts` comment could point at the destination
without any of them describing how a commit gets there.

**And it had already shipped the previous feature.** The 23:03Z scheduled run picked up a commit merged
at 22:57Z. This was checked against the live site rather than taken from the run's green tick: the
published CSS contains `scroll-snap-type:y proximity` and the published JavaScript contains `#0a84ff`
and no `--link-hover-decoration`. A green run says the workflow finished; the asset says the right thing
is being served, and only the second one is worth believing.

**So the plan is documentation and correction.** The offer to add automatic deployment was made and
declined, and that decision is recorded rather than quietly honoured.

## What gets corrected, and why it is not a stale note

Four claims in `specs/001-personal-dev-portfolio/quickstart.md` describe infrastructure that does not
exist. Each was checked before being corrected:

| Claim | Checked against | Result |
|---|---|---|
| `deploy` job in CI | the six `name:` keys in `ci.yml` | Lint, TypeCheck, Tests, Build, E2E Tests, Accessibility — no `deploy` |
| `deploy: # GitHub Pages` npm script | `package.json` | absent |
| push to `main` deploys | `deploy.yml` `on:` block | the workflow is in the other repository |
| branch protection with required checks | `.../branches/main/protection` | "Branch not protected" |

**The last one is the finding that was not looked for.** It matters more than a stale note because the
destination workflow checks out `ref: main`, so the absence of protection is the absence of anything
between a failing push and the next deployment.

**A reader following Scenario 9 to its end pushes, waits, and concludes the deployment succeeded.** The
site they are looking at is up to four hours old, and nothing they did had any effect on it.

## What gets written, and the part that does real work

`spec.md` accounts for the pipeline. `quickstart.md` does the work that matters day to day, because
**the workflow verifies nothing after it deploys** — it ends at `deploy-pages` with no request to the
published URL.

**So the quickstart's checks read the published asset for a declaration.** Not "the site loads", which a
cache will satisfy, and not "the run is green", which the workflow's own list of steps guarantees. Fetch
the CSS, look for the thing that changed. A stale deployment fails that check and passes every other one
available.

## What is deliberately not built

**No post-deploy verification step in the workflow.** It is the right place for it and it is in another
repository. FR-012 rules it out; the manual procedure compensates.

**No automated link from a commit to a deployment.** Offered, declined, recorded.

**No test asserting this specification stays true.** The reasoning is in the spec and it is worth repeating
here, because a test here would be the obvious thing to add and it would be worse than nothing: it would
have to compare prose against either a file it cannot see or a copy of `deploy.yml` committed here. The
copy is worse, because it fails silently when the real workflow changes — it still agrees with itself.

**The limitation is written into `spec.md` instead.** A documented weakness is visible; a test that cannot
fail is not.

## Three things that look like failures and are not

Recorded because each would otherwise cost someone an investigation:

**A deep link returns HTTP 404.** It always will. Pages has no rewrite rule for a history-routed app; it
serves `404.html`, which stashes the path and replaces the URL with `/`, and the script in `index.html`
replays it. Verified in production: `/contact` returns 404 and renders "Contacto".

**The destination repository has files the site does not serve.** Its `index.html` and `im_web/` are a
hand-written site, committed and unreachable, because `build_type: workflow` means Pages uses the uploaded
artifact.

**The deploy reads `main` when the run starts, not when it was scheduled.** A run queued behind another
publishes whatever `main` holds by the time it begins. With `cancel-in-progress: false`, they queue
rather than cancelling.

## The one thing that would go wrong without this document

**Changing the Pages configuration to serve from the branch.** It would publish the legacy static site
that sits in the destination's root. No CI check would fail, no run would report anything — the workflow
would keep succeeding while serving a different website. The first person to find out would be a visitor.

That is the kind of failure that leaves no trace, which is the only reason it belongs in a document rather
than in a comment nobody reads.