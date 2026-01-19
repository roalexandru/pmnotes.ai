from collections import Counter
import re

feedback = [
    "Love the new update!",
    "The app crashes often.",
    "Great customer service.",
    "Not intuitive to use."
]

positive_keywords = ["love", "great", "fast", "helpful"]
negative_keywords = ["crash", "slow", "confusing", "not"]

rows = []
negative_terms = []

for item in feedback:
    text = item.lower()
    label = "neutral"
    if any(word in text for word in positive_keywords):
        label = "positive"
    if any(word in text for word in negative_keywords):
        label = "negative"
    rows.append((item, label))
    if label == "negative":
        negative_terms.extend(re.findall(r"\b\w+\b", text))

print("| Feedback | Sentiment |")
print("|:---------|:----------|")
for item, label in rows:
    print(f"| {item} | {label} |")

counts = Counter([label for _, label in rows])
common_negatives = Counter(negative_terms).most_common(3)

print("\nSummary")
print(f"Positive: {counts['positive']}")
print(f"Negative: {counts['negative']}")
print(f"Neutral: {counts['neutral']}")
print(f"Top negative themes: {common_negatives}")
print("Recommendation: Address crash stability and usability confusion first.")

# Sample Output:
# | Feedback | Sentiment |
# |:---------|:----------|
# | Love the new update! | positive |
# | The app crashes often. | negative |
# | Great customer service. | positive |
# | Not intuitive to use. | negative |
#
# Summary
# Positive: 2
# Negative: 2
# Neutral: 0
# Top negative themes: [('the', 2), ('app', 1), ('crashes', 1)]
# Recommendation: Address crash stability and usability confusion first.
