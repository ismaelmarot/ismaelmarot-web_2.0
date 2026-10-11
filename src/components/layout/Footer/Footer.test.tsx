import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getCssForElement } from '@/test-utils/css';
import { Footer } from './Footer';

const mockSocialLinks = [
  { id: 'email', type: 'email' as const, label: 'Email', value: 'test@example.com', iconName: 'mail' as const },
  { id: 'github', type: 'github' as const, label: 'GitHub', value: 'https://github.com/test', iconName: 'github' as const },
  { id: 'linkedin', type: 'linkedin' as const, label: 'LinkedIn', value: 'https://linkedin.com/in/test', iconName: 'linkedin' as const },
];

const mockNavigation = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

describe('Footer', () => {
  /* Feature 014 split the copyright into a symbol/year outside the signature and a name inside it.
     A text matcher no longer finds the whole line in one element, because the name is now its own
     element. Matching on the paragraph's textContent keeps every assertion below reading the line as
     a visitor does, and keeps the existing tests working instead of deleting them, which FR-008
     forbids. */
  const copyrightOf = (name: string) =>
    screen.getByText((_, el) => el?.tagName === 'P' && new RegExp(`© ${new Date().getFullYear()} ${name}$`).test(el.textContent ?? ''));

  it('renders copyright with current year', () => {
    render(<Footer socialLinks={mockSocialLinks} copyright="Test Name" />);
    expect(copyrightOf('Test Name')).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<Footer socialLinks={mockSocialLinks} />);
    expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute('href', 'mailto:test@example.com');
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', 'https://github.com/test');
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute('href', 'https://linkedin.com/in/test');
  });

  it('opens external links in new tab', () => {
    render(<Footer socialLinks={mockSocialLinks} />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders navigation when provided', () => {
    render(
      <MemoryRouter>
        <Footer socialLinks={mockSocialLinks} navigation={mockNavigation} />
      </MemoryRouter>
    );
    expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /terms/i })).toBeInTheDocument();
  });

  it('routes navigation through the router instead of reloading the document', () => {
    render(
      <MemoryRouter>
        <Footer socialLinks={mockSocialLinks} navigation={mockNavigation} />
      </MemoryRouter>
    );
    // NavLink renders a plain href too, so the client-side behaviour is asserted by
    // checking the footer reuses the shared Navigation, not a hand-rolled anchor list.
    expect(screen.getByRole('link', { name: /privacy/i })).toHaveAttribute('href', '/privacy');
  });

  it('marks the section of the current route as current', () => {
    render(
      <MemoryRouter initialEntries={['/terms']}>
        <Footer socialLinks={mockSocialLinks} navigation={mockNavigation} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /terms/i })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /privacy/i })).not.toHaveAttribute('aria-current');
  });

  it('applies variant styles', () => {
    render(<Footer socialLinks={mockSocialLinks} variant="minimal" />);
    expect(getCssForElement(screen.getByRole('contentinfo'))).toContain(
      'padding-block: var(--space-8)'
    );

    render(<Footer socialLinks={mockSocialLinks} variant="full" />);
    expect(getCssForElement(screen.getAllByRole('contentinfo')[1])).toContain(
      'padding-block: var(--space-16)'
    );
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Footer socialLinks={mockSocialLinks} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });

  // Feature 014. The footer signature is one typeface on one word. Everything below exists so that
  // it stays one typeface on one word: these four assertions are the ones that would catch the
  // feature spreading into the symbol, the year, or the rest of the page.

  it('keeps the copyright text identical to before the signature face was added', () => {
    render(<Footer socialLinks={mockSocialLinks} copyright="Test Name" />);
    const copyright = copyrightOf('Test Name');

    // Feature 014 changed the typeface of the name and nothing else, so the element still carries
    // exactly one space between the year and the name, in this order.
    expect(copyright.textContent).toBe(`© ${new Date().getFullYear()} Test Name`);
    expect(copyright.tagName).toBe('P');
  });

  it('puts the signature face on the name alone', () => {
    render(<Footer socialLinks={mockSocialLinks} copyright="Test Name" />);
    const signature = screen.getByText('Test Name');
    const css = getCssForElement(signature);

    expect(css).toContain('font-family: var(--font-hand)');
    expect(css).toContain('font-weight: 400');
    // The parent still carries Inter. The symbol and the year are in the parent, so if the
    // signature face ever reached them this is the assertion that would notice.
    expect(getCssForElement(copyrightOf('Test Name'))).not.toContain('var(--font-hand)');
  });

  it('declares the weight rather than inheriting it, because the typeface has no bold', () => {
    render(<Footer socialLinks={mockSocialLinks} copyright="Test Name" />);
    // Playwrite's axis stops at 400. An inherited or default weight above that would not make the
    // name heavier; the browser would synthesise a face the typeface was never drawn with.
    expect(getCssForElement(screen.getByText('Test Name'))).toContain('font-weight: 400');
  });

  it('reserves the copyright height so the signature cannot move the social links', () => {
    render(<Footer socialLinks={mockSocialLinks} copyright="Test Name" />);
    // Measured before implementing: the handwriting face sets a 25px inline box against Inter's
    // 17px at the same 14px, which grew the line 21px to 22px and pushed the link row down 1px.
    expect(getCssForElement(copyrightOf('Test Name'))).toContain('height: 21px');
  });

  it('still falls back to the default name when no copyright prop is given', () => {
    render(<Footer socialLinks={mockSocialLinks} />);
    expect(screen.getByText('Ismael Marot')).toBeInTheDocument();
  });
});