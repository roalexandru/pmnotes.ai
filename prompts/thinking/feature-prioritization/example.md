# Feature Prioritization: RICE Score Analysis

## Framework Choice: RICE
I am using the **RICE** (Reach, Impact, Confidence, Effort) framework because it balances the potential benefit against the development cost, which is crucial for our limited engineering resources.

## Prioritized List

| Rank | Feature | Reach (1-10) | Impact (1-3) | Confidence (100%) | Effort (1-5) | RICE Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1.** | **Social Login** (Google/Apple) | 9 | 2 | 100% | 1 | **1800** |
| **2.** | **Dark Mode** | 10 | 1 | 90% | 2 | **450** |
| **3.** | **Offline Support** | 5 | 3 | 80% | 4 | **300** |
| **4.** | **Export to PDF** | 2 | 2 | 70% | 3 | **93** |

*(Note: Score = (Reach * Impact * Confidence) / Effort)*

## Justification

### Top Priorities
1.  **Social Login**: Low effort (Using Auth0/Firebase) but massive impact on conversion rate. It removes friction for almost every new user.
2.  **Dark Mode**: Highly requested, touches 100% of users, and relatively low complexity if our design system supports tokens.

### Lowest Priority
4.  **Export to PDF**: While useful for a niche group, the reach is low, and rendering PDFs consistently across devices is surprisingly high effort. We should backlog this until we have enterprise customers asking for reporting.
