import styled, { css, keyframes } from 'styled-components';
import { tokens } from '@/styles/tokens';

const itemIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const StyledNav = styled.nav<{ $variant: 'header' | 'mobile' | 'footer' }>`
  display: flex;
  align-items: center;
  gap: ${tokens.space[6]};

  ${({ $variant }) => {
    switch ($variant) {
      case 'header':
        return css`
          display: flex;

          @media (max-width: 1023px) {
            gap: ${tokens.space[4]};
          }
        `;
      case 'mobile':
        return css`
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: ${tokens.space[2]};
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

export const StyledNavItem = styled.a<{ $active?: boolean; $variant?: 'header' | 'mobile' | 'footer' }>`
  color: ${tokens.colors.textSecondary};
  font-size: ${tokens.fontSizes.label};
  font-weight: ${tokens.fontWeights.medium};
  text-decoration: none;
  transition: color ${tokens.transitions.fast};

  &:hover {
    color: ${tokens.colors.textPrimary};
  }

  ${({ $variant }) =>
    $variant === 'mobile' &&
    css`
      display: block;
      text-align: left;
      padding: ${tokens.space[3]} 0;
      color: ${tokens.colors.textPrimary};
      font-size: clamp(1.5rem, 5vw, 2rem);
      font-weight: ${tokens.fontWeights.semibold};
      line-height: ${tokens.lineHeights.snug};
      animation: ${itemIn} 360ms var(--ease-out) both;

      &:nth-child(2) { animation-delay: 60ms; }
      &:nth-child(3) { animation-delay: 120ms; }
      &:nth-child(4) { animation-delay: 180ms; }
      &:nth-child(5) { animation-delay: 240ms; }

      &:hover {
        color: ${tokens.colors.accent};
      }
    `}

  ${({ $active }) =>
    $active &&
    css`
      color: ${tokens.colors.accent};
    `}
`;
