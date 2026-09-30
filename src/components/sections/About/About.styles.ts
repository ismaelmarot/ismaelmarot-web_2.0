import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledAbout = styled.div`
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
`;

export const StyledAboutHeadline = styled.h2`
  margin: 0 0 ${tokens.space[6]} 0;
  font-size: ${tokens.fontSizes['4xl']};
  font-weight: ${tokens.fontWeights.bold};
  line-height: ${tokens.lineHeights.tight};
  letter-spacing: -0.01em;
  color: ${tokens.colors.textPrimary};
  text-align: left;

  @media (max-width: 767px) {
    font-size: ${tokens.fontSizes['3xl']};
    text-align: center;
  }
`;

export const StyledAboutContent = styled.div`
  max-width: 700px;
`;

export const StyledAboutText = styled.p`
  margin: 0 0 ${tokens.space[6]} 0;
  font-size: ${tokens.fontSizes.lg};
  font-weight: ${tokens.fontWeights.normal};
  line-height: ${tokens.lineHeights.relaxed};
  color: ${tokens.colors.textSecondary};

  @media (max-width: 767px) {
    font-size: ${tokens.fontSizes.base};
    text-align: center;
  }
`;

export const StyledAboutStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${tokens.space[8]};
  margin-top: ${tokens.space[10]};
  padding-top: ${tokens.space[8]};
  border-top: 1px solid ${tokens.colors.borderSubtle};
  width: 100%;
  max-width: 100%;

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${tokens.space[6]};
  }
`;

export const StyledStatItem = styled.div<{ $index?: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${tokens.space[2]};
  opacity: 0;
  animation: fadeInUp ${tokens.durations.normal} ${tokens.easings.out} forwards;
  animation-delay: ${({ $index }) => ($index || 0) * 100}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }
`;

export const StyledStatValue = styled.div`
  font-size: ${tokens.fontSizes['4xl']};
  font-weight: ${tokens.fontWeights.bold};
  line-height: ${tokens.lineHeights.tight};
  color: ${tokens.colors.textPrimary};

  @media (max-width: 767px) {
    font-size: ${tokens.fontSizes['3xl']};
  }
`;

export const StyledStatLabel = styled.div<{ $variant?: 'description' }>`
  font-size: ${({ $variant }) => $variant === 'description' ? tokens.fontSizes.sm : tokens.fontSizes.base};
  font-weight: ${({ $variant }) => $variant === 'description' ? tokens.fontWeights.normal : tokens.fontWeights.medium};
  line-height: ${tokens.lineHeights.normal};
  color: ${({ $variant }) => $variant === 'description' ? tokens.colors.textTertiary : tokens.colors.textSecondary};
`;