BEGIN;

-- Keep public on search_path for functions that issue UPDATE public.updates,
-- so legacy triggers on public.updates referencing unqualified table names
-- (e.g. "updates") continue to resolve cleanly.
ALTER FUNCTION public.sync_updates_impact_indicator() SET search_path = public;
ALTER FUNCTION public.migrate_outcome_updates(bigint, bigint[], bigint) SET search_path = public;

COMMIT;
