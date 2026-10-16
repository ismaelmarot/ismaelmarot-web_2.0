---
description: "Requirements quality checklist for the deployment path"
---

# Requirements Quality Checklist: The Deployment Path

**Purpose**: Review the *quality of the requirements* written before implementation, not whether the
feature was built.
**Created**: 2026-10-15
**Feature**: [spec.md](../spec.md)

**Review Ownership**: This is a reviewer-owned artifact. `[x]` means the criterion was reviewed and found
satisfied as a requirement. It does **not** mean the work is done.

## Clarity

- [x] CHK001 Every claim about the pipeline names the repository or the file it comes from
- [x] CHK002 The three triggers are a table with a "Fires" column that says "never" on the third, rather
      than a sentence that could be read either way
- [x] CHK003 "Between zero and four hours" is given as a consequence with a worked example, not as a
      configuration value
- [x] CHK004 The word "never" appears once, on the dead trigger, and the reason it cannot fire is given

## Completeness

- [x] CHK005 `build_type: workflow` is recorded together with the single action that would breach it
- [x] CHK006 The absence of post-deployment verification is recorded, and the quickstart supplies one
- [x] CHK007 The absence of branch protection is recorded together with why it matters — that the
      deployment reads `ref: main`
- [x] CHK008 The deep-link 404 is recorded as expected, with the mechanism and a note that `curl` and a
      browser disagree
- [x] CHK009 The empty secret list is recorded, so "no secrets" is a checked fact rather than an
      assumption

## Consistency

- [x] CHK010 The six job names quoted match `.github/workflows/ci.yml` exactly, including capitals
- [x] CHK011 Nothing in this specification contradicts another spec; the only prior claims it touches are
      the four in `specs/001`, and those are corrected in the same change
- [x] CHK012 `specs/019-contribution-freshness` is named as the reason the cron exists, rather than the
      cron being described as a deployment mechanism in its own right

## Modifiability

- [x] CHK013 `quickstart.md` is the operating procedure and `spec.md` is the account. A maintainer shipping
      a change reads one and does not need the other
- [x] CHK014 The quickstart's checks read the published asset, so they work for any future change without
      being edited — they name one declaration as an example, not as the check

## Traceability

- [x] CHK015 SC-006 is the only criterion that is a real check, and the specification says so rather than
      presenting the rest as verification
- [x] CHK016 The limitation — that nothing here can be tested — is in the specification's body, not in an
      appendix, so a reader meets it before relying on the document

## YAGNI

- [x] CHK017 No workflow changed, no secret added, no automation added
- [x] CHK018 No test was written that cannot fail

## Notes

- CHK018 is the item worth the time. The obvious addition here is a test asserting that this specification
  matches `deploy.yml`. It would have to compare prose against either a file in another repository — which
  it cannot read — or a copy of `deploy.yml` committed here. **The copy is the worse option**: it agrees
  with itself, so when the real workflow changes the test stays green and reports that everything is
  fine. A test that cannot fail is worse than no test, because it buys the appearance of a guarantee.
- CHK007 came from looking for a third stale claim and finding a fourth. The branch protection line was not
  in scope; it is the one correction with consequences, because the deployment reads the branch it claims
  to be protected.
- CHK004 is the item a reader skims past. A configured trigger that can never fire reads as a working
  safety net in any file listing, and the failure mode is someone relying on it.

## Review

**Result**: clear, complete, consistent, modifiable, traceable, and free of anything not asked for.
Cleared for implementation.

**Reviewed**: 2026-10-15
**Reviewer**: record audit