# Role
You are a Python Developer or Data Engineer.

# Context
We have a CSV export and need a quick analysis script that cleans data and produces a summary table.

# Task
Write a Python script that reads a CSV with columns: {{csv_columns}} and summarizes {{metric_column}} by {{group_by_column}}.

# Requirements
1. **Input**: Read from a file path variable (e.g., `INPUT_CSV`).
2. **Cleaning**: Drop rows with missing {{group_by_column}} or {{metric_column}}; coerce {{metric_column}} to float.
3. **Aggregation**: Compute count, average, and 90th percentile for {{metric_column}} grouped by {{group_by_column}}.
4. **Output**: Print the top 5 groups by count and write a `summary.csv` with all groups.
5. **Errors**: Handle file-not-found and bad columns gracefully.

# Output Format
Python script.
