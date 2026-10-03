import styled from 'styled-components';
import { tokens } from '@/styles/tokens';

/**
 * Full screen screenshot viewer built on the native dialog element, so the focus trap, the
 * Escape key and the inert background come from the platform instead of being hand rolled.
 */
export const StyledViewer = styled.dialog`
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  overflow: hidden;

  &::backdrop {
    background: rgba(0, 0, 0, 0.92);
  }
`;

export const StyledViewerFrame = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  /* Leaves room for the arrows on the sides and the bar on top. */
  padding: ${tokens.space[16]} ${tokens.space[12]};
  /* The frame fills the viewport, so it would swallow every click aimed at the backdrop and
     the viewer could not be dismissed by clicking outside. Passing those clicks through to
     the dialog is what makes the backdrop clickable; the few things that must react opt back
     in below. */
  pointer-events: none;
`;

export const StyledViewerImage = styled.img`
  display: block;
  pointer-events: auto;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: ${tokens.radii.lg};
`;

export const StyledViewerBar = styled.div`
  /* Inherits pointer-events: none from the frame on purpose: the empty middle of the bar is
     backdrop, and clicking it should dismiss the viewer. */
  position: absolute;
  top: ${tokens.space[4]};
  left: ${tokens.space[4]};
  right: ${tokens.space[4]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${tokens.space[4]};
`;

export const StyledViewerCounter = styled.p`
  margin: 0;
  padding: ${tokens.space[2]} ${tokens.space[3]};
  border-radius: ${tokens.radii.full};
  background-color: rgba(255, 255, 255, 0.12);
  font-size: var(--text-label);
  font-weight: ${tokens.fontWeights.medium};
  color: var(--color-white);
`;

export const StyledViewerButton = styled.button<{ $edge: 'start' | 'end' }>`
  position: absolute;
  pointer-events: auto;
  top: 50%;
  ${({ $edge }) => ($edge === 'start' ? 'left: var(--space-4);' : 'right: var(--space-4);')}
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  cursor: pointer;
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &:focus-visible {
    outline: 2px solid var(--color-white);
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    width: 38px;
    height: 38px;
  }
`;

export const StyledViewerClose = styled.button`
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  cursor: pointer;
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &:focus-visible {
    outline: 2px solid var(--color-white);
    outline-offset: 2px;
  }
`;

/** Wraps a screenshot in the inline carousel so it can be opened full screen. */
export const StyledGalleryThumb = styled.button`
  display: block;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 4px;
    border-radius: ${tokens.radii.lg};
  }
`;