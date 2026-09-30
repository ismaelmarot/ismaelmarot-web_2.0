import { render, screen } from '@testing-library/react';
import { Projects } from './Projects';

const mockProjects = [
  {
    id: '1',
    name: 'Project One',
    description: 'A sample project',
    technologies: ['React', 'TypeScript'],
    githubUrl: 'https://github.com/user/project1',
    lastUpdated: '2024-01-01T00:00:00Z',
    screenshotUrls: [],
  },
  {
    id: '2',
    name: 'Project Two',
    description: 'Another project',
    technologies: ['Vue', 'JavaScript'],
    githubUrl: 'https://github.com/user/project2',
    lastUpdated: '2024-01-02T00:00:00Z',
    screenshotUrls: [],
  },
];

describe('Projects', () => {
  it('renders section heading', () => {
    render(<Projects projects={mockProjects} />);
    expect(screen.getByRole('heading', { name: 'Proyectos' })).toBeInTheDocument();
  });

  it('renders project cards', () => {
    render(<Projects projects={mockProjects} />);
    expect(screen.getByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('Project Two')).toBeInTheDocument();
  });

  it('renders empty state when no projects', () => {
    render(<Projects projects={[]} />);
    expect(screen.getByText('No projects available yet.')).toBeInTheDocument();
  });

  it('applies projects section composition', () => {
    render(<Projects projects={mockProjects} />);
    const section = screen.getByRole('region', { name: /projects/i });
    expect(section).toHaveAttribute('style', expect.stringContaining('min-height'));
  });
});