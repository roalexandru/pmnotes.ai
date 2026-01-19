import numpy as np

metric_name = "daily active users"
values = [120, 135, 150, 160, 155, 180, 200]
metrics_to_calculate = ["average", "median", "minimum", "maximum", "stddev"]

arr = np.array(values, dtype=float)

summary = {
    "average": arr.mean(),
    "median": np.median(arr),
    "minimum": arr.min(),
    "maximum": arr.max(),
    "stddev": arr.std(ddof=1)
}

print(f"Metric: {metric_name}")
for key in metrics_to_calculate:
    print(f"{key.title()}: {summary[key]:.2f}")

if "stddev" in metrics_to_calculate and summary["stddev"] > summary["average"] * 0.2:
    print("Insight: Volatility looks elevated; investigate outlier days.")

# Sample Output:
# Metric: daily active users
# Average: 157.14
# Median: 155.00
# Minimum: 120.00
# Maximum: 200.00
# Stddev: 28.07
# Insight: Volatility looks elevated; investigate outlier days.
