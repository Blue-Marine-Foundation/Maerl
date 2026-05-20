'use server';

import { createClient } from '@/utils/supabase/server';
import { OVERVIEW_FETCH_CODES } from '../pillar-config';
import {
  geographyBucketKeysFromRaw,
  ISO3_BOUNDS,
  ISO3_TO_DISPLAY,
  isGlobalProjectLabel,
  normalizeProjectGeography,
  REGION_BOUNDS,
  splitAndMapCountries,
  tryResolveWaterRegion,
  WATER_REGION_BY_ID,
  type MapBounds,
} from './country-iso-map';

const MAP_INDICATOR_LABELS: Record<
  string,
  { label: string; unit: string }
> = {
  '1.2.3': { label: 'Protection — committed area', unit: 'km²' },
  '1.2.1': { label: 'Protection — proposed area', unit: 'km²' },
  '1.2.2': { label: 'Protection — designated area', unit: 'km²' },
  '2.2.5': { label: 'Restoration — active area', unit: 'km²' },
  '2.2.1': { label: 'Restoration — habitat improving', unit: 'km²' },
  '2.2.4': { label: 'Restoration — specimens deployed', unit: 'specimens' },
  '4.2.1': { label: 'Fisheries — risky gear or practices banned', unit: 'km²' },
  '4.3.2': { label: 'Policy — laws or agreements influenced', unit: 'instruments' },
  '5.6.1': { label: 'Fisheries — people in management', unit: 'people' },
  '5.2.1': { label: 'Benefits — monetary', unit: 'beneficiaries' },
  '5.2.2': { label: 'Benefits — in-kind', unit: 'beneficiaries' },
  '5.3.3': {
    label: 'Engagement — outreach to action',
    unit: 'people',
  },
};

const ELIGIBLE_PROJECT_TYPES = ['Project', 'Unit led project'] as const;

export type CountryProject = {
  id: number;
  name: string;
  slug: string;
  project_type: string | null;
};

export type CountryMetric = {
  indicator_code: string;
  indicator_label: string;
  unit: string;
  total: number;
};

export type GeographyImpactRow = {
  geographyKind: 'country' | 'water';
  /** ISO-3 alpha (countries) or marine overlay id (`WaterRegionMeta.id`). */
  geographyId: string;
  geographyLabel: string;
  /** Marine overlays only — choropleth countries use Mapbox polygons. */
  waterBounds: MapBounds | null;
  activeProjects: number;
  projects: CountryProject[];
  metrics: CountryMetric[];
};

export type GeographyImpactData = {
  rows: GeographyImpactRow[];
  /** `project_country === Global` — counted for KPI only, no map geometry. */
  globalActiveProjectCount: number;
  /** Null / blank country, or unknown label (nothing to plot). */
  activeProjectsWithoutMappedGeography: number;
  defaultFocusBounds: MapBounds | null;
  defaultFocusLabel: string | null;
};

function isTrackedIndicator(code: string | null): boolean {
  return (
    code !== null &&
    (OVERVIEW_FETCH_CODES as readonly string[]).includes(code)
  );
}

function isEligibleProjectType(type: string | null): boolean {
  return (
    type !== null &&
    (ELIGIBLE_PROJECT_TYPES as readonly string[]).includes(type)
  );
}

type Bucket = {
  projects: Map<number, CountryProject>;
  metricTotals: Map<string, number>;
};

type ProjectRow = {
  id: number;
  name: string;
  slug: string;
  project_country: string | null;
  project_type: string | null;
  regional_strategy?: string | null;
};

type UpdateRow = {
  value: number | null;
  projects: {
    project_country: string | null;
    project_status: string | null;
    project_type: string | null;
  } | null;
  impact_indicators: {
    indicator_code: string | null;
    indicator_unit: string | null;
    ii_heirarchy: string | null;
  } | null;
};

function getOrCreateBucket(buckets: Map<string, Bucket>, key: string): Bucket {
  const existing = buckets.get(key);
  if (existing) return existing;
  const fresh: Bucket = {
    projects: new Map(),
    metricTotals: new Map(),
  };
  buckets.set(key, fresh);
  return fresh;
}

function indexProjectsByGeography(
  buckets: Map<string, Bucket>,
  projects: ProjectRow[],
): void {
  for (const project of projects) {
    const keys = geographyBucketKeysFromRaw(project.project_country);
    if (keys.length === 0) continue;
    for (const geoKey of keys) {
      const bucket = getOrCreateBucket(buckets, geoKey);
      bucket.projects.set(project.id, {
        id: project.id,
        name: project.name,
        slug: project.slug,
        project_type: project.project_type,
      });
    }
  }
}

