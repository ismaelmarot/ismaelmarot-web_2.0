import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
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

  it('applies sticky class by default', () => {
    const { container } = render(<Header navigation={mockNavigation} />);
    expect(container.firstChild).toHaveClass('sticky');
  });

  it('applies static class when sticky is false', () => {
    const { container } = render(<Header navigation={mockNavigation} sticky={false} />);
    expect(container.firstChild).toHaveClass('static');
  });

  it('applies transparent class by default', () => {
    const { container } = render(<Header navigation={mockNavigation} />);
    expect(container.firstChild).toHaveClass('transparent');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Header navigation={mockNavigation} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });
});