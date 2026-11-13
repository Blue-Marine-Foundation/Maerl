BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
DO $$
DECLARE first_id bigint; repeated_id bigint; total double precision;
BEGIN
  INSERT INTO public.updates(project_id, outcome_measurable_id, type, description, value, date)
  VALUES (1, 1, 'Impact', 'Two MPAs designated', 2, '2026-09-01') RETURNING id INTO first_id;
  SELECT coalesce(sum(total_value), 0) INTO total FROM public.get_reviewed_impact_indicator_summaries('2026-01-01', '2026-12-31');
  ASSERT total = 0, 'Pending impact must not count';
  UPDATE public.updates SET valid = true, admin_reviewed = true WHERE id = first_id;
  SELECT coalesce(sum(total_value), 0) INTO total FROM public.get_reviewed_impact_indicator_summaries('2026-01-01', '2026-12-31');
  ASSERT total = 0, 'Unverified impact must not count';
  UPDATE public.updates SET verified = true WHERE id = first_id;
  INSERT INTO public.updates(project_id, output_measurable_id, type, description, value, date)
  VALUES (1, 1, 'Impact', 'Same MPAs reported again', 2, '2026-09-02') RETURNING id INTO repeated_id;
  UPDATE public.updates SET valid = true, admin_reviewed = true, verified = true, duplicate = true WHERE id = repeated_id;
  INSERT INTO public.updates(project_id, outcome_measurable_id, type, description, value, date)
  VALUES (1, 1, 'Progress', 'Work continues', 9, '2026-09-03');
  SELECT coalesce(sum(total_value), 0) INTO total FROM public.get_reviewed_impact_indicator_summaries('2026-01-01', '2026-12-31');
  ASSERT total = 2, 'Only approved, valid, verified, nonduplicate numeric impact counts';
  SELECT coalesce(sum(total_value), 0) INTO total FROM public.get_reviewed_impact_indicator_series('2026-01-01', '2026-12-31');
  ASSERT total = 2, 'Series must agree with summaries';
  UPDATE public.updates SET value = 3 WHERE id = first_id;
  SELECT coalesce(sum(total_value), 0) INTO total FROM public.get_reviewed_impact_indicator_summaries('2026-01-01', '2026-12-31');
  ASSERT total = 0, 'Edited impact must leave totals';
END $$;
ROLLBACK;