function shouldCountUpdate(
  update: UpdateRow,
): update is UpdateRow & {
  projects: NonNullable<UpdateRow['projects']>;
  impact_indicators: NonNullable<UpdateRow['impact_indicators']>;
} {
  const project = update.projects;
  const indicator = update.impact_indicators;
  if (!project || !indicator) return false;
  if (!project.project_status?.toLowerCase().startsWith('active')) return false;
  if (!isEligibleProjectType(project.project_type)) return false;
  if (indicator.ii_heirarchy !== 'Indicator') return false;
  if (!isTrackedIndicator(indicator.indicator_code)) return false;
  return true;
}

function indexUpdatesByGeography(
  buckets: Map<string, Bucket>,
  updates: UpdateRow[],
): void {
  for (const update of updates) {
    if (!shouldCountUpdate(update)) continue;
    const code = update.impact_indicators.indicator_code as string;
    const keys = geographyBucketKeysFromRaw(update.projects.project_country);
    if (keys.length === 0) continue;
    for (const geoKey of keys) {
      const bucket = getOrCreateBucket(buckets, geoKey);
      const running = bucket.metricTotals.get(code) ?? 0;
      bucket.metricTotals.set(code, running + (update.value ?? 0));
    }
  }
}

function bucketKeyToRow(
  bucketKey: string,
  bucket: Bucket,
): GeographyImpactRow | null {
  const meta = MAP_INDICATOR_LABELS;

  if (bucketKey.startsWith('iso:')) {
    const iso = bucketKey.slice(4);
    return {
      geographyKind: 'country',
      geographyId: iso,
      geographyLabel: ISO3_TO_DISPLAY[iso] ?? iso,
      waterBounds: null,
      activeProjects: bucket.projects.size,
      projects: Array.from(bucket.projects.values()).sort((p1, p2) =>
        p1.name.localeCompare(p2.name),
      ),
      metrics: OVERVIEW_FETCH_CODES.filter(
        (code) => (bucket.metricTotals.get(code) ?? 0) > 0,
      ).map((code) => ({
        indicator_code: code,
        indicator_label: meta[code]?.label ?? code,
        unit: meta[code]?.unit ?? '',
        total: bucket.metricTotals.get(code) ?? 0,
      })),
    };
  }

  if (bucketKey.startsWith('sea:')) {
    const waterId = bucketKey.slice(4);
    const water = WATER_REGION_BY_ID[waterId];
    if (!water) return null;
    return {
      geographyKind: 'water',
      geographyId: water.id,
      geographyLabel: water.displayName,
      waterBounds: water.bounds,
      activeProjects: bucket.projects.size,
      projects: Array.from(bucket.projects.values()).sort((p1, p2) =>
        p1.name.localeCompare(p2.name),
      ),
      metrics: OVERVIEW_FETCH_CODES.filter(
        (code) => (bucket.metricTotals.get(code) ?? 0) > 0,
      ).map((code) => ({
        indicator_code: code,
        indicator_label: meta[code]?.label ?? code,
        unit: meta[code]?.unit ?? '',
        total: bucket.metricTotals.get(code) ?? 0,
      })),
    };
  }

  return null;
}

