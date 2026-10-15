---
description: "Requirements quality checklist for section-by-section scrolling"
---

# Requirements Quality Checklist: Section-by-Section Scrolling

**Purpose**: Review the *quality of the requirements* written before implementation, not whether the
feature was built.
**Created**: 2026-10-15
**Feature**: [spec.md](../spec.md)

**Review Ownership**: This is a reviewer-owned artifact. `[x]` means the criterion was reviewed and found
satisfied as a requirement. It does **not** mean the work is done.

## Clarity

- [x] CHK001 `proximity` and `mandatory` are compared in a table rather than one being asserted as right
- [x] CHK002 "De sección en sección" is recorded as an assumption that could be wrong, with the
      consequence of being wrong named — if it meant an obligation, the central decision is wrong
- [x] CHK003 The 182px footer is given as a concrete instance of why `mandatory` fails here, not as a
      general caution
- [x] CHK004 No requirement says "smooth" or "pleasant" without a measurement behind it

## Completeness

- [x] CHK005 The five bands are enumerated by name rather than described as "the sections"
- [x] CHK006 The footer is explicitly excluded from being a snap point (FR-005)
- [x] CHK007 The reduced-motion decision is a requirement (FR-008) rather than an absence, so it is
      visible and reversible
- [x] CHK008 The horizontal scrollers inside the bands are named in the edge cases

## Consistency

- [x] CHK009 No requirement contradicts another; FR-010 exists specifically to stop the snapping working
      and being double-offset at the same time
- [x] CHK010 The specification does not contradict `specs/003`'s `scroll-padding-top: 64px` or the band
      heights measured by `hero-band`
- [x] CHK011 `proximity` on `<html>` cannot be confused with the existing `x mandatory` on the carousel
      containers, because the two are named with their own axes

## Modifiability

- [x] CHK012 The five alignment declarations are static and local to three components; changing which
      sections snap needs no hook or condition
- [x] CHK013 The mechanism is one attribute name, so changing `proximity` to `mandatory` is one word in
      one rule and nothing else

## Traceability

- [x] CHK014 SC-010 exists because this feature can silently resize a page, and it is measured against
      assertions the repository already makes
- [x] CHK015 SC-008 asserts the *absence* of a snap on a hard flick, which is the only criterion that
      distinguishes `proximity` from `mandatory` and would be the first thing lost if it tightened
- [x] CHK016 SC-006 asserts the attribute's removal on navigation, because a leaked attribute on `<html>`
      is silent and no landing-page assertion would notice it

## YAGNI

- [x] CHK017 No wrapper component, no context, no store, no new dependency
- [x] CHK018 Scroll restoration was identified as a possible extension and left out rather than half-built

## Notes

- CHK002 is the item worth the time. "De sección en sección" reads like an obligation, and the honest
  position is that `proximity` satisfies the rhythm and does not satisfy the rule. The specification says
  so in its own voice rather than letting a reader infer it, because a future maintainer who wants
  `mandatory` should find the reasoning here and reverse it deliberately.
- CHK009's `scroll-margin-top` exclusion is the second time in this sequence that a correct-looking CSS
  property would have broken a working arrangement by doubling an offset that already existed.
- CHK015 is the reverse of the usual worry. Most checklists ask whether the feature does what it claims;
  this one asks whether it stops doing things the visitor did not ask it to stop.

## Review

**Result**: clear, complete, consistent, modifiable, traceable, and free of anything not asked for.
Cleared for implementation.

**Reviewed**: 2026-10-15
**Reviewer**: record audit