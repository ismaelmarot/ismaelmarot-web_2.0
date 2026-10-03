import { render, screen } from '@testing-library/react';
import { TechnologyCard } from './TechnologyCard';

const mockTechnology = {
  id: 'typescript',
  name: 'TypeScript',
  category: 'language' as const,
  proficiency: 'expert' as const,
  yearsExperience: 4,
  iconName: 'typescript',
};

describe('TechnologyCard', () => {
  it('renders technology name', () => {
    render(<TechnologyCard technology={mockTechnology} index={0} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('does not render meta when not provided', () => {
    render(<TechnologyCard technology={{ ...mockTechnology, proficiency: undefined, yearsExperience: undefined }} index={0} />);
    expect(screen.queryByText('expert')).not.toBeInTheDocument();
    expect(screen.queryByText('4 yrs')).not.toBeInTheDocument();
  });
});