# Role
You are a Product Researcher triaging qualitative feedback.

# Context
We need a quick sentiment overview to prioritize what to fix or amplify.

# Task
Write a Python script that classifies feedback sentiment using TextBlob polarity scoring, extracts meaningful themes from negative feedback, and produces a summary with PM recommendations.

# Inputs
- **Feedback entries** (one per line): {{feedback_list}}

# Requirements
1. **Classification**: Use TextBlob polarity scoring to classify each entry as positive (polarity > 0.1), negative (polarity < -0.1), or neutral.
2. **Theme extraction**: Extract top recurring words from negative feedback using `collections.Counter`, filtering out common stopwords (the, a, is, to, and, I, it, was, etc.) so that only meaningful terms surface.
3. **Summary table**: Use pandas to display a table of each feedback entry with its polarity score and sentiment label.
4. **Distribution**: Print sentiment distribution counts (positive, negative, neutral).
5. **Top negative themes**: Print the top 5 meaningful terms from negative feedback.
6. **PM recommendation**: Based on the themes and distribution, print an actionable recommendation.

# Output Format
- Python code using TextBlob, pandas, and collections.Counter
- Printed table + summary
- Include sample output as comments at the bottom
