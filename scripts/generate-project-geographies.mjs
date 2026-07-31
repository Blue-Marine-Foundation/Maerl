#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';

const NATURAL_EARTH_COMMIT = 'ca96624a56bd078437bca8184e78163e5039ad19';
const NATURAL_EARTH_URL =
  `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/` +
  `${NATURAL_EARTH_COMMIT}/geojson/ne_10m_admin_0_map_units.geojson`;

const GENERATED_TS_PATH =
  'components/overview/country-impact-map/generated-iso-geographies.ts';
const AUDIT_SQL_PATH = 'docs/4-project-country-audit.sql';
const SIGNOFF_CSV_PATH = 'docs/project-field-signoff.csv';

const GENERATED_VALUES_START = '-- BEGIN GENERATED CANONICAL GEOGRAPHY VALUES';
const GENERATED_VALUES_END = '-- END GENERATED CANONICAL GEOGRAPHY VALUES';
const SMALL_GEOGRAPHY_MAX_SHORT_SPAN_DEGREES = 2;

const MAPBOX_VERIFIED_EXTRAS = [
  {
    iso3: 'XKS',
    label: 'Kosovo',
    sourceFeature: (feature) => feature.properties?.NAME_EN === 'Kosovo',
  },
  {
    iso3: 'XSB',
    label: 'Sovereign Base Areas (Akrotiri and Dhekelia)',
    sourceFeature: (feature) =>
      ['ESB', 'WSB'].includes(feature.properties?.ADM0_A3),
  },
];

const ISO_LABEL_OVERRIDES = {
  SHN: 'Saint Helena, Ascension and Tristan da Cunha',
  USA: 'United States',
  UMI: 'United States Minor Outlying Islands',
};

const UMI_FEATURE_NAMES = new Set([
  'Baker Island',
  'Howland Island',
  'Jarvis Island',
  'Johnston Atoll',
  'Kingman Reef',
  'Midway Atoll',
  'Palmyra Atoll',
  'Wake Island',
]);

const CUSTOM_CANONICAL_OPTIONS = [
  {
    value: 'Aruba, Bonaire, Curacao',
    label: 'Aruba, Bonaire, Curacao',
    group: 'Countries & Territories',
  },
  {
    value: 'Dutch Caribbean',
    label: 'Dutch Caribbean',
    group: 'Countries & Territories',
  },
  {
    value: 'Tunisia, Libya',
    label: 'Tunisia, Libya',
    group: 'Countries & Territories',
  },
  { value: 'Ascension', label: 'Ascension', group: 'Islands' },
  {
    value: 'Channel Islands',
    label: 'Channel Islands',
    group: 'Islands',
  },
  {
    value: 'French Polynesia',
    label: 'French Polynesia',
    group: 'Islands',
  },
  { value: 'St Helena', label: 'St Helena', group: 'Islands' },
  { value: 'Dogger Bank', label: 'Dogger Bank', group: 'Seas & Oceans' },
  {
    value: 'Indian Ocean',
    label: 'Indian Ocean',
    group: 'Seas & Oceans',
  },
  {
    value: 'Mediterranean Sea',
    label: 'Mediterranean Sea',
    group: 'Seas & Oceans',
  },
  { value: 'North Sea', label: 'North Sea', group: 'Seas & Oceans' },
  { value: 'Global', label: 'Global', group: 'Global' },
];

const CURRENT_AUDIT_ROWS = {
  project_status: [
    ['Active', 69],
    ['Complete', 39],
    ['Pipeline', 6],
    ['Transitioned', 2],
  ],
  project_type: [
    ['Project', 87],
    ['Unit led project', 23],
    ['Unit', 6],
  ],
  project_country: [
    [null, 42],
    ['United Kingdom', 17],
    ['Global', 14],
    ['United Kingdom, EU', 3],
    ['Channel Islands', 2],
    ['Chile', 2],
    ['Greece', 2],
    ['Italy', 2],
    ['Namibia', 2],
    ['Spain', 2],
    ['Antarctica', 1],
    ['Argentina', 1],
    ['Aruba, Bonaire, Curacao', 1],
    ['Ascension', 1],
    ['Azerbaijan', 1],
    ['Bahrain', 1],
    ['Barbados', 1],
    ['Belgium', 1],
    ['Brazil', 1],
    ['British Virgin Islands', 1],
    ['Dominican Republic', 1],
    ['England', 1],
    ['French Polynesia', 1],
    ['Indian Ocean', 1],
    ['Indonesia', 1],
    ['Maldives', 1],
    ['Mediterranean Sea', 1],
    ['Mexico', 1],
    ['Mozambique', 1],
    ['North Sea', 1],
    ['Panama', 1],
    ['Philippines', 1],
    ['Saint Kitts and Nevis', 1],
    ['Saint Vincent and the Grenadines', 1],
    ['St Helena', 1],
    ['São Tomé and Príncipe', 1],
    ['Turkey', 1],
    ['Uruguay', 1],
  ],
};

