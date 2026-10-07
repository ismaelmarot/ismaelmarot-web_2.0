/**
 * The colour each project's scene is painted with.
 *
 * The reference backgrounds are saturated colour behind an angled device. Reproducing that on a light
 * section needs a colour per project, and the data has none, so the mapping lives here rather than in
 * `projects.json`, which is regenerated on every build.
 *
 * The palettes are mid-light and low-saturation on purpose. They are painted as low-opacity radial
 * gradients behind a scene, so a saturated pair would fight the `#F5F5F7` surface and read as a card
 * rather than as depth. Nothing here is ever behind text.
 */

export interface SceneAccent {
  /** The lighter stop, toward the top-left of the backdrop. */
  readonly from: string;
  /** The deeper stop, toward the bottom-right. */
  readonly to: string;
}

/**
 * Keyed by the GitHub repository id that `projects.json` uses.
 *
 * Assigned by what each project is rather than by position: a social app is warm, a money app is green or
 * amber, a link-shortener is violet. The colour follows the project, so a project keeps its identity when
 * the rotation moves it to a different column.
 */
const PALETA: Readonly<Record<string, SceneAccent>> = {
  // QEntry, a social app. Warm, because that is what a social product reads as.
  '1202000505': { from: '#FFB199', to: '#FF6E9C' },
  // NauticAcademy, education. Sky into blue.
  '1230404944': { from: '#7DD3FC', to: '#2E90FA' },
  // LinkIO, links and navigation. Indigo into violet.
  '1218376438': { from: '#A5B4FC', to: '#7C5CFF' },
  // car-expense, money. Amber into orange.
  '904467125': { from: '#FFD08A', to: '#FF9F45' },
  // cash-counter, money. Mint into emerald.
  '1055132737': { from: '#8FE3C4', to: '#2FBF8F' },
  // trash2treasure, a tool. Pink into magenta.
  '1176188329': { from: '#F9A8D4', to: '#E85AC8' },
};

/**
 * The palettes used for a project id that has no entry above, so a repository added tomorrow still gets a
 * colour rather than an undefined one.
 */
export const PALETA_POR_DEFECTO: readonly SceneAccent[] = Object.values(PALETA);

/**
 * The accent for a project, derived from its id when it is not one of the six.
 *
 * The hash is a plain 31-multiplier fold rather than a random pick, so the same project always resolves to
 * the same colour: a scene that changed colour between renders would look like a bug.
 */
export function accentDeProyecto(id: string): SceneAccent {
  const directa = PALETA[id];
  if (directa) return directa;

  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return PALETA_POR_DEFECTO[hash % PALETA_POR_DEFECTO.length]!;
}