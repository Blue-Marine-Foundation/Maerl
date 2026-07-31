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

CREATE TRIGGER projects_normalize_project_map_fields
BEFORE INSERT OR UPDATE OF project_country, project_status, project_type
ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.normalize_project_map_fields();

DROP FUNCTION IF EXISTS public.normalize_project_country();
