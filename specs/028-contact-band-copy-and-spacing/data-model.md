# Data Model: The Contact Band's Copy and Spacing

**Feature**: `028-contact-band-copy-and-spacing` | **Date**: 2026-10-17

The feature changes one configuration value. There is no persistence, no state, no new type and no data
flow beyond configuration into the component — exactly as `specs/027`'s data model recorded and nothing
of it moved.

## SiteConfig

`src/types/site.ts` — **no change**. `contactTagline: string` was declared there already and stays.

`src/data/site-config.ts`

| Field | Type | Status | Notes |
|---|---|---|---|
| `email` | `string` | unchanged | The mailto destination. Stays `ismaelmarot@hotmail.com`. |
| `contactDisplayEmail` | `string` | unchanged | The visible address. Stays `ismaelmarot@contacto.com`. |
| `contactTagline` | `string` | **value changed** | `Hablemos y pongámonos manos a la obra`. |

**Validation**: a non-empty string. `useContactBand` reads it and the band renders it as plain text in a
`<p>`; no accent, no escape and no markup can survive the round trip because nothing between the config
and the DOM edits the value.

## ContactBandProps

`src/components/sections/ContactBand/ContactBand.tsx` — **no change**. The `tagline` prop keeps
overriding `derived.tagline` for test fixtures, and the override continues to win over configuration, so
every existing fixture keeps rendering.

## Styled values

`src/components/sections/ContactBand/ContactBand.styles.ts`

| Selector | Declaration | Status | Notes |
|---|---|---|---|
| `StyledContactBandInner` | `gap` | **value changed** | `space[10]` (40px) → `space[12]` (48px). |
| `StyledContactBandDescription` | `font-size` | **value changed** | `--text-body` → `--text-large-subtitle`. |
| `StyledContactBandDescription` | `line-height` | unchanged | 1.625; the 20px text keeps its leading. |
| `StyledContactBandDescription` | `max-width` | unchanged | `60ch`; a wider text needs no narrower column. |
| `StyledContactBandTitle` | all | unchanged | `--text-display-section`, per `specs/027`. |
| `StyledContactBandCta` | all | unchanged | Body text, left-aligned. |
| `StyledContactBandRow` | all | unchanged | `auto 1fr`, and the column edges stay. |
| `StyledContactEmail` | all | unchanged | `--text-display-email`, `justify-self: end`. |
| `StyledContactBand` | all | unchanged | `100dvh`, snap alignment, `space[16]` padding. |

## What flows where

```
siteConfig.contactTagline ──► useContactBand().tagline ──► ContactBand (frase prop) ──► <StyledContactBandDescription>
tokens.space[12] ───────────► StyledContactBandInner.gap ────────┐
var(--text-large-subtitle) ─► StyledContactBandDescription.fontSize
```

The single rendered sentence is the config's own value, so one place carries an accent and one place
carries a size, and neither can drift from the other at the component boundary.
