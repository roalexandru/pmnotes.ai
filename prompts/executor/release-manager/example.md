# Release Notes Package v1.2.0

## Status
**Release Date**: 2023-10-27
**Target Version**: v1.2.0
**Previous Version**: v1.1.5

## Changelog
*   **Feature**: Added Dark Mode support for the dashboard. (PR #452)
*   **Feature**: New "Export to CSV" button in the users table. (PR #448)
*   **Fix**: Resolved login session timeout issue on Safari. (PR #455)
*   **Perf**: Optimized image loading on the landing page (20% faster LCP). (PR #450)

## Automation Steps Taken
1.  bumped version in `package.json` to `1.2.0`.
2.  Generated `CHANGELOG.md` entry.
3.  Created git tag `v1.2.0`.

## Next Steps
*   Run `npm publish` (awaiting manual approval).
*   Deploy to Staging environment for smoke testing.