const SAFE_VALUE_MAPPINGS = new Map([
  ['project_country:', null],
  ['project_country:French Polynseia', 'French Polynesia'],
  ['project_country:Mediterranean Sea ', 'Mediterranean Sea'],
  ['project_country:Sao Tome', 'São Tomé and Príncipe'],
  ['project_country:St Kitts and Nevis', 'Saint Kitts and Nevis'],
  [
    'project_country:St Vincent and the Grenadines',
    'Saint Vincent and the Grenadines',
  ],
]);

const SIGNOFF_DECISIONS = [
  {
    field: 'project_status',
    currentValue: 'Transitioned',
    currentCount: 2,
    proposedValue: '',
    action:
      'Choose: retain as a fourth status, or convert both rows to Complete',
    notes:
      'A CHECK constraint must not be finalized until the status owner records this decision.',
  },
  {
    field: 'project_country',
    currentValue: 'England',
    currentCount: 1,
    proposedValue: '',
    action: 'Choose: preserve sub-national value, or fold to United Kingdom',
    notes:
      'Preserving the raw value retains future sub-national migration fidelity.',
  },
  {
    field: 'project_country',
    currentValue: 'Scotland',
    currentCount: 0,
    proposedValue: '',
    action: 'Choose: preserve sub-national value, or fold to United Kingdom',
    notes:
      'No current row in the 2026-07-31 audit; decision still governs legacy aliases.',
  },
  {
    field: 'project_country',
    currentValue: 'England, Scotland',
    currentCount: 0,
    proposedValue: '',
    action: 'Choose: preserve sub-national value, or fold to United Kingdom',
    notes:
      'No current row in the 2026-07-31 audit; decision still governs legacy aliases.',
  },
  {
    field: 'project_country',
    currentValue: 'United Kingdom, EU',
    currentCount: 3,
    proposedValue: '',
    action: 'Choose: preserve compound value, or fold to United Kingdom',
    notes:
      'The current map resolves this value to GBR, so cleanup is not required for visibility.',
  },
];

const GROUP_ORDER = [
  'Countries & Territories',
  'Islands',
  'Seas & Oceans',
  'Global',
];

function roundCoordinate(value) {
  return Number(value.toFixed(6));
}

function visitCoordinates(value, output) {
  if (
    Array.isArray(value) &&
    value.length >= 2 &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  ) {
    output.push([value[0], value[1]]);
    return;
  }
  if (!Array.isArray(value)) return;
  for (const child of value) visitCoordinates(child, output);
}

function minimalLongitudeBounds(points) {
  const longitudes = points
    .map(([longitude]) => ((longitude % 360) + 360) % 360)
    .sort((a, b) => a - b);

  let largestGap = -1;
  let largestGapIndex = 0;
  for (let index = 0; index < longitudes.length; index += 1) {
    const next =
      index === longitudes.length - 1
        ? longitudes[0] + 360
        : longitudes[index + 1];
    const gap = next - longitudes[index];
    if (gap > largestGap) {
      largestGap = gap;
      largestGapIndex = index;
    }
  }

  let west = longitudes[(largestGapIndex + 1) % longitudes.length];
  let east = longitudes[largestGapIndex];
  if (east < west) east += 360;
  if (west > 180) {
    west -= 360;
    east -= 360;
  }
  return [west, east];
}

