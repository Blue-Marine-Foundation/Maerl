-- Impact indicator series RPC
--
-- Companion to public.get_impact_indicator_summaries. Where the summaries
-- function returns one aggregate per indicator over a date range, this
-- function returns one row per (indicator, year) — the time-series data
-- needed to power sparklines and trend charts on the Impact page.
--
-- Filter shape matches get_impact_indicator_summaries exactly:
--   - u.valid = TRUE
--   - u.duplicate = FALSE
--   - u.date::date BETWEEN from_date AND to_date
--
-- Indicators with zero matching updates in the window are omitted (INNER
-- JOIN). Consumers should treat missing years as gaps and either fill them
-- in client-side or render the data as a sparse line.
--
-- Applied as Supabase migration: create_get_impact_indicator_series.
-- This file is a documentation copy and is safe to re-run.
CREATE OR REPLACE FUNCTION public.get_impact_indicator_series(from_date date, to_date date)
RETURNS TABLE (
  impact_indicator_id bigint,
  indicator_code text,
  year integer,
  valid_updates bigint,
  total_value double precision
)
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    i.id AS impact_indicator_id,
    i.indicator_code,
    EXTRACT(YEAR FROM (u.date::date))::integer AS year,
    COUNT(u.value) AS valid_updates,
    COALESCE(SUM(u.value), 0) AS total_value
  FROM public.impact_indicators i
  JOIN public.updates u
    ON u.impact_indicator_id = i.id
   AND u.valid = TRUE
   AND u.duplicate = FALSE
   AND (u.date::date) BETWEEN from_date AND to_date
  GROUP BY i.id, i.indicator_code, EXTRACT(YEAR FROM (u.date::date))::integer
  ORDER BY i.id, year;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.get_impact_indicator_series(date, date)
  TO anon, authenticated, service_role;
