-- Caribbean territories now map via ISO country polygons (c:*) instead of point pins (p:*).

with geography_renames(old_key, new_key) as (
  values
    ('p:barbados', 'c:brb'),
    ('p:st-vincent-and-the-grenadines', 'c:vct')
)
delete from public.map_headline_stats legacy
using geography_renames renames
where legacy.geography_key = renames.old_key
  and exists (
    select 1
    from public.map_headline_stats canonical
    where canonical.geography_key = renames.new_key
      and canonical.display_template = legacy.display_template
  );

with geography_renames(old_key, new_key) as (
  values
    ('p:barbados', 'c:brb'),
    ('p:st-vincent-and-the-grenadines', 'c:vct')
)
update public.map_headline_stats legacy
set geography_key = renames.new_key
from geography_renames renames
where legacy.geography_key = renames.old_key
  and not exists (
    select 1
    from public.map_headline_stats canonical
    where canonical.geography_key = renames.new_key
      and canonical.display_template = legacy.display_template
  );
