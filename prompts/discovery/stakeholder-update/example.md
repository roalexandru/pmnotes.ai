# Stakeholder Update: Figma Slides

**Period:** Sprint 14 (Feb 17 – Feb 28)
**Status:** At Risk — on track for feature delivery but hiring gap threatens Q2 velocity.

## Accomplishments

* **Shipped real-time collaboration on slides** — multiple designers can now co-edit simultaneously, unblocking the #1 requested feature from enterprise pilots.
* **Closed 3 enterprise design pilots** — Shopify, Stripe, and Datadog signed pilot agreements, adding $180K in potential ARR to pipeline.
* **Reduced slide load time by 40%** — P95 load time dropped from 3.2s to 1.9s through lazy rendering and asset optimization.
* **Completed accessibility audit for presenter mode** — WCAG 2.1 AA compliance confirmed, removing a launch blocker for enterprise customers.

## Blockers & Risks

* **Hiring freeze delayed frontend hire** — We are down one frontend engineer for Q2. Impact: presenter mode beta timeline may slip 2 weeks. **Ask:** Exception approval for one frontend role, or temporary allocation from the Design Systems team.
* **Performance regression on large decks (50+ slides)** — Editing latency spikes to 800ms+ on decks with heavy assets. Impact: may block enterprise adoption (their average deck is 60+ slides). **Mitigation:** Engineering spike scheduled for Sprint 15 to evaluate virtualized rendering.

## Upcoming Priorities

* **Presenter mode beta launch** — target March 7 internal dogfood, March 14 beta to 50 pilot users. Expected outcome: validate core presentation flow and gather usability feedback.
* **Enterprise SSO integration** — SAML and OKTA support in progress. Expected outcome: remove procurement blocker for 4 enterprise deals in pipeline.
* **Design system templates** — first 10 templates from the design team. Expected outcome: reduce blank-canvas friction and improve activation rate by ~15%.

## Key Asks

1. **Hiring exception** — approve one senior frontend engineer requisition to maintain Q2 delivery commitments.
2. **Design Systems team support** — 2 weeks of part-time frontend help (1 engineer) to cover the gap while we hire.
3. **Enterprise pilot feedback review** — schedule 30-min sync with Sales to review pilot feedback before presenter mode beta.
