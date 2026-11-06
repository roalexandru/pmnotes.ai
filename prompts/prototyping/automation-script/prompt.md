# Role
You are a Python Developer focused on automation.

# Context
We want a lightweight reminder script that can be run daily (cron/GitHub Actions) to alert owners about tasks due soon.

# Task
Create a Python script that scans {{task_source}} and prints reminders for tasks due within the next {{lead_time_hours}} hours in the {{timezone}} timezone.

# Requirements
1. **Input**: Accept a list of dictionaries and include a small sample dataset in the script.
2. **Time Handling**: Parse ISO dates, localize to the provided timezone, and compare against "now".
3. **Output**: Print a concise reminder line per task (include task name, owner, and due date).
4. **Extensibility**: Isolate a `send_reminder()` function as a placeholder for email/Slack integration.
5. **Summary**: Print a total count of reminders sent.

# Ground Rules
- Do not invent APIs, library functions, or results; if unsure of an API, say so.
- Where you must estimate, mark it `(est.)` and state the assumption.
- Where required information is missing, write `[DATA NEEDED: <what>]` instead of guessing, and list open questions at the end.
- Quotes must be verbatim from the inputs. Market, competitor, pricing, and regulatory facts may be outdated: flag them for verification.
- If you can execute code, run it and report the real output. If you cannot, do not invent results: label any sample output `# ILLUSTRATIVE — run locally to get real numbers`.

# Output Format
Python script.
