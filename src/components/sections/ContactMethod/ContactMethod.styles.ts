import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledContactMethodWrapper = styled.div<{ $index?: number }>`
  opacity: 0;
  animation: fadeInUp ${tokens.durations.normal} ${tokens.easings.out} forwards;
  animation-delay: ${({ $index }) => ($index || 0) * 100}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }
`;

export const StyledContactMethodLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.space[4]};
  padding: ${tokens.space[4]} ${tokens.space[6]};
  background: ${tokens.colors.background};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radii.lg};
  text-decoration: none;
  color: ${tokens.colors.textPrimary};
  transition: background ${tokens.transitions.normal}, border-color ${tokens.transitions.normal}, transform ${tokens.transitions.normal}, box-shadow ${tokens.transitions.normal};
  min-width: 300px;

  &:hover {
    background: ${tokens.colors.bgMuted};
    border-color: ${tokens.colors.primary};
    transform: translateX(4px);
    box-shadow: ${tokens.shadows.md};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.focus};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }

  @media (max-width: 767px) {
    min-width: auto;
    width: 100%;
    padding: ${tokens.space[3]} ${tokens.space[4]};
  }
`;

export const StyledContactMethodIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${tokens.radii.md};
  background: linear-gradient(135deg, ${tokens.colors.primaryLight} 0%, ${tokens.colors.bgAccent} 100%);
  color: ${tokens.colors.primary};
  flex-shrink: 0;
`;

export const StyledContactMethodLabel = styled.span`
  font-size: ${tokens.fontSizes.base};
  font-weight: ${tokens.fontWeights.medium};
  line-height: ${tokens.lineHeights.normal};
  color: ${tokens.colors.textPrimary};
  white-space: nowrap;
`;

export const StyledContactMethodValue = styled.span`
  font-size: ${tokens.fontSizes.base};
  font-weight: ${tokens.fontWeights.normal};
  line-height: ${tokens.lineHeights.normal};
  color: ${tokens.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 767px) {
    font-size: ${tokens.fontSizes.sm};
  }
`;