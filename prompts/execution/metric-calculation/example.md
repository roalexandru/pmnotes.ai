```python
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

if "stddev" in metrics_to_calculate:
    cv = summary["stddev"] / summary["average"]  # coefficient of variation
    if cv > 0.2:
        print(f"Insight: Volatility looks elevated (CV {cv:.1%}); investigate outlier days.")
    else:
        print(f"Insight: Volatility is moderate (CV {cv:.1%}); the series is trending, not spiking.")
```

Sample output:

```text
Metric: daily active users
Average: 157.14
Median: 155.00
Minimum: 120.00
Maximum: 200.00
Stddev: 26.75
Insight: Volatility is moderate (CV 17.0%); the series is trending, not spiking.
```
