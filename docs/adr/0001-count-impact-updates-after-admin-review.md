# Count Impact Updates only after Admin Review

Impact totals include an Outcome or Output Indicator Update only after Admin Review confirms that it is valid and not a duplicate. This deliberately prioritises reporting accuracy over immediate inclusion: submitting an Impact Update does not by itself make the value contribute to organisation-wide totals. Any user edit to an approved Impact Update returns it to Pending Review and removes it from totals until it is approved again; changes confined to admin review fields do not.

Clarified with Suneha on 30 October 2026: Verified records whether supporting evidence is attached. Admin Review can accept a verbally confirmed result without attached evidence, so Verified is independent of reporting eligibility.

Launch baseline agreed with Suneha on 24 November 2026: historical updates already marked `verified = true` (prior to the Admin page workflow) receive a one-off `admin_reviewed = true` backfill before launch without changing `valid` or `duplicate`; updates with `verified = false` and `admin_reviewed = false` remain unreviewed for manual Admin review.
