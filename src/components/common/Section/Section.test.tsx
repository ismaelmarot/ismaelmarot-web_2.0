import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getCssForElement } from '@/test-utils/css';
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

  it('applies size styles', () => {
    render(<Section id="test" size="sm">Small</Section>);
    expect(getCssForElement(screen.getByText('Small'))).toContain(
      'padding-block: var(--space-10)'
    );

    render(<Section id="test" size="xl">Extra Large</Section>);
    expect(getCssForElement(screen.getByText('Extra Large'))).toContain(
      'padding-block: var(--space-20)'
    );
  });

  it('applies background styles', () => {
    render(<Section id="test" background="default">Default</Section>);
    expect(getCssForElement(screen.getByText('Default'))).toContain(
      'background: var(--color-background)'
    );

    render(<Section id="test" background="muted">Muted</Section>);
    expect(getCssForElement(screen.getByText('Muted'))).toContain(
      'background: var(--color-bg-muted)'
    );
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
    render(<Section id="test" className="custom-class">Custom</Section>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });
});