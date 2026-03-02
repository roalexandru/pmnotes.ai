---
incident_id: INC-2026-0218
severity: SEV-1
duration_minutes: 88
mttr_minutes: 53
customers_affected: 450
revenue_impact_usd: 38000
revenue_recovered: true
root_cause_category: configuration
detection_method: automated_alert
action_items: 4
---

# Postmortem: Payment Processing Outage — Stripe Webhook Failures

**Date:** 2026-02-18
**Severity:** SEV-1
**Duration:** 88 minutes (14:02–15:30 UTC)
**Author:** Product Manager, Payments Team

## Executive Summary

On February 18, an expired Stripe API key in production caused webhook processing failures, delaying approximately 450 customer payments for 30–90 minutes. The issue was detected by automated alerting within 13 minutes, and the team resolved it by rotating the key and replaying the webhook queue. No data was lost and all revenue was recovered.

## Timeline

| Time (UTC) | Event |
|------------|-------|
| 14:02 | PagerDuty alert fires: webhook failure rate exceeds 5% threshold |
| 14:05 | On-call engineer acknowledges alert, begins investigation |
| 14:15 | Confirmed: payments stuck in "pending" state, webhook responses returning 401 |
| 14:22 | Incident channel opened, PM and engineering lead paged |
| 14:30 | Customer support notified; canned response prepared for incoming tickets |
| 14:40 | Root cause identified: Stripe API key in production config expired at 14:00 UTC |
| 14:55 | New API key generated, rotated in production, webhook replay initiated |
| 15:20 | Webhook backlog cleared, payment processing confirmed normal |
| 15:30 | All queued payments processed successfully; incident declared resolved |

## Root Cause Analysis

**Immediate cause:** The Stripe API key used for webhook authentication expired at 14:00 UTC, causing all incoming webhooks to return 401 Unauthorized.

**Why did the key expire?**
1. The API key had a 90-day expiration set by Stripe's security policy.
2. Key rotation is a manual process — an engineer must generate a new key in the Stripe dashboard and update the production config.
3. No automated reminder or monitoring existed for key expiration dates.
4. The last rotation was performed ad-hoc 93 days ago with no calendar reminder set.
5. Staging uses a separate authentication path (test keys with no expiration), so expiration was never caught in pre-production testing.

**Root cause:** Absence of automated key expiration monitoring and a defined rotation schedule for third-party API credentials.

## Impact Assessment

| Dimension | Impact |
|-----------|--------|
| Customers affected | ~450 (payments delayed 30–90 min) |
| Support tickets | 12 inbound tickets |
| Revenue | $38K delayed, all recovered — $0 lost |
| Data loss | None |
| SLA breach | No — 99.9% monthly SLA still met |
| Downstream systems | Subscription activation delayed for ~80 new signups |

## What Went Well

- **Fast detection**: Automated alerting caught the failure within 2 minutes. On-call response was under 15 minutes.
- **Clear communication**: Incident channel was opened promptly, support was looped in early, and a customer-facing status update was posted within 30 minutes.
- **Clean resolution**: Key rotation and webhook replay resolved the issue without data loss or manual payment reconciliation.

## What Went Poorly

- **No proactive monitoring**: We had no visibility into API key expiration dates across any third-party integration.
- **Manual rotation process**: Key rotation requires 4 manual steps across two systems (Stripe dashboard + production config). This is error-prone and undocumented.
- **Staging parity gap**: Staging's use of non-expiring test keys meant this failure mode was invisible in pre-production.

## Action Items

- [ ] **P0 — Platform Lead**: Implement automated monitoring for all third-party API key expiration dates with alerts at 30, 14, and 3 days before expiry. *Deliverable: monitoring dashboard + PagerDuty integration.*
- [ ] **P1 — Infrastructure Engineer**: Automate Stripe key rotation via secrets manager (e.g., Vault) so rotation requires zero manual steps. *Deliverable: runbook replaced by automated rotation.*
- [ ] **P1 — QA Lead**: Add an expiring-credentials test scenario to staging that simulates 401 responses from payment webhooks. *Deliverable: integration test in CI.*
- [ ] **P2 — PM**: Audit all third-party integrations for similar manual credential management gaps. *Deliverable: risk inventory spreadsheet shared with engineering leads.*

## Lessons Learned

1. **Manual operational processes are hidden risks.** If a critical process depends on someone remembering to do something, it will eventually fail. Every recurring operational task touching production should be automated or at minimum have calendar-based reminders with clear ownership.
2. **Staging should test failure modes, not just happy paths.** Our staging environment was optimized for feature testing but didn't simulate the operational realities of production (key expiration, rate limits, certificate renewal). Parity gaps in operational behavior are as dangerous as code bugs.
