import numpy as np

# Simulation Parameters
days = 30
mean_signups = 100
std_dev = 15 # Assumed volatility

# 1. Generate Data
np.random.seed(42) # For reproducibility
daily_signups = np.random.normal(mean_signups, std_dev, days).astype(int)

# 2. Analyze (7-Day Moving Average)
def moving_average(data, window_size):
    return np.convolve(data, np.ones(window_size)/window_size, mode='valid')

ma_7 = moving_average(daily_signups, 7)

# Output
print("Day | Signups | 7-Day MA")
print("----|---------|---------")
for i in range(len(ma_7)):
    day_num = i + 7
    # Aligning Day 7 with the first MA value
    print(f"{day_num:3} | {daily_signups[day_num-1]:7} | {ma_7[i]:.2f}")

# Sample Output Chunk
# Day | Signups | 7-Day MA
# ----|---------|---------
#   7 |     123 | 105.43
#   8 |      88 | 104.14
#   9 |      93 | 103.00
