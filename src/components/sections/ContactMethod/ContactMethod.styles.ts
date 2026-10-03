import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledContactMethodWrapper = styled.div<{ $index?: number }>`
  /* This wrapper is a flex item, and a flex item defaults to min-width:auto, which stops
     it shrinking below the min-content width of the nowrap label and value. Without this
     the row stays 330px wide and pushes the 320px viewport into horizontal scrolling. */
  min-width: 0;
  opacity: 0;
  animation: fadeInUp var(--duration-normal) var(--ease-out) forwards;
  animation-delay: ${({ $index }) => ($index || 0) * 100}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }
`;

export const StyledContactMethodLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.space[3]};
  /* An inline-flex box with width:auto resolves via shrink-to-fit, which never goes below
     its own min-content width, so it ignored the 320px container and overflowed.
     max-width lets it cap at the container and hand the excess to the ellipsis below. */
  max-width: 100%;
  padding: ${tokens.space[3]} ${tokens.space[4]};
  font-size: var(--text-body);
  font-weight: 400;
  line-height: 1.5;
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

export const StyledContactMethodIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: var(--color-accent);
`;

export const StyledContactMethodLabel = styled.span`
  font-size: var(--text-body);
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-accent);
  white-space: nowrap;
`;

export const StyledContactMethodValue = styled.span`
  font-size: var(--text-body);
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-accent);
  /* min-width:0 is required for the ellipsis below to engage: a flex item defaults to
     min-width:auto, so the nowrap text would push the row past a 320px viewport. */
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 767px) {
    font-size: var(--text-secondary);
  }
`;