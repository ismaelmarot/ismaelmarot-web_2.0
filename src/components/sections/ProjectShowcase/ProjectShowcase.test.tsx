import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { ProjectShowcase } from './ProjectShowcase';
import { ReducedMotionProvider } from '@/hooks/useReducedMotion';
import { INTERVALO_MS } from './showcaseRotation';
import type { Project } from '@/types/project';

const proyectosBase = [
  ['p1', 'Uno', 'Primera app'],
  ['p2', 'Dos', 'Segunda app'],
  ['p3', 'Tres', 'Tercera app'],
  ['p4', 'Cuatro', 'Cuarta app'],
  ['p5', 'Cinco', 'Quinta app'],
  ['p6', 'Seis', 'Sexta app'],
] as const;

const proyectos: Project[] = proyectosBase.map(([id, name, description]) => ({
  id,
  name,
  description,
  technologies: [],
  githubUrl: `https://github.com/ejemplo/${id}`,
  screenshotUrls: [`https://example.com/${id}.png`],
  lastUpdated: '2026-01-01',
}));

/**
 * The project name of the scene in a given column.
 *
 * Read through `within` rather than `querySelector`, so the assertions use the same accessible surface
 * a visitor's screen reader would and the tests stay honest about what is actually exposed.
 */
const nombreEnLaColumna = (columna: number) =>
  within(screen.getAllByTestId('showcase-scene')[columna]!).getByRole('heading', {
    level: 3,
  }).textContent;

/** The caption of a scene, as the visitor reads it. */
const descripcionDeLaColumna = (columna: number) =>
  within(screen.getAllByTestId('showcase-scene')[columna]!).getByText(
    (_, elemento) => elemento?.tagName === 'P'
  ).textContent;

