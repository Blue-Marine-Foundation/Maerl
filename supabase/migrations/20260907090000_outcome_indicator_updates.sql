BEGIN;

ALTER TABLE public.updates
  ADD COLUMN outcome_measurable_id bigint REFERENCES public.outcome_measurables(id);
CREATE INDEX updates_outcome_measurable_id_idx ON public.updates(outcome_measurable_id);
ALTER TABLE public.updates ADD CONSTRAINT updates_one_indicator
  CHECK (num_nonnulls(output_measurable_id, outcome_measurable_id) <= 1);

-- Definer rights are limited to validation and locking; INSERT/UPDATE RLS still
-- checks the caller on public.updates. Partners need no indicator edit privilege.
CREATE OR REPLACE FUNCTION public.enforce_indicator_update() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  indicator_project bigint;
  indicator_impact bigint;
  content_changed boolean := false;
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
  IF TG_OP = 'INSERT' THEN
    IF NEW.outcome_measurable_id IS NOT NULL THEN
      SELECT project_id, impact_indicator_id INTO indicator_project, indicator_impact
        FROM public.outcome_measurables WHERE id = NEW.outcome_measurable_id FOR NO KEY UPDATE;
    ELSE
      SELECT project_id, impact_indicator_id INTO indicator_project, indicator_impact
        FROM public.output_measurables WHERE id = NEW.output_measurable_id FOR NO KEY UPDATE;
    END IF;
    IF indicator_project IS DISTINCT FROM NEW.project_id
        OR (NEW.outcome_measurable_id IS NOT NULL AND indicator_impact IS NULL) THEN
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
  END IF;
  IF NEW.type NOT IN ('Impact', 'Progress') OR NEW.type IS NULL THEN
    RAISE EXCEPTION 'Choose Impact or Progress' USING ERRCODE = '23514';
  END IF;
  IF NEW.type = 'Impact' AND (NEW.value IS NULL OR NEW.value < 0 OR NEW.value::text IN ('NaN', 'Infinity', '-Infinity')) THEN
    RAISE EXCEPTION 'Enter a finite nonnegative impact value' USING ERRCODE = '23514';
  END IF;
  IF TG_OP = 'INSERT' OR content_changed THEN
    NEW.admin_reviewed := false;
    NEW.valid := NEW.type = 'Progress';
    NEW.verified := false;
    NEW.duplicate := false;
    NEW.review_note := NULL;
  END IF;
  IF NEW.type = 'Progress' THEN NEW.value := NULL; END IF;
  IF NEW.duplicate THEN NEW.valid := false; END IF;
  RETURN NEW;
END $$;

-- Run after legacy BEFORE triggers so they cannot reinstate automatic approval.
CREATE TRIGGER zz_enforce_indicator_update BEFORE INSERT OR UPDATE ON public.updates
FOR EACH ROW EXECUTE FUNCTION public.enforce_indicator_update();
CREATE FUNCTION public.enforce_outcome_mapping() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF NEW.impact_indicator_id IS NULL AND
      (TG_OP = 'INSERT' OR OLD.impact_indicator_id IS NOT NULL) THEN
    RAISE EXCEPTION 'An Outcome Indicator requires an Impact Indicator' USING ERRCODE = '23514';
  END IF;
  IF TG_OP = 'UPDATE' AND NEW.impact_indicator_id IS DISTINCT FROM OLD.impact_indicator_id
      AND NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Admin', 'Super Admin')) THEN
    RAISE EXCEPTION 'Only admins may change the Impact Indicator mapping' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER zz_enforce_outcome_mapping BEFORE INSERT OR UPDATE ON public.outcome_measurables
FOR EACH ROW EXECUTE FUNCTION public.enforce_outcome_mapping();

-- Explicitly selected historical updates only; remapping the indicator never calls this.
CREATE FUNCTION public.migrate_outcome_updates(outcome_indicator_id bigint, update_ids bigint[], target_impact_indicator_id bigint)
RETURNS bigint LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE affected bigint;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Admin', 'Super Admin')) THEN
    RAISE EXCEPTION 'Only admins may migrate updates' USING ERRCODE = '42501';
  END IF;
  PERFORM 1 FROM public.outcome_measurables
    WHERE id = outcome_indicator_id AND impact_indicator_id = target_impact_indicator_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Migration target must match the current Outcome Indicator mapping';
  END IF;
  UPDATE public.updates SET impact_indicator_id = target_impact_indicator_id
    WHERE outcome_measurable_id = outcome_indicator_id AND id = ANY(update_ids)
      AND impact_indicator_id IS DISTINCT FROM target_impact_indicator_id;
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END $$;
REVOKE ALL ON FUNCTION public.migrate_outcome_updates(bigint, bigint[], bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.migrate_outcome_updates(bigint, bigint[], bigint) TO authenticated;

-- Invoker security preserves the existing update RLS scope for every caller.
CREATE OR REPLACE VIEW public.reviewed_impact_updates WITH (security_invoker = true) AS
SELECT * FROM public.updates
WHERE type = 'Impact' AND admin_reviewed IS TRUE AND valid IS TRUE
  AND verified IS TRUE AND duplicate IS FALSE AND value IS NOT NULL;
GRANT SELECT ON public.reviewed_impact_updates TO authenticated;

CREATE OR REPLACE FUNCTION public.get_reviewed_impact_indicator_summaries(from_date date, to_date date)
RETURNS TABLE (impact_indicator_id bigint, indicator_code text, indicator_title text, indicator_unit text, valid_updates bigint, total_value double precision)
LANGUAGE sql STABLE SET search_path = '' AS $$
  SELECT i.id::bigint, i.indicator_code, i.indicator_title, i.indicator_unit,
    count(u.id), coalesce(sum(u.value), 0)::double precision
  FROM public.impact_indicators i
  LEFT JOIN public.reviewed_impact_updates u ON u.impact_indicator_id = i.id
    AND u.date::date BETWEEN from_date AND to_date
  GROUP BY i.id, i.indicator_code, i.indicator_title, i.indicator_unit
  ORDER BY i.id;
$$;
CREATE OR REPLACE FUNCTION public.get_reviewed_impact_indicator_series(from_date date, to_date date)
RETURNS TABLE (impact_indicator_id bigint, indicator_code text, year integer, valid_updates bigint, total_value double precision)
LANGUAGE sql STABLE SET search_path = '' AS $$
  SELECT i.id::bigint, i.indicator_code, extract(year FROM u.date::date)::integer,
    count(u.id), sum(u.value)::double precision
  FROM public.impact_indicators i
  JOIN public.reviewed_impact_updates u ON u.impact_indicator_id = i.id
  WHERE u.date::date BETWEEN from_date AND to_date
  GROUP BY i.id, i.indicator_code, extract(year FROM u.date::date)::integer
  ORDER BY 1, 3;
$$;
REVOKE ALL ON FUNCTION public.get_reviewed_impact_indicator_summaries(date, date), public.get_reviewed_impact_indicator_series(date, date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_reviewed_impact_indicator_summaries(date, date), public.get_reviewed_impact_indicator_series(date, date) TO authenticated;

COMMIT;
