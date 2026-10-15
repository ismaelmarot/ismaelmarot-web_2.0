import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { readFileSync, readdirSync } from 'node:fs';
import { Navigation } from './Navigation';
import { getCssForElement } from '@/test-utils/css';

const mockItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'GitHub', href: 'https://github.com', external: true },
];

describe('Navigation', () => {
  it('renders navigation items', () => {
    render(
      <MemoryRouter>
        <Navigation items={mockItems} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
  });

  it('applies variant aria-labels', () => {
    render(
      <MemoryRouter>
        <Navigation items={mockItems} variant="header" />
      </MemoryRouter>
    );
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();

    render(
      <MemoryRouter>
        <Navigation items={mockItems} variant="mobile" />
      </MemoryRouter>
    );
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument();
  });

  it('opens external links in new tab', () => {
    render(
      <MemoryRouter>
        <Navigation items={mockItems} />
      </MemoryRouter>
    );
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('calls onNavigate handler', () => {
    const handleNavigate = vi.fn();
    render(
      <MemoryRouter>
        <Navigation items={mockItems} onNavigate={handleNavigate} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('link', { name: /about/i }));
    expect(handleNavigate).toHaveBeenCalled();
  });

  it('scrolls to top when clicking the link of the current route', () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;

    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation items={mockItems} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('link', { name: /home/i }));

    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('does not scroll on click when navigating to a different route', () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;

    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation items={mockItems} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('link', { name: /projects/i }));

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('does not scroll on click for external links', () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;

    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation items={mockItems} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('link', { name: /github/i }));

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <MemoryRouter>
        <Navigation items={mockItems} ref={ref} />
      </MemoryRouter>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });

  it('applies custom className', () => {
    render(
      <MemoryRouter>
        <Navigation items={mockItems} className="custom-class" />
      </MemoryRouter>
    );
    expect(screen.getByRole('navigation')).toHaveClass('custom-class');
  });

  describe('current section', () => {
    const currentOf = (label: RegExp) =>
      screen.getByRole('link', { name: label }).getAttribute('aria-current');

    it('marks only the item of the current route as current', () => {
      render(
        <MemoryRouter initialEntries={['/about']}>
          <Navigation items={mockItems} />
        </MemoryRouter>
      );
      expect(currentOf(/about/i)).toBe('page');
      expect(currentOf(/projects/i)).toBeNull();
      expect(currentOf(/github/i)).toBeNull();
    });

    it('marks the home item as current on the home route', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Navigation items={mockItems} />
        </MemoryRouter>
      );
      expect(currentOf(/home/i)).toBe('page');
      expect(currentOf(/about/i)).toBeNull();
    });

    it('does not mark home as current on a different route', () => {
      render(
        <MemoryRouter initialEntries={['/about']}>
          <Navigation items={mockItems} />
        </MemoryRouter>
      );
      expect(currentOf(/home/i)).toBeNull();
    });

    it('marks the section as current on a nested route of that section', () => {
      render(
        <MemoryRouter initialEntries={['/projects/car-expense-tracker']}>
          <Navigation items={mockItems} />
        </MemoryRouter>
      );
      expect(currentOf(/projects/i)).toBe('page');
      expect(currentOf(/home/i)).toBeNull();
    });

    it('does not treat a sibling route with a shared prefix as current', () => {
      const items = [
        { label: 'Blog', href: '/blog' },
        { label: 'Blogging', href: '/blogging' },
      ];
      render(
        <MemoryRouter initialEntries={['/blogging']}>
          <Navigation items={items} />
        </MemoryRouter>
      );
      expect(currentOf(/^blogging$/i)).toBe('page');
      expect(currentOf(/^blog$/i)).toBeNull();
    });

    it('only marks the current item with the class the accent rule targets', () => {
      render(
        <MemoryRouter initialEntries={['/about']}>
          <Navigation items={mockItems} />
        </MemoryRouter>
      );
      const about = screen.getByRole('link', { name: /about/i });
      const projects = screen.getByRole('link', { name: /projects/i });
      expect(about).toHaveClass('active');
      expect(projects).not.toHaveClass('active');
      // jsdom keeps var() unresolved, so only the hook is assertable here. The resolved
      // colour is covered by the browser check in specs/006-project-detail/tasks.md.
      expect(window.getComputedStyle(about).color).toBe('var(--color-accent-text)');
      expect(window.getComputedStyle(projects).color).not.toBe('var(--color-accent-text)');
    });
  });

  // specs/022
  describe('hover', () => {
    const renderNav = () =>
      render(
        <MemoryRouter>
          <Navigation items={mockItems} />
        </MemoryRouter>
      );

    it('turns the accent and adds no underline', () => {
      renderNav();
      const css = getCssForElement(screen.getByRole('link', { name: /about/i }));
      expect(css).toContain(':hover');
      expect(css).toContain('color: var(--color-accent)');
      // The underline is gone entirely rather than being switched off. A variable that resolved to its
      // own default in every theme would be a variable with no reason to exist.
      expect(css).not.toContain('link-hover-decoration');
      expect(css).not.toContain('underline');
    });

    it('leaves nothing in the source that can turn a hovered link into an underlined one', () => {
      // SC-007. The variable is gone from this component's hover, but it could still be reintroduced as
      // a header override. Scanned across all of src rather than this one file, because the point is
      // that no theme can bring the underline back by declaring it.
      const offenders: string[] = [];
      const walk = (dir: string) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const full = `${dir}/${entry.name}`;
          if (entry.isDirectory()) walk(full);
          else if (/\.(ts|tsx|css)$/.test(entry.name) && !/\.test\./.test(entry.name) && readFileSync(full, 'utf-8').includes('--link-hover-decoration')) {
            offenders.push(full.replace(`${process.cwd()}/`, ''));
          }
        }
      };
      walk(`${process.cwd()}/src`);
      expect(offenders).toEqual([]);
    });

    it('reads one token, so the dark theme can reach it without this component knowing', () => {
      renderNav();
      const css = getCssForElement(screen.getByRole('link', { name: /about/i }));
      // --color-accent and not a literal: the header's dark theme overrides that token. A hex value
      // here would be immune to it and would land 4.47:1 on black.
      expect(css).toContain('var(--color-accent)');
      expect(css).not.toMatch(/color:\s*#0-9a-f]{3,8}\s*;/i);
    });

    it('gives the resting link the same treatment it had before', () => {
      renderNav();
      const css = getCssForElement(screen.getByRole('link', { name: /about/i }));
      expect(css).toContain('color: var(--color-text-secondary)');
      expect(css).toContain('text-decoration: none');
    });
  });
});
