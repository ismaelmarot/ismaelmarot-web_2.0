import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledProjectCardWrapper = styled.div<{ $isFeatured?: boolean; $index?: number }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  opacity: 0;
  animation: fadeInUp ${tokens.durations.normal} ${tokens.easings.out} forwards;
  animation-delay: ${({ $index }) => ($index || 0) * 100}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }

  ${({ $isFeatured }) => $isFeatured && `
    @media (min-width: 1024px) {
      grid-column: span 2;
      grid-row: span 2;
    }
  `}
`;

export const StyledProjectImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: ${tokens.radii.lg} ${tokens.radii.lg} 0 0;
  overflow: hidden;
  background: ${tokens.colors.bgMuted};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${tokens.transitions.slow};
  }

  .project-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${tokens.colors.textTertiary};
    background: linear-gradient(135deg, ${tokens.colors.bgMuted} 0%, ${tokens.colors.bgAccent} 100%);
  }
`;

export const StyledProjectContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: ${tokens.space[5]};
  gap: ${tokens.space[4]};
`;

export const StyledProjectName = styled.h3`
  margin: 0;
  font-size: ${tokens.fontSizes.xl};
  font-weight: ${tokens.fontWeights.semibold};
  line-height: ${tokens.lineHeights.snug};
  color: ${tokens.colors.textPrimary};
`;

export const StyledProjectDescription = styled.p`
  margin: 0;
  font-size: ${tokens.fontSizes.base};
  font-weight: ${tokens.fontWeights.normal};
  line-height: ${tokens.lineHeights.relaxed};
  color: ${tokens.colors.textSecondary};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const StyledProjectTechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.space[2]};
  margin-top: auto;
  padding-top: ${tokens.space[2]};
`;

export const StyledProjectTechBadge = styled.div`
  display: inline-flex;
`;

export const StyledProjectLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.space[3]};
  margin-top: ${tokens.space[2]};
  padding-top: ${tokens.space[4]};
  border-top: 1px solid ${tokens.colors.borderSubtle};
`;

export const StyledProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.space[2]};
  font-size: ${tokens.fontSizes.sm};
  font-weight: ${tokens.fontWeights.medium};
  color: ${tokens.colors.primary};
  text-decoration: none;
  transition: color ${tokens.transitions.fast}, transform ${tokens.transitions.fast};

  &:hover {
    color: ${tokens.colors.primaryHover};
    transform: translateX(2px);
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.focus};
    outline-offset: 2px;
    border-radius: ${tokens.radii.sm};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;