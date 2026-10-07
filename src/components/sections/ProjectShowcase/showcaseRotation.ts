/**
 * How the showcase picks which project sits in which scene.
 *
 * Four scenes and six projects means four are visible at a time and two are not, and the request is that
 * no project repeats in the same column on consecutive cycles. The arrangement below is built for that
 * rather than shuffled at random: a random shuffle satisfies neither condition reliably, and `SC-005`
 * asserts both.
 *
 * With 6 projects and 4 columns there are 3 distinct cycles, so each project appears exactly twice: that is
 * the most even distribution the arithmetic allows, and it is what `SC-005` measures.
 */

/** How many scenes are visible at once. */
export const COLUMNAS = 4;

/** How long a cycle lasts, in milliseconds. Short enough to see every project, long enough to read. */
export const INTERVALO_MS = 6000;

/**
 * The arrangements, as indexes into the project list.
 *
 * Each project moves two columns per cycle, which is what guarantees it never lands in the column it just
 * left, and the arrangements are pairwise disjoint in every column, so no column ever shows the same
 * project on consecutive cycles.
 */
const DISTRIBUCION: readonly (readonly number[])[] = [
  [0, 1, 2, 3],
  [2, 3, 4, 5],
  [4, 5, 0, 1],
];

/** The number of distinct arrangements before the list repeats. */
export const CICLOS = DISTRIBUCION.length;

/**
 * The project indexes visible at a given cycle.
 *
 * Driven by an explicit counter rather than derived from whatever is currently on screen. The prototype
 * inferred the next cycle from the project in the first column, which is ambiguous precisely because a
 * project belongs to more than one arrangement: from cycle 1 that inference returned cycle 1 again. A
 * counter has no such ambiguity, and the property that matters is decided here rather than repaired
 * afterwards.
 *
 * Past the three built arrangements the whole list keeps shifting by two columns per lap, so the no-repeat
 * property survives every further cycle rather than only the first three.
 */
export function projectIndexes(ciclo: number, total: number): number[] {
  const base = DISTRIBUCION[ciclo % CICLOS]!;
  const vueltas = Math.floor(ciclo / CICLOS);
  return base.map((indice) => (indice + vueltas * 2) % total);
}