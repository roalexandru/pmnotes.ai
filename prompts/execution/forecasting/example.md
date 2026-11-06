```python
starting_users = 1000
growth_rate = 0.08
churn_rate = 0.05
months = 12

users = starting_users
net_rate = (1 + growth_rate) * (1 - churn_rate) - 1  # growth and churn compound

print("Month | Users")
print("------|------")
for month in range(1, months + 1):
    users = users * (1 + growth_rate)
    users = users * (1 - churn_rate)
    print(f"{month:>5} | {users:,.0f}")

print(f"\nNet monthly growth rate: {net_rate:.2%}")
print(f"Final users after {months} months: {users:,.0f}")
print("Insight: Positive net rate indicates compounding growth, but churn slows acceleration.")
```

Sample output:

```text
Month | Users
------|------
    1 | 1,026
    2 | 1,053
    3 | 1,080
    4 | 1,108
    5 | 1,137
    6 | 1,166
    7 | 1,197
    8 | 1,228
    9 | 1,260
   10 | 1,293
   11 | 1,326
   12 | 1,361

Net monthly growth rate: 2.60%
Final users after 12 months: 1,361
Insight: Positive net rate indicates compounding growth, but churn slows acceleration.
```
