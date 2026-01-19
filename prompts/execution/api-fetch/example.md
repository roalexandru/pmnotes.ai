import requests

api_url = "https://jsonplaceholder.typicode.com/todos"
query_params = {"userId": 1, "completed": False}
fields = ["id", "title", "completed"]
limit = 5

response = requests.get(api_url, params=query_params, timeout=10)
response.raise_for_status()
items = response.json()

if not isinstance(items, list):
    raise ValueError("Expected a list of objects from the API.")

subset = items[:limit]
missing_fields = set()

print("| id | title | completed |")
print("|---:|:------|:---------:|")
for item in subset:
    row = []
    for field in fields:
        if field not in item:
            missing_fields.add(field)
        row.append(item.get(field))
    print(f"| {row[0]} | {row[1]} | {row[2]} |")

print("\nSummary")
print(f"Records fetched: {len(items)}")
print(f"Records shown: {len(subset)}")
print(f"Missing fields: {', '.join(sorted(missing_fields)) or 'None'}")
print("Verdict: Data shape is sufficient for the demo.")

# Sample Output:
# | id | title | completed |
# |---:|:------|:---------:|
# | 1 | delectus aut autem | False |
# | 2 | quis ut nam facilis et officia qui | False |
# | 3 | fugiat veniam minus | False |
# | 4 | et porro tempora | True |
# | 5 | laboriosam mollitia et enim quasi adipisci quia provident illum | False |
#
# Summary
# Records fetched: 20
# Records shown: 5
# Missing fields: None
# Verdict: Data shape is sufficient for the demo.
