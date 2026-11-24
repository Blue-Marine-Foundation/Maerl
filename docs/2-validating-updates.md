# Validating Updates

The Admin page allows Admin and Super Admin users to review submitted updates.

### Status fields for updates

- Verified `true / false`
- Duplicate `true / false`
- Valid `true / false`
- Reviewed `true / false`

### Defaults

New Outcome and Output Indicator Impact updates start with:

- Verified = false
- Duplicate = false
- Valid = false
- Reviewed = false

Progress updates are valid immediately and do not contribute a numeric value.
General Updates retain their existing rules.

### Completing a review

1. Check the evidence and set Verified, Valid and Duplicate as appropriate.
2. Set Reviewed to Yes when the assessment is complete. A rejected or duplicate
   update can also be marked Reviewed once its assessment is finished.

Changing an individual check does not automatically mark the update Reviewed.
This keeps an unfinished assessment in the default unreviewed list. To find a
completed assessment, change the Admin Reviewed filter to Either or Yes.

Marking an update Duplicate automatically sets Valid to No. An Impact update
contributes to totals when Reviewed and Valid are Yes and Duplicate is No.
Verified records whether supporting evidence is attached. An admin can accept a
verbally confirmed result with Verified set to No; it still counts once reviewed. Editing its content resets approval and removes it from totals until it is
reviewed again; changing only review fields does not reset approval.
