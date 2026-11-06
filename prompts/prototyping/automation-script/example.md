### `reminders.py`

```python
from __future__ import annotations

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

TIMEZONE = "America/Los_Angeles"
LEAD_TIME_HOURS = 24

# Sample Data (due dates relative to now so the demo always produces output;
# replace with ISO strings like "2026-11-20T17:00:00" from your real task source)
_now = datetime.now(ZoneInfo(TIMEZONE)).replace(second=0, microsecond=0)
TASKS = [
    {"task_name": "Submit Q4 report", "due_date": (_now + timedelta(hours=6)).isoformat(), "owner": "Ava"},
    {"task_name": "Renew SSL certificate", "due_date": (_now + timedelta(hours=72)).isoformat(), "owner": "Jules"},
    {"task_name": "Prepare weekly demo", "due_date": (_now + timedelta(hours=20)).isoformat(), "owner": "Riley"},
]


def parse_due_date(raw_date: str, tz: ZoneInfo) -> datetime:
    parsed = datetime.fromisoformat(raw_date)
    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=tz)
    return parsed.astimezone(tz)


def send_reminder(task: dict, due_at: datetime) -> None:
    # Placeholder for email/Slack integration
    print(f"[REMINDER] {task['task_name']} (Owner: {task['owner']}) is due at {due_at:%Y-%m-%d %H:%M %Z}")


def check_due_soon(tasks: list[dict], lead_hours: int, timezone: str) -> int:
    tz = ZoneInfo(timezone)
    now = datetime.now(tz)
    window_end = now + timedelta(hours=lead_hours)

    reminders_sent = 0
    for task in tasks:
        due_at = parse_due_date(task["due_date"], tz)
        if now <= due_at <= window_end:
            send_reminder(task, due_at)
            reminders_sent += 1

    print(f"\nTotal reminders sent: {reminders_sent}")
    return reminders_sent


if __name__ == "__main__":
    check_due_soon(TASKS, LEAD_TIME_HOURS, TIMEZONE)
```
