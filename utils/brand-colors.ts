/**
 * Blue Marine Foundation brand palette.
 * Mirrors blue-marine-tokens.css and the inlined `brand` object in
 * tailwind.config.ts (Turbopack can't resolve TS imports there) — keep in sync.
 *
 * Contrast rules (brand guidelines p.9): the bright accents (plankton,
 * seagrass, seahorse, axolotl, seaFoam) are fills/chips only — never text,
 * never text-on-fill below 24px. Sunlight blue is focus-ring/non-text only.
 */

export const MARINE_BLUE = '#003c69';
export const ABYSS_BLUE = '#192d4b';
export const MIDNIGHT_BLUE = '#004994';
export const TWILIGHT_BLUE = '#1a67e2';
export const SUNLIGHT_BLUE = '#00aaff';
export const SEAGRASS_GREEN = '#3addb3';
export const PLANKTON_BLUE = '#78f9ff';
export const SEA_FOAM = '#e1fefe';
export const URCHIN_VIOLET = '#7766c2';
export const AXOLOTL_PINK = '#ff9ad1';
export const SEAHORSE_YELLOW = '#f9f871';

/** Tailwind `brand` color namespace (literal hexes keep opacity modifiers working). */
export const brand = {
  marine: MARINE_BLUE,
  abyss: ABYSS_BLUE,
  midnight: MIDNIGHT_BLUE,
  twilight: TWILIGHT_BLUE,
  sunlight: SUNLIGHT_BLUE,
  seagrass: SEAGRASS_GREEN,
  plankton: PLANKTON_BLUE,
  seafoam: SEA_FOAM,
  urchin: URCHIN_VIOLET,
  axolotl: AXOLOTL_PINK,
  seahorse: SEAHORSE_YELLOW,
} as const;

/** Categorical series, ordered for adjacent-hue separation; labels must use text colors, not these. */
export const VIZ_CATEGORICAL = [
  MARINE_BLUE,
  SEAGRASS_GREEN,
  URCHIN_VIOLET,
  SUNLIGHT_BLUE,
  AXOLOTL_PINK,
  SEAHORSE_YELLOW,
  TWILIGHT_BLUE,
  PLANKTON_BLUE,
] as const;

/** Sequential blue ramp (light → dark) for choropleths/heatmaps. */
export const VIZ_SEQ = [
  SEA_FOAM,
  PLANKTON_BLUE,
  SUNLIGHT_BLUE,
  TWILIGHT_BLUE,
  MIDNIGHT_BLUE,
  MARINE_BLUE,
  ABYSS_BLUE,
] as const;

export const MARINE_BLUE_RGB = [0, 60, 105] as const;

export function marineAlpha(alpha: number): string {
  return `rgba(${MARINE_BLUE_RGB.join(', ')}, ${alpha})`;
}
