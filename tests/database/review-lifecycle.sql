BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
DO $$
DECLARE submitted public.updates;
BEGIN
  INSERT INTO public.updates(project_id, outcome_measurable_id, type, description, value, date)
  VALUES (1, 1, 'Impact', 'Two MPAs designated', 2, '2026-09-01') RETURNING * INTO submitted;
  UPDATE public.updates SET verified = true, valid = true, admin_reviewed = true WHERE id = submitted.id;
  UPDATE public.updates SET review_note = 'Evidence checked' WHERE id = submitted.id RETURNING * INTO submitted;
  ASSERT submitted.admin_reviewed AND submitted.valid, 'Review-only edits preserve approval';
  UPDATE public.updates SET description = 'Corrected description' WHERE id = submitted.id RETURNING * INTO submitted;
  ASSERT NOT submitted.admin_reviewed AND NOT submitted.valid, 'Content edits must return to pending';
END $$;
ROLLBACK;
