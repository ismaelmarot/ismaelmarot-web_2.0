import {
  COLUMNAS,
  CICLOS,
  projectIndexes,
} from '@/components/sections/ProjectShowcase/showcaseRotation';
import {
  accentDeProyecto,
  PALETA_POR_DEFECTO,
} from '@/components/sections/ProjectShowcase/showcaseScenes';

const TOTAL = 6;

describe('projectIndexes', () => {
  it('shows four different projects at a time', () => {
    for (let ciclo = 0; ciclo < 6; ciclo += 1) {
      const visibles = projectIndexes(ciclo, TOTAL).slice(0, COLUMNAS);
      expect(visibles).toHaveLength(COLUMNAS);
      expect(new Set(visibles).size).toBe(COLUMNAS);
    }
  });

  it('never repeats a project in the same column on consecutive cycles', () => {
    // Checked against the previous cycle rather than the next, and across the wrap from the last built
    // arrangement into the shifted ones, which is where a naive rotation breaks.
    for (let ciclo = 1; ciclo < 12; ciclo += 1) {
      const anterior = projectIndexes(ciclo - 1, TOTAL);
      const actual = projectIndexes(ciclo, TOTAL);
      for (let columna = 0; columna < COLUMNAS; columna += 1) {
        expect(actual[columna]).not.toBe(anterior[columna]);
      }
    }
  });

  it('shows every project exactly twice across the three built cycles', () => {
    const vistos = Array.from({ length: TOTAL }, () => 0);
    for (let ciclo = 0; ciclo < CICLOS; ciclo += 1) {
      for (const indice of projectIndexes(ciclo, TOTAL).slice(0, COLUMNAS)) {
        vistos[indice] = (vistos[indice] ?? 0) + 1;
      }
    }
    // The most even distribution six projects and four columns allow.
    expect(vistos).toEqual([2, 2, 2, 2, 2, 2]);
  });

  it('keeps showing four valid indexes for any list length', () => {
    for (const total of [1, 2, 3, 4, 5, 6, 9, 12]) {
      for (let ciclo = 0; ciclo < 5; ciclo += 1) {
        for (const indice of projectIndexes(ciclo, total)) {
          expect(Number.isInteger(indice)).toBe(true);
          expect(indice).toBeGreaterThanOrEqual(0);
          expect(indice).toBeLessThan(total);
        }
      }
    }
  });

  it('does not repeat within a cycle when there are fewer projects than columns', () => {
    // With three projects and four columns the guard lives in the component, which renders fewer columns.
    // What matters here is that the rotation never returns an index outside the list.
    const visibles = projectIndexes(0, 3).slice(0, 3);
    expect(new Set(visibles).size).toBe(3);
  });
});

describe('accentDeProyecto', () => {
  const ids = [
    '1202000505',
    '1230404944',
    '1218376438',
    '904467125',
    '1055132737',
    '1176188329',
  ];

  it('gives every mapped project a distinct pair of colours', () => {
    const pares = ids.map((id) => {
      const accent = accentDeProyecto(id);
      return `${accent.from}-${accent.to}`;
    });
    expect(new Set(pares).size).toBe(ids.length);
  });

  it('is stable for an unknown id, so a scene does not change colour between renders', () => {
    expect(accentDeProyecto('un-repositorio-nuevo')).toEqual(accentDeProyecto('un-repositorio-nuevo'));
  });

  it('falls back to one of the known palettes for an unknown id', () => {
    expect(PALETA_POR_DEFECTO).toContainEqual(accentDeProyecto('9999999999'));
  });

  it('returns hex stops rather than empty values', () => {
    for (const id of [...ids, '9999999999']) {
      const accent = accentDeProyecto(id);
      expect(accent.from).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(accent.to).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});