import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navigation } from './Navigation';

const mockItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'GitHub', href: 'https://github.com', external: true },
];

describe('Navigation', () => {
  it('renders navigation items', () => {
    render(<Navigation items={mockItems} />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
  });

  it('applies variant aria-labels', () => {
    render(<Navigation items={mockItems} variant="header" />);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();

    render(<Navigation items={mockItems} variant="mobile" />);
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument();
  });

  it('highlights active section', () => {
    render(<Navigation items={mockItems} activeSection="#about" />);
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('aria-current', 'page');
  });

  it('opens external links in new tab', () => {
    render(<Navigation items={mockItems} />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('calls onNavigate handler', () => {
    const handleNavigate = vi.fn();
    render(<Navigation items={mockItems} onNavigate={handleNavigate} />);
    fireEvent.click(screen.getByRole('link', { name: /about/i }));
    expect(handleNavigate).toHaveBeenCalledWith('#about');
  });

  it('prevents default for anchor links', () => {
    const handleNavigate = vi.fn();
    render(<Navigation items={mockItems} onNavigate={handleNavigate} />);
    const link = screen.getByRole('link', { name: /about/i });
    fireEvent.click(link);
    expect(handleNavigate).toHaveBeenCalledWith('#about');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Navigation items={mockItems} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });

  it('applies custom className', () => {
    const { container } = render(<Navigation items={mockItems} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});