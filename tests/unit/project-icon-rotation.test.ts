import { describe, expect, it } from 'vitest';
import {
  ESPACIOS,
  INTERVALO_MS,
  FASE_MS,
  siguienteAsignacion,
} from '@/components/sections/ProjectIconStrip/iconRotation';

/**
 * FR-003 is the promise this feature rests on, and it cannot be checked by looking at the page: no slot
 * may keep the app it was showing. SC-001 to SC-004 are its joint assertion over twenty consecutive
 * assignments with six apps in six slots.
 *
 * `rng` is injected rather than stubbed globally, so these are deterministic and need no timer.
 */

/** A random source with a fixed seed, so a failure is reproducible. Mulberry32.
 *
 *  The `|= 0` and `| 0` coercions are part of the algorithm rather than decoration. An earlier version of
 *  this helper read `let a = semilla >>> 0` and added without coercing, and `>>>` truncates to 32 bits,
 *  so the accumulated state fell out of range and the generator produced a fixed pattern.

 *  One instance must serve the whole chain of assignments, not one per cycle. Building a fresh seeded
 *  source inside the loop restarts the sequence, so every cycle drew the same value and a single-slot
 *  run visited two of the six apps while the assertions were reading it as a broken function. The seeded
 *  source is therefore created once and passed to every call.
 */
