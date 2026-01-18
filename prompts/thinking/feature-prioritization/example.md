# Feature Prioritization: TaskFlow Activation Push

## Framework Choice
I will use **RICE** because the objective is activation growth and we need a balanced view of reach, impact, confidence, and effort within a 6-week window.

## Scoring Table

| Rank | Feature | Reach (1-10) | Impact (1-3) | Confidence (0-100%) | Effort (1-5) | RICE Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Social login | 9 | 2 | 90% | 1 | 1620 |
| 2 | In-app checklist onboarding | 8 | 2 | 85% | 2 | 680 |
| 3 | Dark mode | 7 | 1 | 80% | 2 | 280 |
| 4 | Offline support | 4 | 2 | 60% | 4 | 120 |
| 5 | Export to PDF | 3 | 1 | 70% | 3 | 70 |

## Ranked Recommendations
1. **Social login**: Removes friction at sign-up and affects nearly every new user, delivering immediate activation lift.
2. **In-app checklist onboarding**: Guides users to the “first value moment” and can be shipped incrementally.
3. **Dark mode**: Popular request but limited activation impact; low risk and aligns with design system.
4. **Offline support**: Valuable but high effort relative to activation gains in the short term.
5. **Export to PDF**: Lowest reach and primarily a reporting feature for power users.

## Quick-Win & Big-Bet
* **Quick-Win**: Social login (low effort, high reach).
* **Big-Bet**: Offline support (high effort, potential long-term retention impact).

## Risks & Dependencies
* Social login depends on Auth0 configuration and compliance review.
* Offline support requires data model changes and sync conflict resolution.
