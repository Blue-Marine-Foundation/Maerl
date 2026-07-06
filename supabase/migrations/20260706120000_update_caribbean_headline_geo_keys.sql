-- Caribbean territories now map via ISO country polygons (c:*) instead of point pins (p:*).

update public.map_headline_stats
set geography_key = 'c:brb'
where geography_key = 'p:barbados';

update public.map_headline_stats
set geography_key = 'c:vct'
where geography_key = 'p:st-vincent-and-the-grenadines';
