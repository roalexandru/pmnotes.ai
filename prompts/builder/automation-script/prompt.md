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

# Output Format
Python script.
