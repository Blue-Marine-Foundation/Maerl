import { GENERATED_ISO_GEOGRAPHIES } from './generated-iso-geographies';
import type { MapBounds } from './map-bounds';

export type { MapBounds } from './map-bounds';

// Canonical mapping from free-text `projects.project_country` to map features.
//
// - **Countries** → ISO 3166-1 alpha-3 for Mapbox `country-boundaries-v1`.
// - **Sea / ocean programmes** (`RAW_TO_WATER_REGION`) → marker geographies,
//   with bounds retained for map focus.
// - **Tiny territories / islands** (`RAW_TO_POINT_REGION`) → marker geographies,
//   so they remain visible at globe scale.
//   Do not remap them onto coastal states.
// - **Global** (`isGlobalProjectLabel`) → counted in KPI only, no choropleth.
//
// ISO countries and territories come from the generated registry. To refresh it,
// run `pnpm generate:geographies`. To add a Maerl-specific compound, sea, or
// marker island, update the custom metadata below and the matching generator
// constants so the picker, audit SQL, and sign-off CSV stay aligned.
//
// FUTURE: see docs/7-project-country-iso3-migration.md — eventual structured column.

const GENERATED_RAW_TO_ISO3: Record<string, readonly string[]> =
  Object.fromEntries(
    GENERATED_ISO_GEOGRAPHIES.map((geography) => [
      geography.label,
      [geography.iso3],
    ]),
  );

const CUSTOM_AND_LEGACY_RAW_TO_ISO3: Record<string, readonly string[]> = {
  'Aruba, Bonaire, Curacao': ['ABW', 'BES', 'CUW'],
  BVI: ['VGB'],
  'Dutch Caribbean': ['CUW', 'ABW', 'SXM', 'BES'],
  England: ['GBR'],
  Scotland: ['GBR'],
  'England, Scotland': ['GBR'],
  'Sao Tome': ['STP'],
  'St Kitts and Nevis': ['KNA'],
  'St Kitts & Nevis': ['KNA'],
  'St Vincent and the Grenadines': ['VCT'],
  'Tunisia, Libya': ['TUN', 'LBY'],
  'United Kingdom, EU': ['GBR'],
};

export const RAW_TO_ISO3: Record<string, readonly string[]> = {
  ...GENERATED_RAW_TO_ISO3,
  ...CUSTOM_AND_LEGACY_RAW_TO_ISO3,
};

export type MapPoint = [number, number];

/** Programme geographies rendered as visual marker anchors, not coastal-country proxies. */
export type WaterRegionMeta = {
  id: string;
  displayName: string;
  coordinates: MapPoint;
  bounds: MapBounds;
};

export const RAW_TO_WATER_REGION: Record<string, WaterRegionMeta> = {
  'Indian Ocean': {
    id: 'indian-ocean',
    displayName: 'Indian Ocean',
    coordinates: [73, -8],
    bounds: [
      [30, -35],
      [115, 30],
    ],
  },
  'Mediterranean Sea': {
    id: 'mediterranean-sea',
    displayName: 'Mediterranean Sea',
    coordinates: [18, 35.5],
    bounds: [
      [-6, 30],
      [37, 47],
    ],
  },
  'North Sea': {
    id: 'north-sea',
    displayName: 'North Sea',
    coordinates: [4, 56],
    bounds: [
      [-4.45, 50.99],
      [12.01, 61.02],
    ],
  },
  'Dogger Bank': {
    id: 'dogger-bank',
    displayName: 'Dogger Bank',
    coordinates: [2.8, 55.25],
    bounds: [
      [1, 54.35],
      [4.35, 55.98],
    ],
  },
};

/** Lookup by stable `WaterRegionMeta.id` (slug). */
export const WATER_REGION_BY_ID: Record<string, WaterRegionMeta> =
  Object.fromEntries(Object.values(RAW_TO_WATER_REGION).map((m) => [m.id, m]));

export type PointRegionMeta = {
  id: string;
  displayName: string;
  coordinates: MapPoint;
  bounds: MapBounds;
};

export const RAW_TO_POINT_REGION: Record<string, PointRegionMeta> = {
  Ascension: {
    id: 'ascension',
    displayName: 'Ascension',
    coordinates: [-14.36, -7.95],
    bounds: [
      [-18, -11],
      [-10, -5],
    ],
  },
  'Ascension Island': {
    id: 'ascension',
    displayName: 'Ascension',
    coordinates: [-14.36, -7.95],
    bounds: [
      [-18, -11],
      [-10, -5],
    ],
  },
  'Channel Islands': {
    id: 'channel-islands',
    displayName: 'Channel Islands',
    coordinates: [-2.13, 49.3],
    bounds: [
      [-3, 48.8],
      [-1.2, 49.9],
    ],
  },
  'French Polynesia': {
    id: 'french-polynesia',
    displayName: 'French Polynesia',
    coordinates: [-149.41, -17.68],
    bounds: [
      [-155, -23],
      [-144, -13],
    ],
  },
  'French Polynseia': {
    id: 'french-polynesia',
    displayName: 'French Polynesia',
    coordinates: [-149.41, -17.68],
    bounds: [
      [-155, -23],
      [-144, -13],
    ],
  },
  'Saint Helena': {
    id: 'st-helena',
    displayName: 'St Helena',
    coordinates: [-5.72, -15.96],
    bounds: [
      [-8, -18],
      [-3, -13],
    ],
  },
  'St Helena': {
    id: 'st-helena',
    displayName: 'St Helena',
    coordinates: [-5.72, -15.96],
    bounds: [
      [-8, -18],
      [-3, -13],
    ],
  },
  'St Helena Island': {
    id: 'st-helena',
    displayName: 'St Helena',
    coordinates: [-5.72, -15.96],
    bounds: [
      [-8, -18],
      [-3, -13],
    ],
  },
};

