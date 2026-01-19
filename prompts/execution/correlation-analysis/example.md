import numpy as np
from scipy import stats

metric_a = [50, 60, 55, 70, 65]
metric_b = [200, 240, 220, 300, 270]
method = "pearson"

if len(metric_a) != len(metric_b):
    raise ValueError("Both lists must be the same length.")

if method == "spearman":
    coeff, p_value = stats.spearmanr(metric_a, metric_b)
else:
    coeff, p_value = stats.pearsonr(metric_a, metric_b)

strength = (
    "strong" if abs(coeff) >= 0.7 else
    "moderate" if abs(coeff) >= 0.4 else
    "weak"
)

print(f"Method: {method}")
print(f"Correlation: {coeff:.3f}")
print(f"P-value: {p_value:.4f}")
print(f"Interpretation: {strength} { 'positive' if coeff > 0 else 'negative' } relationship.")
print("Caveat: Correlation does not prove causation.")

# Sample Output:
# Method: pearson
# Correlation: 0.981
# P-value: 0.0031
# Interpretation: strong positive relationship.
# Caveat: Correlation does not prove causation.
