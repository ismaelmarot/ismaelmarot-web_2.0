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

// Added by Amendment 1 and revised by Amendment 2. None of the tests above assert
// styling, so they all still pass. The guards that survive both amendments are kept:
// no border, no fill, no shadow outside the focus indicator. What Amendment 2 changed
// is that the active option is now marked by text colour alone, and that hover exists
// and touches colour only.
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

  // FR-031. Supersedes Amendment 1's FR-028, which had the active option filled with
  // --color-accent and white text. That measured 4.70:1, but as a fill it was the only
  // thing keeping the option visible; without it the colour has to carry the state as
  // text, and #0071E3 at 12px on #F5F5F7 is 4.31:1, which fails AA. Hence accent-text.
  it('marks the active option with the accent text colour and no fill', () => {
    renderFilter('Tools');
    const css = getCssForElement(screen.getByRole('button', { name: 'Tools' }));
    expect(css).toContain('color: var(--color-accent-text)');
    expect(css).not.toContain('background-color: var(--color-accent)');
    expect(css).not.toContain('var(--color-white)');
  });

  // FR-031 and FR-027: neither state may declare a fill, or the reference look is lost.
  it('gives neither state a background', () => {
    renderFilter('Tools');
    for (const name of ['Tools', 'Education']) {
      const css = getCssForElement(screen.getByRole('button', { name }));
      expect(css).toContain('background-color: transparent');
      expect(css).not.toMatch(/background-color: var\(/);
    }
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

  // FR-032. The reference's inactive colour, measured from the live header.
  it('leaves the inactive option in the navigation secondary colour', () => {
    renderFilter();
    const css = getCssForElement(screen.getByRole('button', { name: 'Education' }));
    expect(css).toContain('color: var(--color-text-secondary)');
    expect(css).toContain('font-size: var(--text-label)');
    expect(css).toContain('font-weight: var(--font-weight-medium)');
  });

  // FR-033. Amendment 1 removed the hover; Amendment 2 brings it back because the
  // reference has one and it only touches colour.
  it('darkens on hover without adding a border, a shadow or a fill', () => {
    renderFilter();
    const css = getCssForElement(screen.getByRole('button', { name: 'Education' }));
    const hoverRules = css.split(/\n(?=\.)/).filter((rule) => rule.includes(':hover'));
    expect(hoverRules).toHaveLength(1);
    expect(hoverRules[0]).toContain('color: var(--color-text-primary)');
    expect(hoverRules[0]).not.toContain('border');
    expect(hoverRules[0]).not.toContain('box-shadow');
    expect(hoverRules[0]).not.toContain('background');
  });

  it('darkens the active option on hover too, like the navigation does', () => {
    renderFilter('Tools');
    const css = getCssForElement(screen.getByRole('button', { name: 'Tools' }));
    expect(css).toContain('color: var(--color-accent-text-hover)');
  });

  // FR-034. The navigation's links are 18px tall; a filter of seven options is not.
  it('keeps a 44px hit area', () => {
    renderFilter();
    const css = getCssForElement(screen.getByRole('button', { name: 'Education' }));
    expect(css).toContain('height: 44px');
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

  // FR-030 superseded. Amendment 1 gave the active option a dark ring because the fill
  // was the same blue as the shared token, which made the indicator 1:1 against its own
  // background. With no fill there is nothing to contrast against, so both states share
  // the token again: 4.31:1 against this section, over the 3:1 a non-text indicator needs.
  it('gives both states the shared focus ring', () => {
    renderFilter('Tools');
    for (const name of ['Tools', 'Education']) {
      const css = getCssForElement(screen.getByRole('button', { name }));
      expect(css).toContain('box-shadow: var(--shadow-focus)');
      expect(css).not.toContain('var(--color-fg)');
    }
  });
});