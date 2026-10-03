import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getCssForElement } from '@/test-utils/css';
import { Grid } from './Grid';

describe('Grid', () => {
  it('renders children', () => {
    render(<Grid><span>Grid Item</span></Grid>);
    expect(screen.getByText('Grid Item')).toBeInTheDocument();
  });

  it('applies column styles for a number', () => {
    render(<Grid columns={2}>Two Columns</Grid>);
    expect(getCssForElement(screen.getByText('Two Columns'))).toContain(
      'grid-template-columns: repeat(2, 1fr)'
    );

    render(<Grid columns={4}>Four Columns</Grid>);
    expect(getCssForElement(screen.getByText('Four Columns'))).toContain(
      'grid-template-columns: repeat(4, 1fr)'
    );
  });

  it('applies responsive columns for object', () => {
    render(<Grid columns={{ base: 1, md: 2, lg: 3, xl: 4 }}>Responsive</Grid>);
    const css = getCssForElement(screen.getByText('Responsive'));
    expect(css).toContain('grid-template-columns: repeat(1, 1fr)');
    expect(css).toContain('grid-template-columns: repeat(2, 1fr)');
    expect(css).toContain('grid-template-columns: repeat(3, 1fr)');
    expect(css).toContain('grid-template-columns: repeat(4, 1fr)');
  });

  it('applies gap styles', () => {
    render(<Grid gap="sm">Small Gap</Grid>);
    expect(getCssForElement(screen.getByText('Small Gap'))).toContain('gap: var(--space-3)');

    render(<Grid gap="lg">Large Gap</Grid>);
    expect(getCssForElement(screen.getByText('Large Gap'))).toContain('gap: var(--space-8)');
  });

  it('applies alignItems styles', () => {
    render(<Grid alignItems="center">Center</Grid>);
    expect(getCssForElement(screen.getByText('Center'))).toContain('align-items: center');
  });

  it('applies justifyContent styles', () => {
    render(<Grid justifyContent="between">Between</Grid>);
    expect(getCssForElement(screen.getByText('Between'))).toContain(
      'justify-content: space-between'
    );

    render(<Grid justifyContent="around">Around</Grid>);
    expect(getCssForElement(screen.getByText('Around'))).toContain(
      'justify-content: space-around'
    );
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Grid ref={ref}>Ref Grid</Grid>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it('applies custom className', () => {
    render(<Grid className="custom-class">Custom</Grid>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });
});