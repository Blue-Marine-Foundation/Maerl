BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
DO $$
DECLARE submitted public.updates;
BEGIN
  INSERT INTO public.updates(project_id, outcome_measurable_id, type, description, value, date)
  VALUES (1, 1, 'Impact', 'Two MPAs designated', 2, '2026-09-01') RETURNING * INTO submitted;
  BEGIN
    UPDATE public.updates SET admin_reviewed = true, valid = true, verified = true WHERE id = submitted.id;
    RAISE EXCEPTION 'Expected non-admin approval to be rejected';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    INSERT INTO public.updates(project_id, output_measurable_id, outcome_measurable_id, type, description)
    VALUES (1, 1, 1, 'Progress', 'Both parents');
    RAISE EXCEPTION 'Expected dual attachment to be rejected';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    INSERT INTO public.updates(project_id, output_measurable_id, type, description, value)
    VALUES (2, 1, 'Impact', 'Wrong project', 2);
    RAISE EXCEPTION 'Expected cross-project output to be rejected';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    UPDATE public.updates SET outcome_measurable_id = NULL WHERE id = submitted.id;
    RAISE EXCEPTION 'Expected detaching historical update to be rejected';
  EXCEPTION WHEN check_violation THEN NULL; END;
  INSERT INTO public.updates(project_id, outcome_measurable_id, type, description, value)
  VALUES (1, 1, 'Progress', 'Discussions ongoing', 7) RETURNING * INTO submitted;
  ASSERT submitted.value IS NULL AND submitted.valid, 'Progress is visible and nonnumeric';
  INSERT INTO public.updates(project_id, type, description) VALUES (1, 'Progress', 'General update') RETURNING * INTO submitted;
  ASSERT submitted.outcome_measurable_id IS NULL AND submitted.output_measurable_id IS NULL AND submitted.valid, 'General updates remain unchanged';
END $$;
ROLLBACK;
