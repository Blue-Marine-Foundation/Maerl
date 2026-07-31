# Plan: constrained Country + Status inputs so projects always appear on the map

Context: the overview map already reads live from Supabase, but free-text
`project_country` (and dirty legacy `project_status` values like `'Active '`)
mean unrecognised strings silently drop projects off the map. This plan makes
bad values impossible to enter and cleans up what's already there.

Key codebase facts driving the plan:

- The edit form ([components/project-metadata/edit-form.tsx](../components/project-metadata/edit-form.tsx))
  is the ONLY in-app write path — there is no create-project page; new projects
  are inserted directly in Supabase. So UI dropdowns alone don't fully close the
  loop; DB-level guards are needed too.
- `project_status` is ALREADY a `<select>` in the edit form (Pipeline/Active/
  Complete). The dirty values (`'Active '`) are legacy rows or direct inserts —
  and a legacy value currently renders as a blank selection without warning.
- The map's canonical geography list lives in
  [components/overview/country-impact-map/country-iso-map.ts](../components/overview/country-impact-map/country-iso-map.ts)
  (`RAW_TO_ISO3`, `RAW_TO_WATER_REGION`, `RAW_TO_POINT_REGION`, `Global`).
- [docs/4-project-country-audit.sql](../docs/4-project-country-audit.sql) already
  audits dirty values; [docs/7-project-country-iso3-migration.md](../docs/7-project-country-iso3-migration.md)
  captures the eventual full ISO-3 schema migration — this plan is the interim
  step 3 of that doc, deliberately without the schema change.

## Phase 1 — Canonical options list (shared source of truth)

- [x] In `country-iso-map.ts`, export `CANONICAL_GEOGRAPHY_OPTIONS` —
      one entry per canonical display label: the preferred key for each ISO
      group (e.g. `British Virgin Islands`, not `BVI`), each water region,
      each point region, existing compound entries (`Tunisia, Libya`,
      `Aruba, Bonaire, Curacao`), and `Global`. Alphabetised.
      Scope is explicitly broader than sovereign states: overseas
      territories (BVI, Dutch Caribbean), marker islands (Ascension,
      St Helena, French Polynesia, Channel Islands), and seas/oceans are
      all included — the list is "anything the map can render".
- [x] Group options for the picker: Countries & Territories /
      Islands / Seas & Oceans / Global — so territories are easy to find.
- [x] Keep alias keys (`BVI`, `St Kitts & Nevis`, ` French Polynseia`…) in the
      RAW\_ maps for legacy rows, but only canonical labels appear in the picker.
- [x] Pre-seed the registry with the FULL
      ISO 3166-1 list (~250 countries + ISO-coded territories) via a one-off
      generated file (name + ISO-3 + bounds from a public dataset). Mapbox
      `country-boundaries-v1` already has polygons for all of them, so any
      brand-new country renders immediately with zero code change — the map
      stays genuinely live. Without this, a project in a new geography needs
      a one-line registry edit + deploy before it's selectable.
      Consequence: full list requires the searchable combobox (Phase 2), not
      a native select. Non-ISO geographies (new sea programmes, compound
      labels, extra marker islands) still need a one-line code addition
      either way — document that workflow in the file header.
- [x] Generate tiny-territory marker metadata from pinned Natural Earth bounds
      and label points; dual-render small ISO polygons and visible markers.
- [x] Verify sample codes against the live Mapbox tileset, including Greece,
      Somalia/Somaliland, Kosovo (`XKS`), and the Sovereign Base Areas (`XSB`).

## Phase 2 — Form changes (edit-form.tsx)

- [x] Replace the Project Country `TextInput` with a searchable combobox fed by
      `CANONICAL_GEOGRAPHY_OPTIONS`, plus a "Not set" empty option.
- [x] Legacy-value guard (applies to BOTH country and status inputs): if the
      loaded value isn't in the options list, render it as an extra
      `(legacy — please reselect)` option so the form doesn't silently blank or
      clobber it, and show it needs fixing.
- [x] Trim/normalise changed fields in `handleSubmit` and validate them again in
      the patch-based server action. Unchanged legacy fields do not block saves.
- [x] Picker component: the full ISO list uses a searchable
      shadcn/Radix Command combobox.

## Phase 3 — One-off data cleanup (SQL, run in Supabase)

- [x] Run a read-only audit to enumerate dirty values.
- [x] Extend the audit to `project_type` — it's a third map-gating field
      (map only shows `'Project'` / `'Unit led project'`; a typo there
      silently hides a project) and it isn't editable in the app at all.
