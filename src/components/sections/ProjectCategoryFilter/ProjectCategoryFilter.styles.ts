import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledProjectCategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.space[2]};
`;

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
  transition: background-color var(--transition-normal), color var(--transition-normal);

  ${({ $active }) =>
    $active
      ? `
        background-color: var(--color-accent);
        color: var(--color-white);
      `
      : `
        /* Transparent rather than white: the section is #F5F5F7 and a white pill on it
           measures 1.09:1, so it had no silhouette to begin with. The border was the only
           thing drawing it. No tone close enough to give it a shape keeps the 12px label
           above 4.5:1, so the pill is carried by its text and by the filled active state. */
        background-color: transparent;
        color: var(--color-text-secondary);
      `}

  &:focus-visible {
    outline: none;
    /* The shared focus token is the accent, which is also the active fill, so on the
       active option the ring sat against its own background at 1:1 and indicated
       nothing. Dark ink measures 3.58:1 against the fill and 15.46:1 against the
       section, so it is the one colour that reads against either (FR-030). */
    box-shadow: ${({ $active }) =>
      $active ? '0 0 0 3px var(--color-fg)' : tokens.shadows.focus};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;