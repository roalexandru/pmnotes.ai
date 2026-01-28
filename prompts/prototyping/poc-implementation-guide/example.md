```markdown
# POC Implementation Guide: AI Support Chatbot

## 1. POC Scope Definition

### In Scope (Must Build)
- Chat interface with message input and response display
- LLM integration for generating responses
- FAQ knowledge base lookup (3 categories only)
- Basic conversation history within session

### Out of Scope (Skip for POC)
- User authentication
- Conversation persistence across sessions
- Analytics dashboard
- Multi-language support
- Mobile responsiveness
- Admin panel for FAQ management

### Shortcuts Allowed
| Area | Shortcut | Rationale |
|------|----------|-----------|
| Data | Hardcoded FAQ JSON file | Avoid DB setup; 50 FAQs sufficient for demo |
| Auth | No auth; single test user | Focus on core chatbot functionality |
| UI | Use shadcn/ui components | Looks polished without custom design |
| Error handling | Console logs + generic error message | Demo path won't hit edge cases |
| Deployment | Local + ngrok for stakeholder demo | Skip CI/CD entirely |

## 2. Technical Decisions

| Component | Decision | Rationale |
|-----------|----------|-----------|
| Frontend | Next.js + shadcn/ui | Fast setup, good defaults, team knows React |
| Backend | Next.js API routes | No separate server needed |
| LLM | OpenAI API (gpt-4o-mini) | Fast, cheap, good enough for POC |
| Vector DB | None - keyword search | RAG adds complexity; simple search validates core UX |
| Data | JSON file with FAQs | Zero setup, easy to edit |
| Hosting | Vercel (free tier) | One-click deploy from GitHub |

## 3. Implementation Phases

### Phase 1: Foundation (Day 1) - 8 hours

**End of Day Checkpoint**: Can send a message and get a hardcoded response back.

- [ ] Initialize Next.js project with TypeScript
- [ ] Install and configure shadcn/ui
- [ ] Create basic chat UI layout (input + message list)
- [ ] Set up OpenAI API integration
- [ ] Create FAQ JSON file with 10 sample entries
- [ ] Basic API route that echoes input

### Phase 2: Core Functionality (Day 2-3) - 16 hours

**End of Day 2 Checkpoint**: LLM responds based on FAQ context.
**End of Day 3 Checkpoint**: Happy path fully working with 50 FAQs.

- [ ] Implement FAQ search (keyword matching)
- [ ] Build prompt template with FAQ context injection
- [ ] Add streaming response display
- [ ] Implement conversation history (in-memory)
- [ ] Add "I don't know" fallback when no FAQ match
- [ ] Expand FAQ dataset to 50 entries across 3 categories
- [ ] Add loading states and typing indicator

### Phase 3: Polish & Demo-Ready (Day 4-5) - 12 hours

**End of Day 4 Checkpoint**: Demo script runs smoothly.
**End of Day 5 Checkpoint**: Deployed and shareable.

- [ ] UX polish: better message styling, timestamps
- [ ] Add category hints in UI ("Try asking about billing, shipping, or returns")
- [ ] Handle API errors gracefully (show friendly message)
- [ ] Create demo script with 5 key scenarios
- [ ] Deploy to Vercel
- [ ] Test with 2-3 internal users
- [ ] Prepare stakeholder talking points

## 4. Task Breakdown

| Task | Effort | Owner | Dependencies | Acceptance Criteria |
|------|--------|-------|--------------|---------------------|
| Project setup | 1h | FE Dev | None | Next.js running locally |
| Chat UI shell | 2h | FE Dev | Project setup | Input + message list renders |
| OpenAI integration | 2h | BE Dev | Project setup | API key works, test call succeeds |
| FAQ data file | 1h | PM | None | 10 FAQs in JSON format |
| API route | 2h | BE Dev | OpenAI integration | POST /api/chat returns response |
| FAQ search | 3h | BE Dev | FAQ data file | Returns top 3 matches |
| Prompt engineering | 2h | BE Dev | FAQ search | LLM uses FAQ context |
| Streaming UI | 3h | FE Dev | API route | Responses stream in real-time |
| Conversation memory | 2h | BE Dev | API route | Context maintained in session |
| Expand FAQs | 2h | PM | FAQ search working | 50 FAQs, 3 categories |
| Error handling | 2h | FE Dev | All above | Graceful degradation |
| UI polish | 4h | FE Dev | All above | Looks professional |
| Deployment | 1h | FE Dev | All above | Live on Vercel |
| Demo prep | 2h | PM | Deployment | Script + talking points |

**Total: ~29 hours across 5 days**

## 5. Risk Mitigation

| Risk | Likelihood | Fallback Plan |
|------|------------|---------------|
| OpenAI API rate limits | Low | Use gpt-4o-mini; implement basic caching |
| LLM responses too slow | Medium | Add streaming; show typing indicator |
| FAQ search returns bad matches | Medium | Increase context window; add "rephrase" prompt |
| Designer unavailable | Medium | Use shadcn defaults; skip custom styling |
| Stakeholder wants more features | High | Document "post-POC" backlog; stay firm on scope |

### Daily Checkpoints

| Day | Must Be Working |
|-----|-----------------|
| 1 | Message send/receive loop (hardcoded response OK) |
| 2 | LLM generates responses using FAQ context |
| 3 | Happy path smooth; 50 FAQs loaded |
| 4 | Demo script runs without errors |
| 5 | Deployed; stakeholder demo ready |

## 6. Demo Preparation

### Demo Scenarios

1. **Happy Path**: "How do I return an item?" → Clear, accurate answer with policy details
2. **Follow-up**: "What if I lost the receipt?" → Maintains context from previous question
3. **Out of Scope**: "What's your CEO's phone number?" → Graceful "I can help with billing, shipping, or returns"
4. **Edge Case**: Typo in query → Still finds relevant FAQ
5. **Speed Demo**: Show response streaming in real-time

### Demo Setup Needed
- [ ] Clear browser cache before demo
- [ ] Pre-load 3 conversation examples
- [ ] Have FAQ JSON open to show data source
- [ ] Ngrok URL for remote stakeholders

### Known Limitations to Disclose
- No auth - anyone with link can access
- Conversation history lost on refresh
- Only 50 FAQs in 3 categories
- English only

### Stakeholder Talking Points
- "This validates that LLM + simple search can handle 80% of support queries"
- "Full build would add auth, persistence, and admin tools"
- "Next step: pilot with 5 real support agents for 1 week"
```