- [x] Write `docs/9-project-country-status-cleanup.sql`: trim whitespace on
      all three columns; fold known variants to canonical labels (`'Active '`
      → `'Active'`, `' Greece'` → `'Greece'`, `BVI` → `British Virgin
Islands`, `Sao Tome` → canonical, etc.). Verify with audit after.
- [x] Run the sign-off-independent cleanup against the live Maerl database:
      six `project_country` rows changed on 2026-07-31; the post-cleanup audit
      found zero remaining safe cleanup candidates. `Transitioned` and the UK
      sub-national/compound values were left unchanged.
- [ ] Share `docs/project-field-signoff.csv` with Suneha for sign-off
      on names/spellings before the picker ships (replaces her lost
      "list of all project countries").

## Phase 4 — DB-level guards (stop bad direct inserts)

- [ ] Select and enable one guarded status CHECK after Suneha decides whether
      `Transitioned` is retained or converted to `Complete`; run it only after
      Phase 3 cleanup.
- [x] For country: prepare a trigger that trims whitespace on insert/update.
      Recommend the trim-trigger only for now — the country list grows often,
      and a CHECK would make adding a new country a DB migration; the full FK
      answer is the docs/7 ISO-3 migration.
- [x] Prepare a matching CHECK for `project_type` (audited closed set:
      `'Project'`, `'Unit led project'`, `'Unit'`, + whatever the audit
      finds legitimately in use).
- [x] Apply and verify the country-normalization trigger and project-type CHECK
      against the live database on 2026-07-31. The behavior test ran inside a
      rolled-back transaction and left project data unchanged.
- [x] Save as `docs/10-project-field-constraints.sql`, note in docs/7 that
      steps overlap.
- [x] Tighten the country-map queries in
      `country-impact-map/server-actions.ts` from
      `ilike('project_status', 'Active%')` (a workaround for the legacy
      `'Active '` rows — and one that still misses leading-space/typo
      variants) to exact `eq('project_status', 'Active')`.

## Phase 4b — Map-side visibility & liveness follow-ups

- [x] Unmapped-projects caption → server-filtered actionable list for Admin and
      Super Admin users:
      "+N active projects without a mapped geography"
      (`map-view.tsx:717`). For admins, list WHICH projects (name + raw
      country value) — popover or tooltip — so "why isn't X on the map?"
      becomes self-diagnosable instead of a support request.
- [x] Document the headline-stats caveat: a new geography appears on the
      map automatically (shading/pin, project list, standard metric
      totals), but the curated hover headline stats come from the
      `map_headline_stats` table and need a row per geography. Note the
      workflow in docs; a Super Admin editor for that table is a possible
      later follow-up, not in scope here.

## Phase 5 — Verify

- [ ] Edit a project: country dropdown shows canonical list; saved value
      renders on the overview map without touching `country-iso-map.ts`.
- [ ] Zero-impact project renders (St Kitts case): a project with a valid
      geography but no valid updates still shades/pins its geography with
      the project listed and empty metrics — confirmed supported in
      `indexProjectsByGeography` (buckets projects independently of
      updates); verify it stays true end-to-end.
- [x] Load a project with a legacy value: code path preserves and labels the
      value, allows unrelated patch saves, and requires a canonical selection
      only when that field changes.
- [ ] Re-run docs/4 audit: zero rows flagged `has_leading_space` /
      `has_trailing_space` / `not_in_lookup` (bar deliberate entries).
- [ ] Direct insert with `'Active '` status rejected by the CHECK constraint.
- [x] `pnpm build` clean.
- [ ] Deploy to staging for user testing after field sign-off and SQL
      finalization.

## Explicitly out of scope (tracked in docs/7)

- New `project_country_iso3` column / join table for multi-country projects.
- Migrating map/table consumers off free-text `project_country`.

## Review

- Branch: `feature/constrained-project-geography-inputs` (created from `main`).
- Generated 249 official ISO entries plus live-verified Mapbox `XKS`/`XSB`
  entries, 262 canonical picker options, and 105 dual-rendered point markers.
- `pnpm verify:mapbox-countries`: passed all nine live samples.
- `pnpm build`: passed.
- Safe cleanup, the country-normalization trigger, and the project-type CHECK
  ran against the live database on 2026-07-31; no status constraint,
  sign-off-gated mappings, deployment, or external communication performed.
- Pending owner decisions: `Transitioned`; England/Scotland and
  `United Kingdom, EU` folding.
