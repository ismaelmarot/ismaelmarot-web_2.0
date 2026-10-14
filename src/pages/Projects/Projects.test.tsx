import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectsPage } from './Projects';
import projectsData from '@/data/projects.json';
import { sortProjectsByDisplayOrder } from '@/types/project';
import { formatProjectName } from '@/utils/helpers';
import type { Project } from '@/types/project';

// The row shows the written name, not the repository name: specs/015 FR-001 turns a hyphen into words.
// Reading projects.json's `name` here would have passed against a helper that did not exist.
const published = sortProjectsByDisplayOrder(projectsData as Project[]).map((project) =>
  formatProjectName(project.name)
);

/**
 * The projects page does two things worth pinning: it hands the section a list sorted by the owner's
 * published display order, and it attaches the curated editorial metadata. Both are derived at page
 * level rather than in the section, which is why the page needs its own test — the section's tests all
 * pass a fixture and would not catch either being dropped here.
 */
describe('ProjectsPage', () => {
  it('renders a heading for the section', () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Proyectos' })).toBeInTheDocument();
  });

  it('renders one row per published project', () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    // Each row's name is a level-3 heading, which is what a screen reader navigates by and what makes
    // "one row per project" countable without reaching into the DOM for the card elements.
    const names = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);

    expect(names).toHaveLength(published.length);
    published.forEach((name) => {
      expect(names).toContain(name);
    });
  });

  it('renders the rows in the published order, not the data order', () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    // getAllByRole returns document order, so comparing the whole sequence is the assertion. This is
    // the one thing the page does that the section cannot: it sorts, and specs/005 FR-004 requires the
    // published order to survive the filter. A set comparison would have passed either way.
    const names = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);

    expect(names).toEqual(published);
  });

  it('renders the category filter, which the curated metadata feeds', () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    // The filter only exists when the projects carry categories, so its presence is the evidence that
    // withEditorialMetadata ran at page level rather than being left to the section's default.
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
  });
});