import { useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import {
  StyledViewer,
  StyledViewerFrame,
  StyledViewerImage,
  StyledViewerBar,
  StyledViewerCounter,
  StyledViewerButton,
  StyledViewerClose,
} from './ProjectGalleryViewer.styles';

export interface ProjectGalleryViewerProps {
  screenshots: string[];
  projectName: string;
  /** Index of the screenshot on screen, or null while the viewer is closed */
  activeIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const ProjectGalleryViewer = ({
  screenshots,
  projectName,
  activeIndex,
  onClose,
  onNext,
  onPrevious,
}: ProjectGalleryViewerProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const isOpen = activeIndex !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      // showModal gives the focus trap, the inert background and the ::backdrop. It also
      // does not stop the page behind from scrolling, so that is handled here.
      if (!dialog.open) dialog.showModal();
      closeRef.current?.focus();
      document.body.style.overflow = 'hidden';

      return () => {
        if (dialog.open) dialog.close();
        document.body.style.overflow = '';
      };
    }

    // Keep the element mounted so the backdrop is only ever there while the dialog is open.
    return undefined;
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onNext();
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onPrevious();
      return;
    }
    if (event.key === 'Escape') {
      // The dialog already closes itself on Escape; this keeps the React state in step,
      // which a native close would not do on its own.
      event.preventDefault();
      onClose();
    }
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    // The frame and the bar fill the viewport but let pointer events through, so a click
    // that lands on the dialog itself is a click on empty space rather than on the image or
    // a control.
    if (event.target === dialogRef.current) onClose();
  };

  return (
    <StyledViewer
      ref={dialogRef}
      aria-label={`${projectName} screenshots`}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      data-testid="gallery-viewer"
    >
      {isOpen && activeIndex !== null && (
        <StyledViewerFrame>
          <StyledViewerBar>
            <StyledViewerCounter aria-live="polite" data-testid="gallery-counter">
              {activeIndex + 1} / {screenshots.length}
            </StyledViewerCounter>

            <StyledViewerClose
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close full screen screenshots"
              data-testid="gallery-viewer-close"
            >
              <Icon name="x" size="md" aria-hidden="true" />
            </StyledViewerClose>
          </StyledViewerBar>

          <StyledViewerButton
            type="button"
            $edge="start"
            onClick={onPrevious}
            aria-label="Previous screenshot"
            data-testid="gallery-viewer-prev"
          >
            <Icon name="chevronLeft" size={20} aria-hidden="true" />
          </StyledViewerButton>

          <StyledViewerImage
            src={screenshots[activeIndex]}
            alt={`${projectName} screenshot ${activeIndex + 1}`}
            data-testid="gallery-viewer-image"
          />

          <StyledViewerButton
            type="button"
            $edge="end"
            onClick={onNext}
            aria-label="Next screenshot"
            data-testid="gallery-viewer-next"
          >
            <Icon name="chevronRight" size={20} aria-hidden="true" />
          </StyledViewerButton>
        </StyledViewerFrame>
      )}
    </StyledViewer>
  );
};