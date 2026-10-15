import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getCssForElement } from '@/test-utils/css';
import { HomePage } from './Home';

describe('HomePage', () => {
  it('renders hero section with name and title', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    /* Once, in the Hero. specs/020's band also closed with the name, which specs/021 removed at the
       maintainer's request, so this went from two back to one. getBy is right again and getAllBy
       would have been the thing to fix. */
    expect(screen.getByText('Ismael Marot')).toBeInTheDocument();
    expect(screen.getByText('Web Developer')).toBeInTheDocument();
  });

  it('renders all section summaries', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Sobre mí')).toBeInTheDocument();
    expect(screen.getByText('Proyectos')).toBeInTheDocument();
    expect(screen.getByText('Tecnologías')).toBeInTheDocument();

    /* The contact band asks its question rather than saying its category, so "Contacto" is now the
       section's accessible name and not text on the page. Asserted as the region, because that is
       where the name moved to and a band that lost it would take its name out of the outline. */
    expect(screen.getByRole('region', { name: 'Contacto' })).toBeInTheDocument();
  });

  // The order is deliberate: the work, then the tools, then the person, then how to reach them.
  // Asserting presence alone would let it be reordered back without anything failing.
  it('orders the sections hero, projects, technologies, about, contact', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    /* The last heading is now the question specs/020's band asks rather than the word "Contacto".
       The section still names itself "Contacto" through its accessible label, so nothing navigating
       by region lost its name; only the visible heading changed. The order is what this test is
       for and it is unchanged. */
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Proyectos',
      'Tecnologías',
      'Sobre mí',
      '¿Tienes un proyecto?',
    ]);
  });

  // Reordering the blocks without reassigning their backgrounds left two muted bands in a row,
  // which reads as a mistake rather than a rhythm. The Hero is already default, so the bands
  // must alternate from there for the whole page.
  it('alternates the background band from one section to the next', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const titles = ['Proyectos', 'Tecnologías', 'Sobre mí', 'Contacto'];
    // Asserted on the custom properties rather than the computed colour, because jsdom does
    // not resolve var() and the rule keeps the reference verbatim.
    const backgrounds = titles.map((title) => {
      const section = screen.getByRole('region', { name: title });
      return getCssForElement(section).match(/background-color:\s*(var\([^)]+\))/)?.[1];
    });

    expect(backgrounds).toEqual([
      'var(--color-bg-muted)',
      'var(--color-bg)',
      'var(--color-bg-muted)',
      'var(--color-bg)',
    ]);
  });

  it('renders CTA buttons with correct labels', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Conocé más')).toBeInTheDocument();
    expect(screen.getByText('Ver proyectos')).toBeInTheDocument();
    expect(screen.getByText('Ver tecnologías')).toBeInTheDocument();

    /* "Contactar" used to label two things: the Hero's own call to action and the closing band's
       pill. specs/020 replaced that pill with "ir →" and gave the band the address as its subject,
       so "Contactar" is now the Hero's alone — and the band's route to the same page is the link the
       Hero already had. Asserted once, because the count is what changed. */
    expect(screen.getAllByText('Contactar')).toHaveLength(1);
    expect(screen.getByText('ir')).toBeInTheDocument();
  });
});
