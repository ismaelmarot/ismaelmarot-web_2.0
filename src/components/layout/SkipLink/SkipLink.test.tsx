import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { getCssForElement } from '@/test-utils/css';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
  it('renders skip links for each target', () => {
    render(<SkipLink targets={['hero', 'about', 'projects']} />);
    expect(screen.getByRole('link', { name: /skip to hero/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /skip to about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /skip to projects/i })).toBeInTheDocument();
  });

  it('applies skip link styles', () => {
    render(<SkipLink targets={['main']} />);
    const css = getCssForElement(screen.getByRole('link', { name: /skip to main/i }));
    expect(css).toContain('background-color: var(--color-accent)');
    expect(css).toContain('top: -100%');
  });

  it('scrolls to section on click', () => {
    const target = document.createElement('div');
    target.id = 'main';
    const scrollIntoView = vi.fn();
    const focus = vi.fn();
    target.scrollIntoView = scrollIntoView;
    target.focus = focus;
    document.body.appendChild(target);

    render(<SkipLink targets={['main']} />);
    fireEvent.click(screen.getByRole('link', { name: /skip to main/i }));

    expect(focus).toHaveBeenCalled();
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    target.remove();
  });

  it('prevents default link behavior', () => {
    render(<SkipLink targets={['main']} />);
    const link = screen.getByRole('link', { name: /skip to main/i });
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    link.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('forwards ref to first link', () => {
    const ref = vi.fn();
    render(<SkipLink targets={['main', 'about']} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLAnchorElement));
  });
});