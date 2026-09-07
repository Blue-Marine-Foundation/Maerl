# Outcome Indicator Updates (#172)

Outcome and Output Indicators share the update form, evidence fields, editing controls, review rules, and existing `updates` RLS policies. Outcome indicators expose Add update and Show updates in the project logframe. General Update creation and its legacy visibility filter remain available.

New Outcome Indicators require an Impact Indicator. Only Admin and Super Admin users may change an existing mapping; mappings cannot be removed. Legacy unmapped indicators can still have their wording edited, but must be mapped before they accept updates. Existing-indicator cleanup and mapping are deferred at the user's request, pending collaborator decisions.

Indicator Impact Updates start Pending Review. Reporting requires all of `type = Impact`, `admin_reviewed = true`, `valid = true`, `verified = true`, `duplicate = false`, and a numeric value. Mark repeated results duplicate during review. Content changes reset review; review-only saves leave content untouched. Progress Updates have no numeric value and appear immediately.

An update captures its Impact Indicator on insertion. Editing its Outcome Indicator's mapping does not change historical updates. An authenticated admin can explicitly migrate selected historical updates to the Outcome Indicator's current mapping with:

```sql
select public.migrate_outcome_updates(
  outcome_indicator_id => 123::bigint,
  update_ids => array[456, 457]::bigint[],
  target_impact_indicator_id => 89::bigint
);
```

Replace the example IDs with the reviewed selection. Changed Impact Updates return to Pending Review. Ordinary update forms cannot change the captured mapping or indicator ownership.

## Migration and deployment

Apply `supabase/migrations/20260907090000_outcome_indicator_updates.sql` before deploying the application. It adds the outcome relationship, mapping and review triggers, an explicit migration function, and reviewed-only reporting functions. It retains existing RLS policies. The validation trigger uses definer rights with an empty search path to lock indicators without requiring Partners to edit indicators; writes to `updates` still pass the caller's existing RLS checks. Reporting functions and the reporting view use invoker security.

This change has not been applied to production. The local checkout has no linked Supabase project/access token, so production trigger definitions could not be inspected. Before rollout, validate the migration against a staging copy of the actual schema, particularly existing update triggers and aggregation views. The included database fixture models the relevant legacy columns and Partner policy restrictions, not the complete production schema. Existing stored output aggregates and older reporting RPCs are not rewritten; application reporting uses the new reviewed functions or explicitly filters approved updates.

## Validation

`pnpm typecheck` checks TypeScript. `pnpm test` runs the form tests and database suite. The latter creates and removes an isolated PostgreSQL 15+ cluster under `/tmp`; it never reads application database credentials. PostgreSQL server tools must be on PATH, or set `POSTGRES_BIN` to their directory, for example:

```sh
POSTGRES_BIN=/opt/homebrew/opt/postgresql@15/bin pnpm test
```

Run one form file with `pnpm exec vitest run tests/forms/update-form.test.tsx`, or one database file with `node scripts/test-database.mjs tests/database/partner-permissions.sql` (using the same `POSTGRES_BIN` setting).
