// Overview homepage: strategic pillar presentation + deep-link IDs.
// Indicator IDs match `public.impact_indicators` (verified 2026-05).

export const ALL_TIME_FROM_DATE = '2010-01-01';

/** Deep links — stable DB ids */
export const INDICATOR_IDS: Record<string, number> = {
  '1.2.3': 123,
  '1.2.1': 121,
  '1.2.2': 122,
  '2.2.4': 224,
  '2.2.1': 221,
  '2.2.5': 225,
  '4.2.1': 421,
  '4.3.2': 432,
  '5.6.1': 561,
  '5.2.1': 521,
  '5.2.2': 522,
  '5.3.3': 533,
};

/** Protection pillar — stacked bar order (committed → proposed → designated). */
export const PROTECTION_SEGMENTS = [
  {
    code: '1.2.3',
    shortLabel: 'Committed',
    barClass: 'bg-teal-600',
  },
  {
    code: '1.2.1',
    shortLabel: 'Proposed',
    barClass: 'bg-amber-500',
  },
  {
    code: '1.2.2',
    shortLabel: 'Designated',
    barClass: 'bg-orange-600',
  },
] as const;

export const RESTORATION_INDICATORS = [
  {
    code: '2.2.5',
    label: 'Sea floor actively under restoration',
  },
  {
    code: '2.2.1',
    label: 'Habitat showing measurable improvement',
  },
  {
    code: '2.2.4',
    label: 'Restoration specimens deployed',
  },
] as const;

export const FISHERIES_INDICATORS = [
  {
    code: '4.2.1',
    label: 'Sea area where risky fishing gear or practices are banned',
  },
  {
    code: '4.3.2',
    label: 'Laws or agreements Blue Marine helped shape',
  },
  {
    code: '5.6.1',
    label: 'People engaged in fishery or site management',
  },
] as const;

export const ENGAGEMENT_INDICATORS = [
  {
    code: '5.2.1',
    label: 'Financial benefits',
    hint: 'People who received monetary benefits through Blue Marine–linked work.',
  },
  {
    code: '5.2.2',
    label: 'In-kind benefits',
    hint: 'People who received non-financial benefits (training, access, support, etc.).',
  },
  {
    code: '5.3.3',
    label: 'Outreach that led to action',
    hint:
      'People reached by communications who donated, advocated, or changed behaviour.',
  },
] as const;

export const OVERVIEW_FETCH_CODES: readonly string[] = Array.from(
  new Set<string>([
    ...PROTECTION_SEGMENTS.map((s) => s.code),
    ...RESTORATION_INDICATORS.map((i) => i.code),
    ...FISHERIES_INDICATORS.map((i) => i.code),
    ...ENGAGEMENT_INDICATORS.map((i) => i.code),
  ]),
);
