```python
import pandas as pd
from scipy import stats

# --- Inputs ---
metric_name = "Daily Active Users (DAU)"
baseline_mean = 11210
baseline_stddev = 620
observed_value = 10170
recent_changes = [
    "Deployed v2.3.1 Friday evening (auth flow update)",
    "Marketing email campaign paused last week",
    "US holiday on Monday",
]
segments_raw = "mobile_web:700:1000,desktop:3200:3200,us_users:2500:3330,eu_users:1800:1800,free_tier:4000:5500,paid_tier:6170:6170"

# --- Z-Score & Statistical Significance ---
z_score = (observed_value - baseline_mean) / baseline_stddev
p_value = 2 * stats.norm.sf(abs(z_score))

abs_z = abs(z_score)
if abs_z < 1:
    severity = "Normal (within 1σ)"
    severity_action = "No action"
elif abs_z < 2:
    severity = "Elevated (1–2σ)"
    severity_action = "Monitor"
elif abs_z < 3:
    severity = "High (2–3σ)"
    severity_action = "Investigate"
else:
    severity = "Critical (>3σ)"
    severity_action = "Escalate"

# --- Segment Analysis ---
segments = []
for seg in segments_raw.split(","):
    name, obs, base = seg.split(":")
    obs, base = float(obs), float(base)
    deviation_pct = ((obs - base) / base * 100) if base else 0
    status = "Flat" if abs(deviation_pct) < 5 else ("Down" if deviation_pct < 0 else "Up")
    segments.append({
        "Segment": " ".join(w.upper() if w in {"us", "eu"} else w.title() for w in name.split("_")),
        "Observed": int(obs),
        "Baseline": int(base),
        "Deviation": f"{deviation_pct:+.1f}%",
        "Status": status,
    })

df_segments = pd.DataFrame(segments)

driving = [s for s in segments if s["Status"] == "Down"]
unaffected = [s for s in segments if s["Status"] == "Flat"]

# --- Cause Ranking ---
# Causes are ranked qualitatively from the recent_changes input.
# In practice, Claude generates these rankings; hardcoded here for illustration.
cause_ranking = [
    {
        "rank": 1,
        "cause": "US holiday (Monday)",
        "fit": "Strong",
        "rationale": (
            "The drop is concentrated in US, free-tier, and mobile-web users. "
            "A US holiday would explain why paid and EU users are flat."
        ),
    },
    {
        "rank": 2,
        "cause": "Auth flow deployment (v2.3.1, Friday)",
        "fit": "Moderate",
        "rationale": (
            "Timing aligns (deployed Friday, drop Monday). Mobile web disproportionately "
            "affected could indicate responsive regression. But paid users share the same "
            "auth flow and are flat — weakens this hypothesis."
        ),
    },
    {
        "rank": 3,
        "cause": "Marketing email campaign paused",
        "fit": "Weak",
        "rationale": (
            "Email drives re-engagement for lapsed users, but effect is gradual (days), "
            "not a sudden single-day drop."
        ),
    },
]

# --- Verdict ---
# The action starts from the z-score band. A concentrated segment pattern
# (some segments down, others flat) raises the action by one band, as the prompt allows.
segment_pattern = len(driving) > 0 and len(unaffected) > 0
bands = ["No action", "Monitor", "Investigate", "Escalate"]
action_level = bands.index(severity_action)
raised = False
if segment_pattern and action_level < len(bands) - 1 and abs_z >= 1:
    action_level += 1
    raised = True
final_action = bands[action_level]

if abs_z >= 2:
    verdict = f"Likely Signal — {final_action}"
elif abs_z < 1 and not segment_pattern:
    verdict = f"Likely Noise — {final_action}"
else:
    verdict = f"Inconclusive — {final_action}"

# --- Recommended Action ---
if final_action == "Escalate":
    action = "Escalate to the on-call engineering lead and the metric owner now."
elif final_action == "Investigate":
    action = (
        "Investigate (2 hours):\n"
        "  1. Pull mobile-web auth error logs since Friday's deployment.\n"
        "  2. Compare today's drop against last 3 US holidays.\n"
        f"  3. Re-check tomorrow — if DAU is back within 1σ of baseline "
        f"(≥ {baseline_mean - baseline_stddev:,}), treat it as holiday-driven."
    )
elif final_action == "Monitor":
    action = "Monitor — re-check in 24h."
else:
    action = "No action — the movement is within normal variation."

# --- Print Report ---
print(f"{'=' * 60}")
print(f"METRIC ANOMALY TRIAGE: {metric_name}")
print(f"{'=' * 60}")

print(f"\n## Severity Assessment\n")
print(f"  Observed:       {observed_value:,}")
print(f"  Expected (mean): {baseline_mean:,}")
print(f"  Std Dev:         {baseline_stddev:,}")
print(f"  Deviation:       {observed_value - baseline_mean:,} ({(observed_value - baseline_mean) / baseline_mean * 100:+.1f}%)")
print(f"  Z-Score:         {z_score:.2f}")
print(f"  P-Value:         {p_value:.4f}")
print(f"  Severity:        {severity}")

print(f"\n## Verdict: {verdict}\n")
if raised:
    print(f"  Action raised from {severity_action} to {final_action}: the drop is concentrated in specific segments.")
if segment_pattern:
    down_names = ", ".join(s["Segment"] for s in driving)
    flat_names = ", ".join(s["Segment"] for s in unaffected)
    print(f"  Affected segments: {down_names}")
    print(f"  Unaffected segments: {flat_names}")
    print(f"  A segment-concentrated pattern makes random noise less likely, but z < 2 is not conclusive.")

print(f"\n## Segment Analysis\n")
print(df_segments.to_string(index=False))

print(f"\n## Cause Ranking\n")
for c in cause_ranking:
    print(f"  {c['rank']}. {c['cause']} — {c['fit']} fit")
    print(f"     {c['rationale']}\n")

print(f"## Recommended Action\n")
print(f"  {action}")

print(f"\n## Leadership Talking Points\n")
print(f"  DAU dropped {(baseline_mean - observed_value) / baseline_mean * 100:.0f}% from expected baseline.")
print(f"  The drop is concentrated in US, free-tier, and mobile-web users (segments overlap).")
print(f"  Most likely explanation is the US holiday; we are also checking Friday's auth")
print(f"  deployment for mobile regressions. Definitive answer by tomorrow's standup.")
```

