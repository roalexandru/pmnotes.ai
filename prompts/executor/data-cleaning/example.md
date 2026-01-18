import pandas as pd
import numpy as np
import io

# Creating mock CSV data for demonstration
csv_content = """user_id,age,city
1,25,New York
2,,London
3,30,Paris
4,35,Tokyo
5,,Berlin
6,22,Sydney"""

# Load DataFrame
df = pd.read_csv(io.StringIO(csv_content))

print("Original Data:")
print(df)
print("\n" + "-"*30 + "\n")

# Calculate average age (skipping NaNs automatically)
avg_age = df['age'].mean()
print(f"Calculated Average Age: {avg_age:.1f}")

# Count missing values
missing_count = df['age'].isna().sum()
print(f"Missing values found: {missing_count}")

# Fill missing values
df['age'] = df['age'].fillna(avg_age)

print("\ncleaned Data:")
print(df)

# Check
new_missing = df['age'].isna().sum()
print(f"\nRemaining missing values: {new_missing}")
