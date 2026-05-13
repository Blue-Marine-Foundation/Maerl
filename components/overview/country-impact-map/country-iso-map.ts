// Static `project_country` raw label → ISO 3166-1 alpha-3 mapping.
//
// This file is the canonical, human-curated record of how the free-text
// `projects.project_country` column maps onto Mapbox's country tileset
// (which keys polygons on `iso_3166_1_alpha_3`). The set is intentionally
// scoped to the labels actually present in the database today; new labels
// added in future will fall through with a single console warning per
// render and be dropped from the map until added here.
//
// Returns an array because some raw labels span multiple countries
// (`Tunisia, Libya`) or roll up sub-national values (`England`,
// `Scotland`, `England, Scotland` → `GBR`).
//
// FUTURE: see docs/7-project-country-iso3-migration.md — long term we
// want a constrained `project_country_iso3` column on the projects table
// driven by a UI dropdown, retiring this lookup.

export const RAW_TO_ISO3: Record<string, readonly string[]> = {
  Antarctica: ['ATA'],
  Argentina: ['ARG'],
  Azerbaijan: ['AZE'],
  Bahrain: ['BHR'],
  Barbados: ['BRB'],
  Belgium: ['BEL'],
  Brazil: ['BRA'],
  Chile: ['CHL'],
  'Dogger Bank': ['GBR', 'DEU', 'DNK', 'NLD'],
  'Dutch Caribbean': ['CUW', 'ABW', 'SXM', 'BES'],
  'Dominican Republic': ['DOM'],
  England: ['GBR'],
  Scotland: ['GBR'],
  'England, Scotland': ['GBR'],
  Greece: ['GRC'],
  Indonesia: ['IDN'],
  Italy: ['ITA'],
  Maldives: ['MDV'],
  Mexico: ['MEX'],
  Mozambique: ['MOZ'],
  Namibia: ['NAM'],
  Netherlands: ['NLD'],
  Panama: ['PAN'],
  Philippines: ['PHL'],
  'Sao Tome': ['STP'],
  'St Vincent and the Grenadines': ['VCT'],
  'Tunisia, Libya': ['TUN', 'LBY'],
  Turkey: ['TUR'],
  Uruguay: ['URY'],
};

// Display name keyed by ISO-3 — used in popovers when the project's raw
// label is messy ("Tunisia, Libya" splits into separate cards) or
// sub-national ("England, Scotland" becomes "United Kingdom").
export const ISO3_TO_DISPLAY: Record<string, string> = {
  ATA: 'Antarctica',
  ARG: 'Argentina',
  AZE: 'Azerbaijan',
  BHR: 'Bahrain',
  BRB: 'Barbados',
  BEL: 'Belgium',
  BRA: 'Brazil',
  CHL: 'Chile',
  CUW: 'Curaçao',
  ABW: 'Aruba',
  SXM: 'Sint Maarten',
  BES: 'Caribbean Netherlands',
  DEU: 'Germany',
  DNK: 'Denmark',
  DOM: 'Dominican Republic',
  GBR: 'United Kingdom',
  GRC: 'Greece',
  IDN: 'Indonesia',
  ITA: 'Italy',
  MDV: 'Maldives',
  MEX: 'Mexico',
  MOZ: 'Mozambique',
  NAM: 'Namibia',
  NLD: 'Netherlands',
  PAN: 'Panama',
  PHL: 'Philippines',
  STP: 'São Tomé and Príncipe',
  VCT: 'St Vincent and the Grenadines',
  TUN: 'Tunisia',
  LBY: 'Libya',
  TUR: 'Turkey',
  URY: 'Uruguay',
};

export type MapBounds = [[number, number], [number, number]];

