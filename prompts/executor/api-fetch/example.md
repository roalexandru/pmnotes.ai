import requests

url = "https://jsonplaceholder.typicode.com/todos"

try:
    print(f"Fetching data from {url}...")
    response = requests.get(url)
    response.raise_for_status() # Raise error for bad status codes
    
    todos = response.json()
    
    print("\nFirst 5 TODO Items:")
    print("=" * 30)
    
    for i, item in enumerate(todos[:5]):
        status = "[x]" if item['completed'] else "[ ]"
        print(f"{i+1}. {status} {item['title']}")
        
except requests.exceptions.RequestException as e:
    print(f"Error fetching data: {e}")

# Output Sample:
# First 5 TODO Items:
# ==============================
# 1. [ ] delectus aut autem
# 2. [ ] quis ut nam facilis et officia qui
# 3. [ ] fugiat veniam minus
# 4. [x] et porro tempora
# 5. [ ] laboriosam mollitia et enim quasi adipisci quia provident illum
