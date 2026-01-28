```markdown
# PRD: SupportOps Assistant

## 1. Summary

SupportOps Assistant is an internal AI co-pilot for Tier-1 support agents that reduces time spent summarizing tickets and locating policy answers while preserving human approval and compliance.

## 2. Goals & Non-Goals

**Goals**

- Reduce average handle time by 25% within 60 days of launch.
- Achieve 90% agent acceptance of AI drafts.
- Increase policy citation accuracy to 95%+.

**Non-Goals**

- Fully automated responses without human approval.
- Cross-channel customer outreach (email/SMS campaigns).

## 3. Target Users & Jobs-to-be-Done

- **Tier-1 Agent**: "Draft accurate responses faster without hunting for policy docs."
- **Team Lead**: "Ensure responses are consistent and compliant."

## 4. User Journeys

1. **Summarize & Draft**: Agent opens a ticket → AI summarizes conversation → AI proposes reply → agent edits and sends.
2. **Policy Lookup**: Agent asks for refund policy → AI returns citation + summary → agent inserts into response.

## 5. Functional Requirements

1. **Ticket Summarization (Must)**
   - Acceptance: Summary includes issue, prior actions, and customer sentiment.
2. **Draft Response (Must)**
   - Acceptance: Draft references at least one policy citation when applicable.
3. **Policy Search (Should)**
   - Acceptance: Results show top 3 docs with snippets and confidence.
4. **Agent Feedback (Could)**
   - Acceptance: Agents can rate drafts and flag hallucinations.

## 6. AI Interaction Design

- **System Prompt**: "You are a support co-pilot. Provide concise drafts, never send directly."
- **Tone**: Helpful, professional, empathetic.
- **Confirmation**: Require explicit agent approval before any external reply.

## 7. Data & Integrations

- Inputs: Zendesk ticket history, customer profile, policy docs (Confluence).
- APIs: Zendesk, Confluence search, internal auth (SSO).
- Permissions: Read-only access to tickets; write access for draft notes only.

## 8. Non-Functional Requirements

- P95 response time < 3s for summaries.
- No PII leaves VPC; audit logs retained 12 months.

## 9. Metrics & Instrumentation

- Events: ai_summary_created, ai_draft_accepted, ai_draft_edited.
- Dashboard: Handle time, acceptance rate, policy citation accuracy.

## 10. Risks & Open Questions

- Risk: Policy docs out of date → validate with weekly sync.
- Open question: Which prompt templates maximize acceptance?
```
