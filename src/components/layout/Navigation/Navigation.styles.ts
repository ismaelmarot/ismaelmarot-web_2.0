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
          flex-wrap: wrap;
          justify-content: center;
          gap: ${tokens.space[4]} ${tokens.space[6]};
          font-size: ${tokens.fontSizes.sm};
          color: ${tokens.colors.textMuted};

          @media (max-width: 480px) {
            gap: ${tokens.space[2]} ${tokens.space[4]};
          }
        `;
    }
  }}
`;

export const StyledNavItem = styled.a<{ $variant?: 'header' | 'mobile' | 'footer' }>`
  color: ${tokens.colors.textSecondary};
  font-size: ${tokens.fontSizes.label};
  font-weight: ${tokens.fontWeights.medium};
  text-decoration: none;
  transition: color ${tokens.transitions.fast};

  &:hover {
    color: ${tokens.colors.textPrimary};
    /* Defaults to none, so the light theme is untouched. The header sets it to underline only while
       it is over a dark region, where every colour is white and the colour hover has nothing to
       move to. */
    text-decoration: var(--link-hover-decoration, none);
    text-underline-offset: 4px;
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

  /* NavLink marks the item that resolves to the current URL with .active and sets
     aria-current="page". Styling that class keeps the current section in sync with the
     router instead of reimplementing route matching here. Kept last so it wins over the
     colour the mobile variant sets, and hover darkens instead of lightening so both
     states keep meeting AA on --color-bg-muted. */
  &.active {
    color: ${tokens.colors.accentText};
  }

  &.active:hover {
    color: ${tokens.colors.accentTextHover};
  }
`;
