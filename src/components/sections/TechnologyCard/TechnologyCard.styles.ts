import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledTechnologyCard = styled.div<{ $index?: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${tokens.space[5]} ${tokens.space[4]};
  background: ${tokens.colors.background};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radii.lg};
  gap: ${tokens.space[3]};
  transition: transform ${tokens.transitions.normal}, box-shadow ${tokens.transitions.normal}, border-color ${tokens.transitions.normal};
  opacity: 0;
  animation: fadeInUp ${tokens.durations.normal} ${tokens.easings.out} forwards;
  animation-delay: ${({ $index }) => ($index || 0) * 50}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${tokens.shadows.lg};
    border-color: ${tokens.colors.primary};
  }

  @media (max-width: 767px) {
    padding: ${tokens.space[4]} ${tokens.space[3]};
  }
`;

export const StyledTechnologyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: ${tokens.radii.md};
  background: linear-gradient(135deg, ${tokens.colors.primaryLight} 0%, ${tokens.colors.bgAccent} 100%);
  color: ${tokens.colors.primary};
  flex-shrink: 0;

  @media (max-width: 767px) {
    width: 48px;
    height: 48px;
  }
`;

export const StyledTechnologyName = styled.span`
  font-size: ${tokens.fontSizes.base};
  font-weight: ${tokens.fontWeights.medium};
  line-height: ${tokens.lineHeights.normal};
  color: ${tokens.colors.textPrimary};
  word-break: keep-all;

  @media (max-width: 767px) {
    font-size: ${tokens.fontSizes.sm};
  }
`;

export const StyledTechnologyMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${tokens.space[2]};
  margin-top: ${tokens.space[1]};
`;