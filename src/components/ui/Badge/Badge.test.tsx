import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Badge Text</Badge>);
    expect(screen.getByText('Badge Text')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container: defaultVariant } = render(<Badge variant="default">Default</Badge>);
    expect(defaultVariant.firstChild).toHaveClass('default');

    const { container: tech } = render(<Badge variant="tech">Tech</Badge>);
    expect(tech.firstChild).toHaveClass('tech');
  });

  it('applies size classes', () => {
    const { container: sm } = render(<Badge size="sm">Small</Badge>);
    expect(sm.firstChild).toHaveClass('sm');
  });

  it('renders dot when dotColor is provided', () => {
    render(<Badge dotColor="#ff0000">With Dot</Badge>);
    const dotElement = screen.getByTestId('badge-dot');
    expect(dotElement).toBeInTheDocument();
    expect(dotElement).toHaveStyle({ '--badge-dot-color': '#ff0000' });
  });

  it('does not render dot when dotColor is not provided', () => {
    render(<Badge>No Dot</Badge>);
    expect(screen.queryByTestId('badge-dot')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Badge ref={ref}>Ref Badge</Badge>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
  });
});