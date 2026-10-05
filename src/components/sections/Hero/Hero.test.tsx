import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getCssForElement } from '@/test-utils/css';
import { Hero } from './Hero';
import type { HeroProps } from './Hero';

describe('Hero', () => {
  const defaultProps: HeroProps = {
    name: 'Ismael Marot',
    title: 'Web Developer',
    tagline: 'Building beautiful, functional web experiences.',
    cta: { label: 'View Projects', href: '/projects' },
    secondaryCta: { label: 'Contact Me', href: '/contact' },
  };

  const renderHero = (props: HeroProps = defaultProps) =>
    render(
      <MemoryRouter>
        <Hero {...props} />
      </MemoryRouter>
    );

  it('renders name, title, and tagline', () => {
    renderHero();
    expect(screen.getByText('Ismael Marot')).toBeInTheDocument();
    expect(screen.getByText('Web Developer')).toBeInTheDocument();
    expect(screen.getByText('Building beautiful, functional web experiences.')).toBeInTheDocument();
  });

  it('renders primary CTA button', () => {
    renderHero();
    expect(screen.getByRole('link', { name: 'View Projects' })).toBeInTheDocument();
  });

  it('renders secondary CTA button', () => {
    renderHero();
    expect(screen.getByRole('link', { name: 'Contact Me' })).toBeInTheDocument();
  });

  it('renders without secondary CTA when not provided', () => {
    renderHero({ ...defaultProps, secondaryCta: undefined });
    expect(screen.queryByRole('link', { name: 'Contact Me' })).not.toBeInTheDocument();
  });

  it('applies hero section composition', () => {
    renderHero();
    const section = screen.getByRole('region', { name: /hero/i });
    expect(getCssForElement(section)).toContain('min-height');
  });
});

// Added by Amendment 1. The name and the title moved onto a black band that spans the viewport,
// and the structure changed with them: the band is a sibling of the container rather than a child,
// which is the only way it reaches the full width without 100vw.
describe('Hero identity band', () => {
  const defaultProps: HeroProps = {
    name: 'Ismael Marot',
    title: 'Web Developer',
    tagline: 'Building beautiful, functional web experiences.',
    cta: { label: 'View Projects', href: '/projects' },
    secondaryCta: { label: 'Contact Me', href: '/contact' },
  };

  const renderHero = (props: HeroProps = defaultProps) =>
    render(
      <MemoryRouter>
        <Hero {...props} />
      </MemoryRouter>
    );

  const cssOf = (element: Element) => getCssForElement(element);

  it('paints the band pure black and full width, without 100vw', () => {
    renderHero();
    const band = screen.getByTestId('hero-band');
    const css = cssOf(band);
    // jsdom rewrites the hex to its rgb() form, so the assertion reads the normalised value.
    expect(css).toContain('background: rgb(0, 0, 0)');
    expect(css).toContain('width: 100%');
    // 100vw includes the scrollbar, which would add horizontal scroll on classic-scrollbar platforms.
    expect(css).not.toContain('100vw');
  });

  // Scoped with `within` rather than `closest`, which is the lint rule's objection and also the
  // stronger assertion: it states the whole containment instead of one hop upwards.
  it('holds the name and the title inside the band', () => {
    renderHero();
    const band = screen.getByTestId('hero-band');
    expect(within(band).getByRole('heading', { level: 1 })).toHaveTextContent('Ismael Marot');
    expect(within(band).getByText('Web Developer')).toBeInTheDocument();
  });

  it('keeps the tagline and the buttons off the band, on white', () => {
    renderHero();
    const band = screen.getByTestId('hero-band');
    // Not in the band, but still on the page: this is the whole point of the amendment.
    expect(within(band).queryByText(defaultProps.tagline)).toBeNull();
    expect(screen.getByText(defaultProps.tagline)).toBeInTheDocument();
    expect(within(band).queryByRole('link', { name: 'View Projects' })).toBeNull();
    expect(screen.getByRole('link', { name: 'View Projects' })).toBeInTheDocument();
  });

  it('writes the name and the title in white', () => {
    renderHero();
    expect(cssOf(screen.getByRole('heading', { level: 1 }))).toContain(
      'color: var(--color-white)'
    );
    expect(cssOf(screen.getByText('Web Developer'))).toContain('color: var(--color-white)');
  });

  // The tagline is the same styled component as the title, so the two states have to be told apart
  // by variant. Getting this wrong would leave dark text on the black band.
  it('keeps the tagline dark even though it shares the title component', () => {
    renderHero();
    expect(cssOf(screen.getByText(defaultProps.tagline))).toContain(
      'color: var(--color-text-secondary)'
    );
    expect(cssOf(screen.getByText(defaultProps.tagline))).not.toContain(
      'color: var(--color-white)'
    );
  });

  // Fluid rather than stepped: 64px from 1000px up, down to a 40px floor. A fixed 48px below
  // 768px pushed the Hero 22px past a 320x640 viewport, because the name wraps to two lines there.
  it('gives the band fluid vertical padding, capped at the specified 64px', () => {
    renderHero();
    const css = cssOf(screen.getByTestId('hero-band'));
    expect(css).toContain('padding-block: clamp(var(--space-10), 6.4vw, var(--space-16))');
    expect(css).not.toContain('@media (max-width: 767px)');
  });

  it('leaves a gap under the band so the tagline does not touch the black', () => {
    renderHero();
    expect(cssOf(screen.getByTestId('hero-band'))).toContain(
      'margin-bottom: clamp(var(--space-6), 3.5vw, var(--space-10))'
    );
  });
});