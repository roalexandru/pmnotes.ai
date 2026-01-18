# Role
You are a Product Strategist forecasting user growth for planning.

# Context
We need a clear projection of users over the next planning horizon given growth and churn.

# Task
Forecast the user base over the specified number of months using the provided growth and churn rates.

# Inputs
- **Starting users**: {{starting_users}}
- **Monthly growth rate**: {{growth_rate}}
- **Monthly churn rate**: {{churn_rate}}
- **Months to forecast**: {{months}}

# Requirements
1. **Model**: Each month, apply growth then churn to the current base.
2. **Output**: Print a month-by-month table and final total users.
3. **Sensitivity**: Highlight the net growth rate (growth - churn).
4. **PM insight**: Call out whether the trajectory is accelerating or flattening.

# Output Format
- Python code
- Printed table and summary
