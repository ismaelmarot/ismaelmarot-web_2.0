import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders known icons', () => {
    render(<Icon name="github" />);
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
  });

  it('renders different sizes', () => {
    const { container: sm } = render(<Icon name="github" size="sm" />);
    expect(sm.firstChild).toHaveClass('sm');

    const { container: lg } = render(<Icon name="github" size="lg" />);
    expect(lg.firstChild).toHaveClass('lg');
  });

  it('handles custom pixel size', () => {
    const { container } = render(<Icon name="github" size={32} />);
    expect(container.firstChild).toHaveStyle({ width: '32px', height: '32px' });
  });

  it('handles decorative icons (aria-hidden)', () => {
    render(<Icon name="github" decorative />);
    expect(screen.getByTestId('github-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('handles non-decorative icons with aria-label', () => {
    render(<Icon name="github" decorative={false} aria-label="GitHub" />);
    expect(screen.getByRole('img', { name: /github/i })).toBeInTheDocument();
  });

  it('warns for unknown icons', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // @ts-expect-error - testing unknown icon name
    render(<Icon name="unknown" />);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Icon "unknown" not found'));
    consoleSpy.mockRestore();
  });

  it('applies custom className', () => {
    const { container } = render(<Icon name="github" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Icon name="github" ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
  });
});