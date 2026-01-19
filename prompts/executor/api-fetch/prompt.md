# Role
You are a Product Data Analyst validating third-party API data for a product demo.

# Context
We need to confirm the API responds reliably and contains the fields required for a prototype.

# Task
Fetch data from the API and return a concise summary of the first {{record_limit}} records with the requested fields.

# Inputs
- **API URL**: {{api_url}}
- **Query params**: {{query_params}}
- **Fields to extract**: {{fields_to_extract}}
- **Record limit**: {{record_limit}}

# Requirements
1. **Request**: Use `requests` with timeout and basic error handling.
2. **Validation**: Confirm the response is a list of objects and that requested fields exist.
3. **Output**: Print a tidy table of the extracted fields and a short summary (record count, missing fields).
4. **PM value**: Note whether the API data is sufficient for the intended demo.

# Output Format
- Python code
- Printed table + summary lines
