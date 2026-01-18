import datetime

# Mock Task Data
tasks = [
    {"id": 1, "title": "Buy Groceries", "due": "2023-10-25"},
    {"id": 2, "title": "Submit Tax Return", "due": datetime.date.today().strftime("%Y-%m-%d")}, # Due Today
    {"id": 3, "title": "Call Mom", "due": datetime.date.today().strftime("%Y-%m-%d")},      # Due Today
    {"id": 4, "title": "Renew Passport", "due": "2024-01-01"}
]

def run_automation():
    today = datetime.date.today().strftime("%Y-%m-%d")
    print(f"Automation Run: {datetime.datetime.now()}")
    print(f"Checking for tasks due on: {today}...\n")
    
    count = 0
    for task in tasks:
        if task["due"] == today:
            print(f"[URGENT] Task '{task['title']}' is due today!")
            count += 1
            
    if count == 0:
        print("No tasks due today. Relax!")
    else:
        print(f"\nFound {count} tasks.")

if __name__ == "__main__":
    run_automation()
