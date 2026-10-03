import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Badge Text</Badge>);
    expect(screen.getByText('Badge Text')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default')).toHaveStyle({
      backgroundColor: 'var(--color-bg-muted)',
    });

    render(<Badge variant="tech">Tech</Badge>);
    expect(screen.getByText('Tech')).toHaveStyle({
      backgroundColor: 'var(--color-accent-light)',
    });
  });

  it('applies size styles', () => {
    render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toHaveStyle({ fontSize: 'var(--text-label)' });
  });

  it('renders dot when dotColor is provided', () => {
    render(<Badge dotColor="#ff0000">With Dot</Badge>);
    const dotElement = screen.getByTestId('badge-dot');
    expect(dotElement).toBeInTheDocument();
    expect(screen.getByText('With Dot')).toHaveStyle({
      '--badge-dot-color': '#ff0000',
    });
  });

  it('does not render dot when dotColor is not provided', () => {
    render(<Badge>No Dot</Badge>);
    expect(screen.queryByTestId('badge-dot')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Badge ref={ref}>Ref Badge</Badge>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
  });
});