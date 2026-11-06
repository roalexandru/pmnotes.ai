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

# Ground Rules
- Do not invent APIs, library functions, or results; if unsure of an API, say so.
- Where you must estimate, mark it `(est.)` and state the assumption.
- Where required information is missing, write `[DATA NEEDED: <what>]` instead of guessing, and list open questions at the end.
- Quotes must be verbatim from the inputs. Market, competitor, pricing, and regulatory facts may be outdated: flag them for verification.
- If you can execute code, run it and report the real output. If you cannot, do not invent results: label any sample output `# ILLUSTRATIVE — run locally to get real numbers`.

# Output Format
Python script.
