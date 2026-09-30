import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container: defaultVariant } = render(<Card variant="default">Default</Card>);
    expect(defaultVariant.firstChild).toHaveClass('default');

    const { container: elevated } = render(<Card variant="elevated">Elevated</Card>);
    expect(elevated.firstChild).toHaveClass('elevated');
  });

  it('applies padding classes', () => {
    const { container: sm } = render(<Card padding="sm">Small Padding</Card>);
    expect(sm.firstChild).toHaveClass('sm');

    const { container: lg } = render(<Card padding="lg">Large Padding</Card>);
    expect(lg.firstChild).toHaveClass('lg');
  });

  it('applies interactive styles when hoverable', () => {
    const { container } = render(<Card hoverable>Hoverable</Card>);
    expect(container.firstChild).toHaveClass('interactive');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Custom</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Ref Card</Card>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});