function boundsForFeatures(features, iso3) {
  const points = [];
  for (const feature of features) {
    visitCoordinates(feature.geometry?.coordinates, points);
  }
  if (points.length === 0) {
    throw new Error(`No geometry coordinates found for ${iso3}`);
  }

  if (iso3 === 'ATA') {
    return [
      [-180, -90],
      [180, -60],
    ];
  }

  const [west, east] = minimalLongitudeBounds(points);
  const latitudes = points.map(([, latitude]) => latitude);
  return [
    [roundCoordinate(west), roundCoordinate(Math.min(...latitudes))],
    [roundCoordinate(east), roundCoordinate(Math.max(...latitudes))],
  ];
}

function featureCode(feature) {
  const name = feature.properties?.NAME_EN;
  if (UMI_FEATURE_NAMES.has(name)) return 'UMI';

  const iso3Eh = feature.properties?.ISO_A3_EH;
  const iso3 = feature.properties?.ISO_A3;
  if (/^[A-Z]{3}$/.test(iso3Eh ?? '')) return iso3Eh;
  if (/^[A-Z]{3}$/.test(iso3 ?? '')) return iso3;
  return null;
}

function labelForFeatures(iso3, features) {
  const overridden = ISO_LABEL_OVERRIDES[iso3];
  if (overridden) return overridden;

  const exact = features.find((feature) => feature.properties?.ISO_A3 === iso3);
  return (
    exact?.properties?.NAME_EN ??
    features[0]?.properties?.ADMIN ??
    features[0]?.properties?.NAME_EN ??
    iso3
  );
}

function markerCoordinatesForFeatures(features, bounds) {
  const featureWithLabel = features.find(
    (feature) =>
      Number.isFinite(feature.properties?.LABEL_X) &&
      Number.isFinite(feature.properties?.LABEL_Y),
  );
  if (featureWithLabel) {
    return [
      roundCoordinate(featureWithLabel.properties.LABEL_X),
      roundCoordinate(featureWithLabel.properties.LABEL_Y),
    ];
  }
  return [
    roundCoordinate((bounds[0][0] + bounds[1][0]) / 2),
    roundCoordinate((bounds[0][1] + bounds[1][1]) / 2),
  ];
}

function registryEntry(iso3, features) {
  const bounds = boundsForFeatures(features, iso3);
  const longitudeSpan = Math.abs(bounds[1][0] - bounds[0][0]);
  const latitudeSpan = Math.abs(bounds[1][1] - bounds[0][1]);
  const isNaturalEarthTiny = features.some(
    (feature) => Number(feature.properties?.TINY) > 0,
  );
  const renderAsPoint =
    isNaturalEarthTiny ||
    Math.min(longitudeSpan, latitudeSpan) <=
      SMALL_GEOGRAPHY_MAX_SHORT_SPAN_DEGREES;

  return {
    iso3,
    label: labelForFeatures(iso3, features),
    bounds,
    renderAsPoint,
    markerCoordinates: renderAsPoint
      ? markerCoordinatesForFeatures(features, bounds)
      : null,
  };
}

function buildRegistry(featureCollection) {
  const grouped = new Map();
  for (const feature of featureCollection.features ?? []) {
    const iso3 = featureCode(feature);
    if (!iso3) continue;
    const existing = grouped.get(iso3) ?? [];
    existing.push(feature);
    grouped.set(iso3, existing);
  }

  if (!grouped.has('UMI')) {
    throw new Error('Natural Earth features did not produce a UMI group');
  }

  const officialEntries = [...grouped.entries()]
    .map(([iso3, features]) => registryEntry(iso3, features))
    .sort((a, b) => a.label.localeCompare(b.label));

  if (officialEntries.length !== 249) {
    throw new Error(
      `Expected 249 official ISO entries, found ${officialEntries.length}`,
    );
  }

  const extraEntries = MAPBOX_VERIFIED_EXTRAS.map((extra) => {
    const features = featureCollection.features.filter(extra.sourceFeature);
    if (features.length === 0) {
      throw new Error(`No Natural Earth source geometry for ${extra.iso3}`);
    }
    return {
      ...registryEntry(extra.iso3, features),
      label: extra.label,
    };
  });

  const entries = [...officialEntries, ...extraEntries].sort((a, b) =>
    a.label.localeCompare(b.label),
  );
  const isoCodes = new Set(entries.map((entry) => entry.iso3));
  const labels = new Set(entries.map((entry) => entry.label));
  if (isoCodes.size !== entries.length) {
    throw new Error('Generated ISO registry contains duplicate ISO-3 codes');
  }
  if (labels.size !== entries.length) {
    const duplicateLabels = entries
      .filter(
        (entry, index) =>
          entries.findIndex((candidate) => candidate.label === entry.label) !==
          index,
      )
      .map((entry) => `${entry.iso3}:${entry.label}`);
    throw new Error(
      `Generated ISO registry contains duplicate labels: ${duplicateLabels.join(', ')}`,
    );
  }
  return entries;
}

