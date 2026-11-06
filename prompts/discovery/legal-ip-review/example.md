# Legal & IP Review: AI Support Chatbot

> Not legal advice. Registry, domain, and terms-of-service checks below are steps for you to run; they have not been performed.

## Executive Summary

| Risk Level | Category | Issue |
|------------|----------|-------|
| High | AI/LLM | OpenAI output ownership terms need review |
| High | Privacy | Support tickets contain personal data — GDPR and CCPA/CPRA obligations likely apply |
| Medium | Data | "Anonymized" tickets may still be re-identifiable (pseudonymized data remains personal data) |
| Unknown | Trademark | Product name not yet cleared — registry and domain searches pending (user to run) |
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
| Terms of Service | Review Required | Check the current version and effective date (user to verify) |
| Data Processing | Verify | Confirm processing regions and whether EU data residency is available on your plan |
| Output Ownership | Clarify | Terms have historically assigned output rights to the customer — verify current wording |
| Rate Limits | Verify | Check your account's usage tier against expected POC volume |
| Data Retention | Action Needed | Confirm API data is excluded from training and whether zero data retention is available to you |

**Action Items**:
- [ ] Confirm output ownership for commercial use
- [ ] Confirm zero data retention eligibility and enable it if available
- [ ] Review the current ToS and DPA (record the version/date reviewed)

### Vercel Hosting

| Aspect | Status | Notes |
|--------|--------|-------|
| Data Residency | Verify | Confirm region configuration for EU customers' data |
| GDPR DPA | Verify | Confirm a DPA is in place |
| SOC 2 | Verify | Request the current SOC 2 Type II report (an attestation, not a certification) |

### Sentry Error Tracking

| Aspect | Status | Notes |
|--------|--------|-------|
| PII in error payloads | Action Needed | Chat messages can leak into error events — configure data scrubbing |
| GDPR DPA | Verify | Confirm a DPA is in place and note processing region |

---

## 3. Data & Content Rights

### Data Source Review

| Data Source | Ownership | PII Risk | Action |
|-------------|-----------|----------|--------|
| Internal FAQ database | Owned | Low | OK to use |
| Customer support tickets (stated as anonymized) | Owned — confirm customer contracts permit this use | High | Verify anonymization is irreversible; otherwise treat as personal data |
| Product documentation | Owned | None | OK to use |

### Privacy Checklist
- [ ] Implement PII detection before sending to LLM
- [ ] Add privacy notice for chatbot users
- [ ] Create the GDPR Art. 30 record of processing and complete DPIA screening — required before processing starts, not after launch
- [ ] Establish data retention policy (e.g. 30 days, est.)

---

## 4. Intellectual Property

### Trademark Clearance (not yet performed — user to verify)

"AI Support Chatbot" is descriptive and unlikely to be registrable; choose a distinctive name before launch.

- [ ] Search the USPTO Trademark Search system and EUIPO eSearch for the candidate name in Classes 9 and 42
- [ ] Check name similarity against similar products (e.g. Intercom, Zendesk Answer Bot, Drift)
- [ ] Check domain and social handle availability
- [ ] Have counsel review any close matches

### Copyright Considerations
- [ ] Confirm FAQ content is original/owned (stated as internal)
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
- [ ] CCPA/CPRA: Likely applicable if the business meets a threshold — since 2023, B2B contact data and employee data are in scope, and support tickets contain personal information of business users. Verify thresholds with counsel.
- [x] CAN-SPAM: N/A (no email marketing)
- [ ] Section 230: Review liability for AI outputs

### EU Requirements
- [ ] GDPR: Privacy notice, DPAs with OpenAI, Vercel, and Sentry, Art. 30 record of processing, DPIA screening, and transfer mechanism for any non-EU processing
- [ ] AI Act: Likely limited-risk (transparency) — users must be told they are interacting with AI. Verify the application date; proposals such as the Digital Omnibus may shift timelines
- [ ] Document AI system per EU AI Act requirements

---

## 7. Action Items Summary

### Blockers (Must resolve before any launch)
- [ ] Implement PII redaction for customer ticket data
- [ ] GDPR Art. 30 record of processing, DPIA screening, and executed DPAs with all processors

### Pre-Launch (Before GA)
- [ ] Trademark and domain clearance for the final product name
- [ ] OpenAI ToS review with legal counsel
- [ ] Create LICENSES.md attribution file
- [ ] Add AI disclosure to UI
- [ ] Privacy notice for chatbot users
- [ ] Configure zero data retention with OpenAI

### Post-Launch (Within 90 days)
- [ ] Keep the record of processing current as features change
- [ ] EU AI Act system documentation once application dates are confirmed
- [ ] Full legal review of AI output liability

### Legal Review Needed
- [ ] OpenAI output ownership for commercial product
- [ ] Liability framework for AI errors/hallucinations
- [ ] Customer contract updates for AI features

### Verification Steps for You
- [ ] Trademark registry and domain searches (not performed here)
- [ ] Current OpenAI, Vercel, and Sentry terms, DPAs, and data-residency options
- [ ] CCPA/CPRA applicability thresholds
- [ ] Current EU AI Act application dates
