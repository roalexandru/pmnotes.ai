# UX Review: AI Support Chatbot POC

## Executive Summary

This review is based on the flow description and POC notes only; the prototype itself was not observed, so the friction points below are hypotheses to verify in a 30-minute walkthrough. The two highest-risk areas for the 80% self-resolution target are escalation discoverability on mobile (a stated constraint) and time-to-first-response. Three quick wins (AI badge, suggested questions, sticky escalation button) fit the 3-day POC timeline. Recommend verifying the top risks before the next round of user testing.

## Product Context
- **Product**: AI Support Chatbot
- **Persona**: Customer seeking quick answers to billing/shipping questions
- **Success Metric**: 80% of queries resolved without human escalation

## POC Notes
Chat widget with streaming responses, FAQ search, and escalate button. (No PRD reference was provided.)

---

## 1. Friction Audit

| # | Likely Friction Point (verify) | Severity | Persona Impact | Evidence |
|---|----------------|----------|----------------|----------|
| 1 | Users may not know the bot is AI-powered before the first answer | Medium | Users surprised by AI, may distrust | Not in notes; check widget header |
| 2 | Delay before streaming starts may feel slow | High | Users may abandon | Streaming is noted; [DATA NEEDED: time to first token] |
| 3 | Escalate button may be hard to find on small screens | High | Users can't find help when bot fails | Mobile is a stated constraint; check placement at 375px |
| 4 | No suggested questions or prompts are mentioned for new users | Medium | Cold start, users unsure what to ask | Absent from notes |
| 5 | Error states are not described | Medium | Failures may be confusing, with no retry path | [DATA NEEDED: actual error copy] |

---

## 2. Requirements Validation

No PRD was provided, so this checks the flow against the stated success metric and constraints only. [DATA NEEDED: PRD user stories for a full requirements check]

| Stated Requirement | UX Status | Gap |
|----------------|-----------|-----|
| 80% of queries resolved without human escalation | Unknown | Needs a way to measure resolution (e.g., feedback after each answer) |
| Must work on mobile | Verify | Escalate button placement and widget sizing at mobile widths not described |
| User can escalate to a human (from flow description) | Partial | Button exists; discoverability and handoff experience not described |

---

## 3. Recommendations

### 3.1 Add "AI-Powered" Badge + Suggested Questions
Show upfront that this is AI, with 3 clickable suggested questions.
- **Rationale**: Sets expectations, reduces cold start friction
- **Impact**: High | **Effort**: Low

### 3.2 Reduce Perceived Latency
Show typing indicator immediately, start streaming after 500ms even if partial.
- **Rationale**: Perceived speed matters more than actual speed
- **Impact**: High | **Effort**: Medium

### 3.3 Make Escalation Sticky on Mobile
Pin "Talk to human" button at bottom of chat on mobile viewports.
- **Rationale**: Critical escape hatch must always be visible
- **Impact**: High | **Effort**: Low

### 3.4 Friendly Error Messages
Make sure error states use plain language with a retry, e.g., "I'm having trouble answering right now. Try again?"
- **Rationale**: Human-friendly errors maintain trust
- **Impact**: Medium | **Effort**: Low

### 3.5 Add Feedback Thumbs
Add thumbs up/down after each AI response.
- **Rationale**: Captures satisfaction data, gives users agency
- **Impact**: Medium | **Effort**: Medium

---

## 4. Prioritized Action Table

| Change | Impact | Effort | Priority | Notes |
|--------|--------|--------|----------|-------|
| Sticky escalation button | High | Low | P0 | Critical for mobile users |
| AI badge + suggested questions | High | Low | P0 | Quick win, big UX lift |
| Reduce perceived latency | High | Medium | P1 | Needs backend coordination |
| Friendly error messages | Medium | Low | P1 | Copy change only |
| Feedback thumbs | Medium | Medium | P2 | Good for post-POC iteration |

---

## 5. Acceptance Criteria (Top 3 — Given/When/Then)

### Sticky Escalation Button
- **Given** a user is on a mobile viewport (375px), **When** the chat widget is open, **Then** the "Talk to human" button is visible without scrolling.
- **Given** a user scrolls through a long conversation, **When** they reach the bottom, **Then** the escalation button remains fixed at the bottom of the viewport.
- **Given** a user taps "Talk to human", **When** the escalation flow starts, **Then** the user sees a confirmation message and estimated wait time.

### AI Badge + Suggested Questions
- **Given** a new user opens the chat widget for the first time, **When** the widget loads, **Then** a "Powered by AI" badge is visible in the header and 3 suggested questions are displayed.
- **Given** suggested questions are shown, **When** the user clicks one, **Then** the question is sent as a message and the AI begins responding.
- **Given** the user has already sent a message, **When** they return to the chat, **Then** suggested questions are no longer shown (replaced by conversation history).

### Reduce Perceived Latency
- **Given** a user sends a message, **When** the AI is processing, **Then** a typing indicator appears within 200ms.
- **Given** the AI response takes >500ms, **When** partial content is available, **Then** streaming begins and the user sees text appearing progressively.
- **Given** the AI fails to respond within 10 seconds, **When** the timeout occurs, **Then** a friendly error message is shown with a "Try again" button.

---

## 6. Quick Wins vs. Post-POC

### Quick Wins (fix in hours)
- Add AI badge to chat header
- Add 3 hardcoded suggested questions
- Pin escalation button on mobile CSS
- Update error message copy

### Pre-Launch (before GA)
- Implement streaming latency optimization
- A/B test suggested question variants
- Add loading skeleton instead of spinner

### Post-Launch (iterate later)
- Feedback thumbs with analytics
- Smart suggested questions based on context
- Conversation satisfaction survey
