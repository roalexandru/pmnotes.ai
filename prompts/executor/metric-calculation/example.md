data = [120, 135, 150, 160, 155, 180, 200]

# Calculate Metrics
average = sum(data) / len(data)
data_sorted = sorted(data)
n = len(data)
if n % 2 == 1:
    median = data_sorted[n // 2]
else:
    median = (data_sorted[n // 2 - 1] + data_sorted[n // 2]) / 2
maximum = max(data)

# Output
print(f"Data: {data}")
print("-" * 20)
print(f"Average DAU: {average:.2f}")
print(f"Median  DAU: {median}")
print(f"Maximum DAU: {maximum}")

# Output Look
# Data: [120, 135, 150, 160, 155, 180, 200]
# --------------------
# Average DAU: 157.14
# Median  DAU: 155
# Maximum DAU: 200
