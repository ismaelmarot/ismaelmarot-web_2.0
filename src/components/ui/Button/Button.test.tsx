import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container: primary } = render(<Button variant="primary">Primary</Button>);
    expect(primary.firstChild).toHaveClass('primary');

    const { container: secondary } = render(<Button variant="secondary">Secondary</Button>);
    expect(secondary.firstChild).toHaveClass('secondary');
  });

  it('applies size classes', () => {
    const { container: sm } = render(<Button size="sm">Small</Button>);
    expect(sm.firstChild).toHaveClass('sm');

    const { container: lg } = render(<Button size="lg">Large</Button>);
    expect(lg.firstChild).toHaveClass('lg');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
    expect(screen.getByRole('button')).toContainHTML('svg');
  });

  it('renders left and right icons', () => {
    const leftIcon = <span data-testid="left-icon">←</span>;
    const rightIcon = <span data-testid="right-icon">→</span>;
    render(<Button leftIcon={leftIcon} rightIcon={rightIcon}>With Icons</Button>);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('calls onClick handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', () => {
    const handleClick = vi.fn();
    render(<Button isLoading onClick={handleClick}>Loading</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies fullWidth class when prop is true', () => {
    const { container } = render(<Button fullWidth>Full Width</Button>);
    expect(container.firstChild).toHaveClass('fullWidth');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });
});