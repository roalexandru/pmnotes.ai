```python
import math
from statistics import NormalDist

# Inputs
# Control: 200 conversions / 2000 users
# Variant: 250 conversions / 2100 users
alpha = 0.05
power = 0.80              # planned power for the MDE calculation
planned_split = 0.5       # planned share of traffic in control (50/50 unless stated)

conv_a, n_a = 200, 2000
conv_b, n_b = 250, 2100
rate_a = conv_a / n_a
rate_b = conv_b / n_b
diff = rate_b - rate_a

norm = NormalDist()
z_crit = norm.inv_cdf(1 - alpha / 2)      # two-sided critical value

# 1. Sample-ratio-mismatch (SRM) check: chi-square goodness of fit, 1 df
n_total = n_a + n_b
exp_a, exp_b = n_total * planned_split, n_total * (1 - planned_split)
chi2 = (n_a - exp_a) ** 2 / exp_a + (n_b - exp_b) ** 2 / exp_b
srm_p = math.erfc(math.sqrt(chi2 / 2))    # survival function of chi-square(1)
srm_flag = srm_p < 0.001

# 2. Two-sided, fixed-horizon test
use_fisher = min(conv_a, n_a - conv_a, conv_b, n_b - conv_b) < 5
if use_fisher:
    from scipy import stats  # only needed for small counts
    _, p_value = stats.fisher_exact([[conv_a, n_a - conv_a], [conv_b, n_b - conv_b]])
    test_used = "Fisher's Exact (two-sided)"
    z = None
else:
    pooled = (conv_a + conv_b) / n_total
    se_pooled = math.sqrt(pooled * (1 - pooled) * (1 / n_a + 1 / n_b))
    z = diff / se_pooled
    p_value = 2 * (1 - norm.cdf(abs(z)))
    test_used = "Two-proportion z-test (two-sided, fixed horizon)"

# 3. Confidence interval for the difference (unpooled Wald)
se_diff = math.sqrt(rate_a * (1 - rate_a) / n_a + rate_b * (1 - rate_b) / n_b)
ci_low, ci_high = diff - z_crit * se_diff, diff + z_crit * se_diff

# 4. Minimum detectable effect at the achieved sample sizes
z_power = norm.inv_cdf(power)
mde = (z_crit + z_power) * math.sqrt(rate_a * (1 - rate_a) * (1 / n_a + 1 / n_b))

print(f"Test used: {test_used}")
print(f"SRM check: chi2 = {chi2:.2f}, p = {srm_p:.3f} -> {'MISMATCH, investigate before trusting results' if srm_flag else 'OK'}")
print(f"Control conversion: {rate_a:.3%} ({conv_a}/{n_a})")
print(f"Variant conversion: {rate_b:.3%} ({conv_b}/{n_b})")
print(f"Absolute lift: {diff * 100:.2f} pp ({1 - alpha:.0%} CI: {ci_low * 100:+.3f} to {ci_high * 100:+.3f} pp)")
print(f"Relative lift: {diff / rate_a:.2%}")
if z is not None:
    print(f"z = {z:.3f}")
print(f"P-value: {p_value:.4f}")
print(f"MDE at {power:.0%} power: {mde * 100:.2f} pp ({mde / rate_a:.1%} relative)")

if srm_flag:
    print("Decision: Do not interpret — fix the traffic split first.")
elif p_value < alpha:
    print("Decision: Significant at the planned sample size — evidence the variant changes conversion.")
else:
    print("Decision: Not significant at the planned sample size; do not extend the test ad hoc — "
          "decide based on the pre-registered MDE.")
```

Sample output (from running the script above):

```text
Test used: Two-proportion z-test (two-sided, fixed horizon)
SRM check: chi2 = 2.44, p = 0.118 -> OK
Control conversion: 10.000% (200/2000)
Variant conversion: 11.905% (250/2100)
Absolute lift: 1.90 pp (95% CI: -0.005 to +3.815 pp)
Relative lift: 19.05%
z = 1.950
P-value: 0.0511
MDE at 80% power: 2.63 pp (26.3% relative)
Decision: Not significant at the planned sample size; do not extend the test ad hoc — decide based on the pre-registered MDE.
```
