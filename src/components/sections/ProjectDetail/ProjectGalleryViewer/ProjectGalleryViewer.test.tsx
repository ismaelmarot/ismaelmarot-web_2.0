import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectGalleryViewer } from './ProjectGalleryViewer';

const screenshots = [
  'https://example.com/a.png',
  'https://example.com/b.png',
  'https://example.com/c.png',
];

/**
 * The full-screen screenshot viewer was built inside `sections/ProjectDetail`'s folder, with no folder,
 * no test and no barrel of its own. `specs/006` recorded it only in its `tasks.md` and never as a
 * requirement of its `spec.md`, so the component that takes over the whole viewport had nothing
 * asserting it. These tests were written with the folder rather than after it, which is the point.
 */
describe('ProjectGalleryViewer', () => {
  const renderViewer = (activeIndex: number | null, overrides = {}) =>
    render(
      <ProjectGalleryViewer
        screenshots={screenshots}
        projectName="LinkIO"
        activeIndex={activeIndex}
        onClose={vi.fn()}
        onNext={vi.fn()}
        onPrevious={vi.fn()}
        {...overrides}
      />
    );

  it('renders nothing but its backdrop while it is closed', () => {
    renderViewer(null);

    expect(screen.getByTestId('gallery-viewer')).toBeInTheDocument();
    expect(screen.queryByTestId('gallery-viewer-image')).not.toBeInTheDocument();
  });

  it('names the dialog after the project it is showing', () => {
    renderViewer(0);

    expect(screen.getByLabelText('LinkIO screenshots')).toBeInTheDocument();
  });

  it('shows the screenshot at the active index, numbered from one', () => {
    renderViewer(1);

    const image = screen.getByTestId('gallery-viewer-image');
    expect(image).toHaveAttribute('src', screenshots[1]);
    expect(image).toHaveAttribute('alt', 'LinkIO screenshot 2');
    expect(screen.getByTestId('gallery-counter')).toHaveTextContent('2 / 3');
  });

  it('announces the counter politely rather than assertively', () => {
    renderViewer(0);

    // Arrow keys change the image while focus may be anywhere, so the announcement has to be the only
    // thing that speaks. Assertive would interrupt a screen reader mid-sentence on every press.
    expect(screen.getByTestId('gallery-counter')).toHaveAttribute('aria-live', 'polite');
  });

  // These two address the controls by their test ids rather than by role. jsdom does not implement a
  // modal dialog: `showModal` is a `vi.fn()` in tests/setup.ts, so the element never carries `open` and
  // everything inside it is correctly hidden from the accessibility tree. A role query would fail
  // against markup a browser would expose, which is the wrong way round to be wrong.
  it('moves forward and back through the screenshots', () => {
    const onNext = vi.fn();
    const onPrevious = vi.fn();
    renderViewer(0, { onNext, onPrevious });

    fireEvent.click(screen.getByTestId('gallery-viewer-next'));
    expect(onNext).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('gallery-viewer-prev'));
    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it('closes from the button', () => {
    const onClose = vi.fn();
    renderViewer(0, { onClose });

    fireEvent.click(screen.getByTestId('gallery-viewer-close'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('names its three controls for assistive technology, which jsdom cannot be asked to expose', () => {
    renderViewer(0);

    // The labels are asserted from the source rather than the tree, because the tree hides them here.
    // They are the difference between a usable modal and an unusable one, so they are worth pinning.
    expect(screen.getByTestId('gallery-viewer-close')).toHaveAttribute(
      'aria-label',
      'Close full screen screenshots'
    );
    expect(screen.getByTestId('gallery-viewer-next')).toHaveAttribute(
      'aria-label',
      'Next screenshot'
    );
    expect(screen.getByTestId('gallery-viewer-prev')).toHaveAttribute(
      'aria-label',
      'Previous screenshot'
    );
  });

  it('closes on Escape, because a dialog that traps focus must release it', () => {
    const onClose = vi.fn();
    renderViewer(0, { onClose });

    fireEvent.keyDown(screen.getByTestId('gallery-viewer'), { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('navigates with the arrow keys', () => {
    const onNext = vi.fn();
    const onPrevious = vi.fn();
    renderViewer(1, { onNext, onPrevious });
    const viewer = screen.getByTestId('gallery-viewer');

    fireEvent.keyDown(viewer, { key: 'ArrowRight' });
    expect(onNext).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(viewer, { key: 'ArrowLeft' });
    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it('leaves the arrow keys alone when the key is something else', () => {
    const onNext = vi.fn();
    const onPrevious = vi.fn();
    renderViewer(1, { onNext, onPrevious });

    fireEvent.keyDown(screen.getByTestId('gallery-viewer'), { key: 'a' });

    expect(onNext).not.toHaveBeenCalled();
    expect(onPrevious).not.toHaveBeenCalled();
  });

  it('closes when the backdrop itself is clicked, but not when the image is', () => {
    const onClose = vi.fn();
    renderViewer(0, { onClose });

    // The frame and the bar fill the viewport and let pointer events through, so a click landing on the
    // dialog element itself is a click on empty space. A click on the image must not close it.
    fireEvent.click(screen.getByTestId('gallery-viewer-image'));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('gallery-viewer'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hides the page behind it while it is open, so the background cannot scroll', () => {
    renderViewer(0);

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('gives the page its scrolling back when it closes', () => {
    const { unmount } = renderViewer(0);
    unmount();

    // Without this the visitor lands on a page that cannot be scrolled, which is the failure a modal
    // cleanup exists to prevent and the one nothing else in the tree would catch.
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});