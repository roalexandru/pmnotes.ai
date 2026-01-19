# Release v1.2.0 (2026-02-01)

## Highlights
- Added churn risk dashboard widgets for PMs.
- Reduced billing pipeline retries from 5 to 2 for faster recovery.

## Features
- Analytics: Added cohort retention export to CSV.
- Growth: Introduced onboarding checklist emails.

## Fixes
- Fixed edge case where promo codes failed for annual plans.
- Resolved timezone bug in scheduled reports.

## Chores
- Upgraded dependencies for security patches.
- Refactored data pipelines to reduce latency.

## Risk Review
- Billing: Retry logic changes could affect payments.
- Auth: None detected.
- Database: Added index to subscriptions table.

## Checklist
- [ ] Tests run (unit + integration)
- [ ] DB migrations applied
- [ ] Docs updated
- [ ] Version bump in package.json / pyproject.toml

## Version Bump Targets
- package.json
- CHANGELOG.md

