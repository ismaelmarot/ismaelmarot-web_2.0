import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

export const StyledContributions = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[6]};
  /* The tile is white on the section's muted background, the way an Apple card sits on a
     page rather than being a coloured block of its own. */
  padding: ${tokens.space[8]};
  background-color: var(--color-bg);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xs), inset 0 1px 0 rgba(255, 255, 255, 0.6);

  @media (max-width: 767px) {
    padding: ${tokens.space[5]};
    border-radius: var(--radius-xl);
  }
`;

export const StyledContributionsHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${tokens.space[4]};
  flex-wrap: wrap;
`;

export const StyledContributionsTitle = styled.h3`
  margin: 0;
  font-size: var(--text-large-subtitle);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
`;

export const StyledContributionsPeriod = styled.span`
  font-size: var(--text-secondary);
  font-weight: 400;
  color: var(--color-text-tertiary);
  white-space: nowrap;
`;

/**
 * The grid scrolls sideways on a narrow screen rather than shrinking the cells.
 *
 * 53 weeks at 10px plus a 3px gap is 583px, which will not fit a 375px phone. Scaling the
 * cells down until they fit would take them to about 5px, below the point where a day reads as
 * a square at all, and the levels would collapse into each other. Scrolling keeps them the size
 * they were designed at, and the row is focusable so the keyboard can reach the overflow, which
 * a scroll container with no focusable content otherwise locks away.
 */
export const StyledContributionsScroller = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  /* Room for the cell's focus ring, which is drawn outside it and would otherwise be clipped. */
  padding: 4px 2px;
  margin: -4px -2px;
  -webkit-overflow-scrolling: touch;

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
`;

export const StyledContributionsGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 10px;
  grid-template-rows: repeat(7, 10px);
  gap: 3px;
  /* Anchored to the newest week on the right, matching the order people read the data. */
  direction: ltr;
`;

/* The grid is a fixed 686px at every viewport while the scroll container is not: 1108px at 1440 and
   274px at 390. This wrapper is what lets the "today" label sit under today's column instead of
   under the container, which put it 420px away on a desktop and 164px away at 1024. Sized to content
   so it scrolls with the grid, and block children so the grid keeps its own row template. */
export const StyledContributionsContent = styled.div`
  width: max-content;
`;

/* Replaces the outline the cell used to carry. A ring was the wrong signal at this size: it read as
   three different marks depending on the level, the white layer did not read as an edge against the
   page, two pixels of it left only 6x6 of the cell's own colour, and a 2px inset on a 2px radius
   degenerated to a square inner corner. Words say which day it is; a 10px tile cannot.
   Not announced: the cell's accessible name already states the count and that the day is today. */
export const StyledContributionsToday = styled.p`
  margin: ${tokens.space[2]} 0 0;
  text-align: right;
  font-family: ${tokens.fonts.sans};
  font-size: var(--text-secondary);
  font-weight: ${tokens.fontWeights.medium};
  color: var(--color-text-secondary);
`;

/**
 * role="img" so the aria-label is allowed. aria-label is prohibited on a plain div, which is
 * what axe reported on all 371 cells: the label existed and a screen reader could never have
 * received it. As an image the cell exposes the label as its accessible name, which is exactly
 * the intent, and the role is invisible in the accessibility tree beyond that name.
 */
export const StyledContributionCell = styled.div.attrs({ role: 'img' })<{
  $level: number;
}>`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background-color: ${({ $level }) =>
    tokens.colors.contributions[Math.min($level, tokens.colors.contributions.length - 1)]};
  transition: transform var(--transition-fast) var(--ease-out);

  &:hover {
    transform: scale(1.35);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

export const StyledContributionsLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${tokens.space[2]};
  font-size: var(--text-secondary);
  color: var(--color-text-tertiary);
`;

export const StyledContributionsLegendScale = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

export const StyledContributionLegendCell = styled.div<{ $level: number }>`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background-color: ${({ $level }) =>
    tokens.colors.contributions[Math.min($level, tokens.colors.contributions.length - 1)]};
`;

export const StyledContributionsStats = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${tokens.space[4]};
  margin: 0;
  padding-top: ${tokens.space[5]};
  border-top: 1px solid var(--color-border);
`;

export const StyledContributionStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StyledContributionStatValue = styled.dd`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  font-variant-numeric: tabular-nums;
`;

export const StyledContributionStatLabel = styled.dt`
  margin: 0;
  font-size: var(--text-label);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.02em;
  color: var(--color-text-tertiary);
`;
