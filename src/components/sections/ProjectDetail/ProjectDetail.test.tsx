import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectDetail, PLATFORM_ICONS } from './ProjectDetail';
import { getCssForElement } from '@/test-utils/css';
import { StyledInfoGrid } from './ProjectDetail.styles';
import { getIcon } from '@/components/ui/Icon/useIcon';
import type { Project } from '@/types/project';

const webProject: Project = {
  id: '10',
  name: 'Trash2Treasure',
  description: 'A community recycling mobile app',
  technologies: ['TypeScript'],
  githubUrl: 'https://github.com/ismaelmarot/trash2treasure',
  demoUrl: 'https://trash2treasure-app.vercel.app',
  screenshotUrls: ['https://img.example/1.png', 'https://img.example/2.png'],
  lastUpdated: '2026-01-01T00:00:00Z',
  primaryLanguage: 'TypeScript',
  iconUrl: 'https://raw.githubusercontent.com/ismaelmarot/trash2treasure/main/icon-192.png',
  sizeKb: 26000,
  categories: ['Social', 'Navigation'],
  viewports: ['desktop', 'tablet', 'mobile'],
  platforms: ['web'],
};

const desktopProject: Project = {
  ...webProject,
  id: '11',
  name: 'Car Expense Tracker',
  demoUrl: undefined,
  sizeKb: 34000,
  appSizeBytes: 113_900_000,
  downloadUrl: 'https://github.com/ismaelmarot/car-expense-tracker/releases',
  versions: [
    { version: 'v2.0.4', date: '2026-05-03T00:00:00Z', url: 'https://github.com/ismaelmarot/car-expense-tracker/releases/tag/v2.0.4' },
    { version: 'v2.0.1', date: '2026-03-31T00:00:00Z', url: 'https://github.com/ismaelmarot/car-expense-tracker/releases/tag/v2.0.1' },
  ],
  categories: ['Finances'],
  viewports: ['desktop'],
  platforms: ['mac', 'pc'],
};

const bareProject: Project = {
  ...webProject,
  id: '12',
  demoUrl: undefined,
  screenshotUrls: [],
  sizeKb: undefined,
  appSizeBytes: undefined,
  downloadUrl: undefined,
  versions: undefined,
  categories: undefined,
  viewports: undefined,
  platforms: undefined,
  primaryLanguage: undefined,
};

const renderDetail = (project: Project = webProject) =>
  render(
    <MemoryRouter>
      <ProjectDetail project={project} shareUrl="https://site/projects/10" />
    </MemoryRouter>
  );

