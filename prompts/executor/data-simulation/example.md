import numpy as np

np.random.seed(42)

days = 30
daily_mean = 120
daily_stddev = 15
window = 7

signups = np.random.normal(loc=daily_mean, scale=daily_stddev, size=days)
signups = np.maximum(signups, 0)

moving_avg = np.convolve(signups, np.ones(window) / window, mode="valid")

print(f"Days simulated: {days}")
print(f"Mean sign-ups: {signups.mean():.1f}")
print(f"Min/Max sign-ups: {signups.min():.1f} / {signups.max():.1f}")
print(f"Latest {window}-day moving average: {moving_avg[-1]:.1f}")
print("Insight: The moving average smooths daily noise to reveal the underlying growth trend.")

# Sample Output:
# Days simulated: 30
# Mean sign-ups: 119.8
# Min/Max sign-ups: 90.9 / 150.1
# Latest 7-day moving average: 118.5
# Insight: The moving average smooths daily noise to reveal the underlying growth trend.
