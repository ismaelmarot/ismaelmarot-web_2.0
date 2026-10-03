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
  justify-content: center;
  /* Square, because the control holds a glyph and nothing else. At this size the icon clears
     3:1 against the section background for a non-text element with room to spare. */
  width: 34px;
  height: 34px;
  padding: 0;
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: ${tokens.radii.md};
  color: var(--color-text-secondary);
  cursor: pointer;
  /* Deliberately no :hover. The state worth signalling is focus, and the accessible name
     carries the meaning, since the glyph on its own says nothing about what the control does. */

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

/**
 * The pills of one category.
 *
 * 8px inside a group against 32px between groups on the track. The category names are gone, so
 * the change of rhythm is what still marks where one group ends and the next begins.
 */
export const StyledMarqueeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.space[2]};
`;