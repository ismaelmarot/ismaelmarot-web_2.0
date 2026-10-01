import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section } from './Section';

describe('Section', () => {
  it('renders with required id', () => {
    render(<Section id="test-section">Content</Section>);
    expect(screen.getByRole('region', { name: /section: test-section/i })).toBeInTheDocument();
  });

  it('applies custom ariaLabel', () => {
    render(<Section id="test" ariaLabel="Custom Label">Content</Section>);
    expect(screen.getByRole('region', { name: /custom label/i })).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { container: sm } = render(<Section id="test" size="sm">Small</Section>);
    expect(sm.firstChild).toHaveClass('sm');

    const { container: xl } = render(<Section id="test" size="xl">Extra Large</Section>);
    expect(xl.firstChild).toHaveClass('xl');
  });

  it('applies background classes', () => {
    const { container: muted } = render(<Section id="test" background="muted">Muted</Section>);
    expect(muted.firstChild).toHaveClass('muted');

    const { container: accent } = render(<Section id="test" background="accent">Accent</Section>);
    expect(accent.firstChild).toHaveClass('accent');
  });

  it('renders children', () => {
    render(<Section id="test"><span>Child content</span></Section>);
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Section id="test" ref={ref}>Ref Section</Section>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });

  it('applies custom className', () => {
    const { container } = render(<Section id="test" className="custom-class">Custom</Section>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});