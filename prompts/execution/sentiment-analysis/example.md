## Per-entry classification

```json
[
  {"id": 1, "label": "positive", "confidence": "high", "rationale": "Explicit enthusiasm for the latest release.", "quote": "Love the new update!"},
  {"id": 2, "label": "negative", "confidence": "high", "rationale": "Reports a reproducible crash in a core screen.", "quote": "The app crashes every time I open settings."},
  {"id": 3, "label": "positive", "confidence": "high", "rationale": "Praises support quality and speed.", "quote": "Great customer service, very responsive."},
  {"id": 4, "label": "negative", "confidence": "medium", "rationale": "General usability complaint with no specific feature named.", "quote": "Not intuitive to use at all."},
  {"id": 5, "label": "positive", "confidence": "high", "rationale": "Praises speed and reliability relative to other tools.", "quote": "Fast and reliable, best tool we have used."},
  {"id": 6, "label": "negative", "confidence": "high", "rationale": "Confusing billing UI plus a duplicate charge.", "quote": "I was charged twice"},
  {"id": 7, "label": "negative", "confidence": "high", "rationale": "Core search feature fails on mobile.", "quote": "Search is broken on mobile, never returns results."},
  {"id": 8, "label": "positive", "confidence": "high", "rationale": "Fast, low-friction onboarding.", "quote": "Onboarding was smooth, got started in minutes."}
]
```

## Sentiment distribution (n = 8)

| Label | Count | Share |
|:--|--:|--:|
| Positive | 4 | 50% |
| Negative | 4 | 50% |
| Neutral | 0 | 0% |
| Mixed | 0 | 0% |

## Negative themes

| Theme | Entry ids | Severity note |
|:--|:--|:--|
| Billing errors | 6 | Highest: a duplicate charge costs the customer money and creates refund and churn risk. |
| Stability / broken core flows | 2, 7 | High: a crash in settings and mobile search returning no results block core tasks. |
| Usability | 4 | Medium: real friction, but no specific screen or task named, so follow-up is needed. |

## PM recommendations

1. **Investigate the double charge now (entry 6).** Check payment logs for duplicate transactions, refund affected users, and review the billing page copy that the user called "confusing".
2. **Triage the two reliability bugs (entries 2, 7) for the next sprint.** Reproduce the settings crash and the mobile search failure; both are specific enough to file as bugs today.
3. **Follow up on "Not intuitive" (entry 4) before acting.** The entry names no feature; ask the user or check session recordings for where they got stuck.

Caveat: with only 8 entries, the 50/50 split is not a reliable signal of overall sentiment. Use it to pick issues to investigate, not to report a satisfaction trend.

Open questions:
- [DATA NEEDED: how many users hit the duplicate charge, from billing/payment logs]
- [DATA NEEDED: device and OS for the mobile search failure]
