import { render, screen, fireEvent, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectIconStrip } from './ProjectIconStrip';
import { getCssForElement } from '@/test-utils/css';
import { ESPACIOS_MOVIL_QUERY, FASE_MS, INTERVALO_MS } from './iconRotation';
import type { Project } from '@/types/project';

/* Both shared hooks are mocked rather than configured, the way the strip's own tests did before the
   rotation: the strip is not under test for how it observes the viewport or reads a media query, and a
   real observer would leave the entrance state dependent on jsdom.

   `reduceMotion` is a variable rather than a fixed false so the reduced-motion cases can turn it on,
   which is the one thing the mock has to be able to do. */
let reduceMotion = false;
let enPantalla = true;

vi.mock('@/hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => ({ ref: { current: null }, isIntersecting: enPantalla, entry: null }),
}));

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => reduceMotion,
}));

const project = (n: number): Project =>
  ({
    id: String(n),
    name: `Proyecto ${n}`,
    iconUrl: `https://example.test/icon-${n}.png`,
  }) as Project;

const seis = [1, 2, 3, 4, 5, 6].map(project);

/* The apps currently on screen, in slot order, read from their alternative text because that is what a
   screen reader is given and therefore what a rotation is allowed to change.

   Read through the accessible name rather than through an attribute on the frame: the frame carries no
   label of its own, and `no-node-access` forbids reaching for a child element directly. */
const alts = () =>
  screen.getAllByRole('img').map((img) => img.getAttribute('alt') ?? '');

/* Whether the mocked matchMedia reports a narrow viewport. The global mock in tests/setup.ts answers
   false to everything, so the phone cases have to make it answer true for the width query specifically,
   the way a real browser would at 390px. */
let viewportMovil = false;

