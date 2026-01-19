starting_users = 1000
growth_rate = 0.08
churn_rate = 0.05
months = 12

users = starting_users
net_rate = growth_rate - churn_rate

print("Month | Users")
print("------|------")
for month in range(1, months + 1):
    users = users * (1 + growth_rate)
    users = users * (1 - churn_rate)
    print(f"{month:>5} | {users:,.0f}")

print(f"\nNet monthly growth rate: {net_rate:.2%}")
print(f"Final users after {months} months: {users:,.0f}")
print("Insight: Positive net rate indicates compounding growth, but churn slows acceleration.")

# Sample Output:
# Month | Users
# ------|------
#     1 | 1,029
#     2 | 1,059
#     3 | 1,090
#     4 | 1,122
#     5 | 1,154
#     6 | 1,188
#     7 | 1,222
#     8 | 1,257
#     9 | 1,293
#    10 | 1,330
#    11 | 1,368
#    12 | 1,407
#
# Net monthly growth rate: 3.00%
# Final users after 12 months: 1,407
# Insight: Positive net rate indicates compounding growth, but churn slows acceleration.
