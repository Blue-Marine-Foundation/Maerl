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
    dotClass: 'bg-emerald-300',
    barClass: 'bg-emerald-300',
  },
  {
    code: '1.2.1',
    shortLabel: 'Proposed',
    dotClass: 'bg-emerald-500',
    barClass: 'bg-emerald-500',
  },
  {
    code: '1.2.2',
    shortLabel: 'Designated',
    dotClass: 'bg-emerald-700',
    barClass: 'bg-emerald-700',
  },
] as const;

export const RESTORATION_INDICATORS = [
  {
    code: '2.2.5',
    label: 'Sea floor under restoration',
  },
  {
    code: '2.2.1',
    label: 'Habitat showing improvement',
  },
  {
    code: '2.2.4',
    label: 'Restoration specimens deployed',
  },
] as const;

export const FISHERIES_INDICATORS = [
  {
    code: '4.2.1',
    label: 'Sea area with risky gear or practices banned',
  },
  {
    code: '4.3.2',
    label: 'Laws or agreements shaped',
  },
  {
    code: '5.6.1',
    label: 'People engaged in management',
  },
] as const;

export const ENGAGEMENT_INDICATORS = [
  {
    code: '5.2.1',
    label: 'Financial benefits',
    hint: 'People who received monetary benefits through Blue Marine-linked work.',
    unitLabel: 'beneficiaries',
  },
  {
    code: '5.2.2',
    label: 'In-kind benefits',
    hint: 'People who received non-financial benefits — training, access, support.',
    unitLabel: 'beneficiaries',
  },
  {
    code: '5.3.3',
    label: 'Outreach that led to action',
    hint:
      'People reached by communications who donated, advocated, or changed behaviour.',
    unitLabel: 'people',
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
