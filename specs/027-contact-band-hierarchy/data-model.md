# Data Model: The Contact Band's Hierarchy

**Feature**: `027-contact-band-hierarchy` | **Date**: 2026-10-16

The feature adds one configuration field and one component prop. There is no persistence, no state and no
data flow beyond configuration into the component.

## SiteConfig

`src/types/site.ts`

| Field | Type | Status | Notes |
|---|---|---|---|
| `email` | `string` | unchanged | The mailto destination. Stays `ismaelmarot@hotmail.com`. |
| `contactDisplayEmail` | `string` | **added** | The visible address. `ismaelmarot@contacto.com`. |
| `contactTagline` | `string` | unchanged | The sentence under the question. |

**Validation**: both are non-empty strings. The band renders the display address as text and the
destination inside `mailto:`; an empty display address would render an empty link, so the config carries
both and the component does not derive one from the other.

## ContactBandProps

`src/components/sections/ContactBand/ContactBand.tsx`

| Prop | Type | Status | Notes |
|---|---|---|---|
| `email` | `string` | unchanged | Overridable mailto destination, for tests. |
| `displayEmail` | `string` | **added** | Overridable visible address, for tests. |
| `redes` | `ContactMethod[]` | unchanged | Overridable networks, for tests. |
| `tagline` | `string` | unchanged | Overridable sentence, for tests. |

Every prop is optional and falls back to the value derived from `siteConfig` by `useContactBand`, so the
component can be mounted from a fixture without a router or a config.

## useContactBand return

`src/components/sections/ContactBand/useContactBand.ts`

| Field | Type | Status | Notes |
|---|---|---|---|
| `email` | `string` | unchanged | The mailto destination. |
| `displayEmail` | `string` | **added** | The visible address. |
| `redes` | `ContactMethod[]` | unchanged | Networks, email filtered out, sorted by `displayOrder`. |
| `tagline` | `string` | unchanged | The sentence. |

## Rendered entities

| Entity | Source | Rendered as |
|---|---|---|
| Question | literal `¿Tienes un proyecto?` | `h2`, `--text-display-section` |
| Sentence | `tagline` | `p`, `--text-body` |
| Call to action | literal `ir` + arrow | `a[href="/contact"]`, left-aligned |
| Networks | `redes` | `ul` of external links, left |
| Email | `displayEmail` (text), `email` (destination) | `a[href="mailto:…"]`, flush right |

## Relationships

- `siteConfig.contactDisplayEmail` → `useContactBand.displayEmail` → `ContactBand` visible text.
- `siteConfig.email` → `useContactBand.email` → `ContactBand` `mailto:` destination.
- `siteConfig.contactTagline` → `useContactBand.tagline` → `ContactBand` sentence.
- `siteConfig.socialLinks` → `useContactBand.redes` → `ContactBand` networks (email entry filtered out).

## State transitions

None. The component is stateless; the hook derives its values once per render.
