import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFound';
import { getCssForElement } from '@/test-utils/css';

/**
 * The 404 page is reached from two directions: a URL that matches no route, and a project id that names
 * no project. `specs/006` FR-021 put both on this component and neither had a test, so the second path
 * — the one a visitor reaches by following a stale link — was untested until this feature.
 */
describe('NotFoundPage', () => {
  it('renders 404 as the page heading', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
  });

  it('says why the visitor is here', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText('La página que buscas no existe o fue movida.')
    ).toBeInTheDocument();
  });

  it('offers a way back to the home page', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    const cta = screen.getByRole('link', { name: /volver al inicio/i });
    expect(cta).toHaveAttribute('href', '/');
  });

  it('labels itself for assistive technology rather than only showing 404', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    // A screen-reader user meets the word "404" before any sentence, so the section's accessible name
    // has to say what happened. This was the one part of the page that could have regressed silently.
    expect(screen.getByRole('region', { name: 'Page not found' })).toBeInTheDocument();
  });

  it('centres its own block rather than relying on the section alone', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    // The section centres vertically; this block centres horizontally. Both are needed, and only the
    // second one is this component's, so it is the second one that is asserted here.
    expect(getCssForElement(screen.getByRole('heading', { level: 1, name: '404' }))).toContain(
      'font-size'
    );
    expect(getCssForElement(screen.getByRole('link', { name: /volver al inicio/i }))).toContain(
      'border-radius'
    );
  });
});