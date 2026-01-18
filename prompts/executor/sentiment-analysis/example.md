feedback = [
    'Love the new update!', 
    'The app crashes often.', 
    'Great customer service.', 
    'Not intuitive to use.'
]

pos_keywords = ['love', 'great', 'awesome', 'good']
neg_keywords = ['crashes', 'not', 'bad', 'slow']

positive_count = 0
negative_count = 0

print("Analyzing feedback...")

for comment in feedback:
    lower_comment = comment.lower()
    
    # Check positive
    if any(word in lower_comment for word in pos_keywords):
        positive_count += 1
        print(f"[:] Positive: '{comment}'")
        
    # Check negative
    elif any(word in lower_comment for word in neg_keywords):
        negative_count += 1
        print(f"[x] Negative: '{comment}'")
    
    else:
        print(f"[ ] Neutral:  '{comment}'")

print("-" * 20)
print(f"Total Positive: {positive_count}")
print(f"Total Negative: {negative_count}")
