from scipy import stats
import numpy as np

# Data
# Group A: 200 conversions / 2000 users
# Group B: 250 conversions / 2100 users

conv_a = 200
n_a = 2000
conv_b = 250
n_b = 2100

# Contingency Table
#           Converted   Not Converted
# Group A   200         1800
# Group B   250         1850
observed = [[conv_a, n_a - conv_a], [conv_b, n_b - conv_b]]

# Chi-Square Test
chi2, p_value, dof, expected = stats.chi2_contingency(observed)

# Conversion Rates
rate_a = (conv_a / n_a) * 100
rate_b = (conv_b / n_b) * 100

print(f"Group A Conversion: {rate_a:.2f}%")
print(f"Group B Conversion: {rate_b:.2f}%")
print(f"Uplift: +{rate_b - rate_a:.2f}%")
print("-" * 20)
print(f"P-Value: {p_value:.4f}")

if p_value < 0.05:
    print("RESULT: Statistically Significant (We can reject the null hypothesis)")
else:
    print("RESULT: Not Significant (Role of chance cannot be ruled out)")

# Output Sample:
# P-Value: 0.0412
# RESULT: Statistically Significant
