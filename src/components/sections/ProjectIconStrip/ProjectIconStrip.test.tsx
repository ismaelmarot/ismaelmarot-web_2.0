import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProjectIconStrip } from './ProjectIconStrip';
import { getCssForElement } from '@/test-utils/css';
import type { Project } from '@/types/project';

vi.mock('@/hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => ({ ref: { current: null }, isIntersecting: true, entry: null }),
}));

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

const project = (n: number): Project =>
  ({
    id: String(n),
    name: `Proyecto ${n}`,
    iconUrl: `https://example.test/icon-${n}.png`,
  }) as Project;

const seis = [1, 2, 3, 4, 5, 6].map(project);

describe('ProjectIconStrip', () => {
  it('renders one frame per project', () => {
    render(<ProjectIconStrip projects={seis} />);
    expect(screen.getAllByTestId('project-icon-frame')).toHaveLength(6);
  });

  // The frame is what rounds the icon, not the artwork: all six source PNGs have transparent
  // corners, so a frame with no background of its own shows the section through the corner.
  it('frames each icon at 96px with the tile radius and its own background', () => {
    render(<ProjectIconStrip projects={seis} />);
    const css = getCssForElement(screen.getAllByTestId('project-icon-frame')[0]!);
    expect(css).toContain('width: 96px');
    expect(css).toContain('height: 96px');
    // 22% of 96, the app-icon tile ratio the carousel uses.
    expect(css).toContain('border-radius: 21px');
    expect(css).toContain('background-color: var(--color-card-frame)');
    expect(css).toContain('overflow: hidden');
  });

  // The sources are not square: QEntry is 379x366 and one is 1024px wide. Contain would letterbox
  // them so a 379x366 icon reads smaller than a 192x192 one, and stretch would distort them.
  it('fits the artwork to the frame rather than stretching it', () => {
    render(<ProjectIconStrip projects={seis} />);
    const css = getCssForElement(screen.getByRole('img', { name: /Proyecto 1/ }));
    expect(css).toContain('object-fit: cover');
    expect(css).toContain('object-position: center');
  });

  // A frame with no alt leaves the project unidentified, and an empty alt hides it from everyone
  // including a screen reader.
  it('names each project in the alternative text', () => {
    render(<ProjectIconStrip projects={seis} />);
    for (const n of [1, 2, 3, 4, 5, 6]) {
      expect(screen.getByRole('img', { name: `Icono de Proyecto ${n}` })).toBeInTheDocument();
    }
  });

  it('is not a link, because the section already carries one call to action', () => {
    render(<ProjectIconStrip projects={seis} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('renders nothing when there are no projects', () => {
    const { container } = render(<ProjectIconStrip projects={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  // A project whose iconUrl is missing keeps its frame, so one absent asset does not reflow the
  // row and shift the other five.
  it('keeps the frame for a project with no icon', () => {
    render(<ProjectIconStrip projects={[{ id: 'x', name: 'Sin icono' } as Project]} />);
    expect(screen.getByTestId('project-icon-frame')).toBeInTheDocument();
    expect(screen.getByTestId('project-icon-fallback')).toBeInTheDocument();
  });

  // The entrance is the request. The observer drives it, so a visitor who never scrolls to the
  // section is not shown an animation they did not see.
  it('animates the frames in with a 60ms stagger per icon', () => {
    render(<ProjectIconStrip projects={seis} />);
    const delays = screen
      .getAllByTestId('project-icon-frame')
      .map((f) => getCssForElement(f).match(/animation-delay:\s*([\d.]+)ms/)?.[1]);
    expect(delays).toEqual(['0', '60', '120', '180', '240', '300']);
  });

  it('scrolls the row on a narrow viewport with the cut edge masked', () => {
    render(<ProjectIconStrip projects={seis} />);
    const frame = screen.getAllByTestId('project-icon-frame')[0]!;
    // The scroll container and its mask are on the row inside the list, not on the list itself:
    // role="list" is the strip and the row is what scrolls. The row is reached through the frames'
    // own test id rather than by walking the tree, which lint rejects.
    const fila = getCssForElement(screen.getByTestId('project-icon-row'));
    expect(fila).toContain('@media (max-width: 700px)');
    // Without the mask a cut frame reads as clipped rather than as continuing.
    expect(fila).toContain('mask-image: linear-gradient');
    expect(fila).toContain('overflow-x: auto');
    expect(fila).toContain('scrollbar-width: none');
    // And the frames snap, so scrolling lands on a whole icon rather than between two.
    expect(getCssForElement(frame)).toContain('scroll-snap-align: center');
  });
});
