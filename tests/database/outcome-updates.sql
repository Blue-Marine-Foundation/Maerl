BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
DO $$
DECLARE submitted public.updates;
BEGIN
  INSERT INTO public.updates(project_id, outcome_measurable_id, type, description, value, date)
  VALUES (1, 1, 'Impact', 'Two MPAs designated', 2, '2026-09-01') RETURNING * INTO submitted;
  ASSERT submitted.impact_indicator_id = 1, 'Mapping must be captured on submission';
  ASSERT submitted.admin_reviewed = false, 'New impact must be pending';
  ASSERT submitted.valid = false, 'New impact must be excluded from totals';
END $$;
ROLLBACK;
