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

# Ground Rules

- Use only the data provided above. Do not invent data, APIs, library functions, or results; if unsure of an API, say so.
- Where you must estimate, mark it `(est.)` and state the assumption.
- Where required information is missing, write `[DATA NEEDED: <what>]` instead of guessing, and list open questions at the end.
- Quotes must be verbatim from the inputs. Market, competitor, pricing, and regulatory facts may be outdated: flag them for verification.
- If you can execute code, run it and report the real output. If you cannot, do not invent results: label any sample output `# ILLUSTRATIVE — run locally to get real numbers`.

# Output Format
- Python code
- Printed coefficient, p-value, and interpretation
