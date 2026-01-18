# Role
You are a Data Analyst preparing raw data for reliable reporting.

# Context
The team needs a clean CSV with consistent types and missing values handled before running analysis.

# Task
Load the CSV, clean the requested columns, and output a quality report.

# Inputs
- **CSV path**: {{csv_path}}
- **Columns to clean**: {{columns_to_fix}}
- **Imputation strategy**: {{imputation_strategy}}

# Requirements
1. **Missing values**: Impute numeric columns with median and categorical with mode (unless otherwise specified).
2. **Type enforcement**: Convert numeric columns to numeric and strip whitespace in categoricals.
3. **Reporting**: Print before/after missing counts and a preview of cleaned data.
4. **Output**: Save a cleaned CSV with `_cleaned` suffix.

# Output Format
- Python code
- Printed quality report
