CREATE OR REPLACE FUNCTION public.normalize_project_country()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.project_country := nullif(btrim(NEW.project_country), '');
  RETURN NEW;
END;
$$;

CREATE TRIGGER projects_normalize_project_country
BEFORE INSERT OR UPDATE OF project_country
ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.normalize_project_country();

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
  ADD CONSTRAINT projects_project_type_valid
  CHECK (
    project_type IS NULL
    OR project_type IN ('Project', 'Unit led project', 'Unit')
  );
