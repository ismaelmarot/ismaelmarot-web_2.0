import { render, screen } from '@testing-library/react';
import { AboutPage } from './About';

/**
 * The About page's own job is almost nothing: it reads three stats out of its own body and hands them
 * to the About section. These tests exist because the page had none, and because the stats are the one
 * thing about this route that is authored rather than derived — they are not in `siteConfig`, so nothing
 * else in the repository would notice if they changed.
 */
describe('AboutPage', () => {
  it('renders the three stats the page declares', () => {
    render(<AboutPage />);

    expect(screen.getByText('Años de experiencia')).toBeInTheDocument();
    expect(screen.getByText('Proyectos completados')).toBeInTheDocument();
    expect(screen.getByText('Tecnologías')).toBeInTheDocument();
  });

  it('renders each stat with its value and its description', () => {
    render(<AboutPage />);

    expect(screen.getByText('5+')).toBeInTheDocument();
    expect(screen.getByText('20+')).toBeInTheDocument();
    expect(screen.getByText('15+')).toBeInTheDocument();
    expect(screen.getByText('Desarrollo profesional')).toBeInTheDocument();
    expect(screen.getByText('Open source y trabajo cliente')).toBeInTheDocument();
    expect(screen.getByText('Lenguajes y frameworks')).toBeInTheDocument();
  });

  it('renders the About section heading', () => {
    render(<AboutPage />);

    expect(screen.getByRole('heading', { level: 2, name: /sobre m[ií]/i })).toBeInTheDocument();
  });

  it('renders without a router, because it renders no link', () => {
    // No MemoryRouter here on purpose. The page declares no link of its own, so a wrapper would be
    // hiding a dependency rather than satisfying one.
    expect(() => render(<AboutPage />)).not.toThrow();
  });
});