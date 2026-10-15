---
description: "Requirements quality checklist for the contact band's proportions"
---

# Requirements Quality Checklist: The Contact Band's Proportions

**Purpose**: Review the *quality of the requirements* written before implementation, not whether the
feature was built.
**Created**: 2026-10-15
**Feature**: [spec.md](../spec.md)

**Review Ownership**: This is a reviewer-owned artifact. `[x]` means the criterion was reviewed and found
satisfied as a requirement. It does **not** mean the work is done.

## Clarity

- [x] CHK001 Every requirement names one observable outcome, and the measurements behind SC-001 to SC-005
      are written down rather than approximated
- [x] CHK002 The layout is drawn, and the drawing is the one the maintainer described
- [x] CHK003 The six corrections are each traceable to a requirement: the question's size to FR-003, the
      address's to FR-002, the split to FR-004, the black button to FR-007, the name to FR-009, the
      divider to FR-010
- [x] CHK004 No requirement says "big", "balanced" or "roomy" without a number behind it
- [x] CHK005 The one requirement that was asked for and then declined is recorded as withdrawn, with the
      maintainer's own words, in the specification's Amendment 1

## Completeness

- [x] CHK006 Every requirement is met or explicitly withdrawn; nothing is implied
- [x] CHK007 The consequences of adding two entries to one shared list — the footer and `/contact` — are
      named in the requirements and in the plan rather than discovered afterwards
- [x] CHK008 What this does not change is stated: the band's height, `Layout`, the other bands, and the
      contact page's own design

## Consistency

- [x] CHK009 No requirement contradicts another
- [x] CHK010 The specification does not contradict `specs/020` without saying so, and it amends that
      document rather than quietly overriding it
- [x] CHK011 Language matches the other sixteen specifications: requirements in English, user-facing copy
      in Spanish, the same FR and SC identifier format
- [x] CHK012 The assumptions do not contradict the requirements, and the one numerical assumption — that
      40px is the ceiling and 44px does not fit — is the same number the requirements carry

## Modifiability

- [x] CHK013 Putting a real profile on either mark is one configuration change, and the specification says
      so
- [x] CHK014 No measurement was introduced, so nothing on the page has to be kept in step with anything
      else, and that is a deliberate consequence of the maintainer's decision rather than an omission

## Traceability

- [x] CHK015 Every user story maps to at least one requirement, and every requirement maps to a story or is
      marked as a constraint
- [x] CHK016 Every success criterion names whether it is a component assertion or a browser measurement,
      and the ones that cannot be asserted from jsdom say so
- [x] CHK017 What is not covered is stated: the band's height, and any visual comparison against a
      previous rendering

## YAGNI

- [x] CHK018 No requirement asks for anything the maintainer did not ask for
- [x] CHK019 No new dependency and no new hook, and both are requirements rather than accidents
- [x] CHK020 No new typographic step was added for the heading; an existing token carried it, and the
      review corrected which one: `--text-large-subtitle` inverts the hierarchy below 390px, so the
      heading sits at `--text-body`. See Amendment 2.

## Notes

- CHK005 and CHK020 are the two that changed the shape of the work. The first is why the specification has
  an amendment section: a requirement asked for in writing and then declined is still a requirement, and a
  record that only lists the surviving ones makes the withdrawal invisible.
- The second is why FR-003 names a token rather than a number. The question could have been given a size of
  its own, and that would have put a fourth display step into a scale that has three.
- CHK014 records a cost that was accepted rather than a problem that was solved. The requirement to share
  one screen between the band and the footer was real, and meeting it would have meant a hook in `Layout`.
  The specification says the section is one screen and a fifth, which is the honest form of that sentence.

## Review

**Result**: clear, complete, consistent, modifiable, traceable, and free of anything not asked for.
Cleared for implementation.

**Reviewed**: 2026-10-15
**Reviewer**: record audit
