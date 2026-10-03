import styled, { css } from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledHero = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const StyledHeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${tokens.space[6]};
  max-width: 900px;
  width: 100%;
`;

export const StyledHeroHeadline = styled.h1`
  margin: 0;
  font-size: var(--text-display-hero);
  font-weight: 700;
  line-height: 1.0;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);

  span {
    display: block;
  }
`;

export const StyledHeroTagline = styled.p<{ $variant?: 'title' | 'description' }>`
  margin: 0;
  font-size: ${({ $variant }) => {
    switch ($variant) {
      case 'title': return 'var(--text-display-project)';
      case 'description': return 'var(--text-large-subtitle)';
      default: return 'var(--text-large-subtitle)';
    }
  }};
  font-weight: ${({ $variant }) => $variant === 'title' ? 600 : 400};
  line-height: ${tokens.lineHeights.relaxed};
  color: ${({ $variant }) => $variant === 'description' ? 'var(--color-text-secondary)' : 'var(--color-text-primary)'};
  max-width: 700px;
`;

export const StyledHeroCtaGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${tokens.space[4]};
  margin-top: ${tokens.space[4]};
`;

export const StyledHeroCta = styled.a<{ $variant?: 'primary' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: ${tokens.space[3]} ${tokens.space[6]};
  font-family: ${tokens.fonts.sans};
  font-size: ${tokens.fontSizes.lg};
  font-weight: ${tokens.fontWeights.medium};
  text-decoration: none;
  white-space: nowrap;
  border-radius: ${tokens.radii.full};
  transition: background-color 120ms ease-out;

  ${({ $variant }) =>
    $variant === 'ghost'
      ? css`
          background-color: transparent;
          color: ${tokens.colors.textPrimary};

          &:hover {
            background-color: ${tokens.colors.bgMuted};
          }
        `
      : css`
          background-color: ${tokens.colors.primary};
          color: ${tokens.colors.white};

          &:hover {
            background-color: ${tokens.colors.primaryHover};
            color: ${tokens.colors.white};
          }
        `}

  &:focus-visible {
    outline: 2px solid ${tokens.colors.focus};
    outline-offset: 2px;
  }
`;