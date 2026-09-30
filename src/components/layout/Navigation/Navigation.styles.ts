import styled, { css } from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledNav = styled.nav<{ $variant: 'header' | 'mobile' | 'footer' }>`
  display: flex;
  align-items: center;
  gap: ${tokens.space[6]};

  ${({ $variant }) => {
    switch ($variant) {
      case 'header':
        return css`
          display: flex;
          @media (max-width: 767px) {
            display: none;
          }
        `;
      case 'mobile':
        return css`
          display: flex;
          flex-direction: column;
          gap: ${tokens.space[4]};
          padding-block: ${tokens.space[6]};
        `;
      case 'footer':
        return css`
          display: flex;
          gap: ${tokens.space[6]};
          font-size: ${tokens.fontSizes.sm};
          color: ${tokens.colors.textMuted};
        `;
    }
  }}
`;

export const StyledNavItem = styled.a<{ $active?: boolean }>`
  color: ${tokens.colors.textSecondary};
  font-weight: ${tokens.fontWeights.medium};
  text-decoration: none;
  transition: color 120ms ease-out;

  &:hover {
    color: ${tokens.colors.primary};
  }

  ${({ $active }) =>
    $active &&
    css`
      color: ${tokens.colors.primary};
    `}
`;