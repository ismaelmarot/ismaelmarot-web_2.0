import { render, screen } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';

const mockProject = {
  id: '1',
  name: 'Test Project',
  description: 'A test project description that is long enough to test truncation',
  technologies: ['React', 'TypeScript', 'Node.js'],
  githubUrl: 'https://github.com/user/project',
  lastUpdated: '2024-01-01T00:00:00Z',
  demoUrl: 'https://demo.example.com',
  screenshotUrls: [],
};

describe('ProjectCard', () => {
  it('renders project name and description', () => {
    render(<ProjectCard project={mockProject} index={0} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project description')).toBeInTheDocument();
  });

  it('renders technology badges', () => {
    render(<ProjectCard project={mockProject} index={0} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('renders GitHub link', () => {
    render(<ProjectCard project={mockProject} index={0} />);
    expect(screen.getByRole('link', { name: /code/i })).toHaveAttribute('href', 'https://github.com/user/project');
  });

  it('renders demo link when provided', () => {
    render(<ProjectCard project={mockProject} index={0} />);
    expect(screen.getByRole('link', { name: /demo/i })).toHaveAttribute('href', 'https://demo.example.com');
  });

  it('renders skeleton when isSkeleton is true', () => {
    render(<ProjectCard project={mockProject} index={0} isSkeleton />);
    expect(screen.getByTestId('skeleton')).not.toBeInTheDocument(); // No test-id, just check no project name
    expect(screen.queryByText('Test Project')).not.toBeInTheDocument();
  });

  it('applies featured styling when isFeatured is true', () => {
    const { container } = render(<ProjectCard project={mockProject} index={0} isFeatured />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ gridColumn: 'span 2' });
  });
});