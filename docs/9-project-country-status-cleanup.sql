-- Project map-field cleanup
--
-- EXECUTION STATUS:
--   - the sign-off-independent transaction was run against the live Maerl
--     database on 2026-07-31 and changed six project_country rows;
--   - post-cleanup verification found zero remaining safe cleanup candidates;
--   - on 2026-08-07, exactly two Transitioned rows were confirmed and converted
--     to Complete by migration finalize_project_status_constraint;
--   - the UK country candidates at the end of this file remain disabled.
--
-- This safe section is idempotent and can be rerun if verification is needed.
--
-- Safe section:
--   - trims outer whitespace from country, status, and project type;
--   - converts blank strings to NULL;
--   - folds spelling/abbreviation aliases whose meaning is unambiguous.
--
-- Deliberately excluded pending owner sign-off:
--   - England / Scotland / England, Scotland -> United Kingdom;
--   - United Kingdom, EU -> United Kingdom.
--
-- Run docs/4-project-country-audit.sql before and after this script.

BEGIN;

UPDATE public.projects
SET
  project_country = CASE
    WHEN btrim(coalesce(project_country, '')) = '' THEN NULL
    WHEN lower(btrim(project_country)) = 'ascension island' THEN 'Ascension'
    WHEN lower(btrim(project_country)) = 'bvi' THEN 'British Virgin Islands'
    WHEN lower(btrim(project_country)) = 'french polynseia'
      THEN 'French Polynesia'
    WHEN lower(btrim(project_country)) = 'saint helena' THEN 'St Helena'
    WHEN lower(btrim(project_country)) = 'st helena island' THEN 'St Helena'
    WHEN lower(btrim(project_country)) = 'sao tome'
      THEN 'São Tomé and Príncipe'
    WHEN lower(btrim(project_country)) IN (
      'st kitts and nevis',
      'st kitts & nevis'
    ) THEN 'Saint Kitts and Nevis'
    WHEN lower(btrim(project_country)) = 'st vincent and the grenadines'
      THEN 'Saint Vincent and the Grenadines'
    ELSE btrim(project_country)
  END,
  project_status = nullif(btrim(project_status), ''),
  project_type = nullif(btrim(project_type), '')
WHERE
  project_country IS DISTINCT FROM CASE
    WHEN btrim(coalesce(project_country, '')) = '' THEN NULL
    WHEN lower(btrim(project_country)) = 'ascension island' THEN 'Ascension'
    WHEN lower(btrim(project_country)) = 'bvi' THEN 'British Virgin Islands'
    WHEN lower(btrim(project_country)) = 'french polynseia'
      THEN 'French Polynesia'
    WHEN lower(btrim(project_country)) = 'saint helena' THEN 'St Helena'
    WHEN lower(btrim(project_country)) = 'st helena island' THEN 'St Helena'
    WHEN lower(btrim(project_country)) = 'sao tome'
      THEN 'São Tomé and Príncipe'
    WHEN lower(btrim(project_country)) IN (
      'st kitts and nevis',
      'st kitts & nevis'
    ) THEN 'Saint Kitts and Nevis'
    WHEN lower(btrim(project_country)) = 'st vincent and the grenadines'
      THEN 'Saint Vincent and the Grenadines'
    ELSE btrim(project_country)
  END
  OR project_status IS DISTINCT FROM nullif(btrim(project_status), '')
  OR project_type IS DISTINCT FROM nullif(btrim(project_type), '');

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.projects
    WHERE project_country IS DISTINCT FROM btrim(project_country)
      OR project_status IS DISTINCT FROM btrim(project_status)
      OR project_type IS DISTINCT FROM btrim(project_type)
  ) THEN
    RAISE EXCEPTION 'Map-field cleanup left outer whitespace behind';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.projects
    WHERE lower(coalesce(project_country, '')) IN (
      'ascension island',
      'bvi',
      'french polynseia',
      'saint helena',
      'st helena island',
      'sao tome',
      'st kitts and nevis',
      'st kitts & nevis',
      'st vincent and the grenadines'
    )
  ) THEN
    RAISE EXCEPTION 'Map-field cleanup left an unambiguous alias behind';
  END IF;
END
$$;

COMMIT;

-- Post-cleanup review. Sign-off-gated values may still appear by design.
SELECT
  project_country,
  count(*) AS project_count
FROM public.projects
GROUP BY project_country
ORDER BY project_count DESC, project_country NULLS FIRST;

SELECT
  project_status,
  count(*) AS project_count
FROM public.projects
GROUP BY project_status
ORDER BY project_count DESC, project_status NULLS FIRST;

SELECT
  project_type,
  count(*) AS project_count
FROM public.projects
GROUP BY project_type
ORDER BY project_count DESC, project_type NULLS FIRST;

-- ============================================================================
-- STATUS DECISION — applied 2026-08-07
-- ============================================================================

-- The two Transitioned rows were converted to Complete and the three-value
-- status CHECK was added by:
--
--   supabase/migrations/
--     20260807132026_finalize_project_status_constraint.sql

-- ============================================================================
-- COUNTRY SIGN-OFF-GATED CANDIDATES — deliberately disabled
-- ============================================================================

-- If the owner chooses to fold UK sub-national/compound values:
--
-- UPDATE public.projects
-- SET project_country = 'United Kingdom'
-- WHERE project_country IN (
--   'England',
--   'Scotland',
--   'England, Scotland',
--   'United Kingdom, EU'
-- );
