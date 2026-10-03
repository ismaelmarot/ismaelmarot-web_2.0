import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

/**
 * Two copies of the content, side by side, so -50% moves exactly one copy and the loop closes
 * on itself. One copy is already wider than the 1024px the container allows, so the visible
 * window can never run out of content at any viewport.
 *
 * Declared before the row that references it: a styled-components template is evaluated when the
 * module loads, so referencing a component defined further down throws at import time.
 */
export const StyledMarqueeTrack = styled.div`
  display: flex;
  align-items: center;
  width: max-content;
  gap: ${tokens.space[8]};
`;

export const StyledMarquee = styled.div`
  display: flex;
  flex-direction: column;
  /* 20px, not 12: with 42px pills a 12px gap left the two rows reading as one dense block
     rather than as two lanes passing each other. */
  gap: ${tokens.space[5]};
  /* width and min-width together, because this is a flex item of the section's centred column.
     A flex item defaults to min-width:auto, which resolves to the content's min-content width,
     and the track is width:max-content at nearly 7000px. Without this the whole block was
     inflated to 1024px and pushed a horizontal scrollbar onto a 375px phone. */
  width: 100%;
  min-width: 0;
`;

export const StyledMarqueeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: ${tokens.space[2]};
`;

/**
 * The pause control.
 *
 * This is WCAG 2.2.2 at level A, not decoration. A marquee that starts by itself, runs past
 * five seconds and sits alongside other content needs a mechanism to stop it, and failure
 * F16 names this exact case. W3C also recommends a single control for several moving elements,
 * so this one button governs both rows rather than each row having its own.
 *
 * A quiet outline pill rather than a solid accent: it sits inside a section whose CTA is already
 * a solid accent pill directly above, and a second solid pill would compete with it.
 */
export const StyledMarqueeToggle = styled.button.attrs({ type: 'button' })`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.space[2]};
  padding: ${tokens.space[1]} ${tokens.space[3]};
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: ${tokens.radii.full};
  font-family: ${tokens.fonts.sans};
  font-size: var(--text-label);
  font-weight: 500;
  line-height: 1.4;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background-color var(--transition-fast), border-color var(--transition-fast),
    color var(--transition-fast);

  &:hover {
    background-color: var(--color-bg);
    border-color: var(--color-accent);
    color: var(--color-text-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
`;

/**
 * A row is a fixed window with the track sliding behind it. The gradient mask fades the content
 * out at both edges so items dissolve instead of being sliced off, which is the difference
 * between a marquee that reads as finished and one that reads as clipped.
 */
export const StyledMarqueeRow = styled.div<{ $reverse?: boolean; $paused?: boolean }>`
  overflow: hidden;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );

  ${StyledMarqueeTrack} {
    animation: marqueeScroll var(--duration-marquee) linear infinite;
    /* Running the same keyframes backwards rather than declaring a second set: both rows then
       travel the same distance in the same time, so they cannot drift out of step. */
    animation-direction: ${({ $reverse }) => ($reverse ? 'reverse' : 'normal')};
    animation-play-state: ${({ $paused }) => ($paused ? 'paused' : 'running')};
  }

  @media (prefers-reduced-motion: reduce) {
    ${StyledMarqueeTrack} {
      animation: none;
      transform: translateX(0);
    }
  }
`;

/** One category: its label, then the pills that belong to it. */
export const StyledMarqueeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.space[3]};
`;

/**
 * The category name, set apart from the pills it introduces.
 *
 * --color-text-tertiary measures 4.66:1 on this section's muted background, which clears the
 * 4.5:1 that small text needs. The accent was rejected: it measures 4.31:1 here and fails.
 */
export const StyledMarqueeLabel = styled.span`
  font-size: var(--text-label);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--color-text-tertiary);
`;