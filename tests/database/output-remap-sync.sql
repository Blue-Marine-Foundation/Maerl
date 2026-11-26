BEGIN;
-- Insert legacy pre-validation rows while triggers are bypassed (as postgres)
ALTER TABLE public.updates DISABLE TRIGGER zz_enforce_indicator_update;
INSERT INTO public.updates(id, project_id, output_measurable_id, impact_indicator_id, posted_by, type, description, value, date, valid, verified, duplicate, admin_reviewed)
VALUES
  (901, 1, 1, 1, '00000000-0000-0000-0000-000000000001', 'Impact', 'Legacy null-value impact update', NULL, '2024-06-01', true, false, false, false),
  (902, 1, 1, 1, '00000000-0000-0000-0000-000000000001', 'Project', 'Legacy non-standard type update', NULL, '2024-06-02', true, false, false, false),
  (903, 1, 1, 1, '00000000-0000-0000-0000-000000000001', 'Impact', 'Approved numeric impact update', 42, '2025-01-15', true, true, false, true),
  (904, 1, 1, 1, '00000000-0000-0000-0000-000000000001', 'Progress', 'Written progress update', NULL, '2025-02-15', true, false, false, false),
  (905, 1, 1, 2, '00000000-0000-0000-0000-000000000001', 'Impact', 'Already on target indicator', 10, '2025-03-15', true, true, false, true);
ALTER TABLE public.updates ENABLE TRIGGER zz_enforce_indicator_update;

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
DO $$
DECLARE
  u901 public.updates;
  u902 public.updates;
  u903 public.updates;
  u904 public.updates;
  u905 public.updates;
BEGIN
  -- Remapping an output indicator syncs all past updates, including legacy invalid rows
  UPDATE public.output_measurables SET impact_indicator_id = 2 WHERE id = 1;

  SELECT * INTO u901 FROM public.updates WHERE id = 901;
  SELECT * INTO u902 FROM public.updates WHERE id = 902;
  SELECT * INTO u903 FROM public.updates WHERE id = 903;
  SELECT * INTO u904 FROM public.updates WHERE id = 904;
  SELECT * INTO u905 FROM public.updates WHERE id = 905;

  ASSERT u901.impact_indicator_id = 2 AND NOT u901.admin_reviewed AND NOT u901.valid,
    'Legacy null-value impact update must remap without crashing and return to pending';
  ASSERT u902.impact_indicator_id = 2 AND NOT u902.admin_reviewed AND NOT u902.valid,
    'Legacy non-standard type update must remap without crashing and set valid=false';
  ASSERT u903.impact_indicator_id = 2 AND NOT u903.admin_reviewed AND NOT u903.valid AND NOT u903.verified,
    'Remapped approved impact update must move to new indicator and return to pending review';
  ASSERT u904.impact_indicator_id = 2 AND u904.valid AND u904.value IS NULL,
    'Remapped progress update must move to new indicator and remain valid';
  ASSERT u905.impact_indicator_id = 2 AND u905.admin_reviewed AND u905.valid AND u905.verified,
    'Update already on target indicator must not lose its review state';

  -- Review-only edits on a legacy null-value update must succeed (e.g. admin rejecting it)
  UPDATE public.updates SET admin_reviewed = true, valid = false, review_note = 'Missing figure' WHERE id = 901;
  SELECT * INTO u901 FROM public.updates WHERE id = 901;
  ASSERT u901.admin_reviewed AND NOT u901.valid AND u901.review_note = 'Missing figure',
    'Review-only edit on legacy null-value update must succeed';

  -- Editing content on a legacy null-value impact update must still enforce numeric value validation
  BEGIN
    UPDATE public.updates SET description = 'Edited without fixing null value' WHERE id = 901;
    RAISE EXCEPTION 'Expected content edit with null Impact value to be rejected';
  EXCEPTION WHEN check_violation THEN NULL; END;

  -- Inserting a new null-value impact update must still be rejected
  BEGIN
    INSERT INTO public.updates(project_id, output_measurable_id, type, description, value)
    VALUES (1, 1, 'Impact', 'New null impact', NULL);
    RAISE EXCEPTION 'Expected new null-value Impact insert to be rejected';
  EXCEPTION WHEN check_violation THEN NULL; END;
END $$;
ROLLBACK;
