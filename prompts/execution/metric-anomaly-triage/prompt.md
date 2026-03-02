# Role
You are a Product Analyst helping a Product Manager triage a metric anomaly that was flagged in the last 24 hours.

# Context
A key metric has moved unexpectedly. The PM needs to quickly determine whether this requires action, further investigation, or can be attributed to a known cause. Speed matters — leadership will ask about this in standup.

# Task
Write a Python script that computes the z-score, evaluates statistical significance, runs segment-level analysis, and outputs a formatted triage report with a clear verdict and recommended actions.

# Inputs
- **Metric**: {{metric_name}}
- **Baseline mean**: {{baseline_mean}}
- **Baseline std dev**: {{baseline_stddev}}
- **Observed value**: {{observed_value}}
- **Recent changes or events**: {{recent_changes}}
- **Segment breakdown**: {{segments_data}}

# Requirements
1. **Z-score computation**: Use `scipy.stats` to compute the z-score and two-tailed p-value from the baseline mean and standard deviation.
2. **Severity classification**: Classify severity using standard thresholds — within 1σ (normal), 1–2σ (monitor), 2–3σ (investigate), >3σ (escalate).
3. **Segment analysis**: Parse the segment data, compute per-segment deviation as a percentage, and display a pandas DataFrame showing which segments are driving the anomaly vs. unaffected.
4. **Signal vs. noise verdict**: State a clear verdict — likely signal, likely noise, or inconclusive — based on the z-score and segment pattern.
5. **Cause ranking**: Rank the most likely explanations from the recent changes input, with a fit assessment for each (strong/moderate/weak) based on segment and timing patterns.
6. **Recommended action**: Output one of: (a) monitor — check again in 24h, (b) investigate — specify what data to pull, (c) escalate — specify to whom, or (d) no action — explain why expected.
7. **Leadership talking points**: Print 2–3 sentences the PM can use to brief leadership.

# Output Format
- Python code using scipy and pandas
- Script prints a formatted triage report with all sections above
- Include sample output as comments at the bottom
