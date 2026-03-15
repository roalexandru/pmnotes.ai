# Business Case: Native Analytics Dashboard for ProjectFlow

## 1. Executive Summary

**Recommendation: GO — invest in a phased build of a native analytics dashboard.** The addressable opportunity is **$1.05M incremental ARR by Year 3** under moderate assumptions, with a **payback period of 9 months** from launch. The investment required is **$280K** (one-time build) plus $85K/year in ongoing costs. With our top competitor already shipping analytics and 68% of paying teams requesting this capability, every quarter of delay costs us an estimated **$45K in preventable churn and $60K in lost competitive deals**. The risk-adjusted 3-year NPV is **$1.12M** — this is the highest-ROI initiative on our roadmap.

---

## 2. Opportunity Sizing

### Addressable Base

| Metric | Value | Source |
| :--- | :--- | :--- |
| Total paying teams | 3,200 | Internal billing data |
| Teams requesting analytics | 2,176 (68%) | Feedback board + support tickets |
| Average contract value | $840/year | Finance report Q4 |
| Average team size | 12 seats | Product analytics |
| Pro tier teams | 2,400 (75%) | Billing breakdown |
| Business tier teams | 800 (25%) | Billing breakdown |

### Revenue Model Assumptions

Two revenue levers: (A) analytics add-on at $10/seat/month for Pro teams, and (B) Pro-to-Business upgrades driven by analytics being included in Business plan (Business plan is $15/seat/month vs. Pro at $7/seat/month).

### Scenario Comparison

| Scenario | Add-On Adoption (Pro Teams) | Upgrade Rate Lift (Pro→Business) | Churn Reduction | Year 1 Incremental ARR | Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Conservative** | 8% of Pro teams (192 teams) | +3% upgrade rate | 5% churn reduction | $276K | 80% |
| **Moderate** | 15% of Pro teams (360 teams) | +7% upgrade rate | 10% churn reduction | $504K | 60% |
| **Aggressive** | 25% of Pro teams (600 teams) | +12% upgrade rate | 15% churn reduction | $852K | 30% |

### Moderate Scenario Math

- **Add-on revenue**: 360 teams x 12 seats x $10/seat/month x 12 months = **$518K** (discounted to $389K assuming mid-year ramp: 50% adopt in H1, 50% in H2)
- **Upgrade revenue lift**: 2,400 Pro teams x 7% incremental upgrade rate = 168 teams upgrading. 168 teams x 12 seats x ($15 - $7) x 12 = **$193K** (discounted to $97K for mid-year ramp)
- **Churn save**: 3,200 teams x current 8% annual churn x 10% reduction = 26 teams saved. 26 x $840 = **$22K**
- **Total Year 1 (ramped)**: ~$504K incremental ARR run-rate, ~$380K recognized in Year 1

---

## 3. Strategic Rationale

### Why Now

| Signal | Evidence | Urgency |
| :--- | :--- | :--- |
| **Competitive threat** | CompetitorX launched analytics 6 months ago; cited in 12 of last 40 lost deals | High — gap widens every quarter |
| **User demand** | #1 feature request: 420 votes on feedback board, 180 support tickets in 6 months | High — users are vocal and frustrated |
| **Churn driver** | "Lack of reporting" cited in 23% of churn exit surveys last quarter | High — directly impacts retention |
| **Workaround friction** | 45% of active teams export CSV weekly (product analytics data) | Medium — workaround exists but is painful |

### Cost of Delay

Each quarter we delay:
- **Churn loss**: ~$45K (based on reporting-related churn trajectory)
- **Lost competitive deals**: ~$60K (based on win/loss analysis, 3 deals/month at $20K ACV)
- **Eroding differentiation**: CompetitorX is building switching cost with each month of analytics usage
- **Estimated quarterly cost of inaction: $105K**

### Strategic Fit

Analytics directly supports our stated FY26 strategy of "making ProjectFlow the command center for project teams." It creates a data moat — once teams build dashboards and track trends, switching costs increase significantly. This aligns with the board's mandate to improve net revenue retention from 105% to 115%.

---

## 4. Cost-Benefit Analysis

### Build Cost (One-Time)

| Item | Cost | Assumption |
| :--- | :--- | :--- |
| 2 Senior Engineers x 4 months | $160K | $20K/month fully loaded |
| 1 Product Designer x 3 months | $45K | $15K/month fully loaded |
| ClickHouse infrastructure setup | $25K | Setup + first 3 months |
| QA and security review | $20K | 1 QA engineer x 2 months |
| PM allocation (0.5 FTE, 4 months) | $30K | Opportunity cost |
| **Total one-time investment** | **$280K** | |

