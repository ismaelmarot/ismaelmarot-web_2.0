import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';
import { getCssForElement } from '@/test-utils/css';

const mockNavigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
];

const mockCta = { label: 'Contact', href: '/contact' };

describe('Header', () => {
  it('renders logo', () => {
    render(
      <MemoryRouter>
        <Header navigation={mockNavigation} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /go to homepage/i })).toHaveTextContent('Ismael Marot');
  });

  it('renders navigation items', () => {
    render(
      <MemoryRouter>
        <Header navigation={mockNavigation} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
  });

  it('renders CTA when provided', () => {
    render(
      <MemoryRouter>
        <Header navigation={mockNavigation} cta={mockCta} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('applies external link attributes to CTA when external', () => {
    const externalCta = { ...mockCta, external: true };
    render(
      <MemoryRouter>
        <Header navigation={mockNavigation} cta={externalCta} />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /contact/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a header element', () => {
    render(
      <MemoryRouter>
        <Header navigation={mockNavigation} />
      </MemoryRouter>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <MemoryRouter>
        <Header navigation={mockNavigation} ref={ref} />
      </MemoryRouter>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });

  it('shows hamburger and opens menu when mobile viewport', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(max-width: 767px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <MemoryRouter>
        <Header navigation={mockNavigation} />
      </MemoryRouter>
    );
    const button = screen.getByRole('button', { name: /open menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: /mobile menu/i })).toBeInTheDocument();

    window.matchMedia = originalMatchMedia;
  });
});

// Added by spec 003 Amendment 2. The header has to turn white-on-black while it rests on the hero's
// band, and turn back when it no longer does. The switch is driven by the region's bottom edge
// crossing the header's own, not by a scroll offset.
describe('Header over a dark region', () => {
  const mockNavigation = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ];

  /* One region whose bottom edge can be moved. Creating a second one would leave two matching
     elements and querySelector would keep returning the first, so a test that "moves" the band
     would silently measure the old one. */
  /* jsdom reports offsetHeight as 0 for every element, which would collapse the hook's comparison
     to `bottom > 0` and make any positive bottom look like coverage. The header is 52px tall by
     design, so that is stubbed here and the boundary is exercised against it. */
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight'
  );
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      value: 52,
      configurable: true,
    });
  });
  afterEach(() => {
    if (originalOffsetHeight) {
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    }
  });

  let bandBottom = 400;
  const addBand = () => {
    const element = document.createElement('div');
    element.setAttribute('data-header-contrast', 'dark');
    element.getBoundingClientRect = () => ({ bottom: bandBottom }) as DOMRect;
    document.body.appendChild(element);
  };
  const moveBand = (bottom: number) => {
    bandBottom = bottom;
  };

  afterEach(() => {
    document.body.innerHTML = '';
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  const renderHeader = () =>
    render(
      <MemoryRouter>
        <Header navigation={mockNavigation} />
      </MemoryRouter>
    );

  const cssOf = (element: Element) => getCssForElement(element);

  it('goes black with white text and no border while a region covers it', () => {
    addBand();
    renderHeader();
    const css = cssOf(screen.getByRole('banner'));
    // jsdom rewrites the hex to rgb() and cannot represent the `none` keyword, reporting it as the
    // initial `medium`, so the absence of a border is asserted as the absence of the 1px one the
    // light rule declares rather than by reading the value back.
    expect(css).toContain('background-color: rgb(0, 0, 0)');
    expect(css).not.toContain('border-bottom: 1px solid');
    // The colours cascade through custom properties rather than props, so the whole
    // treatment is these overrides and nothing else.
    expect(css).toContain('--color-fg: #ffffff');
    expect(css).toContain('--color-text-secondary: #ffffff');
    expect(css).toContain('--link-hover-decoration: underline');
  });

  it('stays dark while the region still reaches past the header, whatever the scroll offset', () => {
    addBand();
    renderHeader();
    // 150px of scroll must not turn it white: the band is 355px tall and still behind it. The old
    // threshold was scrollY > 20, which is why this needed replacing rather than keeping.
    Object.defineProperty(window, 'scrollY', { value: 150, configurable: true });
    fireEvent.scroll(window);
    expect(cssOf(screen.getByRole('banner'))).toContain('background-color: rgb(0, 0, 0)');
  });

  it('returns to the light treatment once the region no longer reaches the header', () => {
    addBand();
    renderHeader();
    // 60 is still below the header's 52px, so the band covers it and the header stays dark. The
    // switch is a boundary, not an on/off switch at the top of the page.
    moveBand(60);
    fireEvent.resize(window);
    expect(cssOf(screen.getByRole('banner'))).toContain('background-color: rgb(0, 0, 0)');

    // 40 is above 52, so the band has stopped covering the header. scrollY is defined rather than
    // set with scrollTo because jsdom does not implement scrolling and leaves it at 0, which would
    // keep the header in its transparent, not-scrolled state.
    moveBand(40);
    Object.defineProperty(window, 'scrollY', { value: 400, configurable: true });
    fireEvent.scroll(window);

    const css = cssOf(screen.getByRole('banner'));
    expect(css).toContain('background-color: var(--color-bg)');
    expect(css).toContain('border-bottom: 1px solid var(--color-border)');
    expect(css).not.toContain('--link-hover-decoration');
    expect(css).not.toContain('--color-fg: #ffffff');
  });

  it('is transparent at the top of a page with no dark region, exactly as before', () => {
    renderHeader();
    const css = cssOf(screen.getByRole('banner'));
    // Not scrolled and no region to go dark over is the original case: transparent, no border.
    expect(css).toContain('background-color: transparent');
    expect(css).not.toContain('--color-fg: #ffffff');
  });
});
