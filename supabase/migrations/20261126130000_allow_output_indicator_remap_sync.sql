BEGIN;

CREATE OR REPLACE FUNCTION public.enforce_indicator_update() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  indicator_project bigint;
  indicator_impact bigint;
  progress_only boolean := false;
  content_changed boolean := false;
  mapping_or_review_only boolean := false;
  is_admin boolean;
BEGIN
  -- General Updates retain their existing rules.
  IF NEW.outcome_measurable_id IS NULL AND NEW.output_measurable_id IS NULL
      AND (TG_OP = 'INSERT' OR (OLD.outcome_measurable_id IS NULL AND OLD.output_measurable_id IS NULL)) THEN
    RETURN NEW;
  END IF;
  IF num_nonnulls(NEW.outcome_measurable_id, NEW.output_measurable_id) <> 1 THEN
    RAISE EXCEPTION 'An indicator update belongs to exactly one indicator' USING ERRCODE = '23514';
  END IF;
  SELECT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Admin', 'Super Admin')) INTO is_admin;
  IF NEW.outcome_measurable_id IS NOT NULL THEN
    SELECT o.progress_only INTO progress_only FROM public.outcome_measurables o
      WHERE o.id = NEW.outcome_measurable_id FOR NO KEY UPDATE;
    IF progress_only AND NEW.type IS DISTINCT FROM 'Progress' THEN
      RAISE EXCEPTION 'This Outcome Indicator only accepts written Progress updates' USING ERRCODE = '23514';
    END IF;
  END IF;
  IF TG_OP = 'INSERT' THEN
    IF NEW.outcome_measurable_id IS NOT NULL THEN
      SELECT project_id, impact_indicator_id INTO indicator_project, indicator_impact
        FROM public.outcome_measurables WHERE id = NEW.outcome_measurable_id FOR NO KEY UPDATE;
    ELSE
      SELECT project_id, impact_indicator_id INTO indicator_project, indicator_impact
        FROM public.output_measurables WHERE id = NEW.output_measurable_id FOR NO KEY UPDATE;
    END IF;
    IF indicator_project IS DISTINCT FROM NEW.project_id
        OR (NEW.outcome_measurable_id IS NOT NULL AND indicator_impact IS NULL AND NOT progress_only) THEN
      RAISE EXCEPTION 'Choose a mapped indicator belonging to this project' USING ERRCODE = '23514';
    END IF;
    NEW.impact_indicator_id := indicator_impact;
  ELSE
    IF ROW(NEW.outcome_measurable_id, NEW.output_measurable_id, NEW.project_id, NEW.posted_by)
      IS DISTINCT FROM ROW(OLD.outcome_measurable_id, OLD.output_measurable_id, OLD.project_id, OLD.posted_by) THEN
      RAISE EXCEPTION 'The update owner and indicator cannot be changed' USING ERRCODE = '23514';
    END IF;
    IF NOT is_admin AND (ROW(NEW.admin_reviewed, NEW.valid, NEW.verified, NEW.duplicate, NEW.review_note, NEW.impact_indicator_id)
      IS DISTINCT FROM ROW(OLD.admin_reviewed, OLD.valid, OLD.verified, OLD.duplicate, OLD.review_note, OLD.impact_indicator_id)) THEN
      RAISE EXCEPTION 'Only admins may change review fields or migrate update mappings' USING ERRCODE = '42501';
    END IF;
    content_changed := (to_jsonb(NEW) - ARRAY['admin_reviewed', 'valid', 'verified', 'duplicate', 'review_note', 'edited_at'])
      IS DISTINCT FROM (to_jsonb(OLD) - ARRAY['admin_reviewed', 'valid', 'verified', 'duplicate', 'review_note', 'edited_at']);
    mapping_or_review_only := NOT (
      (to_jsonb(NEW) - ARRAY['admin_reviewed', 'valid', 'verified', 'duplicate', 'review_note', 'edited_at', 'impact_indicator_id'])
      IS DISTINCT FROM
      (to_jsonb(OLD) - ARRAY['admin_reviewed', 'valid', 'verified', 'duplicate', 'review_note', 'edited_at', 'impact_indicator_id'])
    );
  END IF;
  -- Allow mapping syncs (e.g. remapping an output indicator) and review-only
  -- edits to touch legacy rows whose type/value predates validation, while
  -- keeping full validation on all inserts and content edits.
  IF TG_OP = 'INSERT' OR NOT mapping_or_review_only THEN
    IF NEW.type NOT IN ('Impact', 'Progress') OR NEW.type IS NULL THEN
      RAISE EXCEPTION 'Choose Impact or Progress' USING ERRCODE = '23514';
    END IF;
    IF NEW.type = 'Impact' AND (NEW.value IS NULL OR NEW.value < 0 OR NEW.value::text IN ('NaN', 'Infinity', '-Infinity')) THEN
      RAISE EXCEPTION 'Enter a finite nonnegative impact value' USING ERRCODE = '23514';
    END IF;
  END IF;
  IF TG_OP = 'INSERT' OR content_changed THEN
    NEW.admin_reviewed := false;
    NEW.valid := coalesce(NEW.type = 'Progress', false);
    NEW.verified := false;
    NEW.duplicate := false;
    NEW.review_note := NULL;
  END IF;
  IF NEW.type = 'Progress' THEN NEW.value := NULL; END IF;
  IF NEW.duplicate THEN NEW.valid := false; END IF;
  RETURN NEW;
END $$;

-- Remapping an output indicator syncs its existing updates to the new Impact Indicator.
CREATE OR REPLACE FUNCTION public.sync_updates_impact_indicator() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF NEW.impact_indicator_id IS DISTINCT FROM OLD.impact_indicator_id THEN
    UPDATE public.updates
    SET impact_indicator_id = NEW.impact_indicator_id
    WHERE output_measurable_id = NEW.id
      AND impact_indicator_id IS DISTINCT FROM NEW.impact_indicator_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_updates_impact_indicator ON public.output_measurables;
CREATE TRIGGER trg_sync_updates_impact_indicator
  AFTER UPDATE OF impact_indicator_id ON public.output_measurables
  FOR EACH ROW EXECUTE FUNCTION public.sync_updates_impact_indicator();

COMMIT;
