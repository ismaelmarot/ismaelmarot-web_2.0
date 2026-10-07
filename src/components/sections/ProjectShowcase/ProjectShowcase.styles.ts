import styled, { css, keyframes } from 'styled-components';
import { tokens } from '@/styles/tokens';
import type { SceneAccent } from './showcaseScenes';

/* The wrapper keeps the same separation from the icon row the prototype used: a rule between them, so the
   two read as different statements without needing a heading. */
export const StyledShowcase = styled.div`
  width: 100%;
  min-width: 0;
  margin-top: ${tokens.space[16]};
  padding-top: ${tokens.space[16]};
  border-top: 1px solid var(--color-border);
`;

/* The rotation drifts the whole stack a little in y and eases the tilt, which is the levitation in the
   reference. The tilt itself is repeated at every keyframe on purpose: if it lived only in the static
   `transform` below, the animation would overwrite it, and disabling the animation under reduced motion
   would leave the scene untilted. Carrying the tilt inside the keyframes keeps the static fallback and the
   animated state describing the same object. */
const flotar = keyframes`
  0%,
  100% {
    transform: translateY(0) rotateX(8deg) rotateY(-16deg);
  }
  50% {
    transform: translateY(-10px) rotateX(10deg) rotateY(-12deg);
  }
`;

/* The scene's own entrance. Deliberately subtle: the slot is keyed by project, so this replays on every
   rotation. A heavy entrance every six seconds would be a slideshow, so it is a short fade and a few
   pixels of rise. */
const entrar = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const StyledShowcaseGrid = styled.div`
  display: grid;
  /* Four on a desktop, because the request asks for four divisions and the rotation is what makes that
     viable with six projects. Below 1280 it drops to two, then to one under 1024, where four side by side
     would leave ~90px each: too small to read and too small for the 3D to register. */
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${tokens.space[10]};

  @media (max-width: 1279px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 1023px) {
    grid-template-columns: minmax(0, 1fr);
    gap: ${tokens.space[12]};
  }
`;

/* One scene: a stage that owns the perspective, the coloured blob and the floating 3D stack, and a caption
   beneath it. */
export const StyledScene = styled.div<{ $indice: number; $visible: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.space[4]};
  min-width: 0;

  ${({ $indice, $visible }) =>
    $visible &&
    css`
      animation: ${entrar} 500ms var(--ease-out) both;
      animation-delay: ${$indice * 70}ms;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: none;
  }
`;

/* The stage carries the `perspective`. It must not set `overflow: hidden` or a `filter`, because either
   would flatten the children and collapse the 3D into a 2D stack. */
export const StyledStage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1.25;
  perspective: 1000px;
  display: grid;
  place-items: center;
  isolation: isolate;
`;

/* The coloured backdrop.
 *
 * A contained rounded panel rather than a blurred ellipse behind the device. An earlier version blurred a
 * 116%-wide radial gradient, and the screenshot showed why that fails: the colour bled past the scene's
 * edges into the section and read as a smudge rather than as a backdrop. The reference keeps its colour
 * inside a defined area with a hard edge, and the device sits on top of it.
 *
 * Opacity is kept high enough that the panel reads as the coloured field of the reference rather than as
 * a tint of the surface behind it.
 */
export const StyledBackdrop = styled.div<{ $accent: SceneAccent }>`
  position: absolute;
  inset: 0;
  border-radius: var(--radius-2xl);
  background: linear-gradient(
    160deg,
    ${({ $accent }) => $accent.from} 0%,
    ${({ $accent }) => $accent.to} 100%
  );
  z-index: 0;
  pointer-events: none;
`;

/* The floating group. `preserve-3d` is what lets the two panels sit at different depths rather than
   overlapping in flat paint order. */
export const StyledStack = styled.div`
  position: relative;
  z-index: 1;
  height: 88%;
  aspect-ratio: 9 / 16;
  /* One scene per row on a phone makes four full-size scenes, and measured at 390px they stacked to
     2243px, which is a very long scroll for a preview. Capping the height keeps each scene readable
     without letting the block dominate the section. */
  max-height: 420px;
  transform-style: preserve-3d;
  /* The static tilt: the resting state of the scene, and the value that remains when the float animation
     is switched off under reduced motion. A static tilt is presentation, not movement. */
  transform: rotateX(8deg) rotateY(-16deg);
  animation: ${flotar} 7s ease-in-out infinite;
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* The panel behind the screenshot: the project's accent, standing in for the second, colour-side device
   in the reference.
 *
   Darkened against the backdrop so it reads as a separate object rather than dissolving into the field
   behind it, and offset far enough that a visible sliver shows on two sides. The earlier 16% offset left
   only a thin edge visible on one side, which the screenshot showed as a stray colour fringe rather than
   as a second device.
 */
export const StyledBackPanel = styled.div<{ $accent: SceneAccent }>`
  position: absolute;
  inset: 0;
  border-radius: var(--radius-2xl);
  background: linear-gradient(
    145deg,
    color-mix(in srgb, ${({ $accent }) => $accent.from} 62%, #000000) 0%,
    color-mix(in srgb, ${({ $accent }) => $accent.to} 72%, #000000) 100%
  );
  transform: translate(-22%, -9%) translateZ(-48px) rotateY(-24deg) rotateX(10deg);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.22);
  z-index: 1;
`;

/* The front panel: the screenshot, on its own, with no bezel or device chrome. Its radius and shadow are
   what make it read as a floating screen rather than a picture in a box. */
export const StyledFrontPanel = styled.div`
  position: absolute;
  inset: 0;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  background: ${tokens.colors.white};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1), 0 18px 44px rgba(0, 0, 0, 0.26);
  z-index: 2;
`;

export const StyledScreenImage = styled.img`
  width: 100%;
  height: 100%;
  /* contain, not cover. The six first captures are all portrait but their ratios run from 0.462 to
     0.632; cover cropped the tallest and the leftover band was visible in the prototype. contain shows
     each screenshot whole on a white screen, so nothing is cut and nothing is stretched. */
  object-fit: contain;
  object-position: center;
  display: block;
`;

export const StyledScreenFallback = styled.div`
  width: 100%;
  height: 100%;
  background: ${tokens.colors.bgMuted};
`;

export const StyledCaption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${tokens.space[1]};
  min-width: 0;
  /* Wide enough that a description does not break onto a fourth line over a single word, which is what
     the four-column grid produced at 1440px. */
  max-width: 34ch;
`;

export const StyledSceneName = styled.h3`
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: ${tokens.colors.textPrimary};
  overflow-wrap: break-word;
`;

export const StyledSceneDescription = styled.p`
  margin: 0;
  font-size: ${tokens.fontSizes.secondary};
  line-height: ${tokens.lineHeights.relaxed};
  color: ${tokens.colors.textSecondary};
`;