import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TechnologiesPage } from './Technologies';
import { technologies } from '@/data/technologies';

/**
 * The technologies page is the thinnest of the seven: it imports the curated array and hands it to the
 * section. It had no test, which meant a change to that import was invisible until the page rendered
 * wrong in a browser. These tests pin the wiring, not the section, whose own tests cover its behaviour.
 */
describe('TechnologiesPage', () => {
  it('renders the technologies heading', () => {
    render(
      <MemoryRouter>
        <TechnologiesPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Tecnologías' })
    ).toBeInTheDocument();
  });

  it('renders the curated technologies the page passes', () => {
    render(
      <MemoryRouter>
        <TechnologiesPage />
      </MemoryRouter>
    );

    for (const technology of technologies.slice(0, 5)) {
      expect(screen.getByText(technology.name)).toBeInTheDocument();
    }
  });

  it('renders no marquee, because the marquee belongs to the landing page', () => {
    render(
      <MemoryRouter>
        <TechnologiesPage />
      </MemoryRouter>
    );

    // specs/016 placed the marquee on `/` and nowhere else, through the landing page's featuredItems
    // slot. This asserts the two pages did not converge.
    expect(
      screen.queryByRole('button', { name: /pausar el carrusel/i })
    ).not.toBeInTheDocument();
  });
});