Sample output (from running the script above):

```text
============================================================
METRIC ANOMALY TRIAGE: Daily Active Users (DAU)
============================================================

## Severity Assessment

  Observed:       10,170
  Expected (mean): 11,210
  Std Dev:         620
  Deviation:       -1,040 (-9.3%)
  Z-Score:         -1.68
  P-Value:         0.0935
  Severity:        Elevated (1–2σ)

## Verdict: Inconclusive — Investigate

  Action raised from Monitor to Investigate: the drop is concentrated in specific segments.
  Affected segments: Mobile Web, US Users, Free Tier
  Unaffected segments: Desktop, EU Users, Paid Tier
  A segment-concentrated pattern makes random noise less likely, but z < 2 is not conclusive.

## Segment Analysis

     Segment  Observed  Baseline Deviation Status
  Mobile Web       700      1000    -30.0%   Down
     Desktop      3200      3200     +0.0%   Flat
    US Users      2500      3330    -24.9%   Down
    EU Users      1800      1800     +0.0%   Flat
   Free Tier      4000      5500    -27.3%   Down
   Paid Tier      6170      6170     +0.0%   Flat

## Cause Ranking

  1. US holiday (Monday) — Strong fit
     The drop is concentrated in US, free-tier, and mobile-web users. A US holiday would explain why paid and EU users are flat.

  2. Auth flow deployment (v2.3.1, Friday) — Moderate fit
     Timing aligns (deployed Friday, drop Monday). Mobile web disproportionately affected could indicate responsive regression. But paid users share the same auth flow and are flat — weakens this hypothesis.

  3. Marketing email campaign paused — Weak fit
     Email drives re-engagement for lapsed users, but effect is gradual (days), not a sudden single-day drop.

## Recommended Action

  Investigate (2 hours):
  1. Pull mobile-web auth error logs since Friday's deployment.
  2. Compare today's drop against last 3 US holidays.
  3. Re-check tomorrow — if DAU is back within 1σ of baseline (≥ 10,590), treat it as holiday-driven.

## Leadership Talking Points

  DAU dropped 9% from expected baseline.
  The drop is concentrated in US, free-tier, and mobile-web users (segments overlap).
  Most likely explanation is the US holiday; we are also checking Friday's auth
  deployment for mobile regressions. Definitive answer by tomorrow's standup.
```
