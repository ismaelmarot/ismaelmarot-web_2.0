import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders children but hides them visually', () => {
    render(<VisuallyHidden>Hidden content</VisuallyHidden>);
    const element = screen.getByText('Hidden content');
    expect(element).toBeInTheDocument();
    expect(element).toHaveStyle({
      position: 'absolute',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    });
  });

  it('renders as span by default', () => {
    const { container } = render(<VisuallyHidden>Span</VisuallyHidden>);
    expect((container.firstChild as HTMLElement)?.tagName).toBe('SPAN');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<VisuallyHidden ref={ref}>Ref</VisuallyHidden>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
  });
});