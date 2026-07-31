# Backlog: replace `projects.project_country` free-text with a constrained ISO-3 column

Status: not started. Captured here so it doesn't get lost.

## Why

`public.projects.project_country` is a free-text column today. The audit
that drove the country-choropleth overview map (May 2026) found:

- ~50% of active projects have no country recorded at all (`NULL` or `""`).
- Sub-national values exist (`England`, `Scotland`, `England, Scotland`)
  that the country-level Mapbox tileset can't render — we currently roll
  these up to `GBR` in code.
- Comma-separated multi-country strings exist (`Tunisia, Libya`) that we
  split client-side.
- Whitespace and truncation noise (` Greece`, `Sao Tome`).

Every one of these is normally avoided by replacing free-text input with a
constrained dropdown backed by an ISO-coded column.

## What

1. Add a new column `public.projects.project_country_iso3 char(3)` with a
   foreign-key-style constraint against an ISO-3 reference list (or a
   `CHECK` constraint listing the codes Maerl actually uses).
2. Backfill from the existing `project_country` text using the same map
   captured in
   [components/overview/country-impact-map/country-iso-map.ts](../components/overview/country-impact-map/country-iso-map.ts)
   (`RAW_TO_ISO3`).
3. Replace the project-create / project-edit form input with a
   typeahead-style dropdown of permitted ISO-3 + display-name pairs.
4. Decide whether multi-country projects need a separate `project_countries`
   join table (recommended) or stay as a single primary country with
   secondary countries captured elsewhere.
5. Migrate consumers off `project_country`:
   - `components/overview/country-impact-map/server-actions.ts`
   - the projects data table column (`columns.tsx`)
   - any reporting/exports that read the field
6. Drop or rename `project_country` once consumers are migrated.

## Why not now

It's a coordinated change touching schema, the project-edit UI, RLS
considerations for joined tables (if we add `project_countries`), and the
overview map. The current free-text approach with a single in-code
mapping (`RAW_TO_ISO3`) is good enough for the homepage and unblocks the
"where Maerl works" view we want to ship today. The migration becomes
worthwhile once we want sub-national fidelity, multi-country projects as
first-class records, or input validation that prevents the noise above
from re-appearing.

## Quick win in the meantime

Before the full migration, the lowest-effort improvement is a
`project_country` cleanup pass on the existing rows: trim whitespace,
decide how sub-national values should relate to "United Kingdom", expand
"Sao Tome" to "São Tomé and Príncipe", and normalise the dirty values listed
in the May 2026 audit. That alone keeps the homepage map honest while the
schema-level work is queued.

The interim constrained-input work now prepares that cleanup in
`docs/9-project-country-status-cleanup.sql`, but deliberately leaves the
England/Scotland fold disabled until the owner decides whether retaining
sub-national fidelity is more important than storing one canonical country
label. The status constraint is likewise sign-off-gated because existing
`Transitioned` rows may represent a legitimate fourth workflow state.

## Interim registry workflow

ISO countries and territories are generated from a pinned Natural Earth
dataset and verified against Mapbox Countries v1. Refresh and validate the
checked-in registry with:

```sh
pnpm generate:geographies
pnpm check:geographies
pnpm verify:mapbox-countries
```

The generator is a development tool only; the application reads the generated
TypeScript and makes no runtime geography-data request. Maerl-specific seas,
compound labels, and marker islands still require an explicit metadata entry in
`country-iso-map.ts` plus the corresponding generator option so the picker,
audit SQL, and sign-off CSV remain aligned.

Small ISO territories are rendered as both their Mapbox polygon and a visible
point marker. Existing Maerl marker islands remain marker-only.

## Headline-stat caveat

A newly selected ISO geography can shade or pin immediately and receives the
standard project/metric totals. Curated hover headlines are separate content in
`public.map_headline_stats`; they appear only after an enabled row is added for
the geography key. A Super Admin editor for that table remains a possible
follow-up and is not part of the constrained-input work.

## Release ordering

After owner sign-off, run the finalized cleanup first, apply the selected
constraints, and deploy the form/map changes in the same release window. The
patch-based metadata action allows unrelated edits to save while an unchanged
legacy country or status is still present, and names the offending field when a
user attempts to change it to a non-canonical value.
