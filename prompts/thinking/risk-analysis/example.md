# Risk & Mitigation Analysis: AI-based Chatbot (Public Beta)

## Risk Register

| Category | Risk | Likelihood | Impact | Mitigation | Early Warning Signal | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Technical | Hallucinated answers damage trust | High | High | RAG with curated sources; response confidence labels | Spike in negative CSAT on bot sessions | Engineering + Support |
| Technical | Latency exceeds 5s during peak | Medium | High | Response streaming, caching FAQs | 95th percentile latency >5s | Engineering |
| Market | Users avoid bot for complex issues | Medium | Medium | Easy “Escalate to human” path after 2 failed turns | Low engagement rate on bot widget | Support |
| Operational | Support team not trained on handoff | Medium | Medium | Training + playbooks + escalation SLAs | Increased ticket resolution time | Support |
| Legal | PII leakage into model prompts | Medium | High | PII redaction + updated data processing terms | Privacy complaints or DSR requests | Legal |

## Top Focus Risks
1. **Hallucinated answers**: Launch with a limited knowledge base and require source citations for every answer.
2. **Latency spikes**: Set SLOs and add a fallback to static FAQ responses.
3. **PII leakage**: Implement pre-processing and audit logs for prompt content.
