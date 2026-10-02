import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

const mockNavigation = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
];

const mockCta = { label: 'Contact', href: '#contact' };

describe('Header', () => {
  it('renders logo', () => {
    render(<Header navigation={mockNavigation} />);
    expect(screen.getByRole('link', { name: /go to homepage/i })).toHaveTextContent('Ismael Marot');
  });

  it('renders navigation items', () => {
    render(<Header navigation={mockNavigation} />);
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
  });

  it('renders CTA when provided', () => {
    render(<Header navigation={mockNavigation} cta={mockCta} />);
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('applies external link attributes to CTA when external', () => {
    const externalCta = { ...mockCta, external: true };
    render(<Header navigation={mockNavigation} cta={externalCta} />);
    const link = screen.getByRole('link', { name: /contact/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a header element', () => {
    render(<Header navigation={mockNavigation} />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Header navigation={mockNavigation} ref={ref} />);
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

    render(<Header navigation={mockNavigation} />);
    const button = screen.getByRole('button', { name: /open menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: /mobile menu/i })).toBeInTheDocument();

    window.matchMedia = originalMatchMedia;
  });
});
