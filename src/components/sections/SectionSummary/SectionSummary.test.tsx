import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SectionSummary } from './SectionSummary';

/**
 * `SectionSummary` is the shared band that the landing page's four sections and its marquee all go
 * through. `specs/011` FR-012 and `specs/016` FR-007 both rest on it accepting a `featuredItems` slot
 * without needing a change, and it had no test of its own — so the slot those two features depend on was
 * unguarded.
 */
describe('SectionSummary', () => {
  const props = {
    id: 'projects',
    title: 'Proyectos',
    description: 'Una selección de lo que he construido.',
    ctaLabel: 'Ver proyectos',
    ctaHref: '/projects',
  };

  it('renders its title as a section heading', () => {
    render(
      <MemoryRouter>
        <SectionSummary {...props} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Proyectos' })).toBeInTheDocument();
  });

  it('renders its description', () => {
    render(
      <MemoryRouter>
        <SectionSummary {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText('Una selección de lo que he construido.')).toBeInTheDocument();
  });

  it('points its call to action at the route it was given', () => {
    render(
      <MemoryRouter>
        <SectionSummary {...props} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Ver proyectos' })).toHaveAttribute(
      'href',
      '/projects'
    );
  });

  it('carries the id it was given, which is what the nav scrolls to', () => {
    render(
      <MemoryRouter>
        <SectionSummary {...props} />
      </MemoryRouter>
    );

    // The nav scrolls to `#projects`, so the band must answer to it. Its accessible name is its title,
    // which is how it is reachable and how this test finds it without reaching into the DOM.
    expect(screen.getByRole('region', { name: 'Proyectos' })).toHaveAttribute('id', 'projects');
  });

  it('renders nothing in the featured slot when none is passed', () => {
    render(
      <MemoryRouter>
        <SectionSummary {...props} />
      </MemoryRouter>
    );

    // The empty state has to hold: specs/011 FR-014 requires the icon strip to render nothing for an
    // empty project list rather than an empty frame, and the slot itself must not leave a gap.
    expect(screen.getByRole('link', { name: 'Ver proyectos' })).toBeInTheDocument();
  });

  it('renders the featured slot when one is passed, unchanged', () => {
    render(
      <MemoryRouter>
        <SectionSummary {...props} featuredItems={<p>contenido destacado</p>} />
      </MemoryRouter>
    );

    // This is the contract specs/011 FR-012 and specs/016 FR-007 both claim the slot satisfies: the
    // featured content renders inside the band without the band knowing what it is.
    expect(screen.getByText('contenido destacado')).toBeInTheDocument();
  });
});