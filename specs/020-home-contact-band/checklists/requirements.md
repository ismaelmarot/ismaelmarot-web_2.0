---
description: "Requirements quality checklist for the contact band on the landing page"
---

# Requirements Quality Checklist: The Contact Band on the Landing Page

**Purpose**: Review the *quality of the requirements* written before implementation, not whether the
feature was built.
**Created**: 2026-10-14
**Feature**: [spec.md](../spec.md)

**Review Ownership**: This is a reviewer-owned artifact. `[x]` means the criterion was reviewed and found
satisfied as a requirement. It does **not** mean the work is done.

## Clarity

- [x] CHK001 Every requirement names one observable outcome and none names two
- [x] CHK002 The layout is drawn, not described, and the drawing is the one the maintainer confirmed
- [x] CHK003 The three notes from the request are each traceable to a requirement: the diagonal arrow to
      FR-004 and FR-005, the size and the click to FR-001 and FR-003, "Ir →" to FR-010
- [x] CHK004 No requirement uses "appropriate", "clean", "nice", "big" or "clear" without a measurable
      figure behind it
- [x] CHK005 The withdrawn colour request is recorded as withdrawn, with the maintainer's own words, so a
      later reader does not reinstate it by accident

## Completeness

- [x] CHK006 Every requirement is satisfied or explicitly deferred; nothing is left implied
- [x] CHK007 The two things that do not ship — the colour and Facebook and Instagram — are named as
      deferrals with the reason, not as omissions
- [x] CHK008 What this feature does *not* change is stated: the contact page, the footer, the other three
      bands
- [x] CHK009 The constraints already present in the repository are named as requirements, not discovered
      during implementation

## Consistency

- [x] CHK010 No requirement contradicts another
- [x] CHK011 Language matches the language of the other fifteen specifications: requirements in English,
      user-facing copy in Spanish, FR and SC identifiers in the same format
- [x] CHK012 The specification's assumptions do not contradict its requirements
- [x] CHK013 Where this feature touches an earlier specification, it says so and says which way:
      `specs/010` FR-015 to FR-017 are untouched, and this one narrows what a band may look like

## Modifiability

- [x] CHK014 Adding a network is a configuration change, not a code change, and the requirements say so
      (FR-011, FR-019)
- [x] CHK015 The band reads its content from `siteConfig`, so a changed address or name needs no edit here
- [x] CHK016 The shared band shell is deliberately duplicated rather than abstracted, and the duplication
      is recorded so a later change to it knows there are four copies

## Traceability

- [x] CHK017 Every user story maps to at least one requirement
- [x] CHK018 Every requirement maps to a user story, or is marked as a constraint rather than a story
- [x] CHK019 Every success criterion is measurable without running the site, or names the browser test
      that measures it
- [x] CHK020 What is *not* backed by the criteria is stated: the band's short-viewport height, and any
      visual comparison

## YAGNI

- [x] CHK021 No requirement asks for something the maintainer did not ask for
- [x] CHK022 No new dependency is introduced, and the requirement says so explicitly (FR-018)
- [x] CHK023 No animation is added, and the specification records the absence as deliberate
- [x] CHK024 Nothing is generalised for a second caller that does not exist

## Notes

- CHK005 is the item worth the most time here. The colour *was* requested and *was* withdrawn, and a
  requirements review that only recorded the surviving requirements would have made the withdrawal
  invisible. A requirement that was asked for and then deliberately not done is part of the requirements.
- CHK016 exists because the duplicated shell is the one place where this specification does something a
  reviewer would normally reject. Recording it is not the same as justifying it; it is the reason a later
  change knows to look in four places instead of one.
- CHK012's check against earlier specifications turned up one real interaction: `specs/018` made every
  route carry exactly one `h1` and this band is not a route, so it is an `h2` under the Hero's `h1`. That
  was checked before the markup was written rather than found by axe.

## Review

**Result**: the requirements are clear, complete, consistent, modifiable, traceable and free of anything
not asked for. Cleared for planning.

**Reviewed**: 2026-10-14
**Reviewer**: record audit
