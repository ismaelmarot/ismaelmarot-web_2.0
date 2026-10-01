import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledTechnologyCard = styled.div<{ $index?: number }>`
  display: inline-flex;
  align-items: center;
  padding: ${tokens.space[2]} ${tokens.space[3]};
  font-size: var(--text-body);
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  transition: color var(--transition-fast), background var(--transition-fast);
  opacity: 0;
  animation: fadeInUp var(--duration-normal) var(--ease-out) forwards;
  animation-delay: ${({ $index }) => ($index || 0) * 50}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }

  &:hover {
    color: var(--color-accent);
    background: var(--color-bg-muted);
  }

  @media (max-width: 767px) {
    padding: ${tokens.space[1]} ${tokens.space[2]};
    font-size: var(--text-secondary);
  }
`;