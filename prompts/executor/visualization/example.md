import matplotlib.pyplot as plt

# Data
months = ['Jan', 'Feb', 'Mar']
sales = [100, 150, 130]

# Create Bar Chart
plt.figure(figsize=(8, 5))
plt.bar(months, sales, color=['#3498db', '#e74c3c', '#2ecc71'])

# Styling
plt.title('Q1 Sales Performance')
plt.xlabel('Month')
plt.ylabel('Sales ($k)')
plt.grid(axis='y', linestyle='--', alpha=0.7)

# Show value on top of bars
for i, v in enumerate(sales):
    plt.text(i, v + 2, str(v), ha='center', fontweight='bold')

# Show
plt.show()

# (Note: In a real code interpreter environment, this would display the image)
print("Chart generated successfully.")
