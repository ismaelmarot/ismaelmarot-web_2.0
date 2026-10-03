import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getCssForElement } from '@/test-utils/css';
import { IndexPage } from './Index';

describe('IndexPage', () => {
  it('renders hero section with name and title', () => {
    render(
      <MemoryRouter>
        <IndexPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Ismael Marot')).toBeInTheDocument();
    expect(screen.getByText('Web Developer')).toBeInTheDocument();
  });

  it('renders all section summaries', () => {
    render(
      <MemoryRouter>
        <IndexPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Sobre mí')).toBeInTheDocument();
    expect(screen.getByText('Proyectos')).toBeInTheDocument();
    expect(screen.getByText('Tecnologías')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  // The order is deliberate: the work, then the tools, then the person, then how to reach them.
  // Asserting presence alone would let it be reordered back without anything failing.
  it('orders the sections hero, projects, technologies, about, contact', () => {
    render(
      <MemoryRouter>
        <IndexPage />
      </MemoryRouter>
    );

    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Proyectos',
      'Tecnologías',
      'Sobre mí',
      'Contacto',
    ]);
  });

  // Reordering the blocks without reassigning their backgrounds left two muted bands in a row,
  // which reads as a mistake rather than a rhythm. The Hero is already default, so the bands
  // must alternate from there for the whole page.
  it('alternates the background band from one section to the next', () => {
    render(
      <MemoryRouter>
        <IndexPage />
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
        <IndexPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Conocé más')).toBeInTheDocument();
    expect(screen.getByText('Ver proyectos')).toBeInTheDocument();
    expect(screen.getByText('Ver tecnologías')).toBeInTheDocument();
    // "Contactar" labels both the hero CTA and the contact summary CTA
    expect(screen.getAllByText('Contactar')).toHaveLength(2);
  });
});
