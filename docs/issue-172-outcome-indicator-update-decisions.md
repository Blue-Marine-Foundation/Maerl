# Issue #172: Outcome Indicator Update decisions

The following product decisions define the agreed scope for adding Updates to Outcome Indicators.

- Outcome Indicators accept both numeric Impact Updates and text-based Progress Updates.
- An Update belongs to either an Outcome Indicator or an Output Indicator, never both.
- Indicator Updates are created through the project logframe. The future of General Updates remains a separate, deferred decision.
- Every new Outcome Indicator must link to an organisational Impact Indicator when created. The link cannot be removed later and can only be changed by an admin.
- Existing Updates retain the Impact Indicator against which they were submitted if their Outcome Indicator is remapped. Moving existing Updates requires an explicit admin migration, and migrated Impact Updates return to Pending Review.
- Outcome Indicator Updates use the same creation and editing permissions, evidence requirements, and verification requirements as Output Indicator Updates.
- Progress Updates appear immediately.
- Impact Updates appear as Pending Review and do not contribute to totals until approved by an admin as valid and not duplicate.
- Any user edit to an approved Impact Update returns it to Pending Review and temporarily removes it from totals. Edits confined to admin review fields do not reset the review.
- Outcome Indicator Updates appear wherever other Updates are shown, with a visual distinction identifying them as outcome-level Updates.
- Existing unmapped Outcome Indicators should all be mapped, prioritising active projects before launch. Placeholder indicators marked `abc` or `REMOVE` should be deleted; indicators marked `Outcome indicator TBC` should be corrected before mapping.

- Verified records attached supporting evidence independently of approval. Reviewed, valid, nonduplicate Impact Updates count even when Verified is No (Suneha clarification, 30 October 2026).