function canonicalOptions(registry) {
  const optionsByValue = new Map(
    registry.map((entry) => [
      entry.label,
      {
        value: entry.label,
        label: entry.label,
        group: 'Countries & Territories',
      },
    ]),
  );

  for (const option of CUSTOM_CANONICAL_OPTIONS) {
    optionsByValue.set(option.value, option);
  }

  return [...optionsByValue.values()].sort((a, b) => {
    const groupDifference =
      GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
    return groupDifference || a.label.localeCompare(b.label);
  });
}

function validateGeneratedData(registry, options) {
  for (const entry of registry) {
    const coordinates = [
      ...entry.bounds.flat(),
      ...(entry.markerCoordinates ?? []),
    ];
    if (!coordinates.every(Number.isFinite)) {
      throw new Error(`${entry.iso3} contains a non-finite coordinate`);
    }
    if (
      entry.bounds[1][0] < entry.bounds[0][0] ||
      entry.bounds[1][1] < entry.bounds[0][1]
    ) {
      throw new Error(`${entry.iso3} contains inverted bounds`);
    }
    if (entry.renderAsPoint !== Boolean(entry.markerCoordinates)) {
      throw new Error(`${entry.iso3} has inconsistent point-marker metadata`);
    }
  }

  for (const iso3 of ['BMU', 'MSR', 'PCN', 'PYF', 'MDV']) {
    const entry = registry.find((candidate) => candidate.iso3 === iso3);
    if (!entry?.renderAsPoint || !entry.markerCoordinates) {
      throw new Error(`${iso3} must be generated with a visible point marker`);
    }
  }

  const optionValues = new Set(options.map((option) => option.value));
  if (optionValues.size !== options.length) {
    throw new Error('Canonical picker options contain duplicate values');
  }
  for (let index = 1; index < options.length; index += 1) {
    const previous = options[index - 1];
    const current = options[index];
    const groupDifference =
      GROUP_ORDER.indexOf(previous.group) - GROUP_ORDER.indexOf(current.group);
    if (
      groupDifference > 0 ||
      (groupDifference === 0 && previous.label.localeCompare(current.label) > 0)
    ) {
      throw new Error('Canonical picker options are not grouped/alphabetized');
    }
  }
}

function generatedTypeScript(registry) {
  return `// This file is generated by scripts/generate-project-geographies.mjs.
// Source: Natural Earth ${NATURAL_EARTH_COMMIT} (public domain).
// XKS and XSB are included only after live verification against Mapbox Countries v1.
// Do not edit this file by hand.

export type GeneratedIsoGeography = {
  iso3: string;
  label: string;
  bounds: [[number, number], [number, number]];
  renderAsPoint: boolean;
  markerCoordinates: [number, number] | null;
};

export const GENERATED_ISO_SOURCE = {
  naturalEarthCommit: '${NATURAL_EARTH_COMMIT}',
  officialIsoEntries: 249,
  mapboxVerifiedExtras: ['XKS', 'XSB'],
} as const;

export const GENERATED_ISO_GEOGRAPHIES: GeneratedIsoGeography[] = ${JSON.stringify(
    registry,
    null,
    2,
  )};
`;
}

function generatedAuditValues(options) {
  return options
    .map(
      (option, index) =>
        `    ('${option.value.replaceAll("'", "''")}')${
          index === options.length - 1 ? '' : ','
        }`,
    )
    .join('\n');
}

