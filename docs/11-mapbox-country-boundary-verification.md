# Mapbox Countries v1 verification

Verified read-only on 31 July 2026 with the repository's configured Mapbox
token and the same production filter used by the overview map:

- `disputed = 'false'`
- `worldview = 'all'` or a worldview containing `US`

| Sample                       | Expected ISO-3 | Observed worldview        | Result |
| ---------------------------- | -------------- | ------------------------- | ------ |
| Greece                       | `GRC`          | `AR,CN,IN,JP,MA,RS,RU,US` | Pass   |
| Somaliland sample point      | `SOM`          | `all`                     | Pass   |
| Bermuda                      | `BMU`          | `all`                     | Pass   |
| Montserrat                   | `MSR`          | `all`                     | Pass   |
| Pitcairn Islands             | `PCN`          | `all`                     | Pass   |
| Fiji                         | `FJI`          | `all`                     | Pass   |
| New Zealand                  | `NZL`          | `all`                     | Pass   |
| Kosovo                       | `XKS`          | `AR,IN,JP,MA,RU,TR,US`    | Pass   |
| Akrotiri Sovereign Base Area | `XSB`          | `all`                     | Pass   |

The exact `XKS` and `XSB` results are why those two Mapbox-supported,
non-official additions are included alongside the 249 official ISO entries.

Rerun the live verification without changing external data:

```sh
pnpm verify:mapbox-countries
```
