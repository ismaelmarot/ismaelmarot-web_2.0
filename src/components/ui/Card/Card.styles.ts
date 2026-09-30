import styled, { css } from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledCard = styled.div<{
  $variant: 'default' | 'bordered' | 'elevated' | 'interactive';
  $padding: 'none' | 'sm' | 'md' | 'lg';
  $hoverable: boolean;
}>`
  border-radius: ${tokens.radii.lg};
  background-color: ${tokens.colors.background};
  transition: box-shadow 200ms ease-out, transform 200ms ease-out;

  ${({ $variant }) => {
    switch ($variant) {
      case 'default':
        return css`border: 1px solid ${tokens.colors.border};`;
      case 'bordered':
        return css`border: 1px solid ${tokens.colors.border};`;
      case 'elevated':
        return css`
          box-shadow: ${tokens.shadows.md};
          border: none;
        `;
      case 'interactive':
        return css`
          border: 1px solid ${tokens.colors.border};
          &:hover {
            box-shadow: ${tokens.shadows.lg};
            transform: translateY(-2px);
          }
        `;
    }
  }}

  ${({ $padding }) => {
    switch ($padding) {
      case 'none':
        return css`padding: 0;`;
      case 'sm':
        return css`padding: ${tokens.space[3]};`;
      case 'md':
        return css`padding: ${tokens.space[4]};`;
      case 'lg':
        return css`padding: ${tokens.space[6]};`;
    }
  }}

  ${({ $hoverable }) => $hoverable && css`
    border: 1px solid ${tokens.colors.border};
    &:hover {
      box-shadow: ${tokens.shadows.lg};
      transform: translateY(-2px);
    }
  `}
`;