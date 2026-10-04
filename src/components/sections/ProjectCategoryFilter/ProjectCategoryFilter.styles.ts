import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledProjectCategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.space[2]};
`;

/**
 * Visually identical to the main navigation's links: no fill, no border, and the active option is
 * marked by its text colour alone. Measured from the live header rather than assumed — inactive
 * #6E6E73, active #0062C4, 12px, weight 500.
 *
 * The active colour is `--color-accent-text` and not `--color-accent` because the fill is gone. With
 * a fill, #0071E3 carried white text at 4.70:1; as 12px text on #F5F5F7 it measures 4.31:1 and fails
 * AA. This is the same distinction the token system already draws between a fill colour and a text
 * colour, and the same one the navigation already follows.
 *
 * The 44px height is a deliberate deviation from the reference: the navigation's links are 18px tall.
 * With a transparent background the extra height is invisible, and it is the difference between a
 * valid touch target and an 18px one across seven options (FR-034).
 */
export const StyledProjectCategoryOption = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: ${tokens.space[2]} ${tokens.space[4]};
  font-family: ${tokens.fonts.sans};
  font-size: var(--text-label);
  font-weight: ${tokens.fontWeights.medium};
  white-space: nowrap;
  cursor: pointer;
  /* On the base, not per state, and that is the whole point of FR-026. This button
     used to declare no border at all while the active branch set only border-color,
     so border-width and border-style stayed at their initial values and the browser
     applied its own default: 2px outset. That moulding also made the active option
     2px wider than the others, so picking a category resized its own pill. Declaring
     it here means no branch can reintroduce it.
     Written as 0 rather than none because cssstyle, the parser jsdom uses, cannot
     represent the keyword and silently rewrites it to the initial "border: medium",
     which would make the regression untestable. Both spellings mean the same thing to a
     browser; only one survives a test. */
  border: 0;
  border-radius: ${tokens.radii.full};
  background-color: transparent;
  /* Colour only. The background no longer changes between states, so transitioning it
     would be dead CSS. */
  transition: color var(--transition-normal);

  ${({ $active }) =>
    $active
      ? `
        color: var(--color-accent-text);
      `
      : `
        color: var(--color-text-secondary);
      `}

  /* Colour only, exactly like the navigation: no border, no shadow, no fill appears
     under the pointer (FR-033). Hover darkens rather than lightens, which is what the
     navigation does so that both states keep meeting AA on this background. */
  &:hover {
    ${({ $active }) =>
      $active
        ? 'color: var(--color-accent-text-hover);'
        : 'color: var(--color-text-primary);'}
  }

  &:focus-visible {
    outline: none;
    /* Both states share the token again. The dark ring this component needed in
       Amendment 1 existed only because the active fill was the same blue as the ring,
       giving 1:1 against its own background. With no fill there is nothing to contrast
       against, and the shared token measures 4.31:1 against this section, clearing the
       3:1 a non-text indicator needs. */
    box-shadow: ${tokens.shadows.focus};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;