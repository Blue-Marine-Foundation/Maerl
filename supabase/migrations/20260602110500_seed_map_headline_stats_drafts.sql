-- Seed disabled editorial drafts for non-ready map headline rows.
-- These come from "Maerl landing page(Headline stats_Country).csv" and are
-- intentionally disabled so editorial can complete them in Supabase UI.

insert into public.map_headline_stats (
  geography_key,
  display_template,
  indicator_codes,
  value_override,
  enabled,
  sort_order,
  notes
)
values
  ('w:eu-draft', 'x policies influenced', array['4.1.2'], null, false, 1000, 'Draft scope from CSV: EU'),
  ('w:eu-draft', 'x stakeholders actively participating in management', array['5.6.1'], null, false, 1010, 'Draft scope from CSV: EU'),

  ('w:global-draft', 'x MPA professionals supported with conservation tech', array['5.2.1'], null, false, 1020, 'Draft scope from CSV: Global; logframe note: Tech in MPAs'),
  ('w:global-draft', 'x reports published on seascape carbon', array['1.1.1'], null, false, 1030, 'Draft scope from CSV: Global; logframe note: Convex Seascape Survey'),

  ('w:north-sea', 'Will add once logframe completed (ELSP dogger bank)', array[]::text[], 0, false, 1040, 'Placeholder from CSV'),
  ('c:bhr', 'Will add once logframe completed', array[]::text[], 0, false, 1050, 'Placeholder from CSV'),
  ('c:stp', 'Will add once logframe completed', array[]::text[], 0, false, 1060, 'Placeholder from CSV'),
  ('w:indian-ocean', 'Will add once logframe completed (FADs)', array[]::text[], 0, false, 1070, 'Placeholder from CSV'),
  ('c:pan', 'Will add once logframe completed (Panama/Costa Rica)', array['1.2.2'], null, false, 1080, 'Placeholder wording retained from CSV; indicator code present'),
  ('p:french-polynesia', 'Will add once logframe completed (French Pol)', array[]::text[], 0, false, 1090, 'Placeholder from CSV'),

  ('c:mdv', 'x people trained as citizen scientists', array[]::text[], 0, false, 1100, 'Incomplete CSV row: no indicator codes provided'),
  ('c:mdv', 'x sq km protected', array[]::text[], 0, false, 1110, 'Incomplete CSV row: no indicator codes provided')
on conflict (geography_key, display_template) do update
set
  indicator_codes = excluded.indicator_codes,
  value_override = excluded.value_override,
  enabled = excluded.enabled,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  updated_at = now();
