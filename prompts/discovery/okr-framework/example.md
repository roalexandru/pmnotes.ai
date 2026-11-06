# OKR & Success Metrics Framework: Northwind Clips — Q1 2027

## OKR Summary Table

### Objective 1: Accelerate Free-to-Paid Conversion

| Key Result | Baseline | Target |
| :--- | :--- | :--- |
| Reduce median time-to-convert from 38 days to 25 days | 38 days | 25 days |
| Increase free-to-paid conversion rate from 4.2% to 5.5% | 4.2% | 5.5% |
| Achieve 60% activation of "team workspace" feature within first 7 days of signup | [DATA NEEDED] | 60% |

### Objective 2: Grow Enterprise Revenue

| Key Result | Baseline | Target |
| :--- | :--- | :--- |
| Increase enterprise ARR from $45M to $58.5M | $45M | $58.5M |
| Close 15 new enterprise deals ($100K+ ACV) | [DATA NEEDED: deals last quarter] | 15 |
| Improve enterprise trial-to-close rate to 28% (est. target) | [DATA NEEDED] | 28% |
| Reduce enterprise sales cycle by ~20% (est. target) | [DATA NEEDED: current cycle length] | −20% |

### Objective 3: Establish Northwind Clips as the Async Collaboration Standard

| Key Result | Baseline | Target |
| :--- | :--- | :--- |
| Increase videos shared to non-users by 40% | [DATA NEEDED: monthly external shares] | +40% |
| Launch async comments and reactions on videos with 20% adoption | 0% (new) | 20% WAU adoption |
| Achieve 35% of active users creating 2+ videos per week | [DATA NEEDED] | 35% |

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
* **Causal Chain (hypothesis — validate with cohort analysis):** Users who create a video on Day 1 are more likely to set up a team workspace; team workspace users hit the paywall sooner and convert at a higher rate than solo users. [DATA NEEDED: actual lift for each step]

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
* **Causal Chain (hypothesis):** Enterprise trials that adopt SSO and admin console within the first week close at a higher rate than those that do not ([DATA NEEDED: close-rate comparison]). Pipeline coverage of ~3x target (est., common sales heuristic) supports predictable attainment.

### Objective 3: Establish Northwind Clips as the Async Collaboration Standard

* **North Star:** Weekly videos shared externally
* **Leading Indicators:**
  - Viral loop: share-to-signup rate for non-users
  - Async comments created per video
  - Multi-video creators (2+/week)
* **Lagging Indicators:**
  - MAU growth rate
  - External share volume
  - Brand search volume for "northwind clips async"
* **Causal Chain (hypothesis):** Videos shared to non-users drive viewer-to-signup conversion ([DATA NEEDED: current rate]); users who receive async comments return more often, increasing multi-video creation.

## Measurement Plan

| Key Result | Data Source (proposed) | Instrumentation Status ([DATA NEEDED: confirm with data team]) |
| :--- | :--- | :--- |
| Time-to-convert | Product analytics conversion funnel | Ready |
| Free-to-paid conversion rate | Billing system + product analytics | Ready |
| Team workspace activation (7-day) | Product analytics | Ready |
| Enterprise ARR | CRM / finance ARR dashboard | Ready |
| New enterprise deals | CRM opportunity reports | Ready |
| Enterprise trial-to-close rate | CRM + product trial tracking | Needs integration |
| Enterprise sales cycle length | CRM stage timestamps | Ready |
| External video shares | Product analytics (share events) | Ready |
| Async comments adoption | Product analytics | Needs new event tracking |
| Multi-video creators per week | Product analytics (creation events) | Ready |

## Guardrail Metrics

* **Video quality score** — Monitor average video completion rate to ensure growth pushes do not degrade content quality.
* **Free-tier NPS** — Track that conversion optimizations do not create a hostile free experience (target: no decline from baseline — [DATA NEEDED: current free-tier NPS]).
* **Enterprise churn rate** — Ensure fast enterprise sales cycles do not sacrifice deal quality (target: at or below current rate — [DATA NEEDED: enterprise churn baseline]).

## Review Cadence

* **Weekly (Monday):** Growth team standup — review leading indicators (activation rates, trial starts, share volumes). Flag any metric trending >10% off pace.
* **Monthly (first Friday):** OKR progress review with PM, engineering lead, and design. Score each KR on 0–1 scale. Decide if any initiatives need reprioritization.
* **Quarterly (end of Q1):** Full OKR retrospective with leadership. Score final attainment, extract learnings, and seed next quarter's objectives.