function normaliseRegion(region: string | null | undefined): string | null {
  const trimmed = region?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function mergeBounds(bounds: MapBounds[]): MapBounds | null {
  if (bounds.length === 0) return null;
  return bounds.reduce<MapBounds>(
    (acc, next) => [
      [Math.min(acc[0][0], next[0][0]), Math.min(acc[0][1], next[0][1])],
      [Math.max(acc[1][0], next[1][0]), Math.max(acc[1][1], next[1][1])],
    ],
    bounds[0],
  );
}

function boundsForProjectCountryField(project: ProjectRow): MapBounds[] {
  const region = normaliseRegion(project.regional_strategy);
  if (region && REGION_BOUNDS[region]) return [REGION_BOUNDS[region]];

  const n = normalizeProjectGeography(project.project_country);
  if (!n || isGlobalProjectLabel(n)) return [];

  const water = tryResolveWaterRegion(project.project_country);
  if (water) return [water.bounds];

  return splitAndMapCountries(project.project_country)
    .map((iso) => ISO3_BOUNDS[iso])
    .filter((bounds): bounds is MapBounds => Boolean(bounds));
}

function buildDefaultFocus(projects: ProjectRow[]): {
  bounds: MapBounds | null;
  label: string | null;
} {
  const bounds = projects.flatMap(boundsForProjectCountryField);
  const regions = Array.from(
    new Set(
      projects
        .map((project) => normaliseRegion(project.regional_strategy))
        .filter((r): r is string => Boolean(r)),
    ),
  ).sort((a, b) => a.localeCompare(b));

  let label = 'assigned active projects';
  if (projects.length === 1) label = projects[0].name;
  if (regions.length > 0) label = regions.join(', ');

  return {
    bounds: mergeBounds(bounds),
    label,
  };
}

export async function fetchCountryImpactData(): Promise<GeographyImpactData> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const projectsResult = await supabase
    .from('projects')
    .select('id, name, slug, project_country, project_type')
    .ilike('project_status', 'Active%')
    .in('project_type', [...ELIGIBLE_PROJECT_TYPES])
    .not('project_country', 'is', null);

  const focusProjectsResult = user
    ? await supabase
        .from('projects')
        .select(
          'id, name, slug, project_country, project_type, regional_strategy, user_projects!inner(user_id)',
        )
        .ilike('project_status', 'Active%')
        .in('project_type', [...ELIGIBLE_PROJECT_TYPES])
        .eq('user_projects.user_id', user.id)
    : { data: [], error: null };

  if (focusProjectsResult.error) {
    throw new Error(
      `Failed to load default map focus: ${focusProjectsResult.error.message}`,
    );
  }
  if (projectsResult.error) {
    throw new Error(
      `Failed to load projects for map: ${projectsResult.error.message}`,
    );
  }

  const portfolioRows = (projectsResult.data ?? []) as ProjectRow[];

  let globalActiveProjectCount = 0;
  let mappedLabelUnknownCount = 0;
  for (const p of portfolioRows) {
    const raw = p.project_country;
    if (raw === null) continue;
    const norm = normalizeProjectGeography(raw);
    if (!norm || norm === '') {
      mappedLabelUnknownCount += 1;
      continue;
    }
    if (isGlobalProjectLabel(norm)) {
      globalActiveProjectCount += 1;
      continue;
    }
    if (geographyBucketKeysFromRaw(raw).length === 0) {
      mappedLabelUnknownCount += 1;
    }
  }

  const [nullCountResult, blankCountResult, updatesResult] = await Promise.all([
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .ilike('project_status', 'Active%')
      .in('project_type', [...ELIGIBLE_PROJECT_TYPES])
      .is('project_country', null),
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .ilike('project_status', 'Active%')
      .in('project_type', [...ELIGIBLE_PROJECT_TYPES])
      .eq('project_country', ''),
    supabase
      .from('updates')
      .select(
        'value, projects!inner(project_country, project_status, project_type), impact_indicators!inner(indicator_code, indicator_unit, ii_heirarchy)',
      )
      .eq('valid', true)
      .eq('duplicate', false)
      .not('value', 'is', null),
  ]);

  if (nullCountResult.error) {
    throw new Error(
      `Failed to count projects without country: ${nullCountResult.error.message}`,
    );
  }
  if (blankCountResult.error) {
    throw new Error(
      `Failed to count projects with blank country: ${blankCountResult.error.message}`,
    );
  }
  if (updatesResult.error) {
    throw new Error(
      `Failed to load updates for map: ${updatesResult.error.message}`,
    );
  }

  const activeProjectsWithoutMappedGeography =
    mappedLabelUnknownCount +
    (nullCountResult.count ?? 0) +
    (blankCountResult.count ?? 0);

  const buckets = new Map<string, Bucket>();
  indexProjectsByGeography(buckets, portfolioRows);
  indexUpdatesByGeography(
    buckets,
    (updatesResult.data ?? []) as unknown as UpdateRow[],
  );

  const rows = Array.from(buckets.entries())
    .map(([key, bucket]) => bucketKeyToRow(key, bucket))
    .filter((row): row is GeographyImpactRow => row !== null)
    .sort((a, b) => a.geographyLabel.localeCompare(b.geographyLabel));

  const defaultFocus = buildDefaultFocus(
    (focusProjectsResult.data ?? []) as ProjectRow[],
  );

  return {
    rows,
    globalActiveProjectCount,
    activeProjectsWithoutMappedGeography,
    defaultFocusBounds: defaultFocus.bounds,
    defaultFocusLabel: defaultFocus.label,
  };
}
