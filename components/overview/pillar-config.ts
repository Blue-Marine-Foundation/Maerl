// Overview homepage: strategic pillar presentation + deep-link IDs.
// IDs mirror the code-derived `public.impact_indicators` records.

export const ALL_TIME_FROM_DATE = '2010-01-01';

/** Deep links — stable DB ids */
export const INDICATOR_IDS: Record<string, number> = {
  '1.2.3': 123,
  '1.2.1': 121,
  '1.2.2': 122,
  '2.1.2': 212,
  '2.2.4': 224,
  '2.2.1': 221,
  '2.2.5': 225,
  '3.1.2': 312,
  '4.1.2': 412,
  '4.2.1': 421,
  '4.3.2': 432,
  '5.6.1': 561,
  '5.2.1': 521,
  '5.2.2': 522,
  '5.3.3': 533,
  '5.5.1': 551,
};

export type OverviewMetricConfig = {
  label: string;
  codes: readonly string[];
};

export type EngagementMetricConfig = OverviewMetricConfig & {
  hint: string;
  unitLabel: string;
};

/** Protection pillar — stacked bar order (committed → proposed → designated). */
export const PROTECTION_SEGMENTS = [
  {
    code: '1.2.3',
    shortLabel: 'Committed',
    dotClass: 'bg-cyan-300',
    barClass: 'bg-cyan-300',
  },
  {
    code: '1.2.1',
    shortLabel: 'Proposed',
    dotClass: 'bg-sky-500',
    barClass: 'bg-sky-500',
  },
  {
    code: '1.2.2',
    shortLabel: 'Designated',
    dotClass: 'bg-blue-700',
    barClass: 'bg-blue-700',
  },
] as const;

export const RESTORATION_INDICATORS = [
  {
    codes: ['2.2.5'],
    label: 'Area of habitat under active restoration',
  },
  {
    codes: ['2.2.4'],
    label: 'Specimens deployed at restoration sites',
  },
  {
    codes: ['2.1.2'],
    label: 'Policy instruments influenced',
  },
] as const satisfies readonly OverviewMetricConfig[];

export const FISHERIES_INDICATORS = [
  {
    codes: ['4.2.1'],
    label:
      'Area of habitat where harmful or illegal fishing practices are banned',
  },
  {
    codes: ['4.3.2'],
    label: 'legal acts or agreements influenced',
  },
  {
    codes: ['3.1.2', '4.1.2'],
    label: 'policy instruments influenced',
  },
] as const satisfies readonly OverviewMetricConfig[];

export const ENGAGEMENT_INDICATORS = [
  {
    codes: ['5.2.1', '5.2.2'],
    label: 'Direct beneficiaries',
    hint: 'People who received monetary or in-kind support',
    unitLabel: 'people',
  },
  {
    codes: ['5.3.3'],
    label: 'Outreach that led to action',
    hint: 'People reached through public engagement who took action',
    unitLabel: 'people',
  },
  {
    codes: ['5.5.1'],
    label: 'Public and students educated',
    hint: 'People/students who completed education programs',
    unitLabel: 'people',
  },
] as const satisfies readonly EngagementMetricConfig[];

export const OVERVIEW_FETCH_CODES: readonly string[] = Array.from(
  new Set<string>([
    ...PROTECTION_SEGMENTS.map((s) => s.code),
    ...RESTORATION_INDICATORS.flatMap((i) => i.codes),
    ...FISHERIES_INDICATORS.flatMap((i) => i.codes),
    ...ENGAGEMENT_INDICATORS.flatMap((i) => i.codes),
  ]),
);
