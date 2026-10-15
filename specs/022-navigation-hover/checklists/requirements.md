---
description: "Requirements quality checklist for the navigation's hover"
---

# Requirements Quality Checklist: The Navigation's Hover

**Purpose**: Review the *quality of the requirements* written before implementation, not whether the
feature was built.
**Created**: 2026-10-15
**Feature**: [spec.md](../spec.md)

**Review Ownership**: This is a reviewer-owned artifact. `[x]` means the criterion was reviewed and found
satisfied as a requirement. It does **not** mean the work is done.

## Clarity

- [x] CHK001 Every requirement names one declaration or one measurable colour
- [x] CHK002 The three parts of the request are each traceable: no underline to FR-003, same reaction in
      both themes to FR-001 and FR-002, blue to FR-002 and FR-004
- [x] CHK003 The contrast table in the specification gives every candidate's number rather than asserting
      that one is best
- [x] CHK004 No requirement says "clear" or "visible" about the hover without a contrast figure behind it

## Completeness

- [x] CHK005 What this does not change is stated: the four accent tokens, the mobile menu, the dark-region
      detection, the header's height
- [x] CHK006 The consequence of sharing one component — the footer's navigation turning blue as well — is
      named in the requirements and in the plan rather than left to be discovered

## Consistency

- [x] CHK007 No requirement contradicts another
- [x] CHK008 The specification does not contradict any earlier document, and none of them assert that the
      underline is a wanted behaviour
- [x] CHK009 Language matches the other seventeen specifications: requirements in English, the same FR and
      SC identifier format, the same register

## Modifiability

- [x] CHK010 The dark blue is a literal in the block that already holds eight literals, so it is changed in
      one place and no other component has to know
- [x] CHK011 The hover reads one token, so retheming the navigation is a token change rather than a
      component change

## Traceability

- [x] CHK012 Every success criterion names whether it is a browser measurement or an arithmetic one, and
      the two that are arithmetic say so
- [x] CHK013 SC-007 asserts the variable's absence from the source, which is the one criterion a
      component test can reach and the one that would otherwise be forgotten when the declaration changes

## YAGNI

- [x] CHK014 No new token, no new component, no new dependency
- [x] CHK015 Nothing was added for the mobile menu or the footer that the maintainer did not ask for

## Notes

- CHK003 is the item worth the time. The obvious answer to "make it blue" is one blue, and the table is
  what stops that being written down without being checked: the site's own blue misses AA on black by
  0.03, which is the kind of shortfall that is invisible in a review and permanent in production.
- CHK006 exists because the footer changed without anyone asking for it to. That is a consequence of one
  component serving three surfaces, and the checklist's job is to make a consequence visible before the
  code, not after.
- CHK014 was the second time in this sequence that the answer to "just use the existing token" was no. The
  first was `specs/021`'s heading, where the existing token inverted a hierarchy.

## Review

**Result**: clear, complete, consistent, modifiable, traceable, and free of anything not asked for.
Cleared for implementation.

**Reviewed**: 2026-10-15
**Reviewer**: record audit
