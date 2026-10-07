import styled, { css, keyframes } from 'styled-components';
import { tokens } from '@/styles/tokens';

/** Apple's own curve for an element arriving: quick out, soft landing. */
const CURVA_APPLE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

export const StyledIconStrip = styled.div`
  width: 100%;
  /* Zeroing the automatic minimum lets this shrink to the space it has. A block's min-content
     width would otherwise be raised by the widest frame row and, on a narrow phone, push a
     horizontal scrollbar onto the whole page. The same reason the technology marquee's slot does. */
  min-width: 0;
`;

export const StyledIconStripRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${tokens.space[4]};

  /* Below 700px six 96px frames are 656px and a phone is 390px, so the row scrolls rather than
     wrapping, and each frame snaps to a whole position. The mask is what keeps a cut edge from
     reading as clipped: it fades the artwork into the background, the same technique the technology
     marquee uses for the same reason.

     700px rather than 656px because the content column carries 24px of padding either side, so the
     row is available 48px narrower than the viewport. */
  @media (max-width: 700px) {
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    scrollbar-width: none;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
    /* padding-inline so the first and last frames are not flush against the mask's fade. */
    padding-inline: ${tokens.space[6]};
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 6%,
      black 94%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 6%,
      black 94%,
      transparent 100%
    );

    &::-webkit-scrollbar {
      display: none;
    }
  }

`;

const aparecer = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

/* The frame, not the artwork, is what rounds the icon and what the background sits behind. Every
   source PNG in projects.json carries transparent corners, and they are not square: one is 379x366 and
   one is 1024px wide. A 96px square with a 22% radius is therefore the same decision the carousel
   makes, at the same size, so the same asset reads the same in both places. */
export const StyledIconFrame = styled.div<{ $index: number; $animate: boolean }>`
  flex: 0 0 auto;
  width: 96px;
  height: 96px;
  border-radius: 21px; /* 22% of 96, the app-icon tile ratio */
  background-color: ${tokens.colors.cardFrame};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  /* A border would be a bright line on this tile. The frame is defined by its own background. */
  border: 0;
  scroll-snap-align: center;
  transform: scale(1);
  transition: transform var(--transition-normal) var(--ease-out),
    box-shadow var(--transition-normal) var(--ease-out);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: scale(1.06);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 12px 28px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 700px) {
    &:hover {
      /* A touch device has no hover, and a sticky hover state on a scrollable row reads as a bug. */
      transform: scale(1);
    }
  }

  /* Driven by the intersection observer rather than by mount, and with a 60ms stagger so the six
     arrive in sequence instead of as one block: the fifth delay is 300ms, which is what SC-005
     measures. A duration of 500ms and that stagger put the whole sequence at 800ms, which is long
     enough to read as presentation and short enough not to delay anything. */
  ${({ $index, $animate }) =>
    $animate &&
    css`
      animation: ${aparecer} 500ms ${CURVA_APPLE} both;
      animation-delay: ${$index * 60}ms;
    `}

  /* Reduced motion: visible at rest, no stagger, no scale on hover, no transition. The global rule
     zeroes --transition-normal already, but the entrance is an animation rather than a transition
     and would still run without this. */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: none;
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

export const StyledIconImage = styled.img`
  width: 100%;
  height: 100%;
  /* Cover rather than contain: the sources are not square, and contain would letterbox them to
     different apparent sizes so a 379x366 icon would read smaller than a 192x192 one. Cover crops
     about 4% of the non-square one and every icon reads at the same weight. */
  object-fit: cover;
  object-position: center;
`;

export const StyledIconFallback = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.04);
`;
