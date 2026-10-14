import { render, screen } from '@testing-library/react';
import { TechnologyPill } from './TechnologyPill';
import type { Technology } from '@/types/project';

const technology: Technology = {
  id: 'typescript',
  name: 'TypeScript',
  category: 'language',
  iconSlug: 'typescript',
};

/**
 * The pill is the one visual both the technologies page and the home marquee share, which is the reason
 * `specs/016` put it in its own file in the first place: two screens that match by construction rather
 * than by two stylesheets being kept in agreement. It had no test of its own — the card's test covered it
 * incidentally, and the marquee's twelve covered only that it was present.
 */
describe('TechnologyPill', () => {
  it('renders the technology name', () => {
    render(<TechnologyPill technology={technology} />);

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('draws the brand mark when the slug resolves', () => {
    render(<TechnologyPill technology={technology} />);

    expect(screen.getByTestId('brand-mark-typescript')).toBeInTheDocument();
  });

  it('takes a testId, so a caller can address one mark among many', () => {
    render(<TechnologyPill technology={technology} testId="marquee-mark-typescript" />);

    expect(screen.getByTestId('marquee-mark-typescript')).toBeInTheDocument();
  });

  it('keeps the slot when the mark does not resolve, rather than collapsing the label', () => {
    render(
      <TechnologyPill
        technology={{ ...technology, id: 'unknown', name: 'Desconocida', iconSlug: 'no-such-icon' }}
      />
    );

    // No mark is drawn, and the name is still there. The slot holds its width so a row of pills does
    // not read as if something failed to load.
    expect(screen.queryByTestId('brand-mark-no-such-icon')).not.toBeInTheDocument();
    expect(screen.getByText('Desconocida')).toBeInTheDocument();
  });

  it('hides the mark from assistive technology, because the name carries the meaning', () => {
    render(<TechnologyPill technology={technology} />);

    // The mark is decoration. Exposing it would make a screen reader announce an image between the two
    // words of the technology's name.
    expect(screen.getByTestId('brand-mark-typescript')).toHaveAttribute('aria-hidden', 'true');
  });

  it('is not focusable, because it is not a link and not a button', () => {
    render(<TechnologyPill technology={technology} />);

    // specs/016's reason for keeping the pill dumb: the technologies page wants it to be a listitem and
    // the marquee wants it inert inside a moving track. A role or a tabindex here would break one of
    // them, so neither is set, and the accessible tree has nothing in it to focus.
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});