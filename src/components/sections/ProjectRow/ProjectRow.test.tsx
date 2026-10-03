import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectRow } from './ProjectRow';
import { getCssForElement } from '@/test-utils/css';
import type { Project } from '@/types/project';

const mockProject: Project = {
  id: '1',
  name: 'Test Project',
  description: 'A test project description',
  technologies: ['React', 'TypeScript'],
  githubUrl: 'https://github.com/user/project',
  lastUpdated: '2024-01-01T00:00:00Z',
  demoUrl: 'https://demo.example.com',
  screenshotUrls: [],
  iconUrl: 'https://raw.githubusercontent.com/user/project/main/icon-192.png',
  projectType: 'web',
  categories: ['Social', 'Navigation'],
};

const renderRow = (project: Project = mockProject) =>
  render(
    <MemoryRouter>
      <ProjectRow project={project} />
    </MemoryRouter>
  );

describe('ProjectRow', () => {
  it('renders the project name', () => {
    renderRow(mockProject);
    expect(screen.getByRole('heading', { name: 'Test Project' })).toBeInTheDocument();
  });

  it('renders the app icon', () => {
    renderRow(mockProject);
    expect(screen.getByAltText('Test Project icon')).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/user/project/main/icon-192.png'
    );
  });

  it('keeps a fixed square icon slot and never crops the artwork', () => {
    renderRow(mockProject);
    const icon = screen.getByAltText('Test Project icon');
    expect(icon).toHaveStyle({ width: '48px', height: '48px', objectFit: 'contain' });
  });

  it('renders the icon fallback when iconUrl is missing', () => {
    const { iconUrl, ...projectWithoutIcon } = mockProject;
    expect(iconUrl).toBeDefined();
    renderRow(projectWithoutIcon);
    expect(screen.queryByAltText('Test Project icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('project-icon-fallback')).toBeInTheDocument();
  });

  it('renders the icon fallback when the icon fails to load', () => {
    renderRow(mockProject);
    fireEvent.error(screen.getByAltText('Test Project icon'));
    expect(screen.getByTestId('project-icon-fallback')).toBeInTheDocument();
    expect(screen.queryByAltText('Test Project icon')).not.toBeInTheDocument();
  });

  it('renders the project description', () => {
    renderRow(mockProject);
    expect(screen.getByText('A test project description')).toBeInTheDocument();
  });

  it('clamps a long description to three lines', () => {
    const longDescription = 'A very long description. '.repeat(20).trim();
    renderRow({ ...mockProject, description: longDescription });
    expect(screen.getByText(longDescription)).toHaveStyle({
      display: '-webkit-box',
      webkitLineClamp: '3',
    });
  });

  it('falls back to a default description when the project has none', () => {
    renderRow({ ...mockProject, description: '   ' });
    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

it('renders every category of the project', () => {
    renderRow(mockProject);
    expect(screen.getByText('Social')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('omits the category list when the project has no categories', () => {
    const { categories, ...projectWithoutCategories } = mockProject;
    expect(categories).toBeDefined();
    renderRow(projectWithoutCategories);
    expect(screen.queryByText('Social')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Test Project' })).toBeInTheDocument();
  });

  it('exposes a single action that opens the project page', () => {
    renderRow(mockProject);
    const action = screen.getByTestId('project-view-action');
    expect(action).toHaveAttribute('href', '/projects/1');
    expect(action).not.toHaveAttribute('target');
    expect(screen.getByText('Ver proyecto')).toBeInTheDocument();
  });

  it('does not render a featured or enlarged layout', () => {
    renderRow(mockProject);
    const rowCss = getCssForElement(screen.getByRole('article'));
    expect(rowCss).not.toContain('grid-column: span 2');
    expect(rowCss).not.toContain('grid-row: span 2');
  });

  it('exposes the row as an article with an accessible name', () => {
    renderRow(mockProject);
    expect(
      screen.getByRole('article', { name: /Test Project - A test project description/ })
    ).toBeInTheDocument();
  });
});