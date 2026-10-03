import styled from 'styled-components';

/**
 * The technologies-page chip: the shared pill, plus the two things that only that page wants.
 *
 * The role makes the chip a list item inside its category's own list, and the entrance is
 * staggered per index so a category reveals itself rather than appearing at once.
 */
export const StyledTechnologyCard = styled.div<{ $index?: number }>`
  opacity: 0;
  animation: fadeInUp var(--duration-normal) var(--ease-out) forwards;
  animation-delay: ${({ $index }) => ($index || 0) * 50}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }
`;