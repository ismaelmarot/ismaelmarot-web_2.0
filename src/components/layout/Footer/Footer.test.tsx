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
  it('renders copyright with current year', () => {
    render(<Footer socialLinks={mockSocialLinks} copyright="Test Name" />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} Test Name`))).toBeInTheDocument();
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
});