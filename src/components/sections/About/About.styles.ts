import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledAbout = styled.div`
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
`;

export const StyledAboutHeadline = styled.h2`
  margin: 0 0 ${tokens.space[6]} 0;
  font-size: var(--text-display-section);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  text-align: left;

  @media (max-width: 767px) {
    text-align: left;
  }
`;

export const StyledAboutContent = styled.div`
  max-width: 700px;
`;

export const StyledAboutText = styled.p`
  margin: 0 0 ${tokens.space[6]} 0;
  font-size: var(--text-body);
  font-weight: 400;
  line-height: 1.625;
  color: var(--color-text-secondary);

  @media (max-width: 767px) {
    text-align: left;
  }
`;

export const StyledAboutStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.space[8]};
  margin-top: ${tokens.space[10]};
  width: 100%;
  max-width: 100%;

  @media (max-width: 767px) {
    gap: ${tokens.space[6]};
  }
`;

export const StyledStatItem = styled.div<{ $index?: number }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: ${tokens.space[2]};
  opacity: 0;
  animation: fadeInUp var(--duration-normal) var(--ease-out) forwards;
  animation-delay: ${({ $index }) => ($index || 0) * 100}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }
`;

export const StyledStatValue = styled.div`
  font-size: var(--text-display-project);
  font-weight: 600;
  line-height: 1.05;
  color: var(--color-text-primary);

  @media (max-width: 767px) {
    font-size: var(--text-display-section);
  }
`;

export const StyledStatLabel = styled.div<{ $variant?: 'description' }>`
  font-size: ${({ $variant }) => $variant === 'description' ? 'var(--text-secondary)' : 'var(--text-label)'};
  font-weight: ${({ $variant }) => $variant === 'description' ? 400 : 500};
  line-height: 1.5;
  color: ${({ $variant }) => $variant === 'description' ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)'};
`;