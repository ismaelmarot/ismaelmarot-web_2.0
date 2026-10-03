import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

/**
 * A chip, in the shape GitHub and Vercel use for a stack: the mark on the left, the name beside
 * it, a hairline border, and nothing else. The section already carries a 371-cell heatmap
 * directly above it, so the chips stay quiet on purpose.
 */
export const StyledTechnologyCard = styled.div<{ $index?: number }>`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.space[2]};
  padding: ${tokens.space[2]} ${tokens.space[4]};
  /* On the section's muted background, so the chip carries its own white surface. That is what
     keeps the mark legible against a coloured card and gives the row a consistent edge. */
  background-color: var(--color-bg);
  /* Apple's hairline is a light neutral rather than a colour, and it sits on a raised surface
     rather than standing alone, so the chip gets a shadow as well as an edge. */
  border: 1px solid var(--color-border);
  /* The same pill the "Ver proyecto" action, Button, Badge, ProjectCategoryFilter,
     SectionSummary and ProjectDetail all use. Written as tokens.radii.full rather than
     var(--radius-full) so the expression matches those files literally, not just in value.
     On a 42px chip 9999px resolves to a 21px radius per side, which is a stadium rather than
     a rounded rectangle, so this needs no separate value for the shorter mobile chip. */
  border-radius: ${tokens.radii.full};
  box-shadow: var(--shadow-xs);
  font-size: var(--text-body);
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-primary);
  white-space: nowrap;
  /* No transform in the transition, and none on hover. fadeInUp ends at translateY(0) with
     fill-mode forwards, so the animated value keeps overriding whatever :hover sets: the chip
     appeared to lift and never moved. The hover state is carried by the shadow growing from xs
     to sm, which reads as elevation without fighting the entrance animation. */
  transition: background-color var(--transition-fast), border-color var(--transition-fast),
    box-shadow var(--transition-fast);

  opacity: 0;
  animation: fadeInUp var(--duration-normal) var(--ease-out) forwards;
  animation-delay: ${({ $index }) => ($index || 0) * 50}ms;

  &:hover {
    background-color: var(--color-bg-muted);
    border-color: var(--color-accent);
    box-shadow: var(--shadow-sm);
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }

  @media (max-width: 767px) {
    padding: ${tokens.space[1]} ${tokens.space[3]};
    /* No radius override here. It used to step down to 12px on the shorter chip, which is
       pointless once the radius is a full pill: 9999px already resolves against whatever the
       height is, so one value covers every breakpoint. */
    font-size: var(--text-secondary);
  }
`;

/**
 * The mark itself, in the interface's ink rather than its official brand colour.
 *
 * Measured on the chip: JavaScript's #F7DF1E is 1.35:1 and Vitest's #00FF74 is 1.35:1, both
 * below the 3:1 that WCAG 1.4.11 holds a graphical object to, and nine of the twenty-three
 * fall short. A row of twenty-three competing hues under a violet heatmap is also noise, and
 * recognition rests on the silhouette anyway, which is what makes a logo a logo.
 */
/**
 * Fixed-size slot around the mark. It holds its width even when no mark resolved, which is
 * what keeps the text aligned across a row: otherwise a chip without an icon starts its label
 * further left and the row reads as if something failed to load.
 */
export const StyledTechnologyIconSlot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;

  @media (max-width: 767px) {
    width: 16px;
    height: 16px;
  }
`;

/**
 * focusable="false" keeps the mark out of the tab order in older engines, where a decorated
 * svg can still be focusable.
 */
export const StyledTechnologyIcon = styled.svg.attrs({ focusable: 'false' })`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  fill: currentColor;
  color: var(--color-fg);

  @media (max-width: 767px) {
    width: 16px;
    height: 16px;
  }
`;
