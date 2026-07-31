-- Project map-field guards
--
-- EXECUTION STATUS:
--   - Sections 1 and 2 were applied to the live Maerl database on 2026-07-31
--     as migration add_project_country_normalization_and_type_constraint;
--   - project_status and project_type trimming was added to the normalization
--     trigger on 2026-07-31 as migration normalize_project_status_and_type;
--   - the enabled trigger and validated CHECK were behavior-tested inside a
--     rolled-back transaction;
--   - Section 3 remains disabled pending owner sign-off.
--
-- Sections 1 and 2 are final and independently runnable. Section 3 contains
-- two disabled status candidates; exactly one may be enabled after sign-off.

-- ============================================================================
-- Section 1: normalize project map fields on every direct insert/update
-- ============================================================================
BEGIN;

CREATE OR REPLACE FUNCTION public.normalize_project_map_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.project_country := nullif(btrim(NEW.project_country), '');
  NEW.project_status := nullif(btrim(NEW.project_status), '');
  NEW.project_type := nullif(btrim(NEW.project_type), '');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS projects_normalize_project_country
ON public.projects;

DROP TRIGGER IF EXISTS projects_normalize_project_map_fields
ON public.projects;

CREATE TRIGGER projects_normalize_project_map_fields
BEFORE INSERT OR UPDATE OF project_country, project_status, project_type
ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.normalize_project_map_fields();

DROP FUNCTION IF EXISTS public.normalize_project_country();

COMMIT;

-- ============================================================================
-- Section 2: constrain project_type to the audited closed set
-- ============================================================================
BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.projects
    WHERE project_type IS NOT NULL
      AND project_type NOT IN ('Project', 'Unit led project', 'Unit')
  ) THEN
    RAISE EXCEPTION
      'Cannot add project_type constraint: unsupported values remain';
  END IF;
END
$$;

ALTER TABLE public.projects
  DROP CONSTRAINT IF EXISTS projects_project_type_valid;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_project_type_valid
  CHECK (
    project_type IS NULL
    OR project_type IN ('Project', 'Unit led project', 'Unit')
  );

COMMIT;

-- ============================================================================
-- Section 3: project_status — SIGN-OFF REQUIRED, nothing executable below
-- ============================================================================

-- Candidate A: owner converts Transitioned to Complete in docs/9, then enables:
--
-- BEGIN;
-- DO $$
-- BEGIN
--   IF EXISTS (
--     SELECT 1
--     FROM public.projects
--     WHERE project_status IS NOT NULL
--       AND project_status NOT IN ('Pipeline', 'Active', 'Complete')
--   ) THEN
--     RAISE EXCEPTION
--       'Cannot add three-value status constraint: unsupported values remain';
--   END IF;
-- END
-- $$;
-- ALTER TABLE public.projects
--   DROP CONSTRAINT IF EXISTS projects_project_status_valid;
-- ALTER TABLE public.projects
--   ADD CONSTRAINT projects_project_status_valid
--   CHECK (
--     project_status IS NULL
--     OR project_status IN ('Pipeline', 'Active', 'Complete')
--   );
-- COMMIT;

-- Candidate B: owner retains Transitioned as a fourth status, then enables:
--
-- BEGIN;
-- DO $$
-- BEGIN
--   IF EXISTS (
--     SELECT 1
--     FROM public.projects
--     WHERE project_status IS NOT NULL
--       AND project_status NOT IN (
--         'Pipeline',
--         'Active',
--         'Complete',
--         'Transitioned'
--       )
--   ) THEN
--     RAISE EXCEPTION
--       'Cannot add four-value status constraint: unsupported values remain';
--   END IF;
-- END
-- $$;
-- ALTER TABLE public.projects
--   DROP CONSTRAINT IF EXISTS projects_project_status_valid;
-- ALTER TABLE public.projects
--   ADD CONSTRAINT projects_project_status_valid
--   CHECK (
--     project_status IS NULL
--     OR project_status IN (
--       'Pipeline',
--       'Active',
--       'Complete',
--       'Transitioned'
--     )
--   );
-- COMMIT;

-- Acceptance after the chosen status constraint is applied:
--
-- INSERT/UPDATE with project_status = 'Active ' must store 'Active'.
-- INSERT/UPDATE with a genuinely unsupported status must fail.
-- INSERT/UPDATE with project_country = ' Greece ' must store 'Greece'.
-- INSERT/UPDATE with project_type = ' Unit ' must store 'Unit'.
-- INSERT/UPDATE with an unsupported project_type must fail.
