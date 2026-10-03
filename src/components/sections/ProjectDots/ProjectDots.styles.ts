import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledProjectDots = styled.ul`
  display: flex;
  align-items: center;
  gap: ${tokens.space[2]};
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

  &:hover::before {
    background-color: var(--color-text-tertiary);
  }

  /* Keep the current dot current on hover: the hover colour would otherwise
     replace the accent and drop the only state that says which card is showing. */
  &[aria-current='true']:hover::before {
    background-color: var(--color-accent);
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