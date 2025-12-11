# Validating Updates

The admin page of Maerl allows Admin users (most likley Suneha / the M&E team) to manually verify the validity of updates submitted by Project Managers.

### Status fields for updates

- Verified `true / false`
- Duplicate `true / false`
- Valid `true / false`
- Reviewed `true / false`

### Defaults

By default, newly submitted updates are:

- Verified = false
- Duplicate = false
- Valid = true
- Reviewed = false

### Business logic

- A new update is considered valid so that it is visible everywhere
- Updates can be considered verified if there is evidence to support the claim, e.g. a link to a published paper, for example
- If an admin marks a lead as `verified = true`,
  - Reviewed is automatically set to `true`
  - Valid remains `false`
- If an admin marks a lead as `duplicate = true`
  - Valid is automatically set to `false`
  - Reviewed is automatically set to `true`