function replaceGeneratedAuditValues(source, generatedValues) {
  const startIndex = source.indexOf(GENERATED_VALUES_START);
  const endIndex = source.indexOf(GENERATED_VALUES_END);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error(
      `${AUDIT_SQL_PATH} is missing the generated geography markers`,
    );
  }
  const before = source.slice(0, startIndex + GENERATED_VALUES_START.length);
  const after = source.slice(endIndex);
  return `${before}\n${generatedValues}\n${after}`;
}

function csvCell(value) {
  const stringValue = value === null ? '<NULL>' : String(value ?? '');
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function generatedSignoffCsv(options) {
  const header = [
    'record_kind',
    'field',
    'current_value',
    'current_count',
    'proposed_value',
    'option_group',
    'proposed_action',
    'decision_required',
    'owner_decision',
    'owner_notes',
  ];
  const rows = [];

  for (const option of options) {
    rows.push([
      'canonical_option',
      'project_country',
      '',
      '',
      option.value,
      option.group,
      'Allow in canonical picker',
      'false',
      '',
      '',
    ]);
  }

  for (const [field, values] of Object.entries(CURRENT_AUDIT_ROWS)) {
    for (const [currentValue, count] of values) {
      const mappingKey = `${field}:${currentValue === null ? '\u0000' : currentValue}`;
      const hasSafeMapping = SAFE_VALUE_MAPPINGS.has(mappingKey);
      const proposedValue = hasSafeMapping
        ? SAFE_VALUE_MAPPINGS.get(mappingKey)
        : currentValue;
      rows.push([
        'current_value',
        field,
        currentValue,
        count,
        proposedValue,
        '',
        hasSafeMapping ? 'Apply unambiguous cleanup' : 'Keep pending audit',
        'false',
        '',
        'Post-cleanup read-only audit snapshot captured 2026-07-31',
      ]);
    }
  }

  for (const decision of SIGNOFF_DECISIONS) {
    rows.push([
      'decision',
      decision.field,
      decision.currentValue,
      decision.currentCount,
      decision.proposedValue,
      '',
      decision.action,
      'true',
      '',
      decision.notes,
    ]);
  }

  return [header, ...rows]
    .map((row) => row.map(csvCell).join(','))
    .join('\n')
    .concat('\n');
}

async function writeOrCheck(relativePath, content, checkOnly) {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  if (checkOnly) {
    let existing;
    try {
      existing = await readFile(absolutePath, 'utf8');
    } catch {
      throw new Error(`${relativePath} is missing; run the generator`);
    }
    if (existing !== content) {
      throw new Error(`${relativePath} is stale; run the generator`);
    }
    process.stdout.write(`checked ${relativePath}\n`);
    return;
  }
  await writeFile(absolutePath, content);
  process.stdout.write(`generated ${relativePath}\n`);
}

async function main() {
  const checkOnly = process.argv.includes('--check');
  const response = await fetch(NATURAL_EARTH_URL);
  if (!response.ok) {
    throw new Error(
      `Natural Earth download failed with HTTP ${response.status}`,
    );
  }
  const featureCollection = await response.json();
  const registry = buildRegistry(featureCollection);
  const options = canonicalOptions(registry);
  validateGeneratedData(registry, options);
  const prettierConfig = (await resolveConfig(GENERATED_TS_PATH)) ?? {};
  const formattedTypeScript = await format(generatedTypeScript(registry), {
    ...prettierConfig,
    filepath: GENERATED_TS_PATH,
  });

  const auditSource = await readFile(
    path.resolve(process.cwd(), AUDIT_SQL_PATH),
    'utf8',
  );
  const updatedAudit = replaceGeneratedAuditValues(
    auditSource,
    generatedAuditValues(options),
  );

  await writeOrCheck(GENERATED_TS_PATH, formattedTypeScript, checkOnly);
  await writeOrCheck(AUDIT_SQL_PATH, updatedAudit, checkOnly);
  await writeOrCheck(SIGNOFF_CSV_PATH, generatedSignoffCsv(options), checkOnly);

  const pointEntries = registry.filter((entry) => entry.renderAsPoint);
  process.stdout.write(
    `registry: ${registry.length} boundaries, ${options.length} canonical options, ` +
      `${pointEntries.length} dual-rendered point markers\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
