# UX Flow Review: Signup → Import → First Dashboard

## Persona Lens
Ops manager with limited analytics experience needs fast clarity and minimal setup.

## Top Friction Points
1. Import step requires field mapping without defaults.
2. Long copy on signup form hides "Skip for now" option.
3. Dashboard builder asks for advanced metrics before showing a preview.
4. Error messages during import lack actionable fixes.
5. No progress feedback after upload.

## Recommendations
- Add auto-mapping with editable defaults to reduce setup time.
- Surface a “Start with template” CTA before advanced configuration.
- Add inline validation with example formats on import errors.
- Introduce a progress indicator with estimated time.

## Impact / Effort
| Change | Impact | Effort | Rationale |
|:--|:--:|:--:|:--|
| Auto-mapping defaults | High | Medium | Cuts time-to-value in half for non-technical users. |
| Template-first CTA | High | Low | Gets users to a preview faster. |
| Inline import validation | Medium | Medium | Reduces retries and support tickets. |
| Progress indicator | Medium | Low | Lowers drop-off during wait time. |

## Acceptance Criteria (Top 2)
1. Auto-mapping applies defaults for ≥80% of uploaded CSV fields and allows manual edits.
2. Template-first CTA appears on the first dashboard screen and leads to a preview within 2 clicks.

## Metric Mapping
These changes reduce time-to-first-dashboard, which should lift activation rate within 24 hours.
