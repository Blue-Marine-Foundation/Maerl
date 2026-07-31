#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const SAMPLE_LOCATIONS = [
  { label: 'Greece', expectedIso3: 'GRC', coordinates: [22.94, 39.07] },
  {
    label: 'Somaliland (Somalia ISO verification)',
    expectedIso3: 'SOM',
    coordinates: [44.07, 9.56],
  },
  { label: 'Bermuda', expectedIso3: 'BMU', coordinates: [-64.76, 32.3] },
  {
    label: 'Montserrat',
    expectedIso3: 'MSR',
    coordinates: [-62.19, 16.74],
  },
  {
    label: 'Pitcairn Islands',
    expectedIso3: 'PCN',
    coordinates: [-128.32, -24.36],
  },
  { label: 'Fiji', expectedIso3: 'FJI', coordinates: [177.98, -17.83] },
  {
    label: 'New Zealand',
    expectedIso3: 'NZL',
    coordinates: [174.78, -41.29],
  },
  { label: 'Kosovo', expectedIso3: 'XKS', coordinates: [20.9, 42.6] },
  {
    label: 'Akrotiri Sovereign Base Area',
    expectedIso3: 'XSB',
    coordinates: [32.96, 34.61],
  },
];

async function readLocalEnvironment() {
  const source = await readFile('.env', 'utf8');
  const values = {};
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  }
  return values;
}

function passesProductionFilter(properties) {
  if (String(properties.disputed) !== 'false') return false;
  const worldview = String(properties.worldview ?? '');
  return worldview === 'all' || worldview.includes('US');
}

async function queryLocation(sample, token) {
  const [longitude, latitude] = sample.coordinates;
  const endpoint = new URL(
    `https://api.mapbox.com/v4/mapbox.country-boundaries-v1/tilequery/` +
      `${longitude},${latitude}.json`,
  );
  endpoint.searchParams.set('access_token', token);
  endpoint.searchParams.set('radius', '0');
  endpoint.searchParams.set('limit', '50');

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`${sample.label}: Mapbox returned HTTP ${response.status}`);
  }
  const payload = await response.json();
  const candidates = (payload.features ?? []).filter((feature) =>
    passesProductionFilter(feature.properties ?? {}),
  );
  const match = candidates.find(
    (feature) => feature.properties?.iso_3166_1_alpha_3 === sample.expectedIso3,
  );
  const observed = [
    ...new Set(
      candidates.map(
        (feature) =>
          `${feature.properties?.iso_3166_1_alpha_3 ?? '<none>'}` +
          `/${feature.properties?.worldview ?? '<none>'}`,
      ),
    ),
  ];
  return { match, observed };
}

async function main() {
  const environment = await readLocalEnvironment();
  const token = environment.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    throw new Error('NEXT_PUBLIC_MAPBOX_TOKEN is missing from .env');
  }

  let failures = 0;
  for (const sample of SAMPLE_LOCATIONS) {
    const { match, observed } = await queryLocation(sample, token);
    if (match) {
      process.stdout.write(
        `PASS ${sample.label}: ${sample.expectedIso3}/` +
          `${match.properties?.worldview ?? '<none>'}\n`,
      );
    } else {
      failures += 1;
      process.stderr.write(
        `FAIL ${sample.label}: expected ${sample.expectedIso3}; observed ` +
          `${observed.join(', ') || 'no production-filtered feature'}\n`,
      );
    }
  }

  if (failures > 0) {
    throw new Error(`${failures} Mapbox boundary verification(s) failed`);
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
