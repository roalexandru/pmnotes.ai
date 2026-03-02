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
        "Segment": name.replace("_", " ").title(),
        "Observed": int(obs),
        "Baseline": int(base),
        "Deviation": f"{deviation_pct:+.1f}%",
        "Status": status,
    })

df_segments = pd.DataFrame(segments)

driving = [s for s in segments if s["Status"] == "Down"]
unaffected = [s for s in segments if s["Status"] == "Flat"]

# --- Cause Ranking ---
cause_ranking = [
    {
        "rank": 1,
        "cause": "US holiday (Presidents' Day)",
        "fit": "Strong",
        "rationale": (
            "Free-tier, US, mobile-web users are the most casual segment. "
            "Holiday behavior explains why paid and EU users are unaffected."
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
            "not a sudden single-day drop. Email primarily drives desktop, which is flat."
        ),
    },
]

# --- Verdict ---
segment_pattern = len(driving) > 0 and len(unaffected) > 0
if abs_z >= 2 or (abs_z >= 1.5 and segment_pattern):
    verdict = "Likely Signal — Investigate"
elif abs_z < 1:
    verdict = "Likely Noise — Monitor"
else:
    verdict = "Borderline — Investigate to Confirm"

# --- Recommended Action ---
if "Investigate" in verdict or "Signal" in verdict:
    action = (
        "Investigate (2 hours):\n"
        "  1. Pull mobile-web auth error logs since Friday's deployment.\n"
        "  2. Compare today's drop against last 3 US holidays.\n"
        "  3. Re-check tomorrow — if Tuesday DAU recovers to 11,800+, confirm holiday-driven."
    )
elif "Noise" in verdict:
    action = "Monitor — re-check in 24h. No escalation needed."
else:
    action = "Monitor closely — re-assess with tomorrow's data."

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
if segment_pattern:
    down_names = ", ".join(s["Segment"] for s in driving)
    flat_names = ", ".join(s["Segment"] for s in unaffected)
    print(f"  Affected segments: {down_names}")
    print(f"  Unaffected segments: {flat_names}")
    print(f"  Segment-specific pattern rules out random noise.")

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
print(f"  The drop is isolated to US free-tier users on mobile — our most casual segment.")
print(f"  Most likely explanation is the US holiday; we are also checking Friday's auth")
print(f"  deployment for mobile regressions. Definitive answer by tomorrow's standup.")

# Sample Output:
# ============================================================
# METRIC ANOMALY TRIAGE: Daily Active Users (DAU)
# ============================================================
#
# ## Severity Assessment
#
#   Observed:       10,170
#   Expected (mean): 11,210
#   Std Dev:         620
#   Deviation:       -1,040 (-9.3%)
#   Z-Score:         -1.68
#   P-Value:         0.0934
#   Severity:        Elevated (1–2σ)
#
# ## Verdict: Likely Signal — Investigate
#
#   Affected segments: Mobile Web, Us Users, Free Tier
#   Unaffected segments: Desktop, Eu Users, Paid Tier
#   Segment-specific pattern rules out random noise.
#
# ## Segment Analysis
#
#      Segment  Observed  Baseline Deviation Status
#   Mobile Web       700      1000    -30.0%   Down
#      Desktop      3200      3200     +0.0%   Flat
#     Us Users      2500      3330    -24.9%   Down
#     Eu Users      1800      1800     +0.0%   Flat
#    Free Tier      4000      5500    -27.3%   Down
#    Paid Tier      6170      6170     +0.0%   Flat
#
# ## Cause Ranking
#
#   1. US holiday (Presidents' Day) — Strong fit
#      Free-tier, US, mobile-web users are the most casual segment. ...
#
#   2. Auth flow deployment (v2.3.1, Friday) — Moderate fit
#      Timing aligns (deployed Friday, drop Monday). ...
#
#   3. Marketing email campaign paused — Weak fit
#      Email drives re-engagement for lapsed users, but effect is gradual ...
#
# ## Recommended Action
#
#   Investigate (2 hours):
#     1. Pull mobile-web auth error logs since Friday's deployment.
#     2. Compare today's drop against last 3 US holidays.
#     3. Re-check tomorrow — if Tuesday DAU recovers to 11,800+, confirm holiday-driven.
#
# ## Leadership Talking Points
#
#   DAU dropped 9% from expected baseline.
#   The drop is isolated to US free-tier users on mobile — our most casual segment.
#   Most likely explanation is the US holiday; we are also checking Friday's auth
#   deployment for mobile regressions. Definitive answer by tomorrow's standup.
