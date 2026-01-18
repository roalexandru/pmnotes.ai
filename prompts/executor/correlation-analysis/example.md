import numpy as np

# Data
daily_signups = [50, 60, 55, 70, 65]
ad_spend = [200, 240, 220, 300, 270]

# Calculate Correlation Matrix
correlation_matrix = np.corrcoef(daily_signups, ad_spend)
correlation_coefficient = correlation_matrix[0, 1]

print(f"Daily Signups: {daily_signups}")
print(f"Ad Spend ($):  {ad_spend}")
print("-" * 30)
print(f"Correlation Coefficient (r): {correlation_coefficient:.4f}")

# Interpretation
if correlation_coefficient > 0.7:
    print("Interpretation: Strong Positive Correlation")
    print("-> Higher ad spend is strongly associated with more signups.")
elif correlation_coefficient > 0.3:
    print("Interpretation: Moderate Positive Correlation")
else:
    print("Interpretation: Weak or No Correlation")
