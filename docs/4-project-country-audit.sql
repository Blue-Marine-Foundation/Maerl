-- Project country audit (read-only)
--
-- Purpose:
--   Supports manual cleanup of public.projects.project_country values that do
--   not appear on the Impact map.
--
-- The Projects map (components/projects-map/...) joins each project
-- to a country centroid via a TypeScript lookup
-- (components/projects-map/project-coords.ts). Projects whose project_country
-- is NULL, empty, contains stray whitespace, lists multiple countries, or
-- does not match a supported_countries name will silently be dropped from
-- the map.
--
-- This script is read-only. It performs no UPDATEs and no schema changes.
-- Run each section independently in the Supabase SQL editor or via psql.
--
-- Active status convention: anything matching 'Active%' (covers 'Active' and
-- the legacy 'Active ' trailing-space variant).
-- =========================================================================
-- Section 1: Coverage summary
-- One row showing the overall shape of project_country data.
-- =========================================================================
SELECT
  count(*)                                                             AS total_projects,
  count(*) FILTER (WHERE project_status ILIKE 'Active%')                AS active_projects,
  count(*) FILTER (WHERE project_status ILIKE 'Active%'
                     AND project_country IS NULL)                       AS active_with_null_country,
  count(*) FILTER (WHERE project_status ILIKE 'Active%'
                     AND btrim(coalesce(project_country, '')) = '')     AS active_with_empty_country,
  count(*) FILTER (WHERE project_status ILIKE 'Active%'
                     AND project_country IS NOT NULL
                     AND btrim(project_country) <> '')                  AS active_with_country,
  count(DISTINCT project_country)
    FILTER (WHERE project_country IS NOT NULL
              AND btrim(project_country) <> '')                         AS distinct_countries_raw,
  count(DISTINCT lower(btrim(project_country)))
    FILTER (WHERE project_country IS NOT NULL
              AND btrim(project_country) <> '')                         AS distinct_countries_normalised
FROM public.projects;

-- =========================================================================
-- Section 2: Distinct values with flags
-- Every distinct project_country value (including NULL and ''), with a set
-- of boolean flags pointing at the cleanup needed. The not_in_lookup column
-- is true when the value (case- and whitespace-insensitive) does not match a
-- name in supported_countries.
--
-- Keep supported_countries in sync with the keys of COUNTRY_CENTROIDS in
-- components/projects-map/project-coords.ts.
-- =========================================================================
WITH supported_countries(name) AS (
  VALUES
    -- Africa
    ('Algeria'), ('Angola'), ('Benin'), ('Cameroon'), ('Comoros'),
    ('Congo'), ('Côte d''Ivoire'), ('Ivory Coast'), ('Djibouti'),
    ('Egypt'), ('Eritrea'), ('Ethiopia'), ('Gabon'), ('Gambia'),
    ('Ghana'), ('Guinea'), ('Guinea-Bissau'), ('Kenya'), ('Liberia'),
    ('Libya'), ('Madagascar'), ('Mauritania'), ('Mauritius'),
    ('Morocco'), ('Mozambique'), ('Namibia'), ('Nigeria'), ('Senegal'),
    ('Seychelles'), ('Sierra Leone'), ('Somalia'), ('South Africa'),
    ('Sudan'), ('Tanzania'), ('Togo'), ('Tunisia'), ('Uganda'),
    ('Western Sahara'),
    -- Asia & Middle East
    ('Bahrain'), ('Bangladesh'), ('Cambodia'), ('China'), ('India'),
    ('Indonesia'), ('Iran'), ('Iraq'), ('Japan'), ('Jordan'),
    ('Kuwait'), ('Lebanon'), ('Malaysia'), ('Maldives'), ('Myanmar'),
    ('Oman'), ('Pakistan'), ('Philippines'), ('Qatar'),
    ('Saudi Arabia'), ('Sri Lanka'), ('Thailand'), ('Timor-Leste'),
    ('United Arab Emirates'), ('Vietnam'), ('Yemen'),
    -- Europe
    ('Albania'), ('Croatia'), ('France'), ('Greece'), ('Italy'),
    ('Malta'), ('Montenegro'), ('Norway'), ('Portugal'), ('Spain'),
    ('Turkey'), ('United Kingdom'), ('UK'),
    -- Americas
    ('Bahamas'), ('Belize'), ('Brazil'), ('Canada'), ('Chile'),
    ('Colombia'), ('Costa Rica'), ('Cuba'), ('Ecuador'), ('Guatemala'),
    ('Haiti'), ('Honduras'), ('Jamaica'), ('Mexico'), ('Nicaragua'),
    ('Panama'), ('Peru'), ('Trinidad and Tobago'), ('United States'),
    ('USA'),
    -- Pacific & Oceania
    ('Australia'), ('Fiji'), ('Kiribati'), ('Marshall Islands'),
    ('Micronesia'), ('New Zealand'), ('Palau'), ('Papua New Guinea'),
    ('Samoa'), ('Solomon Islands'), ('Tonga'), ('Tuvalu'), ('Vanuatu')
),
supported_normalised AS (
  SELECT lower(btrim(name)) AS norm FROM supported_countries
)
SELECT
  p.project_country                                            AS country_raw,
  count(*)                                                     AS n_projects,
  count(*) FILTER (WHERE p.project_status ILIKE 'Active%')      AS n_active,
  (p.project_country IS NULL)                                  AS is_null,
  (p.project_country IS NOT NULL AND p.project_country = '')   AS is_empty,
  (p.project_country LIKE ' %')                                AS has_leading_space,
  (p.project_country LIKE '% ')                                AS has_trailing_space,
  (p.project_country LIKE '%,%')                               AS is_multi_country,
  (
    p.project_country IS NOT NULL
    AND btrim(p.project_country) <> ''
    AND lower(btrim(p.project_country)) NOT IN (
      SELECT norm FROM supported_normalised
    )
  )                                                            AS not_in_lookup
FROM public.projects p
GROUP BY p.project_country
ORDER BY n_active DESC NULLS LAST, n_projects DESC, country_raw NULLS FIRST;

-- =========================================================================
-- Section 3: Likely duplicates
-- Groups by lower(btrim(...)) and emits any normalised key that has more
-- than one distinct raw spelling, e.g. 'Greece' vs ' Greece'. The variants
-- column lists every raw spelling found.
-- =========================================================================
SELECT
  lower(btrim(project_country))                                 AS country_normalised,
  array_agg(DISTINCT project_country ORDER BY project_country)  AS raw_variants,
  count(*)                                                      AS n_projects,
  count(*) FILTER (WHERE project_status ILIKE 'Active%')         AS n_active
FROM public.projects
WHERE project_country IS NOT NULL
  AND btrim(project_country) <> ''
GROUP BY lower(btrim(project_country))
HAVING count(DISTINCT project_country) > 1
ORDER BY n_projects DESC, country_normalised;
