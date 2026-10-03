import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectRow } from './ProjectRow';
import { getCssForElement } from '@/test-utils/css';
import type { Project } from '@/types/project';

const mockProject: Project = {
  id: '1',
  name: 'Test Project',
  description: 'A test project description',
  technologies: ['React', 'TypeScript'],
  githubUrl: 'https://github.com/user/project',
  lastUpdated: '2024-01-01T00:00:00Z',
  demoUrl: 'https://demo.example.com',
  screenshotUrls: [],
  iconUrl: 'https://raw.githubusercontent.com/user/project/main/icon-192.png',
  projectType: 'web',
  categories: ['Social', 'Navigation'],
};

const renderRow = (project: Project = mockProject) =>
  render(
    <MemoryRouter>
      <ProjectRow project={project} />
    </MemoryRouter>
  );

describe('ProjectRow', () => {
  it('renders the project name', () => {
    renderRow(mockProject);
    expect(screen.getByRole('heading', { name: 'Test Project' })).toBeInTheDocument();
  });

  it('renders the app icon', () => {
    renderRow(mockProject);
    expect(screen.getByAltText('Test Project icon')).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/user/project/main/icon-192.png'
    );
  });

  // Replaces "keeps a fixed square icon slot and never crops the artwork". That
  // test asserted the artwork is never cropped, on the stated grounds that app
  // icons already arrive rounded. Decoding the alpha channel of all six icons in
  // src/data/projects.json disproved that: every file is a square canvas, five
  // have only slightly transparent corners, and LinkIO is fully opaque. The
  // frame now defines the silhouette, which is why the artwork is cropped to
  // fill it rather than left alone.
  it('rounds the icon with a frame instead of trusting the artwork', () => {
    renderRow(mockProject);
    const icon = screen.getByAltText('Test Project icon');
    expect(icon).toHaveStyle({ objectFit: 'cover' });

    const frame = getCssForElement(screen.getByTestId('project-icon-frame'));
    // 26px on a 120px frame, the same 22% ratio the 88px frame used at 22px.
    expect(frame).toContain('border-radius: 26px');
    expect(frame).toContain('overflow: hidden');
    expect(frame).toContain('border: 1px solid');
  });

  it('holds the icon in a fixed 120px frame', () => {
    renderRow(mockProject);
    expect(screen.getByTestId('project-icon-frame')).toBeInTheDocument();
    const frame = getCssForElement(screen.getByTestId('project-icon-frame'));
    expect(frame).toContain('width: 120px');
    expect(frame).toContain('height: 120px');
  });

  // The gradient's lightest stop, not its midpoint, is what every colour on the
  // card has to clear 4.5:1 against, because the name sits over that end.
  it('paints the card as a diagonal grey gradient with no border', () => {
    renderRow(mockProject);
    const css = getCssForElement(screen.getByRole('article'));
    expect(css).toContain('linear-gradient(');
    expect(css).toContain('135deg');
    expect(css).toContain('var(--color-card-from)');
    expect(css).toContain('var(--color-card-to)');
    expect(css).not.toContain('border:');
    expect(css).toContain('box-shadow: var(--shadow-card)');
    expect(css).toContain('border-radius: var(--radius-2xl)');
    expect(css).toContain('padding: var(--space-8)');
  });

  it('reads light text on the dark card', () => {
    renderRow(mockProject);
    expect(getCssForElement(screen.getByRole('heading', { name: 'Test Project' }))).toContain(
      'color: var(--color-card-fg)'
    );
    expect(getCssForElement(screen.getByText('A test project description'))).toContain(
      'color: var(--color-card-fg-muted)'
    );
  });

  // The muted colour was lightened from #A1A1A6 because that measured 3.55:1 on the
  // gradient's lightest stop, where the flat near-black card needed only 6.54:1.
  it('lightens the muted text so it clears AA on the lightest stop', () => {
    renderRow(mockProject);
    const css = getCssForElement(screen.getByText('A test project description'));
    expect(css).toContain('color: var(--color-card-fg-muted)');
    expect(css).not.toContain('#A1A1A6');
  });

  // The hover rules were removed outright rather than softened, so there is nothing
  // to assert at runtime: the card must simply declare no hover selector at all.
  it('does not react to the pointer at all', () => {
    renderRow(mockProject);
    const css = getCssForElement(screen.getByRole('article'));
    expect(css).not.toContain(':hover');
    expect(css).not.toContain('transition:');
  });

  it('takes its height from the strip rather than fixing one', () => {
    renderRow(mockProject);
    expect(getCssForElement(screen.getByRole('article'))).toContain('height: 100%');
  });

  it('scales the name with its own card token', () => {
    renderRow(mockProject);
    expect(getCssForElement(screen.getByRole('heading', { name: 'Test Project' }))).toContain(
      'font-size: var(--text-card-title)'
    );
  });

  it('renders the icon fallback when iconUrl is missing', () => {
    const { iconUrl, ...projectWithoutIcon } = mockProject;
    expect(iconUrl).toBeDefined();
    renderRow(projectWithoutIcon);
    expect(screen.queryByAltText('Test Project icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('project-icon-fallback')).toBeInTheDocument();
  });

it('keeps the fallback inside the same frame so the card does not shift', () => {
    const { iconUrl, ...projectWithoutIcon } = mockProject;
    expect(iconUrl).toBeDefined();
    renderRow(projectWithoutIcon);

    expect(screen.getByTestId('project-icon-fallback')).toBeInTheDocument();
    const frame = getCssForElement(screen.getByTestId('project-icon-frame'));
    expect(frame).toContain('overflow: hidden');
    expect(frame).toContain('width: 120px');
    expect(frame).toContain('height: 120px');
  });

  it('keeps the icon named for assistive technology', () => {
    renderRow(mockProject);
    expect(screen.getByAltText('Test Project icon')).toBeInTheDocument();
  });

  it('renders the icon fallback when the icon fails to load', () => {
    renderRow(mockProject);
    fireEvent.error(screen.getByAltText('Test Project icon'));
    expect(screen.getByTestId('project-icon-fallback')).toBeInTheDocument();
    expect(screen.queryByAltText('Test Project icon')).not.toBeInTheDocument();
  });

  it('renders the project description', () => {
    renderRow(mockProject);
    expect(screen.getByText('A test project description')).toBeInTheDocument();
  });

  it('clamps a long description to three lines', () => {
    const longDescription = 'A very long description. '.repeat(20).trim();
    renderRow({ ...mockProject, description: longDescription });
    expect(screen.getByText(longDescription)).toHaveStyle({
      display: '-webkit-box',
      webkitLineClamp: '3',
    });
  });

  it('falls back to a default description when the project has none', () => {
    renderRow({ ...mockProject, description: '   ' });
    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

it('renders every category of the project', () => {
    renderRow(mockProject);
    expect(screen.getByText('Social')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('omits the category list when the project has no categories', () => {
    const { categories, ...projectWithoutCategories } = mockProject;
    expect(categories).toBeDefined();
    renderRow(projectWithoutCategories);
    expect(screen.queryByText('Social')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Test Project' })).toBeInTheDocument();
  });

  it('exposes a single action that opens the project page', () => {
    renderRow(mockProject);
    const action = screen.getByTestId('project-view-action');
    expect(action).toHaveAttribute('href', '/projects/1');
    expect(action).not.toHaveAttribute('target');
  });

  it('shows a plus glyph rather than a text label', () => {
    renderRow(mockProject);
    const action = screen.getByTestId('project-view-action');
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    expect(action).toHaveTextContent('');
  });

  it('makes the action a round target', () => {
    renderRow(mockProject);
    const css = getCssForElement(screen.getByTestId('project-view-action'));
    expect(css).toContain('width: 48px');
    expect(css).toContain('height: 48px');
    expect(css).toContain('border-radius: var(--radius-full)');
    expect(css).toContain('padding: 0');
    expect(css).toContain('box-shadow: var(--shadow-focus)');
  });

  // The visible label is the bare verb, but a screen reader must still hear where the link
  // goes, or "Ver" on its own names nothing. WCAG 2.5.3 holds because "Ver" is contained in
  // the accessible name.
  it('names the action with the project, not just the verb', () => {
    renderRow(mockProject);
    expect(screen.getByRole('link', { name: `Ver ${mockProject.name}` })).toBeInTheDocument();
  });

  it('has no arrow glyph left in the action', () => {
    renderRow(mockProject);
    // Icon stamps a testid from its name, so the arrow is found without reaching into the DOM.
    expect(screen.queryByTestId('arrowRight-icon')).not.toBeInTheDocument();
  });

  it('ships no uppercase label to style any more', () => {
    renderRow(mockProject);
    const css = getCssForElement(screen.getByTestId('project-view-action'));
    expect(css).not.toContain('text-transform: uppercase');
    expect(css).not.toContain('letter-spacing');
  });

  it('does not render a featured or enlarged layout', () => {
    renderRow(mockProject);
    const rowCss = getCssForElement(screen.getByRole('article'));
    expect(rowCss).not.toContain('grid-column: span 2');
    expect(rowCss).not.toContain('grid-row: span 2');
  });

  it('exposes the row as an article with an accessible name', () => {
    renderRow(mockProject);
    expect(
      screen.getByRole('article', { name: /Test Project - A test project description/ })
    ).toBeInTheDocument();
  });
});