# Tasks: Project Showcase Scenes

- [x] 1. Remove `react-device-bezels` from `package.json` and the lockfile
- [x] 2. Rewrite `spec.md` for the CSS 3D, no-frame design
- [x] 3. Record the icon shadow as Amendment 1 of `specs/011-project-icon-strip/spec.md`
- [x] 4. `showcaseScenes.ts`: per-project accent palettes keyed by id, with an id-derived fallback
- [x] 5. `showcaseRotation.ts`: drop `siguienteCiclo`/`cicloSiguiente`, export `CICLOS`, keep `projectIndexes`
- [x] 6. `ProjectShowcase.styles.ts`: rewrite as the 3D scene
  - [x] 6.1 grid 4 / 2 / 1 at 1280, 1024, below
  - [x] 6.2 stage with `perspective`, contained coloured backdrop
  - [x] 6.3 `preserve-3d` stack, back panel + front panel at different angles
  - [x] 6.4 float keyframe, removed under reduced motion
  - [x] 6.5 caption sized for four columns, not the card title size
- [x] 7. `ProjectShowcase.tsx`: explicit cycle counter, hover/focus/hidden pause, no pause button
- [x] 8. `index.ts`: update exports
- [x] 9. Unit test `projectIndexes` and the accent resolver
- [x] 10. Component test for the scene
- [x] 11. E2E test for the breakpoints, overflow and no-reduced-motion violation
- [x] 12. `npm run typecheck`, `npm run lint`, `npm run build`
- [x] 13. Full suite, confirming only the three pre-existing e2e failures remain
- [x] 14. axe at 1440 / 768 / 390 / 320
- [x] 15. Screenshots at 1440 / 768 / 390 and compare against the reference
- [x] 16. Document the one-screen invariant break as Amendment 2 of specs/011
- [ ] 17. Commit and push
- [ ] 18. Deploy and verify production

## Verification results

| Check | Result |
| --- | --- |
| typecheck | clean |
| lint | clean |
| build | 448.40 kB, 142.57 kB gzip (was 452 kB before, so the showcase costs nothing) |
| unit | 108 passed |
| component | 364 passed |
| e2e chromium | 90 passed, 3 failed, all three pre-existing |
| axe | 0 violations |

The three e2e failures are unchanged from before this work and unrelated to it:
`homepage.spec.ts` "displays all 5 sections" and "navigation works", and
`keyboard.spec.ts` "skip link appears on first tab".

## Findings from the visual pass

Two problems were only visible in a screenshot, not in a test:

- **The coloured backdrop bled outside the scene.** A blurred 116%-wide radial gradient smeared into the
  section and read as a smudge. Replaced with a contained rounded panel at `inset: 0`, which is also what
  the reference does: a defined colour field with a hard edge, the device on top.
- **The back panel was nearly invisible.** At a 16% offset only a thin fringe showed on one side, which
  read as a colour artefact rather than as a second device. Now offset 22% with a darkened shade of the
  accent so it separates from the backdrop it now shares colour with.

## What a screenshot could not confirm

A panel appeared blank in one capture run while reporting `complete: true` and a non-zero `naturalWidth`.
It reproduced only with the float animation running and not under reduced motion, so it was a screenshot
artefact of a moving layer rather than a painting failure. Verified by sampling the same panel repeatedly
with animation disabled: it painted every time.