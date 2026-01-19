from __future__ import annotations

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

# Sample Data
TASKS = [
    {"task_name": "Submit Q3 report", "due_date": "2024-11-21T17:00:00", "owner": "Ava"},
    {"task_name": "Renew SSL certificate", "due_date": "2024-11-23T09:00:00", "owner": "Jules"},
    {"task_name": "Prepare weekly demo", "due_date": "2024-11-22T10:30:00", "owner": "Riley"},
]

TIMEZONE = "America/Los_Angeles"
LEAD_TIME_HOURS = 24


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
