```markdown
# UX Review: AI Support Chatbot POC

## Executive Summary

UX review of the AI Support Chatbot POC identified 5 friction points, with 2 critical issues: the escalation button is hidden on mobile (blocking the 80% resolution target) and a 3-second typing delay creates perceived slowness. Three quick wins (AI badge, suggested questions, sticky escalation button) can be shipped in hours with high impact. Recommend fixing these before the next round of user testing.

## Product Context
- **Product**: AI Support Chatbot
- **Persona**: Customer seeking quick answers to billing/shipping questions
- **Success Metric**: 80% of queries resolved without human escalation

## POC Notes
Chat widget with streaming responses, FAQ-based answers, and escalate-to-human button.

---

## 1. Friction Audit

| # | Friction Point | Severity | Persona Impact |
|---|----------------|----------|----------------|
| 1 | No indication bot is AI-powered until response | Medium | Users surprised by AI, may distrust |
| 2 | Typing indicator shows for full 3s before streaming starts | High | Feels slow, users may abandon |
| 3 | "Escalate to human" button hidden below fold on mobile | High | Users can't find help when bot fails |
| 4 | No suggested questions or prompts for new users | Medium | Cold start problem, users unsure what to ask |
| 5 | Error messages show technical jargon ("API timeout") | Medium | Confusing, doesn't suggest retry |

---

## 2. Requirements Validation

| PRD User Story | UX Status | Gap |
|----------------|-----------|-----|
| "User can ask a question and get instant answer" | Partial | Streaming helps but 3s delay feels slow |
| "User can escalate to human if unsatisfied" | Gap | Button not visible on mobile |
| "User knows they're talking to AI" | Gap | No AI indicator shown upfront |
| "User can see conversation history" | OK | History maintained in session |

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
Replace "API timeout" with "I'm having trouble thinking. Try again?"
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
```