### Ongoing Annual Cost

| Item | Annual Cost |
| :--- | :--- |
| ClickHouse hosting + data pipeline | $36K |
| 0.5 engineer maintenance | $30K |
| Support burden (training, tickets) | $12K |
| Infrastructure scaling buffer | $7K |
| **Total ongoing** | **$85K/year** |

### 3-Year P&L (Moderate Scenario)

| | Year 1 | Year 2 | Year 3 | Total |
| :--- | :--- | :--- | :--- | :--- |
| **Revenue (incremental)** | $380K | $720K | $1,050K | $2,150K |
| Build cost | ($280K) | — | — | ($280K) |
| Ongoing cost | ($85K) | ($85K) | ($85K) | ($255K) |
| **Net contribution** | **$15K** | **$635K** | **$965K** | **$1,615K** |
| Cumulative net | $15K | $650K | $1,615K | |

### Key Financial Metrics

- **Payback period**: 9 months from launch (Month 5 of Year 1 at moderate ramp)
- **3-year ROI**: 302% ($1,615K net / $535K total cost)
- **3-year NPV (10% discount)**: $1,120K
- **Break-even adoption**: Only 5% add-on adoption needed to cover ongoing costs — well below even the conservative scenario

---

## 5. Options Analysis

| Criteria | Build In-House | Buy (Embed Metabase/Preset) | Partner (White-Label) | Do Nothing |
| :--- | :--- | :--- | :--- | :--- |
| **Estimated cost** | $280K build + $85K/yr | $50K integration + $120K/yr licensing | $100K integration + $80K/yr revenue share | $0 direct; $420K/yr in losses |
| **Time to market** | 4 months | 6-8 weeks | 3 months | N/A |
| **Strategic control** | Full | Low — limited to vendor roadmap | Medium — shared roadmap | None |
| **User experience** | Seamless, native | Embedded iframe, inconsistent UX | Varies, usually "good enough" | CSV export to Sheets |
| **Data ownership** | Full | Shared with vendor | Shared with partner | Full (but unexploited) |
| **Ongoing complexity** | Medium | High (vendor dependency, version syncing) | High (coordination overhead) | Low |
| **Recommendation score** | **4/5** | **2/5** | **3/5** | **1/5** |

### Assessment

**Build in-house is the recommended option.** While "Buy" is faster to market, the licensing cost exceeds our build maintenance cost by Year 2, and embedded analytics solutions consistently score lower on user satisfaction due to UX inconsistencies. The 4-month timeline is acceptable given the strategic importance. The "Partner" option is viable as a fallback if we cannot staff the engineering team.

---

## 6. Risk Assessment

| # | Risk | Likelihood | Impact | Mitigation | Residual Risk |
| :--- | :--- | :--- | :--- | :--- | :--- |
| R1 | Engineering team stretched — build takes 6+ months instead of 4 | **High** | **High** | Hire one contract engineer for duration; protect team from interrupt-driven work; PM shields sprint scope | Medium — timeline could still slip 4-6 weeks |
| R2 | ClickHouse data pipeline more complex than estimated | **Medium** | **High** | Spike first 2 weeks on data layer; if spike fails, fall back to PostgreSQL materialized views for MVP | Low — fallback approach is proven |
| R3 | Add-on adoption below conservative estimate | **Medium** | **Medium** | Launch with 30-day free trial for all Pro teams; instrument usage analytics from day 1; adjust pricing if needed | Low — free trial de-risks adoption |
| R4 | Competitor extends lead during our build period | **High** | **Medium** | Ship MVP in 2 months (core charts only), iterate after; communicate roadmap to at-risk accounts | Medium — MVP may not match competitor depth |
| R5 | Privacy concerns with aggregated team data | **Low** | **High** | Privacy review in Week 1; default to team-only data views; obtain explicit consent for cross-team benchmarks | Low — standard consent model |
| R6 | Cannibalization — Pro teams expect analytics for free | **Medium** | **Medium** | Position as premium capability from day 1; include basic metrics (3 charts) in Pro, full dashboard in add-on/Business | Low — freemium model is well-established |

