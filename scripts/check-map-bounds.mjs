#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

async function importTypeScriptModule(relativePath) {
  const source = await readFile(
    path.resolve(process.cwd(), relativePath),
    'utf8',
  );
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(transpiled).toString('base64')}`;
  return import(moduleUrl);
}

function approximatelyEqual(actual, expected, message) {
  assert.ok(Math.abs(actual - expected) < 1e-6, `${message}: ${actual}`);
}

const { GENERATED_ISO_GEOGRAPHIES } = await importTypeScriptModule(
  'components/overview/country-impact-map/generated-iso-geographies.ts',
);
const { getMapBoundsFocus, mergeMapBounds } = await importTypeScriptModule(
  'components/overview/country-impact-map/map-bounds.ts',
);
const boundsByIso = Object.fromEntries(
  GENERATED_ISO_GEOGRAPHIES.map((geography) => [
    geography.iso3,
    geography.bounds,
  ]),
);

const usaBounds = mergeMapBounds([boundsByIso.USA]);
assert.ok(usaBounds);
const usaFocus = getMapBoundsFocus(usaBounds);
approximatelyEqual(
  usaFocus.center[0],
  -127.25062,
  'United States centre should wrap into the conventional longitude range',
);
approximatelyEqual(
  usaFocus.span,
  120.54659,
  'United States should preserve its compact generated span',
);

const fijiAndSamoa = mergeMapBounds([boundsByIso.FJI, boundsByIso.WSM]);
assert.ok(fijiAndSamoa);
const fijiAndSamoaFocus = getMapBoundsFocus(fijiAndSamoa);
assert.ok(
  fijiAndSamoa[1][0] - fijiAndSamoa[0][0] < 20,
  'Fiji and Samoa should remain a compact Pacific longitude interval',
);
assert.ok(
  Math.abs(fijiAndSamoaFocus.center[0]) > 170,
  'Fiji and Samoa should focus near the antimeridian',
);

const usaAndUnitedKingdom = mergeMapBounds([boundsByIso.USA, boundsByIso.GBR]);
assert.ok(usaAndUnitedKingdom);
const usaAndUnitedKingdomFocus = getMapBoundsFocus(usaAndUnitedKingdom);
assert.ok(
  usaAndUnitedKingdom[1][0] - usaAndUnitedKingdom[0][0] < 200,
  'United States and United Kingdom should not produce a near-global interval',
);
assert.ok(
  usaAndUnitedKingdomFocus.center[0] < -80,
  'United States and United Kingdom should not focus over Asia',
);

const fijiAndNewZealand = mergeMapBounds([boundsByIso.FJI, boundsByIso.NZL]);
assert.ok(fijiAndNewZealand);
assert.ok(
  fijiAndNewZealand[1][0] - fijiAndNewZealand[0][0] < 20,
  'Fiji and New Zealand should retain their compact generated longitude span',
);

const conventionalWrappedBounds = [
  [170, -10],
  [-170, 10],
];
const conventionalWrappedFocus = getMapBoundsFocus(conventionalWrappedBounds);
approximatelyEqual(
  conventionalWrappedFocus.center[0],
  -180,
  'A west-greater-than-east bound should focus on the antimeridian',
);
approximatelyEqual(
  conventionalWrappedFocus.span,
  20,
  'A west-greater-than-east bound should use the shorter longitude span',
);

assert.deepEqual(
  mergeMapBounds([
    [
      [-180, -90],
      [180, -60],
    ],
    boundsByIso.GBR,
  ]),
  [
    [-180, -90],
    [180, 60.847886],
  ],
  'A full-longitude bound should remain global',
);

process.stdout.write('Map bounds checks passed.\n');
