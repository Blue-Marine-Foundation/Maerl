// Canonical mapping from free-text `projects.project_country` to map features.
//
// - **Countries** → ISO 3166-1 alpha-3 for Mapbox `country-boundaries-v1`.
// - **Sea / ocean programmes** (`RAW_TO_WATER_REGION`) → separate overlay
//   geometry where available, with bounds retained for map focus/fallbacks.
//   Do not remap them onto coastal states.
// - **Global** (`isGlobalProjectLabel`) → counted in KPI only, no choropleth.
//
// FUTURE: see docs/7-project-country-iso3-migration.md — eventual structured column.

export const RAW_TO_ISO3: Record<string, readonly string[]> = {
  Antarctica: ['ATA'],
  Argentina: ['ARG'],
  Azerbaijan: ['AZE'],
  Bahrain: ['BHR'],
  Barbados: ['BRB'],
  Belgium: ['BEL'],
  Brazil: ['BRA'],
  Chile: ['CHL'],
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
  Spain: ['ESP'],
  'Sao Tome': ['STP'],
  'St Vincent and the Grenadines': ['VCT'],
  'Tunisia, Libya': ['TUN', 'LBY'],
  Turkey: ['TUR'],
  Uruguay: ['URY'],
  'United Kingdom': ['GBR'],
  'United Kingdom, EU': ['GBR'],
};

export type MapBounds = [[number, number], [number, number]];

/** Programme geographies rendered as marine overlays, not coastal-country proxies. */
export type WaterRegionMeta = {
  id: string;
  displayName: string;
  bounds: MapBounds;
};

export const RAW_TO_WATER_REGION: Record<string, WaterRegionMeta> = {
  'Indian Ocean': {
    id: 'indian-ocean',
    displayName: 'Indian Ocean',
    bounds: [
      [30, -35],
      [115, 30],
    ],
  },
  'Mediterranean Sea': {
    id: 'mediterranean-sea',
    displayName: 'Mediterranean Sea',
    bounds: [
      [-6, 30],
      [37, 47],
    ],
  },
  'North Sea': {
    id: 'north-sea',
    displayName: 'North Sea',
    bounds: [
      [-4.45, 50.99],
      [12.01, 61.02],
    ],
  },
  'Dogger Bank': {
    id: 'dogger-bank',
    displayName: 'Dogger Bank',
    bounds: [
      [1, 54.35],
      [4.35, 55.98],
    ],
  },
};

/** Lookup by stable `WaterRegionMeta.id` (slug). */
export const WATER_REGION_BY_ID: Record<string, WaterRegionMeta> =
  Object.fromEntries(
    Object.values(RAW_TO_WATER_REGION).map((m) => [m.id, m]),
  );

export function normalizeProjectGeography(
  raw: string | null | undefined,
): string {
  if (!raw) return '';
  return raw.trim().replace(/\s+/g, ' ');
}

export function isGlobalProjectLabel(raw: string | null | undefined): boolean {
  return normalizeProjectGeography(raw).toLowerCase() === 'global';
}

export function tryResolveWaterRegion(
  raw: string | null | undefined,
): WaterRegionMeta | null {
  const n = normalizeProjectGeography(raw);
  if (!n) return null;
  return RAW_TO_WATER_REGION[n] ?? null;
}

/**
 * Keys for choropleth + marine overlay buckets (`iso:NLD` vs `sea:north-sea`).
 * Ignores Global and blanks (handled upstream in counts).
 */
export function geographyBucketKeysFromRaw(
  raw: string | null | undefined,
): string[] {
  const n = normalizeProjectGeography(raw);
  if (!n || isGlobalProjectLabel(n)) return [];
  const water = tryResolveWaterRegion(raw);
  if (water) return [`sea:${water.id}`];

  const isos = splitAndMapCountriesInternal(n);
  return isos.map((iso) => `iso:${iso}`);
}

/** ISO-3 lookup only water/global already excluded by caller preference — use geographyBucketKeysFromRaw. */
export function splitAndMapCountries(
  raw: string | null | undefined,
): string[] {
  const n = normalizeProjectGeography(raw);
  if (!n || isGlobalProjectLabel(n)) return [];
  if (tryResolveWaterRegion(raw)) return [];
  return splitAndMapCountriesInternal(n);
}

const warnedLabels = new Set<string>();

function splitAndMapCountriesInternal(trimmed: string): string[] {
  const direct = RAW_TO_ISO3[trimmed];
  if (direct) return [...direct];

  if (!warnedLabels.has(trimmed)) {
    warnedLabels.add(trimmed);
    if (typeof console !== 'undefined') {
      console.warn(
        `[country-iso-map] Unknown project_country "${trimmed}". ` +
          `Add to RAW_TO_ISO3 or RAW_TO_WATER_REGION in country-iso-map.ts.`,
      );
    }
  }
  return [];
}

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
  ESP: 'Spain',
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
  DOM: [
    [-72.1, 17.5],
    [-68.2, 19.9],
  ],
  ESP: [
    [-9.4, 35.9],
    [4.6, 43.9],
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
