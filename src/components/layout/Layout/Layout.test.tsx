import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { siteConfig } from '@/data/site-config';

/**
 * `Layout` is the frame every route renders inside, and it assembles five things: the scroll reset, the
 * skip link, the header, the main landmark and the footer. It had no test, which meant the frame itself
 * — the one component every single test-rendered page sits inside — was the only part of the tree
 * nothing asserted.
 */
describe('Layout', () => {
  const renderLayout = () =>
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<p>contenido de la ruta</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

  it('renders the current route inside the main landmark', () => {
    renderLayout();

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('id', 'main-content');
    expect(within(main).getByText('contenido de la ruta')).toBeInTheDocument();
  });

  it('offers a skip link that targets the main landmark', () => {
    renderLayout();

    // Constitution principle IV, and WCAG 2.4.1 bypass blocks: the first thing a keyboard user reaches
    // has to be a way past the header rather than the header itself.
    const skip = screen.getByRole('link', { name: /saltar|skip/i });
    expect(skip).toHaveAttribute('href', '#main-content');
  });

  it('renders the header and the footer', () => {
    renderLayout();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('passes the configured name to the footer copyright', () => {
    renderLayout();

    expect(screen.getByRole('contentinfo')).toHaveTextContent(siteConfig.name);
  });

  it('renders exactly one main landmark, so the skip link has one target', () => {
    renderLayout();

    expect(screen.getAllByRole('main')).toHaveLength(1);
  });
});