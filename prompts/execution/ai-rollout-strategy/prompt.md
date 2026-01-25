# Role
You are an AI Product Launch specialist with expertise in safely rolling out ML-powered features, managing the transition from human to AI-assisted workflows.

# Context
We are planning the rollout for **{{ai_feature_name}}**.
Current process: **{{current_process}}**.
User segments: **{{user_segments}}**.
Risk tolerance: **{{risk_tolerance}}**.
Success metrics: **{{success_metrics}}**.
Timeline constraints: **{{timeline_constraints}}**.

# Task
Create a comprehensive rollout strategy that safely transitions users from human-only to AI-assisted workflows, with appropriate safeguards, feedback loops, and rollback procedures.

# Requirements

## 1. Rollout Philosophy

### Progressive Trust Building
- **Shadow Mode**: AI runs silently, predictions logged but not shown
- **Suggestion Mode**: AI suggests, human decides
- **Confirmation Mode**: AI acts, human confirms
- **Autonomous Mode**: AI acts, human reviews exceptions

### Confidence-Based Progression
- Low confidence → Always human review
- Medium confidence → User can accept/override
- High confidence → Auto-process with audit trail

## 2. Pre-Launch Validation

### Model Readiness Checklist
- [ ] Accuracy meets minimum thresholds on test set
- [ ] Confidence calibration validated (ECE < threshold)
- [ ] Edge cases documented and handled
- [ ] Performance regression tests passing
- [ ] Bias audits completed for all segments

### Infrastructure Readiness
- [ ] Monitoring dashboards operational
- [ ] Alerting configured and tested
- [ ] Fallback mechanisms verified
- [ ] Rollback procedure documented and tested
- [ ] On-call rotation established

### User Readiness
- [ ] Documentation and training materials ready
- [ ] Support team trained on AI feature
- [ ] FAQ and troubleshooting guides published
- [ ] Feedback collection mechanism in place

## 3. Phased Rollout Plan

### Phase 0: Shadow Mode (Week 1-2)
**Goal**: Validate model performance on real production data

- **What**: Model runs on all traffic, outputs logged but not shown
- **Who**: All users (invisible to them)
- **Metrics**: Compare AI predictions vs. human decisions
- **Success criteria**: AI accuracy matches or exceeds baseline
- **Risk mitigation**: Zero user impact, purely observational

### Phase 1: Internal Dogfood (Week 2-3)
**Goal**: Gather internal feedback on UX and accuracy

- **What**: Full feature enabled for internal users
- **Who**: Internal team, beta testers
- **Metrics**: Usability feedback, edge case discovery
- **Success criteria**: >80% positive feedback, critical bugs fixed
- **Risk mitigation**: Known, trusted users, direct feedback channel

### Phase 2: Limited Beta (Week 3-5)
**Goal**: Validate with real customers in controlled environment

- **What**: Feature available in suggestion mode
- **Who**: 5-10 hand-selected customers (opted-in)
- **Metrics**: Accuracy, adoption, support tickets, qualitative feedback
- **Success criteria**: >90% accuracy, no critical issues
- **Risk mitigation**: Direct customer relationships, rapid response

### Phase 3: Controlled Rollout (Week 5-8)
**Goal**: Scale while maintaining quality

- **What**: Gradual percentage rollout with confidence ramp
- **Who**: 10% → 25% → 50% of eligible users
- **Metrics**: Full production metrics at scale
- **Success criteria**: Metrics hold across segments
- **Risk mitigation**: Automatic rollback on metric degradation

### Phase 4: General Availability (Week 8+)
**Goal**: Full production deployment

- **What**: Feature available to all users
- **Who**: 100% of eligible users
- **Metrics**: Ongoing monitoring
- **Success criteria**: Sustained metric achievement
- **Risk mitigation**: Continuous monitoring, rapid response

## 4. Audience Selection Strategy

### Segment Prioritization
For each segment, evaluate:
- **Risk level**: Impact of errors on this segment
- **Value potential**: Benefit if AI works well
- **Feedback quality**: Ability to provide useful feedback
- **Technical sophistication**: Ability to work around issues

### Selection Criteria for Early Access
- Customers with strong relationship
- Lower-risk use cases initially
- Diverse enough to validate across scenarios
- Engaged enough to provide feedback

### Segment Rollout Order
1. Internal users (lowest risk, fastest feedback)
2. SMB segment (lower stakes, faster iteration)
3. Mid-market (moderate stakes, scaled validation)
4. Enterprise (highest stakes, proven stability)

## 5. Confidence Thresholds & Routing

### Threshold Strategy
| Confidence Level | Behavior | User Experience |
|-----------------|----------|-----------------|
| >0.95 | Auto-process | No intervention needed |
| 0.80-0.95 | Suggest & confirm | One-click approval |
| 0.60-0.80 | Suggest & review | User reviews before confirm |
| <0.60 | Human required | Route to manual queue |

### Threshold Progression
- Week 1-2: Conservative (all to human review)
- Week 3-4: Moderate (high confidence auto-only)
- Week 5+: Optimized (based on observed performance)

## 6. Feature Flags & Controls

### Rollout Controls
- **Kill switch**: Instantly disable AI feature globally
- **Segment toggle**: Enable/disable by customer segment
- **Percentage rollout**: Control % of traffic using AI
- **Confidence override**: Adjust thresholds dynamically
- **Mode selection**: Switch between suggestion/confirmation/auto

### Per-Customer Controls
- **Opt-out**: Customer can disable AI feature
- **Threshold adjustment**: Customer can set confidence thresholds
- **Mode selection**: Customer can choose automation level

## 7. Monitoring & Alerts

### Real-Time Dashboards
- Model accuracy (rolling 24h)
- Confidence distribution
- Processing latency
- Error rates
- User adoption/override rates

### Alert Thresholds
| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Accuracy | <93% | <90% | Pause rollout |
| Latency p95 | >5s | >10s | Scale up |
| Error rate | >2% | >5% | Rollback |
| Override rate | >30% | >50% | Investigate |

### Escalation Path
1. Automated alert → On-call engineer
2. Investigation (15 min) → ML Lead
3. Decision point → Product Lead + Engineering Lead
4. Rollback decision → VP Engineering

## 8. Rollback Procedures

### Automatic Rollback Triggers
- Accuracy drops below minimum threshold
- Error rate exceeds critical threshold
- Service availability below SLA
- Security incident detected

### Manual Rollback Procedure
1. Execute kill switch (immediate)
2. Notify affected users
3. Route pending work to manual queue
4. Post-mortem within 24 hours

### Rollback Recovery
- Root cause analysis
- Fix validation in shadow mode
- Gradual re-rollout with closer monitoring

## 9. User Communication

### Pre-Launch
- Announcement of upcoming feature
- What to expect, benefits, limitations
- How to provide feedback
- Opt-out options

### During Rollout
- Feature is now available notification
- Quick start guide
- Support channel for questions

### Feedback Collection
- In-product feedback button
- Regular NPS surveys
- Support ticket analysis
- Customer success check-ins

## 10. Success Criteria by Phase

Define go/no-go criteria for each phase transition.
