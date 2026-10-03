import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getCssForElement } from '@/test-utils/css';
import { Container } from './Container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Container Content</Container>);
    expect(screen.getByText('Container Content')).toBeInTheDocument();
  });

  it('applies size styles', () => {
    render(<Container size="sm">Small</Container>);
    expect(getCssForElement(screen.getByText('Small'))).toContain(
      'max-width: var(--container-sm)'
    );

    render(<Container size="full">Full</Container>);
    expect(getCssForElement(screen.getByText('Full'))).toContain('max-width: none');
  });

  it('applies padding styles', () => {
    render(<Container padding="none">No Padding</Container>);
    expect(getCssForElement(screen.getByText('No Padding'))).toContain('padding-inline: 0');

    render(<Container padding="lg">Large Padding</Container>);
    expect(getCssForElement(screen.getByText('Large Padding'))).toContain(
      'padding-inline: var(--space-8)'
    );
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Container ref={ref}>Ref Container</Container>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it('applies custom className', () => {
    render(<Container className="custom-class">Custom</Container>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });
});