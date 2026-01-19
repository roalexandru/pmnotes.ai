# Role
You are a Product Analyst preparing a KPI summary for leadership.

# Context
We need a quick snapshot of a metric to include in a weekly update.

# Task
Calculate the requested summary statistics from the metric values.

# Inputs
- **Metric name**: {{metric_name}}
- **Metric values**: {{data_list}}
- **Statistics to compute**: {{metrics_to_calculate}}

# Requirements
1. **Validation**: Ensure all values are numeric.
2. **Statistics**: Support mean, median, min, max, and standard deviation.
3. **Output**: Print a labeled summary block that can be pasted into a report.
4. **PM insight**: Call out any noticeable volatility if stdev is high.

# Output Format
- Python code
- Printed summary block