// Coarse country bounds used only for initial camera fitting. The choropleth
// itself still comes from Mapbox's country-boundaries tileset.
export const ISO3_BOUNDS: Record<string, MapBounds> = {
  ARG: [
    [-73.6, -55.1],
    [-53.6, -21.8],
  ],
  ATA: [
    [-180, -85],
    [180, -60],
  ],
  AZE: [
    [44.7, 38.3],
    [50.6, 41.9],
  ],
  BHR: [
    [50.3, 25.5],
    [50.8, 26.4],
  ],
  BEL: [
    [2.5, 49.5],
    [6.4, 51.6],
  ],
  BRA: [
    [-73.9, -33.8],
    [-34.8, 5.3],
  ],
  BRB: [
    [-59.7, 13],
    [-59.4, 13.4],
  ],
  CHL: [
    [-75.6, -56],
    [-66.4, -17.5],
  ],
  CUW: [
    [-69.2, 11.9],
    [-68.6, 12.5],
  ],
  ABW: [
    [-70.1, 12.4],
    [-69.9, 12.7],
  ],
  SXM: [
    [-63.2, 18],
    [-62.9, 18.1],
  ],
  BES: [
    [-68.6, 12],
    [-62.9, 17.7],
  ],
  DEU: [
    [5.8, 47.2],
    [15.1, 55.1],
  ],
  DNK: [
    [8.0, 54.5],
    [15.2, 57.8],
  ],
  DOM: [
    [-72.1, 17.5],
    [-68.2, 19.9],
  ],
  GBR: [
    [-8.7, 49.8],
    [2.1, 60.9],
  ],
  GRC: [
    [19.3, 34.8],
    [28.3, 41.8],
  ],
  IDN: [
    [95, -11.2],
    [141, 6.2],
  ],
  ITA: [
    [6.6, 35.5],
    [18.6, 47.1],
  ],
  LBY: [
    [9.3, 19.5],
    [25.2, 33.3],
  ],
  MDV: [
    [72.5, -0.8],
    [73.8, 7.2],
  ],
  MEX: [
    [-118.5, 14.5],
    [-86.7, 32.7],
  ],
  MOZ: [
    [30.2, -26.9],
    [40.9, -10.3],
  ],
  NAM: [
    [11.7, -29],
    [25.3, -16.9],
  ],
  NLD: [
    [3.2, 50.7],
    [7.3, 53.7],
  ],
  PAN: [
    [-83.1, 7.1],
    [-77.2, 9.7],
  ],
  PHL: [
    [116.9, 4.6],
    [126.6, 21.2],
  ],
  STP: [
    [6.4, -0.1],
    [7.6, 1.8],
  ],
  TUN: [
    [7.5, 30.2],
    [11.7, 37.6],
  ],
  TUR: [
    [25.7, 35.8],
    [44.9, 42.1],
  ],
  URY: [
    [-58.5, -35],
    [-53.1, -30.1],
  ],
  VCT: [
    [-61.5, 12.5],
    [-61.1, 13.4],
  ],
};

// Regional strategy bounds for the initial map camera. These are deliberately
// broad: they orient the user to their assigned active-project region without
// pretending to be exact project geometries.
export const REGION_BOUNDS: Record<string, MapBounds> = {
  Antarctica: [
    [-180, -85],
    [180, -55],
  ],
  Caribbean: [
    [-90, 8],
    [-58, 28],
  ],
  'East Atlantic Corridor': [
    [-25, -10],
    [15, 55],
  ],
  'Indian Ocean': [
    [30, -35],
    [115, 30],
  ],
  Latam: [
    [-118, -56],
    [-32, 33],
  ],
  Med: [
    [-6, 30],
    [37, 47],
  ],
  UKOT: [
    [-90, -55],
    [60, 35],
  ],
  'UK & Channel Islands': [
    [-11, 49],
    [3, 61],
  ],
};

const warnedLabels = new Set<string>();

// Resolve a raw `project_country` string to ISO-3 codes. Trims whitespace,
// returns `[]` for empty/null/unknown labels (with a one-shot console
// warning for unknowns to make missing entries visible during dev).
export function splitAndMapCountries(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (trimmed === '') return [];

  const direct = RAW_TO_ISO3[trimmed];
  if (direct) return [...direct];

  // Fallback for labels not in the canonical map: warn once, return empty
  // so the row drops out of the map rather than raising. New countries
  // entered via the UI will surface here until added to RAW_TO_ISO3.
  if (!warnedLabels.has(trimmed)) {
    warnedLabels.add(trimmed);
    if (typeof console !== 'undefined') {
      console.warn(
        `[country-iso-map] Unknown project_country label: "${trimmed}". ` +
          `Add it to RAW_TO_ISO3 in components/overview/country-impact-map/country-iso-map.ts.`,
      );
    }
  }
  return [];
}