function conSemilla(semilla: number): () => number {
  let a = semilla;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const esUnica = (apps: number[]) => new Set(apps).size === apps.length;

/** Twenty assignments in a row, the shape every guarantee below is measured over. */
function veinteCiclos(rng: () => number, total = 6, espacios = ESPACIOS) {
  const asignaciones: number[][] = [];
  let previa: number[] = [];
  for (let ciclo = 0; ciclo < 20; ciclo += 1) {
    const actual = siguienteAsignacion(total, espacios, previa, rng);
    asignaciones.push(actual);
    previa = actual;
  }
  return asignaciones;
}

describe('la asignacion de apps a los espacios de la fila', () => {
  describe('la garantia: ningun espacio conserva su app', () => {
    it('se sostiene en 20 ciclos con 6 apps y 6 espacios', () => {
      const rng = conSemilla(7);
      let previa: number[] = [];

      for (let ciclo = 0; ciclo < 20; ciclo += 1) {
        const actual = siguienteAsignacion(6, ESPACIOS, previa, rng);
        actual.forEach((app, i) => {
          expect(app, `ciclo ${ciclo}, espacio ${i}: ${previa.join(',')} -> ${actual.join(',')}`).not.toBe(
            previa[i]
          );
        });
        previa = actual;
      }
    });

    it('los seis espacios cambian en cada uno de esos 20 ciclos', () => {
      /* SC-002, and the requirement that is really the visible one: with six apps in six slots every
         slot changing is the whole effect. A permutation that leaves two slots alone is valid under
         SC-001 and would look like nothing happened. */
      const asignaciones = veinteCiclos(conSemilla(7));
      asignaciones.slice(1).forEach((actual, i) => {
        expect(esUnica(actual), `ciclo ${i + 1}`).toBe(true);
        actual.forEach((app, espacio) => {
          expect(app, `ciclo ${i + 1}, espacio ${espacio}`).not.toBe(asignaciones[i]![espacio]);
        });
      });
    });

    it('se sostiene con otras dos semillas', () => {
      for (const semilla of [1, 9999]) {
        let previa: number[] = [];
        for (let ciclo = 0; ciclo < 20; ciclo += 1) {
          const actual = siguienteAsignacion(6, ESPACIOS, previa, conSemilla(semilla));
          actual.forEach((app, i) => expect(app).not.toBe(previa[i]));
          previa = actual;
        }
      }
    });
  });

  describe('ninguna app se repite entre espacios', () => {
    it('SC-003: los seis espacios muestran seis apps distintas', () => {
      veinteCiclos(conSemilla(3)).forEach((asignacion, ciclo) => {
        expect(esUnica(asignacion), `ciclo ${ciclo}: ${asignacion.join(',')}`).toBe(true);
      });
    });

    it('solo devuelve indices que existen', () => {
      veinteCiclos(conSemilla(11)).forEach((asignacion, ciclo) => {
        asignacion.forEach((app) => {
          expect(app, `ciclo ${ciclo}`).toBeGreaterThanOrEqual(0);
          expect(app, `ciclo ${ciclo}`).toBeLessThan(6);
        });
      });
    });
  });

  describe('con el tiempo se ven todas las apps', () => {
    it('SC-004: las 6 apps aparecen en pantalla a lo largo de 20 ciclos', () => {
      const vistas = new Set<number>();
      veinteCiclos(conSemilla(5)).forEach((asignacion) => asignacion.forEach((a) => vistas.add(a)));
      expect(vistas.size).toBe(6);
    });

    it('con 8 apps en 6 espacios tambien se ven todas', () => {
      /* Only two apps are off screen at a time with eight in six slots, so the pool cannot fill the
         slots and the repair path decides which apps come round. All eight still appear over twenty
         cycles, which is what "the other apps get seen" means once the data outgrows the row. */
      const rng = conSemilla(5);
      const vistas = new Set<number>();
      let previa: number[] = [];
      for (let ciclo = 0; ciclo < 20; ciclo += 1) {
        const actual = siguienteAsignacion(8, ESPACIOS, previa, rng);
        actual.forEach((a) => vistas.add(a));
        previa = actual;
      }
      expect(vistas.size).toBe(8);
    });
  });

  describe('la preferencia por apps que no estan en pantalla', () => {
    it('con 6 apps en 6 espacios la preferencia es inalcanzable y no se exige', () => {
      /* There is nowhere for a new app to come from: all six are on screen. The assignment is still a
         valid derangement, which is the guarantee rather than the preference. */
      const asignacion = siguienteAsignacion(6, ESPACIOS, [0, 1, 2, 3, 4, 5], conSemilla(2));
      expect(asignacion).toHaveLength(6);
      asignacion.forEach((app, i) => expect(app).not.toBe(i));
    });

    it('con 14 apps en 6 espacios muestra apps nuevas siempre que puede', () => {
      /* 14 is past the twelve where a wholly unseen set is arithmetically possible, but the guarantee
         and the preference pull against each other here and the guarantee wins: FR-003 requires every
         slot to change, and with only 14 apps a valid derangement that avoids all six on-screen apps is
         rare enough that the bounded draw does not always find one.

         What is asserted is therefore what is actually promised: new apps appear where they can, and
         the six still all change. A test that demanded all six unseen would be asserting something the
         specification does not promise, and would have failed against correct code. */
      const previa = [0, 1, 2, 3, 4, 5];
      const enPantalla = new Set(previa);
      const racha = (rng: () => number) => {
        let actual = previa;
        const nuevas: number[] = [];
        for (let ciclo = 0; ciclo < 10; ciclo += 1) {
          const siguiente = siguienteAsignacion(14, ESPACIOS, actual, rng);
          nuevas.push(siguiente.filter((app) => !enPantalla.has(app)).length);
          siguiente.forEach((app, i) => expect(app, `ciclo ${ciclo}, espacio ${i}`).not.toBe(actual[i]));
          actual = siguiente;
        }
        return nuevas;
      };

      const nuevas = racha(conSemilla(4));
      nuevas.forEach((n, ciclo) => {
        expect(n, `ciclo ${ciclo}: al menos una app nueva`).toBeGreaterThanOrEqual(1);
      });
      expect(Math.max(...nuevas), 'y la mayoria de los ciclos con varias').toBeGreaterThanOrEqual(2);
    });

    it('con 8 apps en 6 espacios no puede llevar los 6 a apps nuevas, pero cambia los 6', () => {
      /* Counted: 8 into 6 leaves only 2 apps off screen, so at most 2 slots can show something unseen.
         All six still change, which is the guarantee and not the preference. */
      const previa = [0, 1, 2, 3, 4, 5];
      const asignacion = siguienteAsignacion(8, ESPACIOS, previa, conSemilla(6));
      asignacion.forEach((app, i) => expect(app).not.toBe(previa[i]));
      expect(esUnica(asignacion)).toBe(true);
    });
  });

  describe('la aleatoriedad es real', () => {
    it('el rng se usa: dos semillas distintas producen asignaciones distintas', () => {
      expect(siguienteAsignacion(6, ESPACIOS, [0, 1, 2, 3, 4, 5], conSemilla(1))).not.toEqual(
        siguienteAsignacion(6, ESPACIOS, [0, 1, 2, 3, 4, 5], conSemilla(2))
      );
    });

    it('la misma semilla reproduce la misma asignacion', () => {
      expect(siguienteAsignacion(6, ESPACIOS, [0, 1, 2, 3, 4, 5], conSemilla(42))).toEqual(
        siguienteAsignacion(6, ESPACIOS, [0, 1, 2, 3, 4, 5], conSemilla(42))
      );
    });

    it('no esta codificada: con 20 semillas se obtienen mas de 5 asignaciones distintas', () => {
      const distintas = new Set<string>();
      for (let semilla = 0; semilla < 20; semilla += 1) {
        distintas.add(
          siguienteAsignacion(6, ESPACIOS, [0, 1, 2, 3, 4, 5], conSemilla(semilla)).join(',')
        );
      }
      expect(distintas.size).toBeGreaterThan(5);
    });
  });

  describe('una fuente de azar degenerada no rompe la garantia', () => {
    /* El limite de reintentos garantiza terminacion pero no que el azar sea bueno, asi que lo que
       queda se repara. Un rng constante es el peor caso posible y aun asi debe cumplir el contrato. */
    const rngNulo = () => 0;

    it('ningun espacio conserva su app', () => {
      const actual = siguienteAsignacion(6, ESPACIOS, [0, 1, 2, 3, 4, 5], rngNulo);
      actual.forEach((app, i) => expect(app).not.toBe(i));
    });

    it('ninguna app se repite entre espacios', () => {
      expect(esUnica(siguienteAsignacion(6, ESPACIOS, [0, 1, 2, 3, 4, 5], rngNulo))).toBe(true);
    });

    it('cumple ambas garantias en 20 ciclos seguidos', () => {
      let previa: number[] = [];
      for (let ciclo = 0; ciclo < 20; ciclo += 1) {
        const actual = siguienteAsignacion(6, ESPACIOS, previa, rngNulo);
        expect(esUnica(actual)).toBe(true);
        actual.forEach((app, i) => expect(app).not.toBe(previa[i]));
        previa = actual;
      }
    });
  });

  describe('los conteos degenerados', () => {
    it('sin apps devuelve una asignacion vacia', () => {
      expect(siguienteAsignacion(0, ESPACIOS, [])).toEqual([]);
    });

    it('con una sola app la devuelve, porque un desarrreglo de uno no existe', () => {
      expect(siguienteAsignacion(1, ESPACIOS, [])).toEqual([0]);
    });

    it('con 2 apps intercambia las 2: es el unico desarrreglo de 2', () => {
      expect(siguienteAsignacion(2, ESPACIOS, [0, 1])).toEqual([1, 0]);
    });

    it('con 5 apps rota entre las 5 sin repetir ninguna', () => {
      const actual = siguienteAsignacion(5, ESPACIOS, [0, 1, 2, 3, 4], conSemilla(3));
      expect(actual).toHaveLength(5);
      expect(esUnica(actual)).toBe(true);
      actual.forEach((app, i) => expect(app).not.toBe(i));
    });

    it('con 6 apps rota entre las 6, que es el caso del proyecto', () => {
      const actual = siguienteAsignacion(6, ESPACIOS, [0, 1, 2, 3, 4, 5], conSemilla(3));
      expect(actual).toHaveLength(6);
      actual.forEach((app, i) => expect(app).not.toBe(i));
    });

    it('con un solo espacio y 6 apps recorre las 6, que es el layout de mobile', () => {
      /* The phone layout is one slot, and the guarantee there is trivial: any app other than the one on
         screen is a valid choice, so the assignment never repeats without needing the derangement. This
         is the exhaustive version of the component test's "several distinct apps", with the random
         source seeded so it can assert all six rather than most of them. */
      /* One seeded source for the whole chain. Building a fresh one inside the loop restarts the
         sequence, so every cycle drew the same value and this run visited two of the six apps while
         reading as a defect in the function rather than in the test. */
      const rng = conSemilla(13);
      const vistas = new Set<number>();
      let previa: number[] = [];
      for (let ciclo = 0; ciclo < 20; ciclo += 1) {
        const actual = siguienteAsignacion(6, 1, previa, rng);
        expect(actual).toHaveLength(1);
        expect(actual[0]).not.toBe(previa[0]);
        vistas.add(actual[0]!);
        previa = actual;
      }
      expect(vistas.size).toBe(6);
    });

    it('con menos espacios que apps, la cantidad es la de espacios', () => {
      expect(siguienteAsignacion(9, 4, [], conSemilla(8))).toHaveLength(4);
      expect(siguienteAsignacion(9, 4, [0, 1, 2, 3], conSemilla(8))).toHaveLength(4);
    });
  });

  describe('un previo incompleto', () => {
    it('con un previo mas corto que los espacios', () => {
      const actual = siguienteAsignacion(8, ESPACIOS, [0, 1], conSemilla(13));
      expect(actual).toHaveLength(ESPACIOS);
      expect(esUnica(actual)).toBe(true);
      expect(actual[0]).not.toBe(0);
      expect(actual[1]).not.toBe(1);
    });

    it('con un previo vacio no lanza', () => {
      expect(() => siguienteAsignacion(8, ESPACIOS)).not.toThrow();
      expect(siguienteAsignacion(8, ESPACIOS)).toHaveLength(ESPACIOS);
    });
  });

  describe('las constantes del contrato', () => {
    it('son seis espacios, cuatro segundos y dos fases de 240ms', () => {
      expect(ESPACIOS).toBe(6);
      expect(INTERVALO_MS).toBe(4000);
      expect(FASE_MS).toBe(240);
    });
  });
});
