import { render, screen } from '@testing-library/react';
import { getTechnologyIconPath } from '@/data/technologies';
import { TechnologyCard } from './TechnologyCard';

const mockTechnology = {
  id: 'typescript',
  name: 'TypeScript',
  category: 'language' as const,
  proficiency: 'expert' as const,
  yearsExperience: 4,
  iconName: 'typescript',
};

/**
 * The mark is decorative and therefore absent from the accessibility tree, which leaves no role
 * or label to query it by. The testid carries the slug that resolved, so a test can tell a drawn
 * mark from an unresolved one without reaching into `container` for a raw `svg`, which is what
 * the testing-library lint rules exist to prevent.
 */
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

  it('draws the brand mark for a known slug', () => {
    render(
      <TechnologyCard technology={{ ...mockTechnology, iconSlug: 'typescript' }} index={0} />
    );

    expect(screen.getByTestId('brand-mark-typescript')).toBeInTheDocument();
    // Resolving the slug is what proves the path exists, independent of the markup.
    expect(getTechnologyIconPath('typescript')).toBeTruthy();
  });

  it('hides the mark from assistive technology', () => {
    render(
      <TechnologyCard technology={{ ...mockTechnology, iconSlug: 'typescript' }} index={0} />
    );

    // The name is already the accessible text. Announcing the mark too would make a screen
    // reader read "TypeScript TypeScript", once per chip, across a row of twenty-three.
    expect(screen.getByTestId('brand-mark-typescript')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  // A typo in a data file should cost one icon, not the whole section.
  it('still renders the name when the slug is unknown', () => {
    render(
      <TechnologyCard technology={{ ...mockTechnology, iconSlug: 'no-existe' }} index={0} />
    );

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.queryByTestId('brand-mark-no-existe')).not.toBeInTheDocument();
  });

  it('still renders the name when there is no slug at all', () => {
    render(<TechnologyCard technology={mockTechnology} index={0} />);

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.queryByTestId('brand-mark-typescript')).not.toBeInTheDocument();
  });
});
