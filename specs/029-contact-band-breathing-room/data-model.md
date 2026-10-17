# Data Model: The Contact Band's Breathing Room

**Feature**: `029-contact-band-breathing-room` | **Date**: 2026-10-17

The feature changes one value on one stylesheet declaration. There is no persistence, no state, no
config field, no prop and no data flow at all — smaller than `specs/028`'s footprint, because not even
the copy moves.

## SiteConfig

`src/types/site.ts` / `src/data/site-config.ts` — **no change**. `contactTagline` and
`contactDisplayEmail` are exactly what specs/028 left them.

## ContactBandProps

`src/components/sections/ContactBand/ContactBand.tsx` — **no change**.

## Styled values

`src/components/sections/ContactBand/ContactBand.styles.ts`

| Selector | Declaration | Status | Notes |
|---|---|---|---|
| `StyledContactBandInner` | `gap` | **value changed** | `space[12]` (48px) → `space[16]` (64px). |
| `StyledContactBand` | all | unchanged | Shell, `100dvh`, snap, `padding-block: space[16]`. |
| `StyledContactBandCopy` | all | unchanged | No margin; the parent's gap owns the separation. |
| `StyledContactBandTitle` | all | unchanged | `--text-display-section`, per specs/027. |
| `StyledContactBandDescription` | all | unchanged | `--text-large-subtitle`, per specs/028. |
| `StyledContactBandCta` | all | unchanged | `align-self: flex-start`. |
| `StyledContactBandRow` / `Networks` / `Email` | all | unchanged | `auto 1fr`, `justify-self: end`. |

## What flows where

```
tokens.space[16] ─► StyledContactBandInner.gap ─► rendered 64px between button and row
```

One token, one declaration, one measured consequence — the whole feature and nothing beside it.
