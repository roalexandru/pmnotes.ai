# Role
You are a Product Analyst simulating growth scenarios.

# Context
We need a quick way to model daily sign-up volatility and communicate trends.

# Task
Simulate daily sign-ups and compute a moving average trend line.

# Inputs
- **Days**: {{days}}
- **Daily mean sign-ups**: {{daily_mean}}
- **Daily standard deviation**: {{daily_stddev}}
- **Moving average window**: {{window_size}}

# Requirements
1. **Simulation**: Generate a daily series using a normal distribution with the provided mean/std dev.
2. **Trend**: Calculate a moving average with the given window size.
3. **Summary**: Print mean, min, max, and the latest moving average value.
4. **PM insight**: Briefly explain what the trend suggests about growth stability.

# Output Format
- Python code
- Printed summary lines
