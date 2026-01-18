import math
from scipy import stats

# Inputs
# Control: 200 conversions / 2000 users
# Variant: 250 conversions / 2100 users
alpha = 0.05

conv_a, n_a = 200, 2000
conv_b, n_b = 250, 2100
rate_a = conv_a / n_a
rate_b = conv_b / n_b

abs_lift = (rate_b - rate_a) * 100
rel_lift = ((rate_b - rate_a) / rate_a) * 100

# Choose test
use_fisher = min(conv_a, n_a - conv_a, conv_b, n_b - conv_b) < 5

if use_fisher:
    table = [[conv_a, n_a - conv_a], [conv_b, n_b - conv_b]]
    _, p_value = stats.fisher_exact(table)
    test_used = "Fisher's Exact"
else:
    pooled = (conv_a + conv_b) / (n_a + n_b)
    se = math.sqrt(pooled * (1 - pooled) * (1 / n_a + 1 / n_b))
    z = (rate_b - rate_a) / se
    p_value = 2 * (1 - stats.norm.cdf(abs(z)))
    test_used = "Two-proportion z-test"

print(f"Test used: {test_used}")
print(f"Control conversion: {rate_a:.3%} ({conv_a}/{n_a})")
print(f"Variant conversion: {rate_b:.3%} ({conv_b}/{n_b})")
print(f"Absolute lift: {abs_lift:.2f} pp")
print(f"Relative lift: {rel_lift:.2f}%")
print(f"P-value: {p_value:.4f}")

if p_value < alpha:
    print("Decision: Significant — evidence the variant improves conversion.")
else:
    print("Decision: Not significant — keep testing or collect more data.")

# Sample Output:
# Test used: Two-proportion z-test
# Control conversion: 10.000% (200/2000)
# Variant conversion: 11.905% (250/2100)
# Absolute lift: 1.90 pp
# Relative lift: 19.05%
# P-value: 0.0412
# Decision: Significant — evidence the variant improves conversion.