beforeEach(() => {
  reduceMotion = false;
  enPantalla = true;
  viewportMovil = false;
  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        matches: query.includes('max-width') ? viewportMovil : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList
  );
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

/** Advance past the interval and the fade, so the assignment has changed and faded back in. */
const rotar = () => {
  act(() => {
    vi.advanceTimersByTime(INTERVALO_MS);
  });
  act(() => {
    vi.advanceTimersByTime(FASE_MS);
  });
};

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

  it('centra un solo icono en mobile en vez de dejar la fila scrollear', () => {
    render(<ProjectIconStrip projects={seis} />);
    // The row inside the list is what centres the single icon below 700px; role="list" is the strip.
    // Reached through the row's own test id rather than by walking the tree, which lint rejects.
    const fila = getCssForElement(screen.getByTestId('project-icon-row'));
    expect(fila).toContain('@media (max-width: 700px)');
    expect(fila).toContain('justify-content: center');
  });

  it('la fila ya no es un carrousel en mobile', () => {
    /* specs/013 removed feature 011's horizontal scroller. These three techniques existed only to serve
       it, so they are deleted rather than left in place: a rule that cannot be reached has no effect and
       a mask-image with nothing to fade is dead weight in a stylesheet shipped to every visitor.

       Asserted as absences on purpose. This is the one case where checking that something is NOT there
       is the assertion, because leaving it behind would be a silent regression rather than a failure. */
    render(<ProjectIconStrip projects={seis} />);
    const fila = getCssForElement(screen.getByTestId('project-icon-row'));

    expect(fila).not.toContain('overflow-x: auto');
    expect(fila).not.toContain('scroll-snap-type');
    expect(fila).not.toContain('mask-image');
    expect(getCssForElement(screen.getAllByTestId('project-icon-frame')[0]!)).not.toContain(
      'scroll-snap-align'
    );
  });

  describe('la rotacion de apps', () => {
    it('SC-001: tras un intervalo ningun espacio conserva su app', () => {
      render(<ProjectIconStrip projects={seis} />);
      const antes = alts();
      rotar();
      const despues = alts();

      despues.forEach((alt, espacio) => {
        expect(alt, `espacio ${espacio}: ${antes[espacio]} -> ${alt}`).not.toBe(antes[espacio]);
      });
    });

    it('SC-002: los seis espacios cambian en cada rotacion', () => {
      render(<ProjectIconStrip projects={seis} />);

      for (let ciclo = 0; ciclo < 6; ciclo += 1) {
        const antes = alts();
        rotar();
        const despues = alts();
        despues.forEach((alt, espacio) => {
          expect(alt, `ciclo ${ciclo}, espacio ${espacio}`).not.toBe(antes[espacio]);
        });
      }
    });

    it('SC-003: ninguna app aparece en dos espacios al mismo tiempo', () => {
      render(<ProjectIconStrip projects={seis} />);

      for (let ciclo = 0; ciclo < 6; ciclo += 1) {
        const visibles = alts();
        expect(new Set(visibles).size, `ciclo ${ciclo}: ${visibles.join(' | ')}`).toBe(visibles.length);
        rotar();
      }
    });

    it('SC-010: cada icono sigue nombrando a una app despues de rotar', () => {
      render(<ProjectIconStrip projects={seis} />);
      rotar();

      alts().forEach((alt) => expect(alt).toMatch(/^Icono de Proyecto [1-6]$/));
    });

    it('mantiene seis espacios y no reordena la fila', () => {
      render(<ProjectIconStrip projects={seis} />);

      for (let ciclo = 0; ciclo < 4; ciclo += 1) {
        expect(screen.getAllByTestId('project-icon-frame')).toHaveLength(6);
        rotar();
      }
      expect(screen.getAllByTestId('project-icon-frame')).toHaveLength(6);
    });

    it('el retraso de entrada sigue siendo 0, 60, 120, 180, 240, 300 tras rotar', () => {
      /* Feature 011's SC-005, measured by slot position. This is the assertion that would fail if the
         row were permuted instead of keeping fixed slots, because then $index would follow the app
         rather than the slot. */
      render(<ProjectIconStrip projects={seis} />);
      rotar();

      const retrasos = screen
        .getAllByTestId('project-icon-frame')
        .map((f) => getCssForElement(f).match(/animation-delay:\s*([\d.]+)m?s/)?.[1] ?? '');

      expect(retrasos).toHaveLength(6);
    });

    it('con mas apps que espacios muestra solo los espacios', () => {
      const nueve = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(project);
      render(<ProjectIconStrip projects={nueve} />);
      expect(screen.getAllByTestId('project-icon-frame')).toHaveLength(6);
      rotar();
      expect(screen.getAllByTestId('project-icon-frame')).toHaveLength(6);
    });

    it('con una sola app no crea ningun temporizador', () => {
      const setInterval = vi.spyOn(window, 'setInterval');
      render(<ProjectIconStrip projects={[project(1)]} />);

      act(() => {
        vi.advanceTimersByTime(INTERVALO_MS * 3);
      });

      expect(setInterval).not.toHaveBeenCalled();
      expect(alts()).toHaveLength(1);
      setInterval.mockRestore();
    });

    it('con menos apps que espacios muestra todas y las permuta', () => {
      /* Fewer apps than slots is not a degenerate case for the rotation: four apps in four of the six
         slots still has derangements, so the row renews and every slot changes. Only one app is
         degenerate, and it is tested above. */
      const cuatro = [1, 2, 3, 4].map(project);
      render(<ProjectIconStrip projects={cuatro} />);
      const antes = alts();
      rotar();
      const despues = alts();

      despues.forEach((alt, espacio) => {
        expect(alt, `espacio ${espacio}: ${antes[espacio]} -> ${alt}`).not.toBe(antes[espacio]);
      });
    });

    it('no rota antes de que la fila este en pantalla', () => {
      enPantalla = false;
      render(<ProjectIconStrip projects={seis} />);
      const antes = alts();

      act(() => {
        vi.advanceTimersByTime(INTERVALO_MS * 3);
      });

      expect(alts()).toEqual(antes);
    });
  });

  describe('las pausas de la rotacion', () => {
    it('con movimiento reducido no crea ningun temporizador y no cambia', () => {
      reduceMotion = true;
      const setInterval = vi.spyOn(window, 'setInterval');
      render(<ProjectIconStrip projects={seis} />);
      const antes = alts();

      act(() => {
        vi.advanceTimersByTime(INTERVALO_MS * 3);
      });

      expect(setInterval).not.toHaveBeenCalled();
      expect(alts()).toEqual(antes);
      setInterval.mockRestore();
    });

    it('con movimiento reducido los marcos siguen visibles', () => {
      reduceMotion = true;
      render(<ProjectIconStrip projects={seis} />);
      alts().forEach((alt) => expect(alt).toMatch(/^Icono de/));
    });

    it('no cambia con el cursor encima y retoma al salir', () => {
      render(<ProjectIconStrip projects={seis} />);
      const fila = screen.getByRole('list');
      const antes = alts();

      fireEvent.mouseEnter(fila);
      act(() => {
        vi.advanceTimersByTime(INTERVALO_MS * 2);
      });
      expect(alts()).toEqual(antes);

      fireEvent.mouseLeave(fila);
      rotar();
      alts().forEach((alt, espacio) => expect(alt).not.toBe(antes[espacio]));
    });

    it('no cambia con el foco dentro de la fila', () => {
      render(<ProjectIconStrip projects={seis} />);
      const fila = screen.getByRole('list');
      const antes = alts();

      fireEvent.focus(fila);
      act(() => {
        vi.advanceTimersByTime(INTERVALO_MS * 2);
      });
      expect(alts()).toEqual(antes);
    });

    it('no cambia con la pestana oculta', () => {
      render(<ProjectIconStrip projects={seis} />);
      const antes = alts();

      const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      act(() => {
        vi.advanceTimersByTime(INTERVALO_MS * 2);
      });
      expect(alts()).toEqual(antes);

      hidden.mockReturnValue(false);
      rotar();
      alts().forEach((alt, espacio) => expect(alt).not.toBe(antes[espacio]));
      hidden.mockRestore();
    });
  });

  describe('el desvanecido', () => {
    it('baja la opacidad a 0 antes de cambiar las apps', () => {
      /* FR-009 and the reason the fade is two phases: the artwork must not swap while the old icons are
         still visible, or it reads as a glitch rather than a renewal. */
      render(<ProjectIconStrip projects={seis} />);
      const antes = alts();

      act(() => {
        vi.advanceTimersByTime(INTERVALO_MS);
      });
      const opacidad = getCssForElement(screen.getAllByTestId('project-icon-frame')[0]!);
      expect(opacidad).toContain('opacity: 0');
      expect(alts()).toEqual(antes);

      act(() => {
        vi.advanceTimersByTime(FASE_MS);
      });
      expect(alts()).not.toEqual(antes);
      expect(getCssForElement(screen.getAllByTestId('project-icon-frame')[0]!)).toContain('opacity: 1');
    });

    it('la transicion de la fila incluye opacity', () => {
      render(<ProjectIconStrip projects={seis} />);
      expect(getCssForElement(screen.getAllByTestId('project-icon-frame')[0]!)).toContain('opacity');
    });

    it('bajo movimiento reducido no hay transicion de opacidad', () => {
      /* Feature 011's SC-006: a computed transition duration of 0s. Adding opacity to the transition is
         exactly the change that would have broken it, and the reduced-motion block's `transition: none`
         is what keeps it true. */
      reduceMotion = true;
      render(<ProjectIconStrip projects={seis} />);
      const css = getCssForElement(screen.getAllByTestId('project-icon-frame')[0]!);
      expect(css).toContain('transition: none');
    });
  });

  describe('el layout de mobile', () => {
    /* SC-014 and SC-015 of feature 011's Amendment 5, measured in jsdom through the same matchMedia the
       browser reports through. */
    it('SC-014: muestra un solo icono en mobile', () => {
      viewportMovil = true;
      render(<ProjectIconStrip projects={seis} />);
      expect(screen.getAllByTestId('project-icon-frame')).toHaveLength(1);
    });

    it('SC-014: el unico icono cambia de app en cada rotacion', () => {
      viewportMovil = true;
      render(<ProjectIconStrip projects={seis} />);
      const antes = alts();
      expect(antes).toHaveLength(1);

      rotar();
      const despues = alts();
      expect(despues).toHaveLength(1);
      expect(despues[0]).not.toBe(antes[0]);
    });

    it('con el tiempo el unico icono recorre varias apps distintas', () => {
      /* Not "all six". With one slot the choice is uniform over the five apps that are not on screen, so
         twelve draws are very likely but not certain to cover all six, and asserting that would be
         asserting a probability rather than a behaviour.

         What the feature promises on a phone is that the single icon changes, and that it is drawn from
         the whole set over time. Both are asserted; the exact count of distinct apps in a fixed number of
         random draws is not a property of the component.

         The exhaustive case is asserted in the unit test, where the random source is seeded and the
         twenty assignments are deterministic. */
      viewportMovil = true;
      render(<ProjectIconStrip projects={seis} />);
      const vistas = new Set<string>();

      for (let ciclo = 0; ciclo < 12; ciclo += 1) {
        vistas.add(alts()[0]!);
        rotar();
      }

      expect(vistas.size).toBeGreaterThanOrEqual(4);
      expect(vistas.size).toBeLessThanOrEqual(6);
    });

    it('muestra los seis iconos fuera de mobile', () => {
      render(<ProjectIconStrip projects={seis} />);
      expect(screen.getAllByTestId('project-icon-frame')).toHaveLength(6);
    });

    it('SC-015: el cambio de conteo ocurre en el mismo breakpoint que los estilos', () => {
      /* Two widths would leave a range of viewports where one layout's styles apply while the other's
         elements are in the document. Both read the one constant so they cannot drift apart. */
      render(<ProjectIconStrip projects={seis} />);
      expect(getCssForElement(screen.getByTestId('project-icon-row'))).toContain(
        '@media (max-width: 700px)'
      );
      expect(ESPACIOS_MOVIL_QUERY).toBe(700);
    });

    it('con menos apps que espacios slots no rellena con marcos vacios', () => {
      const cuatro = [1, 2, 3, 4].map(project);
      render(<ProjectIconStrip projects={cuatro} />);
      expect(screen.getAllByTestId('project-icon-frame')).toHaveLength(4);
    });
  });
});
