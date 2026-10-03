import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCategoryFilter } from './ProjectCategoryFilter';
import { ALL_PROJECTS } from '@/types/project';

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