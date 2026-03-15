# Quarterly Business Review: Growth & Activation

**Quarter:** Q1 2025 (January 1 - March 31)
**Product Area:** Growth & Activation
**Author:** Product Manager, Growth & Activation
**Date:** April 4, 2025

---

## 1. Executive Summary

**Quarter Grade: B** — Strong conversion and revenue gains driven by personalized onboarding, but activation and signup targets missed, and a self-inflicted pricing page incident cost us two weeks of momentum.

**Headline Metrics:**
- Trial-to-paid conversion: **16.2%** (up from 12.0%, +35% QoQ, target was 18%)
- MRR: **$68,100** (up from $52,400, +30% QoQ)
- Activation rate: **61%** (target 70%, gap persists)
- New signups: **14,200** (target 15,000, -5%)

**Biggest Win:** Personalized onboarding shipped February 15 and drove a 3.2x improvement in enterprise trial-to-paid conversion, accelerating MRR growth well ahead of company trajectory toward the $1M ARR goal.

**Biggest Miss:** Activation rate stalled at 61% against a 70% target. The in-app guidance initiative — our primary lever for activation — was descoped after a key engineer departure caused a 3-week delay we couldn't recover from.

**Top Recommendation:** Double down on the enterprise onboarding advantage with SSO (the #1 feature request in lost deals) while building a dedicated SMB onboarding path — the data shows these segments need fundamentally different activation strategies.

---

## 2. Metrics Dashboard

| Metric | Target | Actual | Variance | vs Q4 2024 | Status |
|--------|--------|--------|----------|------------|--------|
| New signups | 15,000 | 14,200 | -5.3% | +22% | Below Target |
| Trial-to-paid conversion | 18.0% | 16.2% | -10.0% | +35% | Below Target |
| MRR | $65,000 | $68,100 | +4.8% | +30% | Exceeding |
| Activation rate (30-day) | 70% | 61% | -12.9% | +5% | Critical |
| NPS | 52 | 54 | +3.8% | +12.5% | Exceeding |
| Support ticket volume | Flat | +12% | +12% | +12% | Below Target |
| Time-to-value (days) | 2.0 | 2.8 | +40% | -33% | Below Target |
| First-week churn | 25% | 28% | +12% | -20% | Below Target |
| Re-engagement reactivation | 20% | 22% | +10% | New | Exceeding |

**Narrative:** MRR is the standout — we exceeded target by 4.8%, driven by stronger-than-expected enterprise conversion from personalized onboarding. However, the top-of-funnel and activation metrics tell a different story: signups were soft and activation remains the critical bottleneck. The 12% increase in support tickets correlates with the Google OAuth signup surge — new users from that channel have lower intent and need more guidance, which we didn't ship.

---

## 3. OKR Scorecard

### Objective 1: Increase Trial-to-Paid Conversion
**Objective Score: 0.67**

| Key Result | Target | Actual | Score | Status | Commentary |
|------------|--------|--------|-------|--------|------------|
| KR1: Increase conversion from 12% to 18% | 18% | 16.2% | 0.70 | Partially Achieved | Strong improvement (+35% QoQ) but fell short of the stretch target. Enterprise segment hit 24%, SMB segment only reached 13.8%. |
| KR2: Reduce time-to-value from 4.2 to 2.0 days | 2.0 days | 2.8 days | 0.64 | Partially Achieved | Meaningful progress (-33%) but missed target. Enterprise users hit 1.9 days; SMB users averaged 3.4 days, pulling the blended number up. |
| KR3: Launch personalized onboarding | Shipped | Shipped Feb 15 | 0.68 | Partially Achieved | Shipped on time with 72% completion rate. However, the 3.2x enterprise lift vs 1.1x SMB lift reveals we built primarily for the enterprise use case. |

### Objective 2: Reduce First-Week Churn
**Objective Score: 0.50**

| Key Result | Target | Actual | Score | Status | Commentary |
|------------|--------|--------|-------|--------|------------|
| KR1: Reduce first-week churn from 35% to 25% | 25% | 28% | 0.70 | Partially Achieved | Good progress (-20% relative) but didn't hit goal. Google OAuth users churn at 42% in week 1, dragging the average up. |
| KR2: Implement re-engagement email series | Shipped | Shipped, 22% reactivation | 0.80 | Achieved | Exceeded the 20% reactivation target. Series performs best with users who completed at least one key action before churning. |
| KR3: Add in-app guidance | Shipped | Descoped | 0.00 | Descoped | Engineer departure created a 3-week delay. With only 4 weeks left in Q1, we made the call to push to Q2 rather than rush a subpar implementation. The right decision, but it left a gap in our activation strategy. |

**Overall Quarter OKR Score: 0.59** (Partial delivery — strong progress on conversion, but the descoped KR and activation miss hold the score back)

---

## 4. Quarter Narrative

### What Went Well

1. **Personalized onboarding drove outsized enterprise impact.** The 3.2x improvement in enterprise trial-to-paid conversion (from 7.4% to 23.7%) was the single biggest lever for MRR growth this quarter. Enterprise accounts convert at higher ACVs, so this disproportionately drove the $15,700 MRR increase. *This was a team-driven outcome.*

2. **Google OAuth removed a real signup barrier.** The 40% increase in new signups from Google OAuth (launched January 22) validated our hypothesis that social login reduces friction. Even though total signups missed target, organic growth without OAuth would have been ~10,100 — meaning OAuth contributed ~4,100 incremental signups. *This was a team-driven outcome.*

3. **Re-engagement email series outperformed expectations.** At 22% reactivation (vs 20% target), the series is now our most cost-effective recovery channel. We also learned that users who completed one key action before churning reactivate at 34%, vs 11% for users who never activated. *This was a team-driven outcome.*

4. **NPS improvement reflects real product progress.** NPS moved from 48 to 54, with qualitative feedback citing "faster setup" and "clearer first experience" — both outcomes of onboarding improvements. *Partially a tailwind from seasonality (Q1 tends to see higher NPS), but the magnitude exceeds seasonal norms.*

### What Didn't Go Well

1. **Pricing page redesign caused an 8% conversion drop.** We launched a redesigned pricing page on February 3 without adequate A/B testing. Conversion dropped from 16.8% to 15.5% within 4 days. We reverted on February 17 — two weeks of degraded performance. **Root cause:** The PM (me) pushed to ship the redesign on a compressed timeline to hit a company initiative deadline, skipping the planned 2-week A/B test. **Impact:** Estimated $3,200 in lost MRR. **Within our control:** Yes, entirely.

2. **Activation rate stalled at 61%.** Our 70% target assumed in-app guidance would ship in February. With that descoped, we had no material lever to move activation after onboarding improvements plateaued. **Root cause:** Over-reliance on a single initiative for a 15-percentage-point improvement, with no fallback plan. **Impact:** Activation is now the binding constraint on conversion — users who activate convert at 38%, vs 4% for those who don't. **Within our control:** Partially — the engineer departure wasn't, but our lack of a backup plan was.

3. **Google OAuth users have a quality problem.** While OAuth drove signup volume, these users churn at 42% in week 1 (vs 28% for email signups) and activate at 44% (vs 68%). We optimized for top-of-funnel volume without considering the full-funnel impact. **Root cause:** No segmented analysis before launch; we treated all signups as equal. **Impact:** +12% support ticket volume, lower blended activation rate. **Within our control:** Yes.

4. **Lost 2 enterprise deals to competitor SSO.** Two prospects with 50+ seat potential chose a competitor specifically because we don't offer SSO. Combined potential ARR: ~$48,000/year. **Root cause:** SSO has been on the roadmap for 3 quarters without being prioritized. **Impact:** Direct revenue loss plus a signal that enterprise pipeline will cap without it. **Within our control:** Yes — this was a prioritization choice.

### What We Learned

1. **Enterprise and SMB are fundamentally different activation problems.** Personalized onboarding showed 3.2x lift for enterprise vs 1.1x for SMB. Time-to-value is 1.9 days for enterprise vs 3.4 for SMB. These segments need separate onboarding paths, not a one-size-fits-all flow. **So what:** Q2 onboarding V2 will be segment-specific from day one, with separate success metrics.

2. **Top-of-funnel volume without activation investment creates drag.** Google OAuth proved we can drive signups, but unactivated users generate support load and depress blended metrics. Growth without activation is a cost center, not a revenue driver. **So what:** We will not invest in additional signup channels until activation rate exceeds 65%. Every growth initiative must include an activation plan.

3. **Shipping speed without experimentation rigor is net-negative.** The pricing page incident cost us $3,200 and two weeks of momentum. The time "saved" by skipping A/B testing was negative ROI. **So what:** No conversion-path change ships without a minimum 1-week A/B test. This is now a team policy, not a suggestion.

---

## 5. Deep Dives

### Deep Dive 1: Enterprise vs SMB Onboarding Divergence

**Background:** Personalized onboarding launched February 15 with a single flow that adapted content based on company size, role, and stated goals. We expected a 2x improvement across all segments.

**What Happened:** Enterprise users (50+ employees) saw a 3.2x improvement in trial-to-paid conversion (7.4% to 23.7%). SMB users (<50 employees) saw only 1.1x (12.8% to 14.1%). The gap was unexpected and significant.

**Analysis:** Post-hoc user research (15 interviews) revealed the root cause. Enterprise users valued the personalization because it helped them map our product to their existing workflows — they need to justify the purchase internally and our onboarding gave them that language. SMB users, by contrast, want speed over personalization — they experienced the additional onboarding steps as friction rather than value. Completion rate data supports this: enterprise completion was 89%, SMB was 62%. Of SMB users who dropped off, 74% abandoned at the "team setup" step — a step that's critical for enterprise but irrelevant for solo/small-team users.

**Implications:** We've been treating our user base as a single segment. The data shows we have two distinct products to build for: an enterprise product that emphasizes collaboration, integrations, and admin controls, and an SMB product that emphasizes speed, simplicity, and individual productivity.

**Recommended Actions:**
- Build a segment-specific onboarding fork in Q2 (SMB: 3 steps max, skip team setup; Enterprise: full guided flow with admin features highlighted).
- Establish separate activation and conversion targets by segment starting Q2.
- Evaluate whether the pricing page should present different plans for each segment.

### Deep Dive 2: Pricing Page Incident — Anatomy of a Self-Inflicted Wound

**Background:** The pricing page redesign aimed to improve plan comparison clarity and highlight the annual discount. It was part of a company-wide initiative to increase annual plan adoption.

**What Happened:** The redesigned page launched February 3 without A/B testing. Within 4 days, trial-to-paid conversion dropped from 16.8% to 15.5% — an 8% relative decline. The team monitored for 10 more days hoping the trend was noise before reverting on February 17. Total time at reduced conversion: 14 days.

**Analysis:** Session recordings revealed two issues. First, the new layout moved the CTA below the fold on mobile (38% of pricing page traffic), reducing click-through by 23%. Second, the prominently featured annual pricing created decision paralysis — users who were ready to start a monthly trial hesitated when presented with a "save 20% annually" message, interpreting it as pressure to commit. Heatmap data showed users scrolling up and down between monthly and annual options repeatedly before leaving.

**Implications:** This incident exposed three process gaps: (1) no mandatory A/B testing policy for conversion-critical pages, (2) no automated regression monitoring on key conversion funnels, and (3) a culture of deadline pressure overriding experimentation rigor. The PM (me) owns this — I prioritized hitting a company initiative deadline over following our own best practices.

**Recommended Actions:**
- Implement automated conversion monitoring with alerting thresholds (>5% drop triggers immediate review).
- Establish a team policy: all changes to signup, pricing, and checkout pages require a minimum 1-week A/B test.
- Re-approach the pricing redesign in Q2 with proper A/B testing, starting with mobile-first design.

### Deep Dive 3: The SSO Gap and Enterprise Pipeline Risk

**Background:** SSO (SAML/OIDC) has been requested by enterprise prospects for three quarters. It has appeared in the lost-deal analysis each quarter but has not been prioritized due to competing growth initiatives.

**What Happened:** In Q1, we lost two enterprise prospects (combined potential: ~$48K ARR, 110 seats) who cited SSO as a hard requirement. Both went to CompetitorX, which shipped SSO in November 2024. Additionally, three existing customers with expansion potential flagged SSO as a blocker for rolling out to their wider organizations.

**Analysis:** The pattern is no longer anecdotal. Across the last three quarters, SSO has appeared in 7 of 12 enterprise lost-deal reports. The average deal size where SSO was cited: $22K ARR. Enterprise represents 34% of our MRR but 58% of our growth — the segment where SSO matters is also the segment driving our trajectory toward $1M ARR.

**Implications:** Every quarter we delay SSO, we cap our enterprise ceiling. With the company goal of $1M ARR by end of Q3, enterprise growth is not optional — and SSO is the tax we must pay to access the larger enterprise deals. The competitor window is narrowing.

**Recommended Actions:**
- Prioritize SSO as the #1 engineering initiative in Q2.
- Set target: SSO in beta by end of Q2 Week 8, GA by end of Q2.
- Sales team to re-engage the two lost Q1 prospects once SSO is in beta.

---

## 6. Customer & Market Signals

**Deal Wins:**
- 4 enterprise deals closed ($18.2K combined ARR), all citing onboarding experience as a differentiator vs competitors. Pattern: companies with 50-200 employees evaluating 2-3 tools chose us because "the product felt like it understood our workflow."
- Fastest sales cycle this quarter: 12 days (down from 22-day average), driven by self-serve onboarding eliminating the need for a demo in 2 of 4 deals.

**Deal Losses:**
- 2 enterprise losses to CompetitorX on SSO ($48K potential ARR). Both were IT-driven decisions where the PM champion couldn't override security requirements.
- 1 mid-market loss on pricing — prospect wanted a per-seat model, we only offer tiered plans. Emerging pattern worth monitoring.

**Customer Feedback Themes:**
- Positive: "Setup was fast" (12 mentions), "onboarding felt personalized" (8 mentions), "support is responsive" (6 mentions).
- Negative: "Need SSO for IT approval" (7 mentions), "mobile experience is clunky" (5 mentions), "want better reporting" (4 mentions).
- Expansion blockers: 3 existing customers paused rollout plans pending SSO.

**Competitive Movements:**
- CompetitorX shipped SSO (November 2024) and is now marketing "enterprise-ready" positioning.
- CompetitorY launched a free tier — we've seen a 15% increase in prospects mentioning them in discovery calls, but no measurable impact on our conversion yet.
- Industry trend: AI-assisted features becoming table stakes. Two competitors announced AI capabilities in Q1.

**Churn Signals:**
- Net revenue retention: 108% (healthy, driven by enterprise expansion).
- Logo churn: 4.2% (up from 3.8% in Q4), concentrated in the Google OAuth cohort. Excluding OAuth signups, logo churn was 3.1%.

---

## 7. Team & Execution Health

**Velocity:**
- Story points completed: 142 (down from 156 in Q4, -9%). The decline is entirely attributable to the mid-quarter engineer departure and subsequent 3-week ramp period for knowledge transfer.
- Cycle time (commit to production): 3.2 days (stable vs Q4). No process degradation despite capacity loss.
- Shipped 3 major features (personalized onboarding, Google OAuth, re-engagement emails) plus 14 smaller improvements.

**Capacity:**
- Team: 1 PM, 4 engineers (down to 3 mid-quarter after departure), 1 designer.
- Utilization was stretched — the descoped in-app guidance was a direct consequence of losing 25% of engineering capacity with no backfill timeline.
- New senior engineer approved for Q2 will restore capacity, but ramp time means effective impact starts Q2 Week 4-5.

**Process:**
- What's working: Two-week sprint cadence, weekly metrics review, async standups.
- What's creating drag: Cross-team dependency on Platform team for SSO groundwork — we've been waiting on an API spec for 6 weeks with no ETA. Escalation needed.
- Retro action from Q4 (implement feature flags for all user-facing changes): 80% adopted, and it saved us during the pricing page revert.

**Team Health:**
- Morale is moderate. The team is proud of the onboarding work and MRR results, but frustrated by the engineer departure and the feeling that we're under-resourced for the ambition level.
- Retention risk: One mid-level engineer has expressed interest in transferring to the Platform team. Direct conversation scheduled for Week 1 of Q2.
- Energy is focused but there's fatigue from running lean. The Q2 hire is important for both capacity and morale.

---

## 8. Next Quarter Plan

### Proposed OKRs

**Objective 1: Unlock Enterprise Growth** (linked to: SSO deal losses, enterprise onboarding success, $1M ARR goal)

| Key Result | Target | Rationale |
|------------|--------|-----------|
| KR1: Ship SSO (SAML + OIDC) to GA | GA by end of Q2 | Removes the #1 blocker in enterprise sales pipeline. 7 of 12 lost deals cited this. |
| KR2: Close 3 new enterprise deals with SSO as a factor | 3 deals | Validates that SSO converts pipeline to revenue, not just checks a box. |
| KR3: Re-engage 2 lost Q1 prospects | 2 meetings booked | Tests whether SSO can recover previously lost deals — important signal for future roadmap investment. |

**Objective 2: Fix the Activation Gap** (linked to: 61% activation rate, enterprise/SMB divergence, in-app guidance descope)

| Key Result | Target | Rationale |
|------------|--------|-----------|
| KR1: Increase blended activation rate from 61% to 68% | 68% | Conservative target that accounts for segment mix. Closing the activation gap is the highest-leverage move for conversion. |
| KR2: Launch segment-specific onboarding (Enterprise + SMB paths) | Shipped by Week 6 | Q1 data proved one-size-fits-all doesn't work. SMB path removes friction; enterprise path deepens engagement. |
| KR3: Ship in-app guidance (carried from Q1) | Shipped by Week 8 | Primary lever for activation among users who complete onboarding but don't reach their "aha moment." |

**Objective 3: Build Pricing Intelligence** (linked to: pricing page incident, per-seat feedback, annual plan push)

| Key Result | Target | Rationale |
|------------|--------|-----------|
| KR1: Run 2 pricing A/B tests with statistical significance | 2 tests completed | We need data, not opinions, on pricing. Q1 taught us that untested pricing changes are expensive. |
| KR2: Determine whether per-seat pricing increases enterprise conversion | Analysis complete | One lost deal and 3 customer requests signal demand. Need to validate before building. |

### Key Bets and Hypotheses

1. **SSO unlocks $150K+ in enterprise pipeline.** Hypothesis: Shipping SSO will convert at least 3 enterprise deals and unblock 3 existing customer expansions in Q2. Falsifiable: If SSO ships and enterprise close rate doesn't improve by >20%, the blocker was something else.

2. **Segment-specific onboarding closes the activation gap.** Hypothesis: A dedicated SMB path (3 steps, no team setup) will increase SMB activation from 44% to 58%. Falsifiable: If SMB activation doesn't improve by >10 percentage points within 4 weeks of launch, the onboarding flow isn't the constraint.

3. **In-app guidance is the missing activation lever.** Hypothesis: Contextual tooltips and guided tasks will increase post-onboarding activation by 15%. Falsifiable: If activation rate for users who see guidance isn't >10% higher than control after 3 weeks, guidance alone isn't sufficient.

### Resource Asks

| Ask | Justification | Expected Impact |
|-----|---------------|-----------------|
| 1 senior engineer (approved, starting Q2 Week 2) | Backfill for Q1 departure + capacity for SSO | Restores team to full velocity; SSO requires dedicated backend resource |
| Platform team API spec for SSO foundation (dependency) | Blocked for 6 weeks; need escalation to VP Engineering | SSO timeline depends on this — every week of delay pushes GA further |
| 2 days of Design support for pricing experiments | Pricing tests need variant designs; our designer is allocated to onboarding V2 | Unlocks Objective 3 without pulling designer off Objective 2 |

### Risks and Dependencies

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Platform team API spec continues to slip | High | SSO delayed 2-4 weeks | Escalate to VP Engineering in Week 1. Prepare fallback: build on third-party SSO provider if internal API isn't ready by Week 4. |
| New engineer ramp takes longer than expected | Medium | Reduced velocity Weeks 2-5 | Assign dedicated onboarding buddy. Start with well-scoped tasks (in-app guidance) before SSO work. |
| Google OAuth churn continues to drag blended metrics | Medium | Activation and churn targets harder to hit | Implement OAuth-specific onboarding nudges. Set segment-specific targets to avoid masking. |
| Competitor ships AI features, market narrative shifts | Low | Enterprise prospects add AI to evaluation criteria | Monitor closely but don't react in Q2. AI exploration is a Q3 consideration. |

### What We're Choosing NOT to Do

1. **Not investing in additional signup channels.** Google OAuth showed that volume without activation is a cost center. We'll focus on converting and activating existing signups before opening new top-of-funnel.

2. **Not building AI features in Q2.** Competitors are announcing AI capabilities, but our enterprise customers are asking for SSO and better onboarding — not AI. We'll monitor the market but won't divert resources from proven demand signals.

3. **Not pursuing the mobile experience overhaul.** 5 customer mentions is a signal to watch, not a signal to act on. Mobile is 18% of our activation funnel — the ROI of fixing enterprise onboarding and SSO is 3-4x higher.

---

## 9. Appendix

### Monthly Metrics Breakdown

| Metric | January | February | March | Q1 Total/Avg |
|--------|---------|----------|-------|---------------|
| New signups | 3,800 | 5,100 | 5,300 | 14,200 |
| Trial-to-paid conversion | 14.1% | 15.5% | 18.8% | 16.2% |
| MRR | $55,800 | $60,200 | $68,100 | — |
| Activation rate | 58% | 60% | 64% | 61% |
| First-week churn | 31% | 29% | 24% | 28% |
| Support tickets | 310 | 385 | 402 | 1,097 |
| NPS | 50 | 53 | 54 | 54 (Q1 end) |

### OKR Progress by Month

| Key Result | Jan | Feb | Mar | Final |
|------------|-----|-----|-----|-------|
| Trial-to-paid 18% | 14.1% | 15.5% | 18.8% | 16.2% avg |
| Time-to-value 2.0d | 3.8d | 2.9d | 2.1d | 2.8d avg |
| Personalized onboarding | In dev | Shipped Feb 15 | 72% completion | Done |
| First-week churn 25% | 31% | 29% | 24% | 28% avg |
| Re-engagement emails | In dev | Shipped Feb 28 | 22% reactivation | Done |
| In-app guidance | In dev | Engineer left | Descoped | Pushed to Q2 |

### Enterprise vs SMB Segment Comparison

| Metric | Enterprise | SMB | Delta |
|--------|-----------|-----|-------|
| Trial-to-paid conversion | 23.7% | 13.8% | +72% |
| Time-to-value | 1.9 days | 3.4 days | -44% |
| Onboarding completion | 89% | 62% | +44% |
| Onboarding lift (vs pre) | 3.2x | 1.1x | — |
| First-week churn | 18% | 34% | -47% |
| Activation rate | 78% | 52% | +50% |

### Structured Data

```json
{
  "quarter": "Q1 2025",
  "product_area": "Growth & Activation",
  "overall_grade": "B",
  "overall_okr_score": 0.59,
  "metrics": [
    { "name": "New signups", "target": 15000, "actual": 14200, "variance_pct": -5.3, "status": "below_target" },
    { "name": "Trial-to-paid conversion", "target": 18.0, "actual": 16.2, "variance_pct": -10.0, "status": "below_target" },
    { "name": "MRR", "target": 65000, "actual": 68100, "variance_pct": 4.8, "status": "exceeding" },
    { "name": "Activation rate", "target": 70, "actual": 61, "variance_pct": -12.9, "status": "critical" },
    { "name": "NPS", "target": 52, "actual": 54, "variance_pct": 3.8, "status": "exceeding" },
    { "name": "Support ticket volume change", "target": 0, "actual": 12, "variance_pct": 12.0, "status": "below_target" },
    { "name": "Time-to-value (days)", "target": 2.0, "actual": 2.8, "variance_pct": 40.0, "status": "below_target" },
    { "name": "First-week churn", "target": 25, "actual": 28, "variance_pct": 12.0, "status": "below_target" },
    { "name": "Re-engagement reactivation", "target": 20, "actual": 22, "variance_pct": 10.0, "status": "exceeding" }
  ],
  "objectives": [
    {
      "objective": "Increase trial-to-paid conversion",
      "score": 0.67,
      "key_results": [
        { "description": "Increase conversion from 12% to 18%", "score": 0.70, "status": "partially_achieved" },
        { "description": "Reduce time-to-value from 4.2 to 2.0 days", "score": 0.64, "status": "partially_achieved" },
        { "description": "Launch personalized onboarding", "score": 0.68, "status": "partially_achieved" }
      ]
    },
    {
      "objective": "Reduce first-week churn",
      "score": 0.50,
      "key_results": [
        { "description": "Reduce first-week churn from 35% to 25%", "score": 0.70, "status": "partially_achieved" },
        { "description": "Implement re-engagement email series", "score": 0.80, "status": "achieved" },
        { "description": "Add in-app guidance", "score": 0.00, "status": "descoped" }
      ]
    }
  ],
  "next_quarter_okrs": [
    {
      "objective": "Unlock enterprise growth",
      "key_results": [
        "Ship SSO (SAML + OIDC) to GA",
        "Close 3 new enterprise deals with SSO as a factor",
        "Re-engage 2 lost Q1 prospects"
      ]
    },
    {
      "objective": "Fix the activation gap",
      "key_results": [
        "Increase blended activation rate from 61% to 68%",
        "Launch segment-specific onboarding by Week 6",
        "Ship in-app guidance by Week 8"
      ]
    },
    {
      "objective": "Build pricing intelligence",
      "key_results": [
        "Run 2 pricing A/B tests with statistical significance",
        "Determine whether per-seat pricing increases enterprise conversion"
      ]
    }
  ],
  "top_risks": [
    "Platform team API spec for SSO continues to slip",
    "New engineer ramp takes longer than expected",
    "Google OAuth churn drags blended metrics",
    "Competitor AI features shift market narrative"
  ],
  "key_learnings": [
    "Enterprise and SMB are fundamentally different activation problems requiring separate onboarding paths",
    "Top-of-funnel volume without activation investment creates drag, not growth",
    "Shipping speed without experimentation rigor is net-negative ROI"
  ]
}
```
