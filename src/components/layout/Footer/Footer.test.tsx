import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
    render(<Footer socialLinks={mockSocialLinks} navigation={mockNavigation} />);
    expect(screen.getByRole('link', { name: /privacy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /terms/i })).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container: minimal } = render(<Footer socialLinks={mockSocialLinks} variant="minimal" />);
    expect(minimal.firstChild).toHaveClass('minimal');

    const { container: full } = render(<Footer socialLinks={mockSocialLinks} variant="full" />);
    expect(full.firstChild).toHaveClass('full');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Footer socialLinks={mockSocialLinks} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });
});