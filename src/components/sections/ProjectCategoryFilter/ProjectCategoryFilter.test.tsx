import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCategoryFilter } from './ProjectCategoryFilter';
import { getCssForElement } from '@/test-utils/css';
import { ALL_PROJECTS, type ProjectCategoryFilterValue } from '@/types/project';

const categories = ['Social', 'Navigation', 'Finances', 'Tools', 'Work', 'Education'];

describe('ProjectCategoryFilter', () => {
  it('renders an option per category plus All', () => {
    render(<ProjectCategoryFilter activeCategory={ALL_PROJECTS} onSelect={vi.fn()} />);
    categories.forEach((category) => {
      expect(screen.getByRole('button', { name: category })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(categories.length + 1);
  });

  it('presents the labels in English, with All first', () => {
    render(<ProjectCategoryFilter activeCategory={ALL_PROJECTS} onSelect={vi.fn()} />);
    const labels = screen.getAllByRole('button').map((button) => button.textContent);
    expect(labels).toEqual(['All', ...categories]);
  });

  it('marks the active option as pressed for assistive technologies', () => {
    render(<ProjectCategoryFilter activeCategory="Tools" onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Tools' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('marks All as active by default', () => {
    render(<ProjectCategoryFilter activeCategory={ALL_PROJECTS} onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('uses native buttons so the keyboard can reach and activate every option', () => {
    const onSelect = vi.fn();
    render(<ProjectCategoryFilter activeCategory={ALL_PROJECTS} onSelect={onSelect} />);

    const options = screen.getAllByRole('button');
    options.forEach((option) => {
      expect(option).toHaveAttribute('type', 'button');
      expect(option).not.toBeDisabled();
      // no negative tabindex, so the option stays in the natural tab order
      expect(option.getAttribute('tabindex')).toBeNull();
    });

    const first = options[0];
    first.focus();
    expect(first).toHaveFocus();

    fireEvent.click(first);
    expect(onSelect).toHaveBeenCalledWith(ALL_PROJECTS);

    fireEvent.click(screen.getByRole('button', { name: 'Education' }));
    expect(onSelect).toHaveBeenCalledWith('Education');
  });

  it('does not store All as a category of any project', () => {
    expect(categories).not.toContain('All');
    expect(ALL_PROJECTS).toBe('All');
  });
});

// Added by Amendment 1. None of the tests above assert styling, so they all still
// pass; these fix the new intent, which is that the options carry no border and no
// shadow, and that the browser's own default border can never come back.
describe('ProjectCategoryFilter visual states', () => {
  // "All" is itself the active option when the selection is All, so the inactive
  // examples below read Education instead, which is genuinely not selected.
  const renderFilter = (activeCategory: ProjectCategoryFilterValue = ALL_PROJECTS) =>
    render(<ProjectCategoryFilter activeCategory={activeCategory} onSelect={vi.fn()} />);

  // FR-026. This is the regression guard for the 2px outset: the declaration has to be
  // on the base, not inside a state branch, or a branch that sets only a colour brings
  // the user-agent default border straight back.
  it('declares no border on the base so the user-agent default cannot apply', () => {
    renderFilter();
    const css = getCssForElement(screen.getByRole('button', { name: 'All' }));
    expect(css).toContain('border: 0px');
    expect(css).not.toContain('border-width');
    expect(css).not.toContain('border-style');
    expect(css).not.toContain('border-color');
  });

  // FR-027 and FR-028.
  it('paints the active option with the accent fill and no border', () => {
    renderFilter('Tools');
    const css = getCssForElement(screen.getByRole('button', { name: 'Tools' }));
    expect(css).toContain('background-color: var(--color-accent)');
    expect(css).toContain('color: var(--color-white)');
  });

  // Exactly one border declaration across the whole rule set, the base one. If a state
  // branch ever sets only a colour again, this count goes to two and the user-agent
  // default comes back with it.
  it('leaves exactly one border declaration in either state', () => {
    renderFilter('Tools');
    // One render, both states, so the queries stay unambiguous.
    for (const name of ['Tools', 'Education']) {
      const css = getCssForElement(screen.getByRole('button', { name }));
      expect(css.match(/border:/g) ?? []).toHaveLength(1);
    }
  });

  // FR-027 and FR-029. Transparent rather than white, because white on the #F5F5F7
  // section measured 1.09:1 and had no silhouette to keep.
  it('leaves the inactive option transparent, with no border and no hover', () => {
    renderFilter();
    const css = getCssForElement(screen.getByRole('button', { name: 'Education' }));
    expect(css).toContain('background-color: transparent');
    expect(css).toContain('color: var(--color-text-secondary)');
    expect(css).not.toContain(':hover');
  });

  // Every box-shadow in the rule set belongs to a focus indicator. A shadow that is not
  // focus-scoped is exactly what the request asked to remove.
  it('confines every box shadow to the focus indicator', () => {
    renderFilter('Tools');
    for (const name of ['All', 'Tools', 'Education']) {
      const css = getCssForElement(screen.getByRole('button', { name }));
      const rules = css.split(/\n(?=[.@])/);
      const shadowRules = rules.filter((rule) => rule.includes('box-shadow'));
      expect(shadowRules.length).toBeGreaterThan(0);
      expect(shadowRules.every((rule) => rule.includes(':focus-visible'))).toBe(true);
    }
  });

  // FR-030. The shared focus token is the accent, which is also the active fill, so
  // the indicator used to sit against its own background at 1:1.
  it('gives the active option a focus ring that contrasts with its own fill', () => {
    renderFilter('Tools');
    const css = getCssForElement(screen.getByRole('button', { name: 'Tools' }));
    expect(css).toContain('0 0 0 3px var(--color-fg)');
    expect(css).not.toContain('0 0 0 3px var(--shadow-focus)');
  });

  it('keeps the shared focus token on an inactive option', () => {
    renderFilter();
    const css = getCssForElement(screen.getByRole('button', { name: 'Education' }));
    expect(css).toContain('box-shadow: var(--shadow-focus)');
  });
});