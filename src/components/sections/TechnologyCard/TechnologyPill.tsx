import styled from 'styled-components';
import { tokens } from '@/styles/tokens';
import { getTechnologyIconPath } from '@/data/technologies';
import type { Technology } from '@/types/project';

/**
 * The pill itself: a mark and a name, nothing else. No role and no entrance animation, because
 * the two places that use it need different ones. The technologies page wants the chip to be a
 * list item that fades in on a stagger; the home marquee wants it to sit still inside a track
 * that is already moving, and an entrance animation there would fight the scroll.
 *
 * Keeping the visual here means the two screens match by construction rather than by two sets of
 * styles being kept in agreement.
 */
export const StyledTechnologyPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.space[2]};
  padding: ${tokens.space[2]} ${tokens.space[4]};
  /* On a muted section, so the pill carries its own white surface. That is what keeps the mark
     legible against the background and gives the row a consistent edge. */
  background-color: var(--color-bg);
  /* Apple's hairline is a light neutral rather than a colour, and it sits on a raised surface
     rather than standing alone, so the pill gets a shadow as well as an edge. */
  border: 1px solid var(--color-border);
  /* The same pill the "Ver proyecto" action, Button, Badge, ProjectCategoryFilter,
     SectionSummary and ProjectDetail all use. Written as tokens.radii.full rather than
     var(--radius-full) so the expression matches those files literally, not just in value. */
  border-radius: ${tokens.radii.full};
  box-shadow: var(--shadow-xs);
  font-size: var(--text-body);
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-primary);
  white-space: nowrap;
  /* Deliberately no hover state. The pill is not a link, not a button and has no tabindex, so
     nothing happens when it is clicked. A hover that changed its colour would advertise an
     interaction that does not exist. */

  @media (max-width: 767px) {
    padding: ${tokens.space[1]} ${tokens.space[3]};
    /* No radius override here. It used to step down to 12px on the shorter pill, which is
       pointless once the radius is a full pill: 9999px already resolves against whatever the
       height is, so one value covers every breakpoint. */
    font-size: var(--text-secondary);
  }
`;

/**
 * Fixed-size slot around the mark. It holds its width even when no mark resolved, which is what
 * keeps the text aligned across a row: otherwise a pill without an icon starts its label further
 * left and the row reads as if something failed to load.
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
 * The mark, in the interface's ink rather than its official brand colour.
 *
 * Measured on the pill: JavaScript's #F7DF1E is 1.35:1 and Vitest's #00FF74 is 1.35:1, both below
 * the 3:1 that WCAG 1.4.11 holds a graphical object to, and nine of the twenty-three fall short.
 * A row of twenty-three competing hues under a violet heatmap is also noise, and recognition
 * rests on the silhouette anyway, which is what makes a logo a logo.
 *
 * focusable="false" keeps the mark out of the tab order in older engines, where a decorated svg
 * can still be focusable.
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

export interface TechnologyPillProps {
  technology: Technology;
  /** Recorded in the DOM so a test can tell a drawn mark from an unresolved one. */
  testId?: string;
}

export function TechnologyPill({ technology, testId }: TechnologyPillProps) {
  const iconPath = getTechnologyIconPath(technology.iconSlug);

  return (
    <StyledTechnologyPill>
      <StyledTechnologyIconSlot aria-hidden={iconPath ? true : undefined}>
        {iconPath && (
          <StyledTechnologyIcon
            viewBox="0 0 24 24"
            aria-hidden="true"
            data-testid={testId ?? `brand-mark-${technology.iconSlug}`}
          >
            <path d={iconPath} />
          </StyledTechnologyIcon>
        )}
      </StyledTechnologyIconSlot>
      {technology.name}
    </StyledTechnologyPill>
  );
}