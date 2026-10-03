import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
