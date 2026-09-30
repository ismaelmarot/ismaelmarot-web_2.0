import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
  it('renders skip links for each target', () => {
    render(<SkipLink targets={['hero', 'about', 'projects']} />);
    expect(screen.getByRole('link', { name: /skip to hero/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /skip to about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /skip to projects/i })).toBeInTheDocument();
  });

  it('applies skip link styles', () => {
    const { container } = render(<SkipLink targets={['main']} />);
    expect(container.firstChild).toHaveClass('skipLink');
  });

  it('scrolls to section on click', () => {
    const scrollToSection = vi.fn();
    vi.spyOn(require('./useSkipLink'), 'useSkipLink').mockReturnValue({ scrollToSection });
    
    render(<SkipLink targets={['main']} />);
    fireEvent.click(screen.getByRole('link', { name: /skip to main/i }));
    expect(scrollToSection).toHaveBeenCalledWith('main');
  });

  it('prevents default link behavior', () => {
    const preventDefault = vi.fn();
    render(<SkipLink targets={['main']} />);
    fireEvent.click(screen.getByRole('link', { name: /skip to main/i }), { preventDefault });
    expect(preventDefault).toHaveBeenCalled();
  });

  it('forwards ref to first link', () => {
    const ref = vi.fn();
    render(<SkipLink targets={['main', 'about']} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLAnchorElement));
  });
});