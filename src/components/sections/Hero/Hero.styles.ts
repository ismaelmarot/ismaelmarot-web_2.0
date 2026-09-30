import styled from 'styled-components';
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

export const StyledHeroHeadline = styled.h1<{ $variant?: 'display-sm' | 'display-md' | 'display-lg' }>`
  margin: 0;
  font-size: ${({ $variant }) => tokens.fontSizes[$variant || 'display-md']};
  font-weight: ${tokens.fontWeights.bold};
  line-height: ${tokens.lineHeights.display};
  letter-spacing: -0.02em;
  color: ${tokens.colors.textPrimary};

  span {
    display: block;
  }

  @media (max-width: 767px) {
    font-size: ${({ $variant }) => {
      switch ($variant) {
        case 'display-sm': return tokens.fontSizes['display-sm'];
        case 'display-lg': return tokens.fontSizes['display-md'];
        default: return tokens.fontSizes['display-md'];
      }
    }};
  }
`;

export const StyledHeroTagline = styled.p<{ $variant?: 'title' | 'description' }>`
  margin: 0;
  font-size: ${({ $variant }) => {
    switch ($variant) {
      case 'title': return tokens.fontSizes['2xl'];
      case 'description': return tokens.fontSizes.lg;
      default: return tokens.fontSizes.xl;
    }
  }};
  font-weight: ${({ $variant }) => $variant === 'title' ? tokens.fontWeights.medium : tokens.fontWeights.normal};
  line-height: ${tokens.lineHeights.relaxed};
  color: ${({ $variant }) => $variant === 'description' ? tokens.colors.textTertiary : tokens.colors.textSecondary};
  max-width: 700px;

  @media (max-width: 767px) {
    font-size: ${({ $variant }) => {
      switch ($variant) {
        case 'title': return tokens.fontSizes.xl;
        case 'description': return tokens.fontSizes.base;
        default: return tokens.fontSizes.lg;
      }
    }};
  }
`;

export const StyledHeroCtaGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${tokens.space[4]};
  margin-top: ${tokens.space[4]};
`;

export const StyledHeroCta = styled.a`
  text-decoration: none;
  display: inline-flex;
`;