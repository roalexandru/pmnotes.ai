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

# Ground Rules

- Use only the data provided above. Do not invent data, APIs, library functions, or results; if unsure of an API, say so.
- Where you must estimate, mark it `(est.)` and state the assumption.
- Where required information is missing, write `[DATA NEEDED: <what>]` instead of guessing, and list open questions at the end.
- Quotes must be verbatim from the inputs. Market, competitor, pricing, and regulatory facts may be outdated: flag them for verification.
- If you can execute code, run it and report the real output. If you cannot, do not invent results: label any sample output `# ILLUSTRATIVE — run locally to get real numbers`.

# Output Format
- Python code
- Printed table + summary lines