/** Lookup by stable `PointRegionMeta.id` (slug). */
export const POINT_REGION_BY_ID: Record<string, PointRegionMeta> =
  Object.fromEntries(Object.values(RAW_TO_POINT_REGION).map((m) => [m.id, m]));

export const GEOGRAPHY_OPTION_GROUPS = [
  'Countries & Territories',
  'Islands',
  'Seas & Oceans',
  'Global',
] as const;

export type GeographyOptionGroup = (typeof GEOGRAPHY_OPTION_GROUPS)[number];

export type CanonicalGeographyOption = {
  value: string;
  label: string;
  group: GeographyOptionGroup;
};

const CUSTOM_COUNTRY_OPTIONS: CanonicalGeographyOption[] = [
  'Aruba, Bonaire, Curacao',
  'Dutch Caribbean',
  'Tunisia, Libya',
].map((value) => ({
  value,
  label: value,
  group: 'Countries & Territories',
}));

const POINT_OPTIONS: CanonicalGeographyOption[] = Object.values(
  POINT_REGION_BY_ID,
).map((point) => ({
  value: point.displayName,
  label: point.displayName,
  group: 'Islands',
}));

const WATER_OPTIONS: CanonicalGeographyOption[] = Object.values(
  WATER_REGION_BY_ID,
).map((water) => ({
  value: water.displayName,
  label: water.displayName,
  group: 'Seas & Oceans',
}));

const canonicalOptionsByValue = new Map<string, CanonicalGeographyOption>();
for (const option of [
  ...GENERATED_ISO_GEOGRAPHIES.map((geography) => ({
    value: geography.label,
    label: geography.label,
    group: 'Countries & Territories' as const,
  })),
  ...CUSTOM_COUNTRY_OPTIONS,
  ...POINT_OPTIONS,
  ...WATER_OPTIONS,
  { value: 'Global', label: 'Global', group: 'Global' as const },
]) {
  // Custom point and water metadata intentionally wins when an ISO label also
  // exists (for example French Polynesia).
  canonicalOptionsByValue.set(option.value, option);
}

export const CANONICAL_GEOGRAPHY_OPTIONS: CanonicalGeographyOption[] =
  Array.from(canonicalOptionsByValue.values()).sort((first, second) => {
    const groupDifference =
      GEOGRAPHY_OPTION_GROUPS.indexOf(first.group) -
      GEOGRAPHY_OPTION_GROUPS.indexOf(second.group);
    return groupDifference || first.label.localeCompare(second.label);
  });

export const CANONICAL_GEOGRAPHY_VALUE_SET = new Set(
  CANONICAL_GEOGRAPHY_OPTIONS.map((option) => option.value),
);

export function normalizeProjectGeography(
  raw: string | null | undefined,
): string {
  if (!raw) return '';
  return raw.trim().replace(/\s+/g, ' ');
}

export function isCanonicalProjectGeography(
  raw: string | null | undefined,
): boolean {
  const normalized = normalizeProjectGeography(raw);
  return normalized === '' || CANONICAL_GEOGRAPHY_VALUE_SET.has(normalized);
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

export function tryResolvePointRegion(
  raw: string | null | undefined,
): PointRegionMeta | null {
  const n = normalizeProjectGeography(raw);
  if (!n) return null;
  return RAW_TO_POINT_REGION[n] ?? null;
}

/**
 * Keys for choropleth + marker buckets (`iso:NLD`, `sea:north-sea`, `point:barbados`).
 * Ignores Global and blanks (handled upstream in counts).
 */
export function geographyBucketKeysFromRaw(
  raw: string | null | undefined,
): string[] {
  const n = normalizeProjectGeography(raw);
  if (!n || isGlobalProjectLabel(n)) return [];
  const water = tryResolveWaterRegion(raw);
  if (water) return [`sea:${water.id}`];
  const point = tryResolvePointRegion(raw);
  if (point) return [`point:${point.id}`];

  const isos = splitAndMapCountriesInternal(n);
  return isos.map((iso) => `iso:${iso}`);
}

/** ISO-3 lookup only water/global already excluded by caller preference — use geographyBucketKeysFromRaw. */
export function splitAndMapCountries(raw: string | null | undefined): string[] {
  const n = normalizeProjectGeography(raw);
  if (!n || isGlobalProjectLabel(n)) return [];
  if (tryResolveWaterRegion(raw)) return [];
  if (tryResolvePointRegion(raw)) return [];
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
          `Add to RAW_TO_ISO3, RAW_TO_WATER_REGION, or RAW_TO_POINT_REGION in country-iso-map.ts.`,
      );
    }
  }
  return [];
}

export const ISO_GEOGRAPHY_BY_ISO3 = Object.fromEntries(
  GENERATED_ISO_GEOGRAPHIES.map((geography) => [geography.iso3, geography]),
);

export const ISO3_TO_DISPLAY: Record<string, string> = Object.fromEntries(
  GENERATED_ISO_GEOGRAPHIES.map((geography) => [
    geography.iso3,
    geography.label,
  ]),
);

export const ISO3_BOUNDS: Record<string, MapBounds> = Object.fromEntries(
  GENERATED_ISO_GEOGRAPHIES.map((geography) => [
    geography.iso3,
    geography.bounds,
  ]),
);

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
