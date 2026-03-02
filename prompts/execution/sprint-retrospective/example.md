# Sprint Retrospective: Sprint 14 — Billing Overhaul

## Goal Assessment

**Partially met.** The Stripe v3 migration shipped on time and passed all integration tests. However, self-serve invoice downloads slipped to Sprint 15 due to mid-sprint scope additions to the migration work that consumed the remaining capacity.

## What Went Well

1. **Cross-functional collaboration** — Design and engineering synced daily during the migration, catching UI inconsistencies early before they reached QA.
2. **Stripe migration execution** — Complex payment flow migration completed without production incidents. The team's decision to run shadow traffic for 48 hours before cutover paid off.
3. **Team communication** — Blockers were surfaced quickly in standups, and the decision to cut invoice downloads was made early enough to avoid crunch.

## What Didn't Go Well

1. **Mid-sprint scope changes** — Two unplanned Stripe webhook edge cases were added after sprint planning, consuming ~8 points of unbudgeted work. *Root cause:* Incomplete technical discovery before sprint commitment.
2. **Late QA involvement** — QA started testing on day 7 of a 10-day sprint. Three bugs were found that required rework. *Root cause:* No QA review of acceptance criteria during planning.
3. **Escaped bugs** — 3 bugs reached production on release day, all related to currency formatting in edge-case locales. *Root cause:* Test data only covered USD and EUR.

## Action Items

- [ ] **PM**: Add a "technical unknowns" section to sprint planning — timebox 30 min for engineers to flag potential scope risks before committing points.
- [ ] **QA Lead**: Join sprint planning to review acceptance criteria and define test data requirements upfront.
- [ ] **Tech Lead**: Expand locale test fixtures to cover all supported currencies before next billing-related work.

## Metrics Snapshot

| Metric | Value | Notes |
|--------|-------|-------|
| Velocity | 34 / 40 pts | 85% — 6 pts lost to unplanned scope |
| Bugs escaped | 3 | All currency formatting; no data loss |
| Sprint goal | Partial | Migration shipped, invoice download deferred |
| Unplanned work | ~8 pts | Stripe webhook edge cases |

## Structured Summary

```json
{
  "sprint": "Sprint 14",
  "goal_status": "partial",
  "velocity": { "planned": 40, "achieved": 34, "percent": 85 },
  "bugs_escaped": 3,
  "unplanned_work_points": 8,
  "action_items": [
    { "description": "Add technical unknowns section to sprint planning", "owner_role": "PM", "category": "process" },
    { "description": "Join sprint planning for acceptance criteria review", "owner_role": "QA Lead", "category": "process" },
    { "description": "Expand locale test fixtures for all currencies", "owner_role": "Tech Lead", "category": "testing" }
  ]
}
```
