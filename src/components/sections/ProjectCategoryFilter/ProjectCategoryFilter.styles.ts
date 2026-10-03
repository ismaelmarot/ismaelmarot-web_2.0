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
  border-radius: ${tokens.radii.full};
  transition: background-color var(--transition-normal), color var(--transition-normal),
    border-color var(--transition-normal);

  ${({ $active }) =>
    $active
      ? `
        background-color: var(--color-accent);
        border-color: var(--color-accent);
        color: var(--color-white);
      `
      : `
        background-color: var(--color-bg);
        border: 1px solid var(--color-border);
        color: var(--color-text-secondary);

        &:hover {
          background-color: var(--color-bg-muted);
        }
      `}

  &:focus-visible {
    outline: none;
    box-shadow: ${tokens.shadows.focus};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;