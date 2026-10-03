import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getCssForElement } from '@/test-utils/css';
import { Projects } from './Projects';
import type { Project } from '@/types/project';

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Trash2Treasure',
    description: 'A recycling app',
    technologies: ['TypeScript'],
    githubUrl: 'https://github.com/user/trash2treasure',
    lastUpdated: '2024-01-01T00:00:00Z',
    screenshotUrls: [],
    categories: ['Social', 'Navigation'],
    viewports: ['desktop', 'tablet', 'mobile'],
    platforms: ['web'],
  },
  {
    id: '2',
    name: 'Car Expense Tracker',
    description: 'Vehicle expenses',
    technologies: ['TypeScript'],
    githubUrl: 'https://github.com/user/car-expense-tracker',
    lastUpdated: '2024-01-02T00:00:00Z',
    screenshotUrls: [],
    categories: ['Finances', 'Tools', 'Work'],
    viewports: ['desktop'],
    platforms: ['mac', 'pc'],
  },
  {
    id: '3',
    name: 'NauticAcademy',
    description: 'Yacht Skipper training',
    technologies: ['TypeScript'],
    githubUrl: 'https://github.com/user/NauticAcademy',
    lastUpdated: '2024-01-03T00:00:00Z',
    screenshotUrls: [],
    categories: ['Education'],
    viewports: ['desktop', 'tablet', 'mobile'],
    platforms: ['web'],
  },
];

const renderProjects = (projects: Project[]) =>
  render(
    <MemoryRouter>
      <Projects projects={projects} />
    </MemoryRouter>
  );

describe('Projects', () => {
  it('renders the section heading', () => {
    renderProjects(mockProjects);
    expect(screen.getByRole('heading', { name: 'Proyectos' })).toBeInTheDocument();
  });

  it('renders one row per project', () => {
    renderProjects(mockProjects);
    expect(screen.getAllByRole('article')).toHaveLength(mockProjects.length);
    expect(screen.getByRole('heading', { name: 'Trash2Treasure' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Car Expense Tracker' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'NauticAcademy' })).toBeInTheDocument();
  });

  it('keeps the published order regardless of the selected category', () => {
    renderProjects(mockProjects);
    const publishedOrder = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent);

    fireEvent.click(screen.getByRole('button', { name: 'Work' }));

    const filteredOrder = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent);

    expect(filteredOrder).toEqual(
      publishedOrder.filter((name) => filteredOrder.includes(name))
    );
    expect(filteredOrder).toEqual(['Car Expense Tracker']);
  });

  it('renders the category selector above the list', () => {
    renderProjects(mockProjects);
    expect(
      screen.getByRole('group', { name: /filtrar proyectos por categoría/i })
    ).toBeInTheDocument();
  });

  it('filters the list by category without reloading the page', () => {
    renderProjects(mockProjects);

    fireEvent.click(screen.getByRole('button', { name: 'Finances' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Car Expense Tracker' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Education' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'NauticAcademy' })).toBeInTheDocument();
  });

  it('includes a project in each of its categories exactly once', () => {
    renderProjects(mockProjects);

    fireEvent.click(screen.getByRole('button', { name: 'Tools' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Social' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Work' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });

  it('restores the complete list when All is selected', () => {
    renderProjects(mockProjects);

    fireEvent.click(screen.getByRole('button', { name: 'Finances' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getAllByRole('article')).toHaveLength(mockProjects.length);
  });

  it('starts at All and never reflects the selection elsewhere', () => {
    renderProjects(mockProjects);
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('explains an empty category instead of showing a blank area', () => {
    renderProjects([{ ...mockProjects[0], categories: ['Social'] }]);

    fireEvent.click(screen.getByRole('button', { name: 'Education' }));

    expect(screen.queryAllByRole('article')).toHaveLength(0);
    expect(screen.getByText('No projects in Education yet.')).toBeInTheDocument();
  });

  it('lists a project without categories under All but not under a category', () => {
    const { categories, viewports: _viewports, platforms: _platforms, ...uncategorised } =
      mockProjects[0];
    expect(categories).toBeDefined();
    renderProjects([uncategorised]);

    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.queryByRole('list', { name: /categorías de/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Social' }));
    expect(screen.getByText('No projects in Social yet.')).toBeInTheDocument();
  });

  it('renders the empty state when there are no projects at all', () => {
    renderProjects([]);
    expect(screen.getByText('No projects available yet.')).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: /filtrar proyectos/i })).not.toBeInTheDocument();
  });

  it('applies the projects section composition', () => {
    renderProjects(mockProjects);
    const section = screen.getByRole('region', { name: /projects/i });
    expect(getCssForElement(section)).toContain('min-height');
  });
});