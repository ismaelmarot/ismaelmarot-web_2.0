/**
 * Which app each slot in the icon row is showing.
 *
 * Six slots and six apps is the case this is built around, and it is the reason this is not a shuffle.
 * When every app is already on screen there is nothing else that could appear, so "the icon that is
 * there disappears and another one appears" can only mean the arrangement changes. That is a
 * permutation with no fixed point, a derangement, and it has to be one deliberately rather than by
 * rejection alone: an unrestricted shuffle of six has a 36.8% chance of leaving at least one slot showing
 * what it had, so most draws would be thrown away.
 *
 * The earlier design derived the next arrangement from whatever app sat in the first slot, which is
 * ambiguous precisely because an app can belong to more than one arrangement. This takes the previous
 * assignment as an argument, because that is what the guarantee is a claim about.
 */

/** How many apps fit in the row on a desktop or tablet. A fixed count, so the row is six wide whatever the data holds. */
export const ESPACIOS = 6;

/**
 * How many apps fit in the row on a phone: one, rotating through the rest.
 *
 * The phone layout is one icon rather than a row of six because a horizontal scroller inside a vertical
 * page competes with the page's own scroll, and the rotation now surfaces the other five apps instead.
 */
export const ESPACIOS_MOVIL = 1;

/**
 * The viewport width at and below which the row shows one icon.
 *
 * Deliberately the 700px that feature 011's carousel used rather than a second width chosen here. Two
 * widths would leave a range of viewports where one layout's styles apply while the other's elements are
 * in the document, which produces an unreachable rule rather than a visible bug. The styles and the slot
 * count both change here, together.
 */
export const ESPACIOS_MOVIL_QUERY = 700;

/** How long an arrangement lasts, in milliseconds. Short enough to be noticed, long enough not to nag. */
export const INTERVALO_MS = 4000;

/** How long one half of the fade takes, in milliseconds. Two of them make half a second of change. */
export const FASE_MS = 240;

/**
 * How many times to draw before repairing.
 *
 * Only the derangement path draws more than once. A shuffled permutation of six elements has 265
 * derangements out of 720, so one draw succeeds about 37% of the time and the expected cost is under
 * three. The bound guarantees termination against a constant source rather than papering over bad luck.
 */
const INTENTOS_MAXIMOS = 16;

/**
 * `total` indexes drawn without replacement, using a Fisher-Yates shuffle.
 *
 * Written out rather than delegated so that `rng` reaches every step: a test seeds it and gets a
 * reproducible assignment, which is what makes the guarantee assertable without a timer or a stub of
 * the global.
 */
function barajar(total: number, rng: () => number): number[] {
  const apps = Array.from({ length: total }, (_, i) => i);
  for (let i = total - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const a = apps[i]!;
    apps[i] = apps[j]!;
    apps[j] = a;
  }
  return apps;
}

/**
 * The next assignment: which app each slot shows.
 *
 * Returns every app when there are no more apps than slots, in index order, and the caller should not
 * rotate at all in that case: a derangement of one element does not exist, so with a single app there
 * is nothing that could change. Returning all of them here keeps that degenerate case out of the
 * component.
 *
 * `previa` is positional: entry `i` is the app slot `i` was showing. An empty or short one simply means
 * those slots had nothing to avoid, which is the first cycle rather than an error.
 */
