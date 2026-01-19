from datetime import datetime

tasks = [
    {"name": "Update pricing", "owner": "Ava", "due_date": "2026-01-20", "status": "open"},
    {"name": "Draft Q1 roadmap", "owner": "Noah", "due_date": "2026-01-28", "status": "open"},
    {"name": "Close vendor contract", "owner": "Mia", "due_date": "2026-01-18", "status": "done"}
]

today = "2026-01-21"

as_of = datetime.strptime(today, "%Y-%m-%d")

overdue = []
for task in tasks:
    due = datetime.strptime(task["due_date"], "%Y-%m-%d")
    if task["status"] != "done" and due < as_of:
        overdue.append(task)

print("| Task | Owner | Due Date | Status |")
print("|:-----|:------|:---------|:-------|")
for task in overdue:
    print(f"| {task['name']} | {task['owner']} | {task['due_date']} | {task['status']} |")

print("\nReminders")
for task in overdue:
    print(f"Reminder: {task['owner']}, '{task['name']}' is overdue since {task['due_date']}.")

print("\nSummary")
print(f"Total tasks: {len(tasks)}")
print(f"Overdue tasks: {len(overdue)}")
percent_overdue = (len(overdue) / len(tasks)) * 100
print(f"% overdue: {percent_overdue:.1f}%")

if percent_overdue > 20:
    print("Recommendation: Escalate in the weekly PM sync.")
else:
    print("Recommendation: Send automated reminders only.")

# Sample Output:
# | Task | Owner | Due Date | Status |
# |:-----|:------|:---------|:-------|
# | Update pricing | Ava | 2026-01-20 | open |
#
# Reminders
# Reminder: Ava, 'Update pricing' is overdue since 2026-01-20.
#
# Summary
# Total tasks: 3
# Overdue tasks: 1
# % overdue: 33.3%
# Recommendation: Escalate in the weekly PM sync.
