# Plan: Project Showcase Scenes

**Spec**: `spec.md`

## Approach

Build the scene as a CSS 3D stack per slot. No new dependencies.

```
<Scene>                     perspective: 1100px, position: relative
  <Blob>                    soft radial-gradient backdrop, accent colour
  <Stack>                   preserve-3d, gentle float keyframe
    <BackPanel>             accent gradient panel, rotateY(-26deg) rotateX(10deg), offset
    <FrontPanel>            screenshot, rotateY(-14deg) rotateX(6deg)
  <Caption>                 name + short description
```

The two panels at different angles inside one `preserve-3d` stack are what produce the layered depth of
the reference (the fanned iPads, the overlapping iPhones). A single tilted panel reads as a flat card.

## Decisions

- **No phone frame.** `react-device-bezels` uninstalled. Also removes the nested-frame problem on
  `trash2treasure`.
- **`object-fit: contain`**, not `cover`. All six first captures are portrait but with ratios from 0.462 to
  0.632; `cover` cropped the tallest and the prototype's empty band was the visible symptom. `contain` in a
  fixed 9:16 panel shows each whole.
- **Rotation by counter.** The prototype derived the next cycle from whichever project was in column 0,
  which is ambiguous because a project belongs to more than one arrangement. An explicit counter driving the
  already-verified `projectIndexes` removes the ambiguity entirely.
- **Accent per project, not per column.** Keyed by project id, so a project keeps its colour when it moves.
  Derived from the id when unmapped, so a new project still gets one.
- **No pause button.** The reference auto-rotates without one and the user declined the marquee's. Hover,
  focus-within, document-hidden and reduced motion all pause it.

## Verification

- Unit: `projectIndexes` for the no-repeat and even-distribution properties.
- Component: renders four scenes, tilted, layered, caption matched, rotation advances, hover stops it,
  reduced motion stops it, failed screenshot degrades in place.
- E2E: four at 1440, one at 390, no overflow at 320, axe clean.
- Visual: screenshot at 1440, 768, 390 and compare against the reference.

## Risks

- `preserve-3d` is clipped by an ancestor with `overflow: hidden`. The stage must not create a flattening
  context, and the section's existing overflow must be checked.
- Letterboxing on `contain` looks wrong if the panel background is too light. The panel surface is the
  accent at low alpha over the section, so the letterbox reads as part of the device.