**Deal-breaker risk**: R1 (team capacity) is the highest-severity risk. If we cannot allocate 2 full-time engineers, the project should be deferred to next quarter rather than attempted at half-capacity.

---

## 7. Sensitivity Analysis

| Assumption Change | Impact on Year 1 Revenue | Revised Payback | Revised 3-Year NPV | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Adoption 50% lower** (7.5% vs. 15%) | $190K (vs. $380K) | 16 months | $480K | Still positive; still worth doing |
| **Build cost 2x** ($560K) | No revenue impact | 14 months | $840K | Payback extends but ROI remains strong |
| **1 quarter delay** (ship Q3 vs. Q2) | $285K (3 quarters of ramp) | 12 months from launch | $920K | Acceptable; avoid further delay |
| **Competitor drops price 20%** | $340K (10% lower adoption due to price pressure) | 10 months | $980K | Minimal impact — our value prop is integration, not price |
| **All pessimistic combined** | $140K | 22 months | $180K | Marginal; would trigger Phase 1 gate review |

### Swing Variable

**Add-on adoption rate is the single most important assumption.** A 1-percentage-point change in adoption rate shifts Year 1 revenue by ~$25K. The free trial strategy in Phase 1 is specifically designed to de-risk this variable by generating real adoption data before we commit to Phase 2 investment.

---

## 8. Implementation Approach

### Phase 1 — MVP Analytics (Months 1-2) — $140K

| Attribute | Detail |
| :--- | :--- |
| **Scope** | 5 core dashboard charts: project status overview, team velocity trend, task completion rate, overdue items tracker, workload distribution |
| **Data layer** | PostgreSQL materialized views (avoid ClickHouse dependency for MVP) |
| **Target users** | 200 beta teams (hand-selected from feedback requestors) |
| **Success criteria** | 60% weekly active usage among beta teams; NPS > 40; <500ms chart load time |
| **Go/no-go for Phase 2** | Hit success criteria + confirmed engineering capacity for Phase 2 |

### Phase 2 — Full Dashboard + Monetization (Months 3-4) — $100K

| Attribute | Detail |
| :--- | :--- |
| **Scope** | Custom chart builder, date range filters, export to PDF, team benchmarking, add-on billing integration |
| **Data layer** | Migrate to ClickHouse for scale; historical data backfill |
| **Target users** | GA to all paying teams; add-on pricing live |
| **Success criteria** | 10% add-on adoption in first 60 days; churn rate declining in Pro cohort |
| **Go/no-go for Phase 3** | Adoption trending toward moderate scenario; infrastructure stable |

### Phase 3 — Scale & Differentiate (Months 5-8) — $40K + ongoing

| Attribute | Detail |
| :--- | :--- |
| **Scope** | AI-generated insights ("Your velocity dropped 15% — here's why"), scheduled email reports, API access for custom integrations, cross-project portfolio view |
| **Dependencies** | ClickHouse stable at scale; PM capacity for insight logic design |
| **Target** | Enterprise expansion; differentiator vs. competitor's static dashboards |

---

## 9. Decision & Next Steps

### Recommendation

**GO — approve Phase 1 immediately ($140K) with Phase 2 funding contingent on MVP success criteria.**

This is a de-risked, phased approach. We commit $140K to validate the opportunity with real users before investing the remaining $140K. The worst-case outcome is a $140K MVP that still reduces churn even if we never monetize it as an add-on.

### Conditions for Approval

1. Engineering leadership confirms 2 engineers can be allocated starting Sprint 1 without jeopardizing platform reliability commitments
2. Privacy review completed in Week 1 (Legal sign-off on data aggregation approach)
3. Finance approves ClickHouse infrastructure budget ($25K for Phase 2)

### Immediate Next Steps (If Approved)

| Week | Action | Owner |
| :--- | :--- | :--- |
| Week 1 | Kick off data layer spike; begin privacy review | Engineering Lead, Legal |
| Week 1 | Recruit 200 beta teams from feedback board requestors | PM |
| Week 2 | Finalize MVP chart specifications with design | PM, Designer |
| Week 2 | Set up analytics instrumentation for adoption tracking | Data Engineer |
| Week 3 | Begin Sprint 1 development | Engineering Team |

### Decision Timeline

**Request decision by end of this week.** Each week of delay pushes launch further into Q3 and costs approximately $25K in combined churn and lost deals. The Phase 1 go/no-go checkpoint at Month 2 provides a natural off-ramp if the investment thesis doesn't hold.
