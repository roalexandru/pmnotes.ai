```markdown
# Legal & IP Review: AI Support Chatbot

## Executive Summary

| Risk Level | Category | Issue |
|------------|----------|-------|
| High | AI/LLM | OpenAI output ownership terms need review |
| Medium | Data | Customer ticket data may contain PII |
| Medium | Trademark | "SupportBot" name conflicts with existing product |
| Low | Licensing | All dependencies are permissive (MIT/Apache) |

**Recommendation**: Proceed with POC but resolve High/Medium items before production launch.

---

## 1. Open Source License Compliance

### Dependency License Summary

| Package | License | Risk Level | Action Needed |
|---------|---------|------------|---------------|
| Next.js | MIT | Low | Include license in bundle |
| React | MIT | Low | Include license in bundle |
| shadcn/ui | MIT | Low | Include license in bundle |
| Tailwind CSS | MIT | Low | Include license in bundle |
| OpenAI Node SDK | Apache 2.0 | Low | Include license, preserve notices |

### Compliance Status
- [x] No GPL/AGPL copyleft licenses detected
- [x] No commercial use restrictions
- [ ] Create LICENSES.md with all attributions
- [ ] Verify no transitive GPL dependencies

---

## 2. Third-Party API & Service Review

### OpenAI API

| Aspect | Status | Notes |
|--------|--------|-------|
| Terms of Service | Review Required | API usage terms updated Jan 2026 |
| Data Processing | US/EU | Data may be processed outside user's region |
| Output Ownership | Clarify | OpenAI assigns output rights to user, but terms have nuances |
| Rate Limits | OK | Tier 1 sufficient for POC |
| Data Retention | Action Needed | Opt out of training data usage |

**Action Items**:
- [ ] Confirm output ownership for commercial use
- [ ] Enable zero data retention mode
- [ ] Review updated ToS (Jan 2026 version)

### Vercel Hosting

| Aspect | Status | Notes |
|--------|--------|-------|
| Data Residency | OK | Can select US/EU region |
| GDPR DPA | OK | Standard DPA available |
| SOC 2 | OK | SOC 2 Type II certified |

---

## 3. Data & Content Rights

### Data Source Review

| Data Source | Ownership | PII Risk | Action |
|-------------|-----------|----------|--------|
| Internal FAQ database | Owned | Low | OK to use |
| Customer support tickets | Owned | High | Must anonymize |
| Product documentation | Owned | None | OK to use |

### Privacy Checklist
- [ ] Implement PII detection before sending to LLM
- [ ] Add privacy notice for chatbot users
- [ ] Document data flow for GDPR compliance
- [ ] Establish data retention policy (suggest 30 days)

---

## 4. Intellectual Property

### Trademark Search: "SupportBot"

| Registry | Status | Conflict |
|----------|--------|----------|
| USPTO | Conflict Found | "SupportBot Pro" - Class 42 |
| EUIPO | Clear | No conflicts |
| Domain | Unavailable | supportbot.com taken |

**Recommendation**: Choose alternative name. Suggestions:
- HelpDesk AI
- AssistIQ
- SupportPilot (check availability)

### Copyright Considerations
- [x] FAQ content is original/owned
- [ ] Verify no copyrighted content in training data
- [ ] Add copyright notice to chatbot responses

### Patent Landscape
- Low risk: Chatbot + FAQ is well-established prior art
- No novel algorithms requiring FTO analysis

---

## 5. AI-Specific Considerations

### LLM Usage Review

| Consideration | Status | Action |
|---------------|--------|--------|
| Model licensing | OK | API usage, not model distribution |
| Output rights | Clarify | Confirm commercial use of outputs |
| AI disclosure | Required | Add "AI-powered" badge to UI |
| Hallucination liability | Document | Add disclaimer for AI-generated content |
| Training opt-out | Action Needed | Configure API for zero retention |

### Required Disclosures
- [ ] Add "Powered by AI" indicator in chat interface
- [ ] Include disclaimer: "AI-generated responses may contain errors"
- [ ] Document in privacy policy that AI is used

---

## 6. Regional Compliance

### US Requirements
- [x] CCPA: Not applicable (B2B, no consumer data sale)
- [x] CAN-SPAM: N/A (no email marketing)
- [ ] Section 230: Review liability for AI outputs

### EU Requirements
- [ ] GDPR: Privacy notice required, DPA with vendors
- [ ] AI Act: Likely "limited risk" - transparency obligations only
- [ ] Document AI system per EU AI Act requirements

---

## 7. Action Items Summary

### Blockers (Must resolve before any launch)
- [ ] Rename product (trademark conflict)
- [ ] Implement PII redaction for customer ticket data

### Pre-Launch (Before GA)
- [ ] OpenAI ToS review with legal counsel
- [ ] Create LICENSES.md attribution file
- [ ] Add AI disclosure to UI
- [ ] Privacy notice for chatbot users
- [ ] Configure zero data retention with OpenAI

### Post-Launch (Within 90 days)
- [ ] GDPR documentation and record of processing
- [ ] EU AI Act system documentation
- [ ] Full legal review of AI output liability

### Legal Review Needed
- [ ] OpenAI output ownership for commercial product
- [ ] Liability framework for AI errors/hallucinations
- [ ] Customer contract updates for AI features
```
