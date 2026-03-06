import re
from collections import defaultdict

# --- Inputs ---
version = "v1.2.0"
since_tag = "v1.1.0"
release_date = "2026-02-01"
git_log = """a1b2c3d feat(analytics): add cohort retention CSV export
d4e5f6a feat(growth): introduce onboarding checklist emails
7g8h9i0 fix(billing): handle promo code edge case for annual plans
j1k2l3m fix(reports): resolve timezone bug in scheduled reports
n4o5p6q chore(deps): upgrade dependencies for security patches
r7s8t9u refactor(pipeline): reduce data pipeline latency
v1w2x3y feat(dashboard): add churn risk widgets for PMs
z4a5b6c fix(billing): reduce retry count from 5 to 2"""

# --- Configuration ---
# Risk keywords checked against scope (not message body, to avoid false positives
# like "security patches" which are risk-reducing, not risk-introducing)
RISK_SCOPE_KEYWORDS = {"billing", "auth", "database", "migration", "payment"}
# Message-level keywords that always indicate risk regardless of context
RISK_MESSAGE_KEYWORDS = {"drop table", "force push", "rm -rf", "breaking change"}
COMMIT_PATTERN = re.compile(
    r"^(?P<hash>[a-z0-9]+)\s+"
    r"(?P<type>feat|fix|chore|refactor|docs|test|ci)"
    r"(?:\((?P<scope>[^)]+)\))?:\s+"
    r"(?P<message>.+)$"
)

# --- Parse Commits ---
categories = defaultdict(list)
risk_items = []

for line in git_log.strip().splitlines():
    match = COMMIT_PATTERN.match(line.strip())
    if not match:
        categories["other"].append({"hash": "?", "scope": "", "message": line.strip()})
        continue

    commit = match.groupdict()
    commit_type = commit["type"]
    scope = commit["scope"] or ""
    message = commit["message"]
    short_hash = commit["hash"]

    entry = {"hash": short_hash, "scope": scope, "message": message}

    if commit_type == "feat":
        categories["features"].append(entry)
    elif commit_type == "fix":
        categories["fixes"].append(entry)
    else:
        categories["chores"].append(entry)

    # Check scope against risk keywords; check message for high-severity patterns
    scope_lower = scope.lower()
    message_lower = message.lower()
    if any(kw in scope_lower for kw in RISK_SCOPE_KEYWORDS) or \
       any(kw in message_lower for kw in RISK_MESSAGE_KEYWORDS):
        risk_items.append({"type": commit_type, "scope": scope, "message": message})

# --- Generate Release Notes ---
print(f"# Release {version} ({release_date})")
print(f"\nCompare: `{since_tag}...{version}`")

# Highlights (first 2 features)
if categories["features"]:
    print("\n## Highlights")
    for feat in categories["features"][:2]:
        scope_prefix = f"{feat['scope'].title()}: " if feat["scope"] else ""
        msg = feat['message']
        print(f"- {scope_prefix}{msg[0].upper() + msg[1:]}")

# Features
if categories["features"]:
    print("\n## Features")
    for feat in categories["features"]:
        scope_prefix = f"**{feat['scope']}**: " if feat["scope"] else ""
        print(f"- {scope_prefix}{feat['message']} (`{feat['hash']}`)")

# Fixes
if categories["fixes"]:
    print("\n## Fixes")
    for fix in categories["fixes"]:
        scope_prefix = f"**{fix['scope']}**: " if fix["scope"] else ""
        print(f"- {scope_prefix}{fix['message']} (`{fix['hash']}`)")

# Chores
if categories["chores"]:
    print("\n## Chores & Refactors")
    for chore in categories["chores"]:
        scope_prefix = f"**{chore['scope']}**: " if chore["scope"] else ""
        print(f"- {scope_prefix}{chore['message']} (`{chore['hash']}`)")

# Risk Review
print("\n## Risk Review")
if risk_items:
    for item in risk_items:
        scope_label = f"[{item['scope']}]" if item["scope"] else ""
        print(f"- ⚠️  {scope_label} {item['message']}")
else:
    print("- No high-risk changes detected.")

# Checklist
print("\n## Release Checklist")
print("- [ ] Tests run (unit + integration)")
print("- [ ] DB migrations applied (if any)")
print("- [ ] Documentation updated")
print("- [ ] Version bumped in target files")
print("- [ ] Changelog updated")
print("- [ ] Stakeholders notified")

# Version Bump Targets
print("\n## Version Bump Targets")
for f in ["package.json", "CHANGELOG.md", "pyproject.toml"]:
    print(f"- `{f}`")

# Stats
total = sum(len(v) for v in categories.values())
print(f"\n---")
print(f"**Stats**: {total} commits — "
      f"{len(categories['features'])} features, "
      f"{len(categories['fixes'])} fixes, "
      f"{len(categories['chores'])} chores, "
      f"{len(risk_items)} flagged for risk review")

# Sample Output:
# # Release v1.2.0 (2026-02-01)
#
# Compare: `v1.1.0...v1.2.0`
#
# ## Highlights
# - Analytics: Add cohort retention CSV export
# - Growth: Introduce onboarding checklist emails
#
# ## Features
# - **analytics**: add cohort retention CSV export (`a1b2c3d`)
# - **growth**: introduce onboarding checklist emails (`d4e5f6a`)
# - **dashboard**: add churn risk widgets for PMs (`v1w2x3y`)
#
# ## Fixes
# - **billing**: handle promo code edge case for annual plans (`7g8h9i0`)
# - **reports**: resolve timezone bug in scheduled reports (`j1k2l3m`)
# - **billing**: reduce retry count from 5 to 2 (`z4a5b6c`)
#
# ## Chores & Refactors
# - **deps**: upgrade dependencies for security patches (`n4o5p6q`)
# - **pipeline**: reduce data pipeline latency (`r7s8t9u`)
#
# ## Risk Review
# - ⚠️  [billing] handle promo code edge case for annual plans
# - ⚠️  [billing] reduce retry count from 5 to 2
#
# ## Release Checklist
# - [ ] Tests run (unit + integration)
# - [ ] DB migrations applied (if any)
# - [ ] Documentation updated
# - [ ] Version bumped in target files
# - [ ] Changelog updated
# - [ ] Stakeholders notified
#
# ## Version Bump Targets
# - `package.json`
# - `CHANGELOG.md`
# - `pyproject.toml`
#
# ---
# **Stats**: 8 commits — 3 features, 3 fixes, 2 chores, 2 flagged for risk review
