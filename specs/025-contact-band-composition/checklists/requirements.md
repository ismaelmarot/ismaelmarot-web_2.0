---
description: "Requirements quality checklist for the contact band's composition"
---

# Requirements Quality Checklist: The Contact Band's Composition

**Purpose**: Review the *quality of the requirements* written before implementation, not whether the
feature was built.
**Created**: 2026-10-16
**Feature**: [spec.md](../spec.md)

**Review Ownership**: This is a reviewer-owned artifact. `[x]` means the criterion was reviewed and found
satisfied as a requirement. It does **not** mean the work is done.

## Clarity

- [x] CHK001 Every size decision is a number measured on the rendered page, with the viewport it was
      measured at
- [x] CHK002 The two tables are labelled by what they govern — the address's widths, and the fit per
      viewport — so they are not read as one table
- [x] CHK003 "The same size" is stated as the same token rather than the same pixels, because the
      distinction is what the mobile step exists to address
- [x] CHK004 The one ambiguous mark in the maintainer's drawing — the button's indentation — is named as
      an assumption rather than presented as a requirement

## Completeness

- [x] CHK005 The arrangement covers all five viewports in the matrix, not just desktop and phone
- [x] CHK006 A sixth network is covered: `auto 1fr` means the address loses width, and the amount is
      stated at both 1440 and 768
- [x] CHK007 An empty network list is covered
- [x] CHK008 A longer address is named as an invalidating change with no detection

## Consistency

- [x] CHK009 No requirement contradicts another; FR-001 and FR-004 are the same claim at two widths
- [x] CHK010 Nothing contradicts `specs/021`. Where `specs/021` chose the question's size, this feature
      keeps it and says why the larger subject strengthens that choice rather than weakening it
- [x] CHK011 FR-013 keeps the band's identity — id, label, height, snap — so the three bands above and
      `specs/023`'s snap points are unaffected

## Modifiability

- [x] CHK012 One token decides the address's size, and the component carries no media query of its own
- [x] CHK013 One copy of the markup with `order`, so the desktop and mobile arrangements cannot disagree
- [x] CHK014 The sentence is a configuration value, so changing it needs no component

## Traceability

- [x] CHK015 SC-001 to SC-005 are measurements, and the specification says so rather than implying the
      component tests cover widths
- [x] CHK016 SC-002 and SC-003 exist specifically to replace `specs/021`'s recorded table with something
      that fails, and the specification says that is what they are for
- [x] CHK017 SC-009 protects the four tokens other sections read, so this feature cannot quietly move a
      component it does not own

## YAGNI

- [x] CHK018 No new component, no context, no new token, no dependency
- [x] CHK019 No handling for a longer address, no detection, no wrapping — the request was a size, and
      the arithmetic is documented instead

## Notes

- CHK004 is the item worth the time. The drawing is the requirement, and its one ambiguous mark is the
  button's indentation. Writing it down as an assumption means a reader who meant something else finds
  one declaration to change, rather than discovering the interpretation from the rendered page.
- CHK003 and FR-001 are the same decision seen twice. "The same size" and "the same token" are different
  requirements, and the mobile step is what exists to reconcile them.
- CHK012 is the item that saves the next person work. A size decided in two places — a token and a media
  query — is a size that will be half-changed the first time it needs moving.
- CHK019 is the discipline. Detecting a longer address would mean measuring at run time, and the request
  was a size. The cost is recorded in the specification's edge cases so the next person who changes the
  address knows the ceiling moved out from under them.

## Review

**Result**: clear, complete, consistent, modifiable, traceable, and free of anything not asked for.
Cleared for implementation.

**Reviewed**: 2026-10-16
**Reviewer**: record audit