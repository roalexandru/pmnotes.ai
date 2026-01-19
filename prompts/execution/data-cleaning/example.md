import pandas as pd

csv_path = "user_data.csv"
columns_to_fix = ["age", "country", "plan_tier"]

# Load data
df = pd.read_csv(csv_path)

print("Missing values (before):")
print(df[columns_to_fix].isna().sum())

# Clean numeric columns
if "age" in columns_to_fix:
    df["age"] = pd.to_numeric(df["age"], errors="coerce")
    df["age"] = df["age"].fillna(df["age"].median())

# Clean categorical columns
for col in ["country", "plan_tier"]:
    if col in columns_to_fix:
        df[col] = df[col].astype(str).str.strip()
        df[col] = df[col].replace({"nan": None})
        df[col] = df[col].fillna(df[col].mode()[0])

print("\nMissing values (after):")
print(df[columns_to_fix].isna().sum())

cleaned_path = csv_path.replace(".csv", "_cleaned.csv")
df.to_csv(cleaned_path, index=False)

print(f"\nSaved cleaned file to: {cleaned_path}")
print("\nCleaned preview:")
print(df.head())

# Sample Output:
# Missing values (before):
# age          12
# country       5
# plan_tier     8
# Missing values (after):
# age          0
# country      0
# plan_tier    0
# Saved cleaned file to: user_data_cleaned.csv
# Cleaned preview:
#    user_id   age country plan_tier
# 0        1  29.0      US      basic
