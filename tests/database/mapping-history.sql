BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
DO $$
BEGIN
  BEGIN
    INSERT INTO public.outcome_measurables(id, project_id) VALUES (2, 1);
    RAISE EXCEPTION 'Expected unmapped creation to be rejected';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    UPDATE public.outcome_measurables SET impact_indicator_id = 2 WHERE id = 1;
    RAISE EXCEPTION 'Expected non-admin remapping to be rejected';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
DO $$
DECLARE submitted public.updates;
BEGIN
  INSERT INTO public.updates(project_id, outcome_measurable_id, type, description, value, date)
  VALUES (1, 1, 'Impact', 'Two MPAs designated', 2, '2026-09-01') RETURNING * INTO submitted;
  UPDATE public.updates SET verified = true, valid = true, admin_reviewed = true WHERE id = submitted.id;
  UPDATE public.outcome_measurables SET impact_indicator_id = 2 WHERE id = 1;
  SELECT * INTO submitted FROM public.updates WHERE id = submitted.id;
  ASSERT submitted.impact_indicator_id = 1 AND submitted.admin_reviewed, 'Remapping must preserve reviewed history';
  PERFORM public.migrate_outcome_updates(1, ARRAY[submitted.id], 2);
  SELECT * INTO submitted FROM public.updates WHERE id = submitted.id;
  ASSERT submitted.impact_indicator_id = 2 AND NOT submitted.admin_reviewed AND NOT submitted.valid, 'Explicit migration must reset review';
END $$;
ROLLBACK;
