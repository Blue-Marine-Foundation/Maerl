-- Remote migration version 20260807132026; owner decision recorded 2026-08-07:
-- convert the two remaining Transitioned projects to Complete and constrain
-- project_status to Pipeline, Active, Complete, or NULL.

BEGIN;

LOCK TABLE public.projects IN SHARE ROW EXCLUSIVE MODE;

DO $$
DECLARE
  transitioned_count bigint;
  updated_count bigint;
BEGIN
  SELECT count(*)
  INTO transitioned_count
  FROM public.projects
  WHERE project_status = 'Transitioned';

  IF transitioned_count <> 2 THEN
    RAISE EXCEPTION
      'Expected exactly two Transitioned projects, found %',
      transitioned_count;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.projects
    WHERE project_status IS NOT NULL
      AND project_status NOT IN (
        'Pipeline',
        'Active',
        'Complete',
        'Transitioned'
      )
  ) THEN
    RAISE EXCEPTION
      'Cannot finalize project status: unsupported values remain';
  END IF;

  UPDATE public.projects
  SET project_status = 'Complete'
  WHERE project_status = 'Transitioned';

  GET DIAGNOSTICS updated_count = ROW_COUNT;

  IF updated_count <> 2 THEN
    RAISE EXCEPTION
      'Expected to convert exactly two Transitioned projects, converted %',
      updated_count;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.projects
    WHERE project_status IS NOT NULL
      AND project_status NOT IN ('Pipeline', 'Active', 'Complete')
  ) THEN
    RAISE EXCEPTION
      'Cannot add project status constraint: unsupported values remain';
  END IF;
END
$$;

ALTER TABLE public.projects
  DROP CONSTRAINT IF EXISTS projects_project_status_valid;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_project_status_valid
  CHECK (
    project_status IS NULL
    OR project_status IN ('Pipeline', 'Active', 'Complete')
  );

COMMIT;
