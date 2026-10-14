import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { ScrollToTop } from './ScrollToTop';

/**
 * `ScrollToTop` renders nothing at all, which is exactly why it needed a test: a component whose entire
 * output is `null` cannot be asserted on by looking at the DOM, so the only thing that can fail is the
 * scroll call. It also had no `.styles.ts` and an inline `useEffect`, which is the other two of the
 * things the constitution asks a component folder to have.
 */

/** Changes the route on demand, so the test makes the path change rather than simulating one. */
function NavigateButton() {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate('/projects')}>
      ir a proyectos
    </button>
  );
}

describe('ScrollToTop', () => {
  // tests/setup.ts already replaces window.scrollTo with a vi.fn, so there is nothing to spy on here.
  const scrollTo = window.scrollTo as unknown as ReturnType<typeof vi.fn>;

  const renderWithRoutes = () =>
    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<NavigateButton />} />
          <Route path="/projects" element={<p>proyectos</p>} />
        </Routes>
      </MemoryRouter>
    );

  afterEach(() => {
    scrollTo.mockClear();
  });

  it('scrolls to the top when the route changes', () => {
    renderWithRoutes();
    scrollTo.mockClear();

    fireEvent.click(screen.getByRole('button', { name: 'ir a proyectos' }));

    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('lands the visitor on the new route as well as at the top', () => {
    renderWithRoutes();

    fireEvent.click(screen.getByRole('button', { name: 'ir a proyectos' }));

    // The scroll and the navigation are the same event. A component that moved the window without
    // letting the router change would be the bug; one that navigated without moving it is the bug this
    // component exists to prevent.
    expect(screen.getByText('proyectos')).toBeInTheDocument();
  });

  it('scrolls on the first render too, which is a no-op on a fresh load', () => {
    renderWithRoutes();

    // Recorded because the test that used to stand here asserted the opposite and was wrong. The effect
    // keys on `pathname`, and an effect runs on mount, so the window is told to go to the top once
    // before it has been anywhere. On a hard load that is a no-op: the browser is already at the top.
    // It is kept rather than guarded, because a second effect that skips the first render would need a
    // ref to do the same thing.
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('does not scroll when the path has not changed', () => {
    renderWithRoutes();
    scrollTo.mockClear();

    // Re-rendering the same route is not a navigation. The dependency is the path, not the render, so a
    // visitor who triggers a state change elsewhere in the tree does not get yanked back to the top.
    fireEvent.click(screen.getByRole('button', { name: 'ir a proyectos' }));
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it('renders no element of its own', () => {
    renderWithRoutes();

    // The route renders exactly one button and nothing else. ScrollToTop adds no landmark, no wrapper
    // and no element of any kind, which is the whole of what it is for.
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});