import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledProjectCardWrapper = styled.div<{ $isFeatured?: boolean; $index?: number }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  opacity: 0;
  animation: fadeInUp var(--duration-normal) var(--ease-out) forwards;
  animation-delay: ${({ $index }) => ($index || 0) * 100}ms;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg);

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
  aspect-ratio: 16 / 9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow), opacity var(--transition-slow);
  }

  .project-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-tertiary);
    background: var(--color-bg-muted);
  }
`;

export const StyledProjectContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${tokens.space[5]};
  gap: ${tokens.space[3]};
`;

export const StyledProjectName = styled.h3`
  margin: 0;
  font-size: var(--text-display-project);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
`;

export const StyledProjectDescription = styled.p`
  margin: 0;
  font-size: var(--text-body);
  font-weight: 400;
  line-height: 1.625;
  color: var(--color-text-secondary);
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
  padding: ${tokens.space[1]} ${tokens.space[3]};
  font-size: var(--text-label);
  font-weight: 500;
  color: var(--color-text-secondary);
  background: var(--color-bg-muted);
  border-radius: var(--radius-full);
  white-space: nowrap;
`;

export const StyledProjectLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.space[3]};
  margin-top: ${tokens.space[2]};
  padding-top: ${tokens.space[4]};
`;

export const StyledProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.space[2]};
  font-size: var(--text-label);
  font-weight: 500;
  color: var(--color-accent);
  text-decoration: none;
  transition: opacity var(--transition-fast);

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* Hover effect on wrapper for subtle scale */
export const StyledProjectCard = styled.article`
  transition: transform var(--transition-normal), opacity var(--transition-normal);

  &:hover {
    transform: scale(1.01);
  }

  &:hover ${StyledProjectImage} img {
    transform: scale(1.02);
    opacity: 0.9;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
    &:hover ${StyledProjectImage} img {
      transform: none;
      opacity: 1;
    }
  }
`;