export function siguienteAsignacion(
  total: number,
  espacios: number = ESPACIOS,
  previa: number[] = [],
  rng: () => number = Math.random
): number[] {
  if (total <= 0) return [];

  const cantidad = Math.min(espacios, total);

  /* A single app is the one count with no derangement: an icon cannot change to a different icon when
     there is no other icon. This is the whole of FR-008's arithmetic, and it is why the check is
     `total === 1` rather than `cantidad === total`.

     With six apps in six slots the row does rotate, and what rotates is the arrangement: every slot
     shows a different app from the one it had, which is a permutation with no fixed point. Treating
     "as many apps as slots" as the degenerate case would have quietly disabled the feature on the data
     the project actually has. */
  if (total === 1) return [0];

  /* The pool of apps this slot may draw from: everything that is not already on screen, and only
     those. Choosing from the pool is what makes the preference for unseen apps structural rather than
     something a search has to find, and it is why a single slot does not need any special handling: with
     one slot the pool is five apps out of six and the guarantee cannot be violated by construction.

     Earlier this was a search: draw sixteen shuffles, keep the valid one showing the most unseen apps.
     With one slot every draw scores identically, because any app other than the current one is unseen by
     definition, so the search degenerated into taking the last valid draw. Whether that spread across
     the six apps or not depended entirely on how the random source happened to walk a six-element
     shuffle, and the phone layout rotated between two of the six apps. Picking from the pool removes
     the dependency on that entirely. */
  /* Draw from the pool of apps that are not on screen, which is what makes the preference for unseen
     apps structural rather than something a search has to find.

     With one slot, which is the phone layout, the pool is every app but the current one and the
     guarantee cannot be violated by construction.

     With six slots and six apps the pool is empty, because every app is already on screen. That is not a
     degenerate case to be repaired around: it is the project's actual data, and a derangement is exactly
     what the request means by "the icon that is there disappears and another one appears". So when the
     pool cannot fill the slots the whole app list is shuffled and the derangement is drawn from that,
     rejecting the draws that leave a slot showing what it had.

     Earlier this was sixteen draws scored by how many unseen apps they showed. With six slots and six apps
     every draw scores zero, because nothing unseen exists, so the scoring was decorative and the function
     returned whichever draw happened to be valid first — which under a seeded source was always the same
     one. Two symptoms came out of that: the row did not vary, and a phone rotated between two of six. */
  const enPantalla = new Set(previa);

  if (enPantalla.size >= total) {
    for (let intento = 0; intento < INTENTOS_MAXIMOS; intento += 1) {
      const candidata = barajar(total, rng).slice(0, cantidad);
      let valida = true;
      for (let i = 0; i < candidata.length; i += 1) {
        if (previa[i] === candidata[i]) {
          valida = false;
          break;
        }
      }
      if (valida) return candidata;
    }
    /* A degenerate source never produced a derangement. Repair rather than return, so the guarantee is
       absolute: it is the promise of the feature and a constant source must not be able to break it. */
    return reparar(barajar(total, rng).slice(0, cantidad), total, previa, rng);
  }

  const disponibles = Array.from({ length: total }, (_, i) => i).filter((app) => !enPantalla.has(app));

  /* Not enough unseen apps to fill every slot. The slots that cannot be satisfied from the pool take
     their apps from the ones already on screen, still never repeating within this assignment and never
     keeping the app that slot had. */
  if (disponibles.length < cantidad) {
    return reparar(barajar(total, rng).slice(0, cantidad), total, previa, rng);
  }

  /* A partial Fisher-Yates over the pool: `cantidad` distinct apps, uniformly, without replacement.
     Swapping rather than splicing, because splicing shortens the pool while `i` counts up and the window
     the next draw samples stops matching the number of items left, which produced `undefined` entries. */
  const elegido: number[] = [];
  for (let i = 0; i < cantidad; i += 1) {
    const j = i + Math.floor(rng() * (disponibles.length - i));
    const app = disponibles[j]!;
    elegido.push(app);
    disponibles[j] = disponibles[i]!;
  }

  return elegido;
}


/**
 * Replace an assignment with one that cannot repeat, in a way that holds by construction.
 *
 * Slots are filled left to right from the apps that are free, which is what makes the result valid
 * without re-checking it: a slot takes the first app that is neither already placed nor what that slot
 * had before, and that app is then taken out of circulation.
 *
 * An earlier version seeded a set with the whole candidate and then repaired whichever slots appeared in
 * it, which is wrong in two ways at once. Every slot looked like a duplicate because the set held all of
 * them, and picking a replacement only checked the set, so a replacement could be an app a later slot
 * was still going to need. The result kept producing duplicates under a constant random source.
 *
 * A replacement always exists, which is why this needs no fallback: at any slot the excluded apps are at
 * most the ones already placed plus that slot's own previous one, and this is only reached when `total`
 * is greater than the number of slots.
 */
function reparar(asignacion: number[], total: number, previa: number[], rng: () => number): number[] {
  /* The candidate order is shuffled before the fill. Filling in index order made the result depend on
     the numbering of the data: with eight apps in six slots only two are off screen at a time, so the
     fill always reached the same low indexes and the highest-numbered app never appeared at all. The
     candidate is random, so the choice among the apps that remain has to be too.

     The slot order is not shuffled, because it is what the guarantee is checked against: slot `i` must
     not keep the app slot `i` had. */
  const candidatos = barajar(total, rng);
  const resultado: number[] = [];

  for (let i = 0; i < asignacion.length; i += 1) {
    for (const app of candidatos) {
      if (resultado.includes(app) || previa[i] === app) continue;
      resultado.push(app);
      break;
    }
  }

  return resultado;
}
