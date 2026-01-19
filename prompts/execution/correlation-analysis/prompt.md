# Role
You are a Product Analyst validating whether two metrics move together.

# Context
We want to know if changes in Metric A explain changes in Metric B.

# Task
Compute the correlation between the two lists and interpret the strength and direction.

# Inputs
- **Metric A values**: {{variable_a}}
- **Metric B values**: {{variable_b}}
- **Correlation method**: {{method}} (pearson or spearman)

# Requirements
1. **Validation**: Ensure both lists are numeric and of equal length.
2. **Calculation**: Compute correlation coefficient and p-value.
3. **Interpretation**: Classify strength (weak/moderate/strong) and direction (positive/negative).
4. **PM takeaway**: Note whether the relationship supports a causal hypothesis (with caveats).

# Output Format
- Python code
- Printed coefficient, p-value, and interpretation
