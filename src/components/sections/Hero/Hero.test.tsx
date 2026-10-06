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

  // Rewritten by Amendment 3. The single fluid padding-block this asserted no longer exists: the top
  // is now derived from the header height and the bottom stays on its own scale, because the band
  // has to clear a fixed header above it. The bottom keeps the fluid floor that stopped a fixed 48px
  // pushing the Hero 22px past a 320x640 viewport, where the name wraps to two lines.
  it('derives the top padding from the header height, not from a fixed number', () => {
    renderHero();
    const css = cssOf(screen.getByTestId('hero-band'));
    expect(css).toContain('padding-top: calc(var(--header-height) + var(--space-12))');
    expect(css).toContain('@media (max-width: 767px)');
    expect(css).toContain('padding-top: calc(var(--header-height) + var(--space-8))');
    // Hardcoding 100 would break silently if the header ever changed height.
    expect(css).not.toContain('padding-top: 100px');
  });

  // Amendment 4. The band was sized by its content, which left it at 43% of a 900px viewport and
  // 30% of an 844px phone: a text block with padding rather than the dark region the design implies.
  it('gives the band a proportion of the viewport, not just its content height', () => {
    renderHero();
    const css = cssOf(screen.getByTestId('hero-band'));
    expect(css).toContain('min-height: 55dvh');
    // min-height rather than height, so a short viewport grows to fit instead of clipping.
    expect(css).not.toMatch(/^\s*height:/m);
    expect(css).toContain('justify-content: center');
  });

  // Amendment 5. This test used to assert the opposite of what it asserts now. It was written for
  // the `@media (max-height: 720px)` fallback that Amendment 5 deleted, and that fallback was the
  // cause of the band falling to 38% of the screen on a 375x667 iPhone SE: a phone of entirely
  // ordinary size showing the smallest band on the site. Rewritten rather than deleted, per SC-010
  // of the carousel spec: a test that contradicts the new design is replaced by one that states the
  // new intent, because deleting it would leave the old behaviour unguarded.
  it('keeps the proportion on a short viewport, with no height query left on the band', () => {
    renderHero();
    const css = cssOf(screen.getByTestId('hero-band'));
    // Height is not the variable the band responds to. A viewport-height query here turned a
    // screen-height rule into a content-height rule on three of the four common phone sizes.
    expect(css).not.toContain('@media (max-height');
    expect(css).not.toContain('min-height: 0');
  });

  it('halves the band on a phone and keeps 55% from 768px up', () => {
    renderHero();
    const css = cssOf(screen.getByTestId('hero-band'));
    // Two statements rather than one inverted rule, so desktop is untouched by construction.
    // 55% left 464px of black above 190px of tagline at 390x844, and put the name 136px below a
    // 52px header.
    expect(css).toContain('@media (max-width: 767px)');
    expect(css).toContain('min-height: 50dvh');
  });

  it('takes the two pixels at 320x640 from the section padding, not from the type', () => {
    renderHero();
    // At 320x640 the band is 320px of 50% and the rest of the Hero wants 322. The band's margin and
    // the name's size are both untouched; this is the only thing given up.
    expect(getCssForElement(screen.getByTestId('hero-section'))).toContain(
      'padding-bottom: var(--space-8)'
    );
  });

  it('keeps the bottom padding on the scale, matching the summary sections', () => {
    renderHero();
    expect(cssOf(screen.getByTestId('hero-band'))).toContain(
      'padding-bottom: clamp(var(--space-10), 6.4vw, var(--space-16))'
    );
  });

  // Amendment 2 put margin-block: auto on StyledHero, which is a grandchild of the section. Auto
  // margins only distribute free space on a flex item, so it did nothing and the content sat under
  // the band with 322px of empty space beneath it.
  it('puts the centring margins on the section direct child, not a descendant', () => {
    renderHero();
    const body = screen.getByTestId('hero-body');
    expect(getCssForElement(body)).toContain('margin-block: auto');
    expect(getCssForElement(screen.getByTestId('hero-band'))).not.toContain('margin-block: auto');
  });

  it('leaves a gap under the band so the tagline does not touch the black', () => {
    renderHero();
    expect(cssOf(screen.getByTestId('hero-band'))).toContain(
      'margin-bottom: clamp(var(--space-6), 3.5vw, var(--space-10))'
    );
  });
});