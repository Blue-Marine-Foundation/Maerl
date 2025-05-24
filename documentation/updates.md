# Updates in Maerl Database

This document describes how updates are tracked and managed in the Maerl database through various metadata fields.

## Metadata Fields

### Source Types
The `source` field indicates the origin of an update:

- **Historic** (2010-2023): Updates gathered from evidence prior to spreadsheet-based logframes
- **Logframe** (2019-2023): Updates imported from legacy spreadsheet-based logframes
- **Maerl** (2024-present): Updates submitted directly to the Maerl database

### Status Fields
- **verified** (`true`/`false`): Indicates whether the update is supported by evidence
- **duplicate** (`true`/`false`): Flags duplicate entries (default: `false`)
- **valid** (`true`/`false`): An update is valid when `verified = true` AND `duplicate = false`
- **admin_reviewed** (`true`/`false`): Indicates whether an admin has reviewed the update
- **review_note** (`string`): Notes from admin on review

## Default Behavior for New Updates

When a new update is added to Maerl:
- `duplicate` is set to `false`
- `verified` is set to `true`

Reference: [Issue #180](https://github.com/orgs/Blue-Marine-Foundation/projects/4/views/8?pane=issue&itemId=108883280&issue=Blue-Marine-Foundation%7CMaerl%7C180)

## Changes in May 2025

### Identification of possible duplicates 
361 updates were flagged as 

```sql 
    duplicate = true 
    AND value IS NOT NULL 
    AND valid = true 
    AND original = true 
    AND verified = true;
```

And should be double checked. They have been marked as `duplicate = false` and can be identified as `review_note` starting with "Possible duplicate". They were updated with the query:

```sql
UPDATE updates
SET 
    duplicate = false,
    review_note = CASE 
        WHEN review_note IS NULL THEN 'Possible duplicate'
        ELSE 'Possible duplicate - ' || review_note
    END
WHERE 
    duplicate = true 
    AND value IS NOT NULL 
    AND valid = true 
    AND original = true 
    AND verified = true;
```

### Field Changes
1. **Deprecation of `original` field**
   - Previous entries with `original = false` are now marked as `duplicate = true`

1. **Depreciation of `verification` field**
   - Only lead `517` and `2806` had valid data for this field; both were moved to `link`

1. **`notes` field renamed `review_note`**

2. **Changes to `verified` field**
   - Previously: Updates from 'Historic' or 'Logframe' sources required manual verification
   - Now: All new updates are verified by default

3. **Changes to `valid` field**
   - Old definition: `valid = true` if `original = true` AND `verified = true`
   - New definition: `valid = true` if `verified = true` AND `duplicate = false`

## Appendix: Update Statistics (as of May 2025)

### Historic Updates
| year | count |
| ---- | ----- |
| 2010 | 4     |
| 2012 | 9     |
| 2013 | 4     |
| 2014 | 9     |
| 2015 | 18    |
| 2016 | 31    |
| 2017 | 22    |
| 2018 | 44    |
| 2019 | 91    |
| 2020 | 109   |
| 2021 | 188   |
| 2022 | 312   |
| 2023 | 52    |
| 2025 | 1     |

### Logframe Updates
| year | count |
| ---- | ----- |
| 2019 | 1     |
| 2020 | 16    |
| 2021 | 106   |
| 2022 | 307   |
| 2023 | 583   |

### Maerl Updates
| year | count |
| ---- | ----- |
| 2024 | 129   |
| 2025 | 125   |