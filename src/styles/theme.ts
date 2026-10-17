import { css } from 'styled-components';

/**
 * The dark theme, as custom properties.
 *
 * A surface opts in by interpolating this where it needs the values, and everything inside it inherits:
 * every colour in `src/styles/tokens.ts` is a `var(--color-*)` string rather than a duplicated value, so
 * overriding the property here is enough to recolour the whole subtree. That is the mechanism
 * `Header.styles.ts` has always used, and this fragment is where its values live now.
 *
 * **`--color-accent` is the override that is not a colour swap.** It is there for the navigation's hover,
 * which `specs/022` moved off `--color-text-secondary`. Two values, not one, because arithmetic forbids a
 * single one: every accent in the system was tuned against white, and the stock `--color-accent` `#0071E3`
 * is 4.47:1 on black and misses AA by 0.03, while a blue light enough to fix that is too light for white.
 * `#0A84FF` is 5.76:1 on black; the light theme keeps `#0071E3`, which is 4.70:1 on white.
 *
 * **`--color-background` is here for a surface this fragment cannot reach.**
 * `MobileMenu.styles.ts` sets its panel with `tokens.colors.background`, which is `var(--color-background)`,
 * so overriding the property here is what turns that panel black — the declaration is already theme-aware
 * and needed no edit. Nothing inside the header subtree reads it: the header sets its own black literally,
 * so adding it here changes nothing the header renders.
 */
export const darkSurface = css`
  --color-fg: #ffffff;
  --color-fg-muted: #e8e8ed;
  --color-text-secondary: #ffffff;
  --color-text-primary: #ffffff;
  --color-accent: #0a84ff;
  --color-accent-text: #ffffff;
  --color-accent-text-hover: #ffffff;
  --color-bg-muted: rgba(255, 255, 255, 0.14);
  --color-border: rgba(255, 255, 255, 0.24);
  --color-background: #000000;
`;