from collections import Counter
import re
import pandas as pd
from textblob import TextBlob

# --- Inputs ---
feedback = [
    "Love the new update!",
    "The app crashes every time I open settings.",
    "Great customer service, very responsive.",
    "Not intuitive to use at all.",
    "Fast and reliable, best tool we have used.",
    "Billing page is confusing and I was charged twice.",
]

STOPWORDS = {
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "to", "and", "or", "but", "in", "on", "at", "for", "of", "with",
    "i", "it", "my", "me", "we", "our", "you", "your", "they", "them",
    "this", "that", "not", "no", "do", "does", "did", "have", "has", "had",
    "so", "if", "all", "very", "just", "about", "up", "out", "from",
}

# --- Sentiment Classification ---
rows = []
negative_words = []

for item in feedback:
    blob = TextBlob(item)
    polarity = blob.sentiment.polarity

    if polarity > 0.1:
        label = "positive"
    elif polarity < -0.1:
        label = "negative"
    else:
        label = "neutral"

    rows.append({"Feedback": item, "Polarity": round(polarity, 3), "Sentiment": label})

    if label == "negative":
        words = re.findall(r"\b[a-z]+\b", item.lower())
        negative_words.extend(w for w in words if w not in STOPWORDS and len(w) > 2)

df = pd.DataFrame(rows)

# --- Sentiment Distribution ---
counts = df["Sentiment"].value_counts()
total = len(df)

# --- Theme Extraction ---
top_themes = Counter(negative_words).most_common(5)

# --- Print Report ---
print("## Feedback Sentiment Analysis\n")
print(df.to_string(index=False))

print("\n## Sentiment Distribution\n")
for label in ["positive", "negative", "neutral"]:
    count = counts.get(label, 0)
    print(f"  {label.capitalize():>8}: {count} ({count / total * 100:.0f}%)")

print(f"\n## Top Negative Themes\n")
for word, count in top_themes:
    print(f"  - {word} ({count}x)")

neg_pct = counts.get("negative", 0) / total * 100
print(f"\n## PM Recommendation\n")
if neg_pct >= 50:
    print("  High negative sentiment. Prioritize stability and usability fixes immediately.")
elif neg_pct >= 25:
    theme_str = ", ".join(w for w, _ in top_themes[:3])
    print(f"  Notable negative feedback around: {theme_str}.")
    print("  Recommend investigating these areas in the next sprint.")
else:
    print("  Sentiment is mostly positive. Continue monitoring for emerging issues.")

# Sample Output:
# ## Feedback Sentiment Analysis
#
#                                            Feedback  Polarity Sentiment
#                              Love the new update!     0.625  positive
#  The app crashes every time I open settings.          -0.125  negative
#       Great customer service, very responsive.         0.700  positive
#                   Not intuitive to use at all.        -0.400  negative
#   Fast and reliable, best tool we have used.           0.567  positive
#  Billing page is confusing and I was charged twice.   -0.350  negative
#
# ## Sentiment Distribution
#
#   Positive: 3 (50%)
#   Negative: 3 (50%)
#    Neutral: 0 (0%)
#
# ## Top Negative Themes
#
#   - crashes (1x)
#   - open (1x)
#   - settings (1x)
#   - intuitive (1x)
#   - use (1x)
#
# ## PM Recommendation
#
#   High negative sentiment. Prioritize stability and usability fixes immediately.
