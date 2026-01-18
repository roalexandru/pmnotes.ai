import csv
from collections import Counter

def analyze_issues(file_path):
    issue_counts = Counter()

    try:
        with open(file_path, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            
            # Check if required column exists
            if 'issue_type' not in reader.fieldnames:
                print("Error: Column 'issue_type' not found in CSV.")
                return

            for row in reader:
                issue_type = row.get('issue_type')
                if issue_type:
                    issue_counts[issue_type] += 1
        
        # Print results
        print("Top 3 Issue Types:")
        print("-" * 20)
        for issue, count in issue_counts.most_common(3):
            print(f"{issue}: {count}")

    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Usage Example
# Assuming a file named 'tickets.csv' exists in the directory
# analyze_issues('tickets.csv')
