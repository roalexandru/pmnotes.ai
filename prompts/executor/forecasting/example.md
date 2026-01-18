# Simulation Parameters
users = 1000
growth_rate = 0.08  # 8%
churn_rate = 0.05   # 5%

months = 12

print(f"Starting Users: {users}")
print(f"Net Growth Rate: {(growth_rate - churn_rate)*100:.1f}% per month")
print("-" * 30)
print("Month | Users (End of Month)")
print("------|---------------------")

for month in range(1, months + 1):
    # Calculate churn and growth
    churned = users * churn_rate
    new_users = users * growth_rate
    
    # Update total
    users = users - churned + new_users
    
    print(f"{month:5} | {int(users):,}")

# Output Sample
# Starting Users: 1000
# Net Growth Rate: 3.0% per month
# ------------------------------
# Month | Users (End of Month)
# ------|---------------------
#     1 | 1,030
#     2 | 1,060
#     3 | 1,092
# ...
#    12 | 1,425