describe('ProjectShowcase', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renderiza cuatro escenas con seis proyectos', () => {
    render(<ProjectShowcase projects={proyectos} />);
    expect(screen.getAllByTestId('showcase-scene')).toHaveLength(4);
  });

  it('muestra cuatro proyectos distintos a la vez', () => {
    render(<ProjectShowcase projects={proyectos} />);
    const nombres = [0, 1, 2, 3].map(nombreEnLaColumna);
    expect(new Set(nombres).size).toBe(4);
  });

  it('cada escena lleva un panel trasero y uno delantero', () => {
    render(<ProjectShowcase projects={proyectos} />);
    expect(screen.getAllByTestId('showcase-back-panel')).toHaveLength(4);
    expect(screen.getAllByTestId('showcase-front-panel')).toHaveLength(4);
  });

  it('cada escena lleva el nombre y la descripción de su proyecto', () => {
    render(<ProjectShowcase projects={proyectos} />);
    for (let columna = 0; columna < 4; columna += 1) {
      expect(nombreEnLaColumna(columna)).toBeTruthy();
      expect(descripcionDeLaColumna(columna)).toBeTruthy();
    }
  });

  it('la descripción de una escena es la del proyecto que la acompaña', () => {
    render(<ProjectShowcase projects={proyectos} />);
    // Every fixture pairs "Uno" with "Primera app", so a mismatch between the two halves of a caption
    // would show up as a description that does not belong to its own name.
    const nombre = nombreEnLaColumna(0);
    const esperado = proyectosBase.find(([, n]) => n === nombre)?.[2];
    expect(descripcionDeLaColumna(0)).toBe(esperado);
  });

  it('la captura de cada escena pertenece a su propio proyecto', () => {
    render(<ProjectShowcase projects={proyectos} />);
    const alts = screen.getAllByRole('img').map((img) => img.getAttribute('alt'));
    for (let columna = 0; columna < 4; columna += 1) {
      expect(alts[columna]).toBe(`Captura de ${nombreEnLaColumna(columna)}`);
    }
  });

  it('rota los proyectos al cumplirse el intervalo', () => {
    render(<ProjectShowcase projects={proyectos} />);
    const antes = nombreEnLaColumna(0);
    act(() => {
      vi.advanceTimersByTime(INTERVALO_MS);
    });
    expect(nombreEnLaColumna(0)).not.toBe(antes);
  });

  it('no repite un proyecto en la misma columna tras rotar', () => {
    render(<ProjectShowcase projects={proyectos} />);
    const antes = [0, 1, 2, 3].map(nombreEnLaColumna);
    act(() => {
      vi.advanceTimersByTime(INTERVALO_MS);
    });
    const despues = [0, 1, 2, 3].map(nombreEnLaColumna);

    // Not just the first column: every column must move on, which is what stops a project from
    // reappearing where the visitor just read it.
    for (let columna = 0; columna < 4; columna += 1) {
      expect(despues[columna]).not.toBe(antes[columna]);
    }
    // Still four distinct projects after the swap.
    expect(new Set(despues).size).toBe(4);
  });

  it('se detiene al pasar el puntero por encima', () => {
    render(<ProjectShowcase projects={proyectos} />);
    fireEvent.mouseEnter(screen.getByTestId('project-showcase'));

    const antes = [0, 1, 2, 3].map(nombreEnLaColumna);
    act(() => {
      vi.advanceTimersByTime(INTERVALO_MS * 3);
    });
    expect([0, 1, 2, 3].map(nombreEnLaColumna)).toEqual(antes);
  });

  it('vuelve a rotar al salir con el puntero', () => {
    render(<ProjectShowcase projects={proyectos} />);
    const contenedor = screen.getByTestId('project-showcase');

    fireEvent.mouseEnter(contenedor);
    const antes = nombreEnLaColumna(0);
    act(() => {
      vi.advanceTimersByTime(INTERVALO_MS * 3);
    });
    expect(nombreEnLaColumna(0)).toBe(antes);

    fireEvent.mouseLeave(contenedor);
    act(() => {
      vi.advanceTimersByTime(INTERVALO_MS);
    });
    expect(nombreEnLaColumna(0)).not.toBe(antes);
  });

  it('se detiene mientras el documento está oculto', () => {
    render(<ProjectShowcase projects={proyectos} />);
    const oculto = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);

    const antes = [0, 1, 2, 3].map(nombreEnLaColumna);
    act(() => {
      vi.advanceTimersByTime(INTERVALO_MS * 2);
    });
    expect([0, 1, 2, 3].map(nombreEnLaColumna)).toEqual(antes);
    oculto.mockRestore();
  });

  it('no rota con movimiento reducido', () => {
    // The hook reads the preference through a provider rather than calling matchMedia directly, so the
    // context has to be what carries it.
    vi.mocked(window.matchMedia).mockImplementation(
      (query: string) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList
    );

    render(
      <ReducedMotionProvider>
        <ProjectShowcase projects={proyectos} />
      </ReducedMotionProvider>
    );

    const antes = [0, 1, 2, 3].map(nombreEnLaColumna);
    act(() => {
      vi.advanceTimersByTime(INTERVALO_MS * 4);
    });
    expect([0, 1, 2, 3].map(nombreEnLaColumna)).toEqual(antes);
  });

  it('no renderiza un control play/pause', () => {
    render(<ProjectShowcase projects={proyectos} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('el panel trasero es decorativo y la captura no', () => {
    render(<ProjectShowcase projects={proyectos} />);
    expect(screen.getAllByTestId('showcase-back-panel')[0]).toHaveAttribute('aria-hidden', 'true');
    for (const img of screen.getAllByRole('img')) {
      expect(img.getAttribute('alt')).toMatch(/^Captura de \S/);
    }
  });

  it('no renderiza nada sin proyectos', () => {
    const { container } = render(<ProjectShowcase projects={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('muestra menos columnas si hay menos proyectos que columnas', () => {
    render(<ProjectShowcase projects={proyectos.slice(0, 2)} />);
    expect(screen.getAllByTestId('showcase-scene')).toHaveLength(2);
  });

  it('no rota si todos los proyectos caben a la vez', () => {
    render(<ProjectShowcase projects={proyectos.slice(0, 3)} />);
    const antes = nombreEnLaColumna(0);
    act(() => {
      vi.advanceTimersByTime(INTERVALO_MS * 3);
    });
    expect(nombreEnLaColumna(0)).toBe(antes);
  });

  it('mantiene nombre y descripción si la captura falla', () => {
    render(<ProjectShowcase projects={proyectos} />);
    fireEvent.error(screen.getAllByRole('img')[0]!);

    // The scene keeps its place in the grid and its caption; only the artwork is replaced by the
    // neutral surface.
    expect(screen.getAllByTestId('showcase-scene')).toHaveLength(4);
    expect(nombreEnLaColumna(0)).toBeTruthy();
    expect(descripcionDeLaColumna(0)).toBeTruthy();
    expect(screen.getAllByTestId('showcase-back-panel')).toHaveLength(4);
    // Three images remain; the failed one became a fallback.
    expect(screen.getAllByRole('img')).toHaveLength(3);
  });

  it('cada captura se carga de forma diferida', () => {
    render(<ProjectShowcase projects={proyectos} />);
    for (const img of screen.getAllByRole('img')) {
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('decoding', 'async');
    }
  });
});