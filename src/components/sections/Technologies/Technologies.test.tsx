import { render, screen } from '@testing-library/react';
import { getCssForElement } from '@/test-utils/css';
import { Technologies } from './Technologies';
import type { ProficiencyLevel } from '@/types/project';

const mockTechnologies = [
  { id: 'ts', name: 'TypeScript', category: 'language' as const, proficiency: 'expert' as ProficiencyLevel, yearsExperience: 4, iconName: 'typescript' },
  { id: 'react', name: 'React', category: 'framework' as const, proficiency: 'expert' as ProficiencyLevel, yearsExperience: 3, iconName: 'react' },
  { id: 'node', name: 'Node.js', category: 'tool' as const, proficiency: 'advanced' as ProficiencyLevel, yearsExperience: 3, iconName: 'node' },
  { id: 'postgres', name: 'PostgreSQL', category: 'database' as const, proficiency: 'advanced' as ProficiencyLevel, yearsExperience: 2, iconName: 'postgres' },
];

describe('Technologies', () => {
  it('renders section heading', () => {
    render(<Technologies technologies={mockTechnologies} />);
    expect(screen.getByRole('heading', { name: 'Tecnologías' })).toBeInTheDocument();
  });

  it('renders technology categories', () => {
    render(<Technologies technologies={mockTechnologies} />);
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Frameworks')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
    expect(screen.getByText('Databases')).toBeInTheDocument();
  });

  it('renders technology cards', () => {
    render(<Technologies technologies={mockTechnologies} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
  });

  it('renders empty when no technologies', () => {
    render(<Technologies technologies={[]} />);
    expect(screen.queryByText('Languages')).not.toBeInTheDocument();
  });

  it('applies technologies section composition', () => {
    render(<Technologies technologies={mockTechnologies} />);
    const section = screen.getByRole('region', { name: /technologies/i });
    expect(getCssForElement(section)).toContain('min-height');
  });
});