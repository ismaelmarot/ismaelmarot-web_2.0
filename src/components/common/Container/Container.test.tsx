import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from './Container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Container Content</Container>);
    expect(screen.getByText('Container Content')).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { container: sm } = render(<Container size="sm">Small</Container>);
    expect(sm.firstChild).toHaveClass('sm');

    const { container: full } = render(<Container size="full">Full</Container>);
    expect(full.firstChild).toHaveClass('full');
  });

  it('applies padding classes', () => {
    const { container: none } = render(<Container padding="none">No Padding</Container>);
    expect(none.firstChild).toHaveClass('none');

    const { container: lg } = render(<Container padding="lg">Large Padding</Container>);
    expect(lg.firstChild).toHaveClass('lg');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Container ref={ref}>Ref Container</Container>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it('applies custom className', () => {
    const { container } = render(<Container className="custom-class">Custom</Container>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});