describe('ProjectDetail', () => {
  it('shows the app icon and the name as the page heading', () => {
    renderDetail();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Trash2Treasure');
    expect(screen.getByAltText('Trash2Treasure icon')).toBeInTheDocument();
  });

  it('lists the categories as a comma separated sentence', () => {
    renderDetail();
    const header = screen.getByTestId('detail-categories');
    expect(header).toHaveTextContent('Social, Navigation');
  });

  it('shows the full description', () => {
    renderDetail();
    expect(screen.getByText('A community recycling mobile app')).toBeInTheDocument();
  });

  it('shows an icon for each platform', () => {
    renderDetail();
    expect(screen.getByLabelText('Available on')).toHaveTextContent('web');
  });

  it('names the platform row with the label that is on screen', () => {
    renderDetail();
    expect(screen.getByText('Available on')).toBeInTheDocument();
    expect(screen.getByLabelText(/^available on$/i)).toBeInTheDocument();
  });

  it('labels both desktop platforms and points Mac at the notebook icon', () => {
    renderDetail(desktopProject);
    expect(screen.getByLabelText('Available on')).toHaveTextContent('mac');
    expect(screen.getByLabelText('Available on')).toHaveTextContent('pc');
    // Asserted on the mapping: the apple mark was dropped because it named the
    // manufacturer next to a desktop tower instead of the form factor.
    expect(PLATFORM_ICONS.mac).toBe('laptop');
    expect(PLATFORM_ICONS.web).toBe('globe');
    expect(PLATFORM_ICONS.pc).toBe('pc');
  });

  it('shows an icon for each supported viewport', () => {
    renderDetail();
    const viewports = screen.getByLabelText('Supported viewports');
    expect(viewports).toHaveTextContent('desktop');
    expect(viewports).toHaveTextContent('tablet');
    expect(viewports).toHaveTextContent('mobile');
  });

  it('links to the repository', () => {
    renderDetail();
    const link = screen.getByTestId('detail-repo-link');
    expect(link).toHaveAttribute('href', webProject.githubUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('links to the web app when one is deployed', () => {
    renderDetail();
    const link = screen.getByTestId('detail-app-link');
    expect(link).toHaveAttribute('href', 'https://trash2treasure-app.vercel.app');
    expect(link).toHaveTextContent('Open the web app');
  });

  it('links to the downloads when the app is not deployed', () => {
    renderDetail(desktopProject);
    const link = screen.getByTestId('detail-app-link');
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/ismaelmarot/car-expense-tracker/releases'
    );
    expect(link).toHaveTextContent('Download the app');
  });

  it('offers only the repository when there is neither an app nor downloads', () => {
    renderDetail(bareProject);
    expect(screen.queryByTestId('detail-app-link')).not.toBeInTheDocument();
    expect(screen.getByTestId('detail-repo-link')).toBeInTheDocument();
  });

  it('offers a control to go back to the list', () => {
    renderDetail();
    expect(screen.getByTestId('detail-back')).toHaveAttribute('href', '/projects');
  });

  describe('screenshots', () => {
    it('shows the screenshots of the project', () => {
      renderDetail();
      expect(
        screen.getByRole('button', { name: /view trash2treasure screenshot 1 full screen/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /view trash2treasure screenshot 2 full screen/i })
      ).toBeInTheDocument();
    });

    it('never renders more than six screenshots', () => {
      const many = {
        ...webProject,
        screenshotUrls: Array.from({ length: 12 }, (_, i) => `https://img.example/${i}.png`),
      };
      renderDetail(many);
      expect(
        screen.getAllByRole('button', { name: /full screen/i })
      ).toHaveLength(6);
    });

    it('shows no gallery when the project has no screenshots', () => {
      renderDetail(bareProject);
      expect(screen.queryByRole('button', { name: /full screen/i })).not.toBeInTheDocument();
      expect(screen.queryByTestId('gallery-viewer')).not.toBeInTheDocument();
    });

    it('drops the visible Screenshots heading', () => {
      renderDetail();
      expect(screen.queryByText('Screenshots')).not.toBeInTheDocument();
      // The region keeps an accessible name even though the heading is gone.
      expect(screen.getByRole('region', { name: 'Screenshots' })).toBeInTheDocument();
    });

    it('exposes the carousel as a keyboard reachable scroll region', () => {
      renderDetail();
      const carousel = screen.getByTestId('detail-gallery');
      expect(carousel).toHaveAttribute('tabindex', '0');
    });

    describe('full screen viewer', () => {
      const thumb = (name: RegExp) => screen.getByRole('button', { name });

      it('opens on the screenshot that was clicked', () => {
        renderDetail();
        fireEvent.click(thumb(/screenshot 2 full screen/i));

        expect(screen.getByAltText('Trash2Treasure screenshot 2')).toBeInTheDocument();
        expect(screen.getByTestId('gallery-counter')).toHaveTextContent('2 / 2');
      });

      it('does not render the viewer content until it is opened', () => {
        renderDetail();
        expect(screen.getByTestId('gallery-viewer')).toBeInTheDocument();
        expect(screen.queryByTestId('gallery-counter')).not.toBeInTheDocument();
      });

      it('moves forward and back with the controls', () => {
        renderDetail();
        fireEvent.click(thumb(/screenshot 1 full screen/i));
        fireEvent.click(screen.getByTestId('gallery-viewer-next'));

        expect(screen.getByAltText('Trash2Treasure screenshot 2')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('gallery-viewer-prev'));
        expect(screen.getByAltText('Trash2Treasure screenshot 1')).toBeInTheDocument();
      });

      it('wraps around at both ends instead of going dead', () => {
        renderDetail();
        fireEvent.click(thumb(/screenshot 1 full screen/i));

        fireEvent.click(screen.getByTestId('gallery-viewer-prev'));
        expect(screen.getByAltText('Trash2Treasure screenshot 2')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('gallery-viewer-next'));
        expect(screen.getByAltText('Trash2Treasure screenshot 1')).toBeInTheDocument();
      });

      it('moves with the arrow keys', () => {
        renderDetail();
        fireEvent.click(thumb(/screenshot 1 full screen/i));
        const viewer = screen.getByTestId('gallery-viewer');

        fireEvent.keyDown(viewer, { key: 'ArrowRight' });
        expect(screen.getByAltText('Trash2Treasure screenshot 2')).toBeInTheDocument();

        fireEvent.keyDown(viewer, { key: 'ArrowLeft' });
        expect(screen.getByAltText('Trash2Treasure screenshot 1')).toBeInTheDocument();
      });

      it('closes with the close button', () => {
        renderDetail();
        fireEvent.click(thumb(/screenshot 1 full screen/i));
        fireEvent.click(screen.getByTestId('gallery-viewer-close'));

        expect(screen.queryByTestId('gallery-counter')).not.toBeInTheDocument();
      });

      it('closes on Escape', () => {
        renderDetail();
        fireEvent.click(thumb(/screenshot 1 full screen/i));
        fireEvent.keyDown(screen.getByTestId('gallery-viewer'), { key: 'Escape' });

        expect(screen.queryByTestId('gallery-counter')).not.toBeInTheDocument();
      });

      it('closes when the backdrop is clicked but not the image', () => {
        renderDetail();
        fireEvent.click(thumb(/screenshot 1 full screen/i));
        const viewer = screen.getByTestId('gallery-viewer');

        fireEvent.click(screen.getByTestId('gallery-viewer-image'));
        expect(screen.getByTestId('gallery-counter')).toBeInTheDocument();

        fireEvent.click(viewer);
        expect(screen.queryByTestId('gallery-counter')).not.toBeInTheDocument();
      });

      it('locks the page behind it while open', () => {
        renderDetail();
        fireEvent.click(thumb(/screenshot 1 full screen/i));
        expect(document.body.style.overflow).toBe('hidden');

        fireEvent.click(screen.getByTestId('gallery-viewer-close'));
        expect(document.body.style.overflow).toBe('');
      });

      it('opens the native dialog so the platform traps focus', () => {
        const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
        renderDetail();
        fireEvent.click(thumb(/screenshot 1 full screen/i));

        expect(showModal).toHaveBeenCalled();
        showModal.mockRestore();
      });
    });

    describe('controls', () => {
      // jsdom reports every element as 0x0, so the scroll extents the buttons rely on
      // have to be declared before the controls can know where the ends are.
      const givenScrollExtent = (element: HTMLElement, { scrollWidth, clientWidth }: { scrollWidth: number; clientWidth: number }) => {
        Object.defineProperty(element, 'scrollWidth', { value: scrollWidth, configurable: true });
        Object.defineProperty(element, 'clientWidth', { value: clientWidth, configurable: true });
      };

      it('offers only the forward control while parked at the start', () => {
        renderDetail();
        const carousel = screen.getByTestId('detail-gallery');
        givenScrollExtent(carousel, { scrollWidth: 3000, clientWidth: 960 });
        fireEvent.scroll(carousel);

        expect(screen.getByRole('button', { name: /next screenshots/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /previous screenshots/i })).not.toBeInTheDocument();
      });

      it('offers the backward control once the track has scrolled', () => {
        renderDetail();
        const carousel = screen.getByTestId('detail-gallery');
        givenScrollExtent(carousel, { scrollWidth: 3000, clientWidth: 960 });
        carousel.scrollLeft = 960;
        fireEvent.scroll(carousel);

        expect(screen.getByRole('button', { name: /previous screenshots/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next screenshots/i })).toBeInTheDocument();
      });

      it('drops the forward control at the end of the track', () => {
        renderDetail();
        const carousel = screen.getByTestId('detail-gallery');
        givenScrollExtent(carousel, { scrollWidth: 3000, clientWidth: 960 });
        carousel.scrollLeft = 2040;
        fireEvent.scroll(carousel);

        expect(screen.getByRole('button', { name: /previous screenshots/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /next screenshots/i })).not.toBeInTheDocument();
      });

      it('shows no controls when the screenshots already fit', () => {
        renderDetail();
        const carousel = screen.getByTestId('detail-gallery');
        givenScrollExtent(carousel, { scrollWidth: 600, clientWidth: 960 });
        fireEvent.scroll(carousel);

        expect(screen.queryByRole('button', { name: /next screenshots/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /previous screenshots/i })).not.toBeInTheDocument();
      });

      it('advances one screenshot at a time instead of jumping by a viewport', () => {
        renderDetail();
        const carousel = screen.getByTestId('detail-gallery');
        givenScrollExtent(carousel, { scrollWidth: 3000, clientWidth: 1216 });
        carousel.style.columnGap = '16px';
        // Scoped to the carousel region: the page has other lists (platforms, viewports)
        // whose items would otherwise be picked up here.
        const region = screen.getByRole('region', { name: 'Screenshots' });
        const first = within(region).getAllByRole('listitem')[0];
        vi.spyOn(first, 'getBoundingClientRect').mockReturnValue({ width: 300 } as DOMRect);
        const scrollBy = vi.fn();
        carousel.scrollBy = scrollBy;
        fireEvent.scroll(carousel);

        fireEvent.click(screen.getByRole('button', { name: /next screenshots/i }));
        // A viewport sized step would be 972px and would skip three screenshots.
        expect(scrollBy).toHaveBeenCalledWith({ left: 316 });
      });

      it('scrolls the track forwards and backwards when clicked', () => {
        renderDetail();
        const carousel = screen.getByTestId('detail-gallery');
        givenScrollExtent(carousel, { scrollWidth: 3000, clientWidth: 960 });
        const scrollBy = vi.fn();
        carousel.scrollBy = scrollBy;
        fireEvent.scroll(carousel);

        fireEvent.click(screen.getByRole('button', { name: /next screenshots/i }));
        expect(scrollBy).toHaveBeenCalledWith({ left: 768 });

        carousel.scrollLeft = 960;
        fireEvent.scroll(carousel);
        fireEvent.click(screen.getByRole('button', { name: /previous screenshots/i }));
        expect(scrollBy).toHaveBeenCalledWith({ left: -768 });
      });

      it('keeps the controls keyboard reachable as buttons', () => {
        renderDetail();
        const carousel = screen.getByTestId('detail-gallery');
        givenScrollExtent(carousel, { scrollWidth: 3000, clientWidth: 960 });
        fireEvent.scroll(carousel);

        expect(screen.getByRole('button', { name: /next screenshots/i })).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('information layout', () => {
    it('gives the rows more air than the columns', () => {
      // The dl has no ARIA role, so it is asserted through the styled component rather
      // than by walking the DOM.
      render(
        <StyledInfoGrid data-testid="grid">
          <dt>Label</dt>
          <dd>Value</dd>
        </StyledInfoGrid>
      );

      const css = getCssForElement(screen.getByTestId('grid'));
      expect(css).toContain('row-gap: var(--space-8)');
      // The column gap is untouched, so the pairs still sit close side by side.
      expect(css).toContain('gap: var(--space-5)');
    });

    it('keeps the wider row gap out of the stacked mobile layout', () => {
      render(
        <StyledInfoGrid data-testid="grid">
          <dt>Label</dt>
          <dd>Value</dd>
        </StyledInfoGrid>
      );

      const css = getCssForElement(screen.getByTestId('grid'));
      // row-gap only appears inside the min-width media query, never on the base rule.
      const baseRule = css.split('@media')[0];
      expect(baseRule).not.toContain('row-gap');
    });
  });

  describe('information', () => {
    it('lists the categories', () => {
      renderDetail();
      const list = screen.getByTestId('detail-categories-list');
      expect(list).toHaveTextContent('Social');
      expect(list).toHaveTextContent('Navigation');
    });

    it('shows the language when there is one', () => {
      renderDetail();
      expect(screen.getByTestId('detail-language')).toHaveTextContent('EN, ES');
    });

    it('falls back to the bilingual default when the project declares no languages', () => {
      renderDetail(bareProject);
      expect(screen.getByText('Language')).toBeInTheDocument();
      expect(screen.getByTestId('detail-language')).toHaveTextContent('EN, ES');
    });

    it('shows only the languages the project declares', () => {
      renderDetail({ ...webProject, languages: ['ES'] });
      expect(screen.getByTestId('detail-language')).toHaveTextContent('ES');
      expect(screen.getByTestId('detail-language').textContent).toBe('ES');
    });

    it('lists a project declaring both languages', () => {
      renderDetail({ ...webProject, languages: ['EN', 'ES'] });
      expect(screen.getByTestId('detail-language')).toHaveTextContent('EN, ES');
    });

    it('shows the technologies under Built with', () => {
      renderDetail(desktopProject);
      expect(screen.getByText('Built with')).toBeInTheDocument();
      expect(screen.getByTestId('detail-built-with')).toHaveTextContent('TypeScript');
    });

    it('omits Built with when the project declares no technologies', () => {
      renderDetail({ ...webProject, technologies: [] });
      expect(screen.queryByText('Built with')).not.toBeInTheDocument();
    });

    it('shows the app size and says so when a downloadable app exists', () => {
      renderDetail(desktopProject);
      const size = screen.getByTestId('detail-size');
      expect(size).toHaveTextContent('108.6 MB');
      expect(size).toHaveTextContent('App size');
    });

    it('shows the repository size and says so when there is no downloadable app', () => {
      renderDetail();
      const size = screen.getByTestId('detail-size');
      expect(size).toHaveTextContent('25.4 MB');
      expect(size).toHaveTextContent('Repository size');
    });

    it('omits the size when the project has none', () => {
      renderDetail(bareProject);
      expect(screen.queryByTestId('detail-size')).not.toBeInTheDocument();
    });
  });

  describe('version history', () => {
    it('lists the published versions newest first with a link to each', () => {
      renderDetail(desktopProject);
      const history = screen.getByLabelText('Published versions');
      expect(history).toHaveTextContent('v2.0.4');
      expect(history).toHaveTextContent('May 3, 2026');
      expect(history).toHaveTextContent('v2.0.1');
      expect(screen.getAllByRole('link', { name: 'View release' })).toHaveLength(2);
    });

    it('states plainly when a project publishes no versions', () => {
      renderDetail(webProject);
      expect(
        screen.getByText('Trash2Treasure does not publish formal versions.')
      ).toBeInTheDocument();
    });
  });

    it('fills the back control in grey so the chevron can be white', () => {
      renderDetail();
      const back = screen.getByTestId('detail-back');
      const css = getCssForElement(back);

      expect(css).toContain('background-color: var(--color-text-secondary)');
      // The glyph paints with currentColor, so this is what turns the arrow white.
      expect(css).toContain('color: var(--color-white)');
    });

  describe('navigation controls', () => {
    it('renders the back control as an icon only link', () => {
      renderDetail();
      const back = screen.getByTestId('detail-back');

      // Icon only, so the name comes from aria-label rather than from visible text.
      expect(back.textContent).toBe('');
      expect(back).toHaveAccessibleName('Back to projects');
    });

    it('keeps the visible label on the share control', () => {
      renderDetail();
      const share = screen.getByTestId('detail-share');

      expect(share).toHaveTextContent('Share');
      expect(share).toHaveAttribute('type', 'button');
    });

    it('has a share glyph registered for the share control', () => {
      // The chain used to sit on this control, which reads as a permalink. The icon name
      // is typed, so this guards the registry entry from being dropped.
      expect(getIcon('share')).toBeTruthy();
    });
  });

  describe('sharing', () => {
    it('offers the share sheet when the device supports it', () => {
      const share = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, { share });
      renderDetail();
      fireEvent.click(screen.getByTestId('detail-share'));
      expect(share).toHaveBeenCalledWith(
        expect.objectContaining({ url: 'https://site/projects/10' })
      );
    });

    it('copies the address when the device cannot share', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, { share: undefined, clipboard: { writeText } });
      renderDetail();
      fireEvent.click(screen.getByTestId('detail-share'));
      expect(writeText).toHaveBeenCalledWith('https://site/projects/10');
      expect(await screen.findByText('Enlace copiado')).toBeInTheDocument();
    });

    it('reports when it could not share at all', async () => {
      Object.assign(navigator, { share: undefined, clipboard: undefined });
      renderDetail();
      fireEvent.click(screen.getByTestId('detail-share'));
      expect(await screen.findByText('No se pudo compartir')).toBeInTheDocument();
    });
  });

  describe('label and value spacing', () => {
    const LABELS = [
      'Available on',
      'Categories',
      'Language',
      'Size',
      'Built with',
      'Supported viewports',
    ];

    // Class names are generated per styled component, so only the declarations behind
    // them can be compared between two elements.
    const declarationsOf = (element: Element) =>
      getCssForElement(element)
        .replace(/\.[A-Za-z][\w-]*/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    it('gives every label the same style', () => {
      renderDetail(desktopProject);
      const [reference, ...others] = LABELS.map((label) =>
        declarationsOf(screen.getByText(label))
      );
      expect(reference).toBeTruthy();
      others.forEach((css) => expect(css).toBe(reference));
    });

    it('pairs the description list terms with their definitions', () => {
      renderDetail(desktopProject);
      expect(screen.getAllByRole('term')).toHaveLength(6);
      expect(screen.getAllByRole('definition')).toHaveLength(6);
    });

    it('gives the viewports pair a term without inline spacing', () => {
      renderDetail(desktopProject);
      // It used to carry style={{ margin: 0 }} on top of an unstyled wrapper, which is
      // what left that pair with no distance at all.
      expect(screen.getByText('Supported viewports')).not.toHaveAttribute('style');
      // A dt does not take its accessible name from its contents, so the pairing is
      // asserted through the role itself.
      expect(screen.getAllByRole('term').map((t) => t.textContent)).toContain(
        'Supported viewports'
      );
    });

    it('gives both icon value lists the same gap', () => {
      renderDetail(desktopProject);
      const [platforms, viewports] = [
        screen.getByLabelText('Available on'),
        screen.getByLabelText('Supported viewports'),
      ].map(declarationsOf);
      expect(platforms).toBe(viewports);
    });

    it('reads the information categories as a comma separated sentence', () => {
      renderDetail();
      expect(screen.getByTestId('detail-categories-list')).toHaveTextContent(
        'Social, Navigation'
      );
    });

    it('spaces every icon from its label the same way', () => {
      renderDetail(desktopProject);
      const regions = [
        screen.getByLabelText('Available on'),
        screen.getByLabelText('Supported viewports'),
      ];

      regions.forEach((list) => {
        within(list)
          .getAllByRole('listitem')
          .forEach((item) => {
            // Asserted on the raw rule text: an invalid declaration is emitted verbatim
            // and then dropped by the browser, which is how the platforms gap silently
            // ended up at zero once.
            expect(declarationsOf(item)).toContain('gap: var(--space-1)');
          });
      });
    });

    it('counts the platforms pair among the description list pairs', () => {
      renderDetail(desktopProject);
      // The pair moved out of the header area into the grid, so it is one of the terms of
      // the description list rather than markup floating outside it.
      expect(screen.getByText('Available on')).toBeInTheDocument();
      expect(screen.getAllByRole('term')).toHaveLength(6);
      expect(screen.getAllByRole('definition')).toHaveLength(6);
    });
  });
});
