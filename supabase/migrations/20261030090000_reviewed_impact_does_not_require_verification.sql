BEGIN;

-- Verification records attached evidence. Admins may accept verbally confirmed
-- results without that evidence; review, validity and duplication govern totals.
-- No historical update flags are changed by this migration.
CREATE OR REPLACE VIEW public.reviewed_impact_updates WITH (security_invoker = true) AS
SELECT * FROM public.updates
WHERE type = 'Impact' AND admin_reviewed IS TRUE AND valid IS TRUE
  AND duplicate IS FALSE AND value IS NOT NULL;

COMMIT;
