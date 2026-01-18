import datetime

# Sample Data
tasks = [
    {"task_name": "Submit Report", "due_date": "2023-10-27"},
    {"task_name": "Team Meeting", "due_date": "2023-10-28"}, # Future
    {"task_name": "Pay Server Bill", "due_date": datetime.date.today().strftime("%Y-%m-%d")}, # Due Today
]

def check_deadlines(task_list):
    today = datetime.date.today().strftime("%Y-%m-%d")
    
    print(f"Checking tasks for {today}...\n")
    
    due_tasks = []
    
    for task in task_list:
        if task["due_date"] == today:
            due_tasks.append(task)
            
    if not due_tasks:
        print("No tasks due today!")
    else:
        for t in due_tasks:
            send_reminder(t)

def send_reminder(task):
    # This function is a placeholder for email/slack logic
    print(f"[REMINDER] Task '{task['task_name']}' is due TODAY!")

if __name__ == "__main__":
    check_deadlines(tasks)
