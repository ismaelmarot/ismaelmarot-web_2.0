import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

/* The outer wrapper holds the controls and the dots together in one row.
   The dots stay a real list, so the group cannot be a div inside their ul: a ul
   whose children are not li loses its list semantics, which axe reports. */
export const StyledProjectControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${tokens.space[4]};
`;

export const StyledProjectDots = styled.ul`
  display: flex;
  align-items: center;
  gap: ${tokens.space[3]};
  margin: 0;
  padding: 0;
  list-style: none;
`;

/* The dot is small, so the button around it is not: a 8px dot is far below the
   24px minimum target, and the extra room costs nothing visually. */
export const StyledProjectDot = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: ${tokens.radii.full};
  background: none;
  cursor: pointer;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: ${tokens.radii.full};
    background-color: var(--color-border);
    transition: background-color var(--transition-normal),
      transform var(--transition-normal) var(--ease-out);
  }

  &[aria-current='true']::before {
    background-color: var(--color-accent);
    transform: scale(1.5);
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${tokens.shadows.focus};
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      transition: none;
    }

    &[aria-current='true']::before {
      transform: none;
    }
  }
`;

export const StyledProjectDotGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.space[1]};
`;

/* Play/stop and the arrows. No :hover rule anywhere, by request: a control that
   reacted under the pointer would be a rule with nothing to change. Focus styling
   is not hover styling, so the focus ring stays, because otherwise these controls
   would be invisible to anyone navigating by keyboard.
   They sit outside the card on the #F5F5F7 section, so they keep the page's own
   ink rather than the card's light one. */
export const StyledProjectControl = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: ${tokens.radii.full};
  background: var(--color-bg);
  color: var(--color-fg);
  cursor: pointer;

  &:focus-visible {
    outline: none;
    box-shadow: ${tokens.shadows.focus};
  }
`;