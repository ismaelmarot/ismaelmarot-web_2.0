import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProjectDetailPage } from './ProjectDetail';
import projectsData from '@/data/projects.json';
import { formatProjectName } from '@/utils/helpers';

/**
 * This page has two paths and one of them is a 404, which makes it the most consequential of the seven
 * routes: an id that resolves wrongly shows the wrong project, and an id that fails to resolve shows
 * the wrong page. It had no test of its own. The section it renders, `sections/ProjectDetail`, is well
 * covered; what was untested is the lookup and the fallthrough that happens above it.
 */
describe('ProjectDetailPage', () => {
  const renderAt = (id: string) =>
    render(
      <MemoryRouter initialEntries={[`/projects/${id}`]}>
        <Routes>
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="*" element={<p>router did not match</p>} />
        </Routes>
      </MemoryRouter>
    );

  it('renders the section for the project the id names', () => {
    const project = projectsData[0];
    renderAt(project.id);

    expect(screen.getByText(formatProjectName(project.name))).toBeInTheDocument();
  });

  it('renders the 404 page for an id that names no project', () => {
    renderAt('no-such-project-id');

    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
  });

  it('does not render the router fallback for an unknown id', () => {
    renderAt('no-such-project-id');

    // The catch-all route exists in this fixture only to prove the component's own 404 is what answered.
    // Without it, a component that rendered nothing would look identical to one that handled the miss.
    expect(screen.queryByText('router did not match')).not.toBeInTheDocument();
  });

  it('labels the section with the project it resolved', () => {
    const project = projectsData[0];
    renderAt(project.id);

    expect(
      screen.getByRole('region', { name: `${project.name} detail` })
    ).toBeInTheDocument();
  });

  it('renders a different project for a different id', () => {
    const [first, second] = projectsData;

    const { unmount } = renderAt(first.id);
    expect(screen.getByText(formatProjectName(first.name))).toBeInTheDocument();
    unmount();

    renderAt(second.id);
    expect(screen.getByText(formatProjectName(second.name))).toBeInTheDocument();
  });
});