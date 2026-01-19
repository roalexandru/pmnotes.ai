# Role
You are a Data Scientist supporting product experimentation decisions.

# Context
We need to determine whether a new variant materially improved conversion relative to the control.

# Task
Using the inputs below, calculate conversion rates, absolute/relative uplift, and test statistical significance.

# Inputs
- **Control data**: {{group_a_data}}
- **Variant data**: {{group_b_data}}
- **Significance threshold (alpha)**: {{alpha}}

# Requirements
1. **Test selection**: Use a two-proportion z-test when counts are large enough; otherwise fall back to Fisher's Exact Test.
2. **Effect size**: Report absolute lift (pp) and relative lift (%).
3. **Interpretation**: State whether the result is significant at the given alpha and what that means for a PM decision.
4. **Reproducibility**: Print intermediate values (conversion rates, sample sizes, test used).

# Output Format
- Python code
- Printed results with a short interpretation block
