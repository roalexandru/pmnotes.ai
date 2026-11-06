---
incident_id: INC-2026-0218
severity: SEV-1
duration_minutes: 88
mttr_minutes: 53
customers_affected: 450  # est.: input reports ~450 delayed payments, not unique customers
revenue_impact_usd: 38000
revenue_recovered: true
root_cause_category: process_tooling_gap
detection_method: automated_alert
action_items: 4
---

# Postmortem: Payment Processing Outage — Stripe Webhook Failures

**Date:** 2026-02-18
**Severity:** SEV-1
**Duration:** 88 minutes (14:02–15:30; timezone [DATA NEEDED])
**Author:** Product Manager, Payments Team

## Executive Summary

On February 18, an expired API key in the production config caused webhook processing failures, delaying approximately 450 payments for 30–90 minutes. A PagerDuty alert fired at 14:02 and on-call confirmed the impact 13 minutes later; the team resolved it by rotating the key and replaying the webhooks. No data was lost and the estimated $38K in delayed revenue was all recovered.

## Timeline

| Time | Event |
|------------|-------|
| 14:02 | PagerDuty alert fires: webhook failure rate exceeds 5% threshold |
| 14:15 | On-call confirms payments stuck in "pending" state |
| 14:40 | Root cause identified: expired API key in production config |
| 14:55 | Key rotated; webhook replay started |
| 15:30 | All queued payments processed; incident resolved |

[DATA NEEDED: alert acknowledgment time, when the incident channel opened, and when support and customers were notified. These are not in the source timeline.]

## Root Cause Analysis

**Immediate cause:** The API key in the production config expired, so webhook processing failed and payments stayed in "pending".

**Why did the key expire?**
1. Why did webhooks fail? The production API key had expired.
2. Why wasn't it rotated in time? Key rotation is a manual process.
3. Why didn't anyone notice the upcoming expiry? There is no monitoring on key expiration.
4. Why didn't testing catch it? Staging uses a different auth path, so this failure mode never appears before production.
5. Why are these gaps still open? [DATA NEEDED: key lifetime, last rotation date, and who owns credential rotation]

**Root cause:** A process/tooling gap: no automated expiry monitoring and no owned rotation schedule for third-party API credentials. The manual rotation step and the staging auth difference are contributing factors.

## Impact Assessment

| Dimension | Impact |
|-----------|--------|
| Customers affected | ~450 (payments delayed 30–90 min) |
| Support tickets | 12 inbound tickets |
| Revenue | $38K delayed, all recovered — $0 lost |
| Data loss | None |
| SLA breach | Likely, pending confirmation: 88 minutes exceeds the ~43.2-minute monthly downtime budget of a 99.9% SLA (30 days × 1,440 min × 0.1%), if delayed payment processing counts as downtime. [DATA NEEDED: applicable SLA terms] |
| Downstream systems | [DATA NEEDED: effects on dependent flows, e.g., subscription activation] |

## What Went Well

- **Automated detection**: The PagerDuty webhook failure-rate alert fired at 14:02, and on-call confirmed the impact by 14:15.
- **Clean resolution**: Key rotation and webhook replay cleared the backlog with no data loss, and all delayed revenue was recovered.
- **Communication**: [DATA NEEDED: how and when support and customers were informed; 12 support tickets were received]

## What Went Poorly

- **No proactive monitoring**: We had no visibility into API key expiration dates across any third-party integration.
- **Manual rotation process**: Key rotation depends on someone remembering to do it, which is error-prone.
- **Staging parity gap**: Staging uses a different auth path, so this failure mode was invisible in pre-production.

## Action Items

- [ ] **P0 — Platform Lead**: Implement automated monitoring for all third-party API key expiration dates with alerts at 30, 14, and 3 days before expiry. *Deliverable: monitoring dashboard + PagerDuty integration.*
- [ ] **P1 — Infrastructure Engineer**: Automate Stripe key rotation via secrets manager (e.g., Vault) so rotation requires zero manual steps. *Deliverable: runbook replaced by automated rotation.*
- [ ] **P1 — QA Lead**: Add an expiring-credentials test scenario to staging that simulates an expired production key on payment webhooks. *Deliverable: integration test in CI.*
- [ ] **P2 — PM**: Audit all third-party integrations for similar manual credential management gaps. *Deliverable: risk inventory spreadsheet shared with engineering leads.*

## Lessons Learned

1. **Manual operational processes are hidden risks.** If a critical process depends on someone remembering to do something, it will eventually fail. Every recurring operational task touching production should be automated or at minimum have calendar-based reminders with clear ownership.
2. **Staging should test failure modes, not just happy paths.** Our staging environment uses a different auth path, so it didn't reproduce operational realities of production such as key expiration. Parity gaps in operational behavior are as dangerous as code bugs.
