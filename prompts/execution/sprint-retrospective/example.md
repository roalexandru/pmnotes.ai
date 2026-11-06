# Sprint Retrospective: Sprint 14 — Billing Overhaul

## Goal Assessment

**Partially met.** Self-serve invoice downloads slipped. The team flagged "too many scope changes mid-sprint", which is the likely cause (est.), but the feedback doesn't confirm it. [DATA NEEDED: final status of the Stripe v3 migration and the confirmed reason invoice downloads slipped]

## What Went Well

1. **Collaboration with design** — The team called out "good collab with design" as a highlight.

The feedback contains only this one positive. [DATA NEEDED: other wins worth keeping, e.g., how the migration itself went]. Ask for these in the retro meeting rather than assuming them.

## What Didn't Go Well

1. **Mid-sprint scope changes** — "Too many scope changes mid-sprint." *Likely root cause (est.):* scope wasn't stable when points were committed. [DATA NEEDED: which items were added and their size in points]
2. **Late QA involvement** — The team wished for "earlier QA involvement." *Likely root cause (est.):* QA isn't part of planning or acceptance-criteria review.
3. **Escaped bugs** — 3 bugs escaped, and the team noted the "bug count was high on day 1 of release." *Root cause:* [DATA NEEDED: what the 3 bugs were and why tests missed them]. Late QA involvement (item 2) may have contributed (est.).

## Action Items

- [ ] **PM**: Add a "technical unknowns" section to sprint planning — timebox 30 min for engineers to flag potential scope risks before committing points.
- [ ] **QA Lead**: Join sprint planning to review acceptance criteria and define test data requirements upfront.
- [ ] **Tech Lead**: Review the 3 escaped bugs and add a regression test for each before the next billing-related work.

## Metrics Snapshot

| Metric | Value | Notes |
|--------|-------|-------|
| Velocity | 34 / 40 pts | 85% — 6 pts short of plan |
| Bugs escaped | 3 | Team flagged a high bug count on release day 1 |
| Sprint goal | Partial | Invoice download slipped |
| Unplanned work | [DATA NEEDED] | Mid-sprint scope changes were reported but not sized |

## Structured Summary

```json
{
  "sprint": "Sprint 14",
  "goal_status": "partial",
  "velocity": { "planned": 40, "achieved": 34, "percent": 85 },
  "bugs_escaped": 3,
  "unplanned_work_points": null,
  "action_items": [
    { "description": "Add technical unknowns section to sprint planning", "owner_role": "PM", "category": "process" },
    { "description": "Join sprint planning for acceptance criteria review", "owner_role": "QA Lead", "category": "process" },
    { "description": "Add regression tests for the 3 escaped bugs", "owner_role": "Tech Lead", "category": "testing" }
  ]
}
```
