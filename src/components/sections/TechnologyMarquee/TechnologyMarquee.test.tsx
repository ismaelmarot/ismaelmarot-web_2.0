import { fireEvent, render, screen, within } from '@testing-library/react';
import { getCssForElement } from '@/test-utils/css';
import { TechnologyMarquee } from './TechnologyMarquee';
import type { Technology } from '@/types/project';

const technologies: Technology[] = [
  { id: 'typescript', name: 'TypeScript', category: 'language', iconSlug: 'typescript' },
  { id: 'react', name: 'React', category: 'framework', iconSlug: 'react' },
  { id: 'git', name: 'Git', category: 'tool', iconSlug: 'git' },
];

const row = (name: RegExp) => screen.getByRole('group', { name });

/** The CSS rules that apply to one element, read from the injected stylesheet. */
const cssOf = (element: Element) => getCssForElement(element);

describe('TechnologyMarquee', () => {
  it('renders the category labels', () => {
    render(<TechnologyMarquee technologies={technologies} />);

    const top = row(/fila superior/i);

    // Once per copy, because the row holds the list twice to close the loop.
    expect(within(top).getAllByText('Lenguajes')).toHaveLength(2);
    expect(within(top).getAllByText('Frameworks')).toHaveLength(2);
    expect(within(top).getAllByText('Herramientas')).toHaveLength(2);
  });

  it('renders the two rows', () => {
    render(<TechnologyMarquee technologies={technologies} />);

    expect(row(/fila superior/i)).toBeInTheDocument();
    expect(row(/fila inferior/i)).toBeInTheDocument();
  });

  // -50% of a track holding two copies is one copy's width. A row holding only one copy would
  // travel half that and leave the visible window empty, which is the seam this guards against.
  it('holds the list twice in each row', () => {
    render(<TechnologyMarquee technologies={technologies} />);

    for (const name of [/fila superior/i, /fila inferior/i]) {
      expect(within(row(name)).getAllByTestId('marquee-group')).toHaveLength(3);
      expect(within(row(name)).getAllByTestId('marquee-group-copy')).toHaveLength(3);
    }
  });

  // Without this a screen reader hears the whole list twice per row, which is four readings of
  // every technology on the page.
  it('hides the duplicate half from assistive technology', () => {
    render(<TechnologyMarquee technologies={technologies} />);

    const duplicates = screen.getAllByTestId('marquee-group-copy');
    expect(duplicates).toHaveLength(6);

    for (const group of duplicates) {
      expect(group).toHaveAttribute('aria-hidden', 'true');
    }

    for (const group of screen.getAllByTestId('marquee-group')) {
      expect(group).not.toHaveAttribute('aria-hidden');
    }
  });

  // Same keyframes and same duration is what keeps the two rows travelling at one speed. The
  // direction itself is not asserted from the stylesheet, because both rows share a single
  // styled component and the emitted CSS holds rules for both variants, so reading it back is
  // ambiguous. The direction is verified for real in the browser by sampling the transform.
  it('runs both rows on the same keyframes and duration', () => {
    render(<TechnologyMarquee technologies={technologies} />);

    const tracks = screen.getAllByTestId('marquee-track');
    expect(tracks).toHaveLength(2);

    for (const track of tracks) {
      const css = cssOf(track);
      expect(css).toContain('marqueeScroll');
      expect(css).toContain('var(--duration-marquee)');
    }
  });

  it('marks one row forward and the other reversed', () => {
    render(<TechnologyMarquee technologies={technologies} />);

    expect(row(/fila superior/i)).toHaveAttribute('data-marquee-direction', 'forward');
    expect(row(/fila inferior/i)).toHaveAttribute('data-marquee-direction', 'reverse');
  });

  // WCAG 2.2.2 level A. The control is required, not a nicety.
  it('offers a control that pauses the movement', () => {
    render(<TechnologyMarquee technologies={technologies} />);

    const button = screen.getByRole('button', { name: /pausar el carrusel/i });
    expect(button).toHaveTextContent('Pausar');
  });

  // One control for both rows, as W3C recommends when a page has several moving elements.
  it('stops both rows when the control is used', () => {
    render(<TechnologyMarquee technologies={technologies} />);

    fireEvent.click(screen.getByRole('button', { name: /pausar el carrusel/i }));

    expect(screen.getByRole('button', { name: /reanudar el carrusel/i })).toHaveTextContent(
      'Reanudar'
    );

    for (const track of screen.getAllByTestId('marquee-track')) {
      expect(cssOf(track)).toContain('paused');
    }
  });

  it('resumes when the control is used again', () => {
    render(<TechnologyMarquee technologies={technologies} />);

    fireEvent.click(screen.getByRole('button', { name: /pausar el carrusel/i }));
    fireEvent.click(screen.getByRole('button', { name: /reanudar el carrusel/i }));

    // Only the control's reported state is asserted here. Whether the rows actually move again
    // is checked in the browser by sampling the transform over time, because styled-components
    // leaves the paused rule in the stylesheet and its presence proves nothing either way.
    expect(screen.getByRole('button', { name: /pausar el carrusel/i })).toHaveTextContent('Pausar');
  });

  it('renders nothing when there is nothing to scroll', () => {
    const { container } = render(<TechnologyMarquee technologies={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});