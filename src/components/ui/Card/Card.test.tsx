import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getCssForElement } from '@/test-utils/css';
import { Card } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    render(<Card variant="default">Default</Card>);
    expect(getCssForElement(screen.getByText('Default'))).toContain(
      'border: 1px solid var(--color-border)'
    );

    render(<Card variant="elevated">Elevated</Card>);
    const elevatedCss = getCssForElement(screen.getByText('Elevated'));
    expect(elevatedCss).toContain('box-shadow: var(--shadow-sm)');
    expect(elevatedCss).not.toContain('border: 1px solid var(--color-border)');
  });

  it('applies padding styles', () => {
    render(<Card padding="sm">Small Padding</Card>);
    expect(getCssForElement(screen.getByText('Small Padding'))).toContain(
      'padding: var(--space-3)'
    );

    render(<Card padding="lg">Large Padding</Card>);
    expect(getCssForElement(screen.getByText('Large Padding'))).toContain(
      'padding: var(--space-6)'
    );
  });

  it('adds a border when hoverable', () => {
    render(<Card hoverable>Hoverable</Card>);
    const hoverableCss = getCssForElement(screen.getByText('Hoverable'));
    expect(hoverableCss).toContain('border: 1px solid var(--color-border)');
    expect(hoverableCss).toContain('transform: translateY(-2px)');
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Custom</Card>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Ref Card</Card>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});