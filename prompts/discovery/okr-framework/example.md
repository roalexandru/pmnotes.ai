# OKR & Success Metrics Framework: Loom — Q3 2025

## OKR Summary Table

### Objective 1: Accelerate Free-to-Paid Conversion

| Key Result | Baseline | Target |
| :--- | :--- | :--- |
| Reduce median time-to-convert from 38 days to 25 days | 38 days | 25 days |
| Increase free-to-paid conversion rate from 4.2% to 5.5% | 4.2% | 5.5% |
| Achieve 60% activation of "team workspace" feature within first 7 days of signup | 34% | 60% |

### Objective 2: Grow Enterprise Revenue

| Key Result | Baseline | Target |
| :--- | :--- | :--- |
| Increase enterprise ARR from $45M to $58.5M | $45M | $58.5M |
| Close 15 new enterprise deals ($100K+ ACV) | 9 last quarter | 15 |
| Improve enterprise trial-to-close rate from 18% to 28% | 18% | 28% |
| Reduce enterprise sales cycle from 62 days to 48 days | 62 days | 48 days |

### Objective 3: Establish Loom as the Async Collaboration Standard

| Key Result | Baseline | Target |
| :--- | :--- | :--- |
| Increase videos shared to non-Loom users by 40% | 2.1M/month | 2.94M/month |
| Launch async comments and reactions on videos with 20% adoption | 0% (new) | 20% WAU adoption |
| Achieve 35% of active users creating 2+ videos per week | 22% | 35% |

## Metrics Hierarchy

### Objective 1: Accelerate Free-to-Paid Conversion

* **North Star:** Free-to-paid conversion rate
* **Leading Indicators:**
  - Day-1 video creation rate (early activation signal)
  - Team workspace setup completion (predicts team plan conversion)
  - Paywall impression-to-click rate (upgrade intent)
* **Lagging Indicators:**
  - Conversion rate (outcome)
  - Time-to-convert (velocity)
  - Revenue per converted user (quality)
* **Causal Chain:** Users who create a video on Day 1 are 3.2x more likely to set up a team workspace. Team workspace users hit the paywall sooner and convert at 2.4x the rate of solo users.

### Objective 2: Grow Enterprise Revenue

* **North Star:** Enterprise ARR
* **Leading Indicators:**
  - Qualified enterprise pipeline value
  - Enterprise trial starts per month
  - Feature adoption of SSO, admin console, and analytics
* **Lagging Indicators:**
  - New enterprise deals closed
  - Average contract value
  - Enterprise NRR (net revenue retention)
* **Causal Chain:** Enterprise trials that adopt SSO and admin console within the first week close at 2x the rate of those that do not. Pipeline coverage of 3x target is needed for predictable attainment.

### Objective 3: Establish Loom as the Async Collaboration Standard

* **North Star:** Weekly videos shared externally
* **Leading Indicators:**
  - Viral loop: share-to-signup rate for non-users
  - Async comments created per video
  - Multi-video creators (2+/week)
* **Lagging Indicators:**
  - MAU growth rate
  - External share volume
  - Brand search volume for "loom async"
* **Causal Chain:** Videos shared to non-users drive a 12% viewer-to-signup rate. Users who receive async comments return 1.8x more frequently, increasing multi-video creation behavior.

## Measurement Plan

| Key Result | Data Source | Instrumentation Status |
| :--- | :--- | :--- |
| Time-to-convert | Mixpanel conversion funnel | Ready |
| Free-to-paid conversion rate | Stripe + Mixpanel | Ready |
| Team workspace activation (7-day) | Product analytics | Ready |
| Enterprise ARR | Salesforce ARR dashboard | Ready |
| New enterprise deals | Salesforce opportunity reports | Ready |
| Enterprise trial-to-close rate | Salesforce + product trial tracking | Needs integration |
| Enterprise sales cycle length | Salesforce stage timestamps | Ready |
| External video shares | Product analytics (share events) | Ready |
| Async comments adoption | Product analytics | Needs new event tracking |
| Multi-video creators per week | Product analytics (creation events) | Ready |

## Guardrail Metrics

* **Video quality score** — Monitor average video completion rate to ensure growth pushes do not degrade content quality.
* **Free-tier NPS** — Track that conversion optimizations do not create a hostile free experience (target: maintain NPS > 45).
* **Enterprise churn rate** — Ensure fast enterprise sales cycles do not sacrifice deal quality (target: maintain churn < 5% annually).

## Review Cadence

* **Weekly (Monday):** Growth team standup — review leading indicators (activation rates, trial starts, share volumes). Flag any metric trending >10% off pace.
* **Monthly (first Friday):** OKR progress review with PM, engineering lead, and design. Score each KR on 0–1 scale. Decide if any initiatives need reprioritization.
* **Quarterly (end of Q3):** Full OKR retrospective with leadership. Score final attainment, extract learnings, and seed next quarter's objectives.
