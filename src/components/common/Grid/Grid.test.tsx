import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Grid } from './Grid';

describe('Grid', () => {
  it('renders children', () => {
    render(<Grid><span>Grid Item</span></Grid>);
    expect(screen.getByText('Grid Item')).toBeInTheDocument();
  });

  it('applies column classes for number', () => {
    const { container: twoCols } = render(<Grid columns={2}>Two Columns</Grid>);
    expect(twoCols.firstChild).toHaveClass('2');

    const { container: fourCols } = render(<Grid columns={4}>Four Columns</Grid>);
    expect(fourCols.firstChild).toHaveClass('4');
  });

  it('applies responsive columns for object', () => {
    const { container } = render(<Grid columns={{ base: 1, md: 2, lg: 3, xl: 4 }}>Responsive</Grid>);
    expect(container.firstChild).toHaveStyle({ '--grid-cols-md': 'repeat(2, 1fr)' });
  });

  it('applies gap classes', () => {
    const { container: sm } = render(<Grid gap="sm">Small Gap</Grid>);
    expect(sm.firstChild).toHaveClass('sm');

    const { container: lg } = render(<Grid gap="lg">Large Gap</Grid>);
    expect(lg.firstChild).toHaveClass('lg');
  });

  it('applies alignItems classes', () => {
    const { container: center } = render(<Grid alignItems="center">Center</Grid>);
    expect(center.firstChild).toHaveClass('center');
  });

  it('applies justifyContent classes', () => {
    const { container: between } = render(<Grid justifyContent="between">Between</Grid>);
    expect(between.firstChild).toHaveClass('between');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Grid ref={ref}>Ref Grid</Grid>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it('applies custom className', () => {
    const { container } = render(<Grid className="custom-class">Custom</Grid>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});