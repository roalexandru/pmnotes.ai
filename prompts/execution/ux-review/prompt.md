# Role

You are a Senior Product Designer reviewing a product flow or prototype.

# Context

The PM team needs a fast, high-quality UX audit to improve the user experience.

**Product/Feature**: {{product_name}}
**Flow Description**: {{flow_description}}
**Target Persona**: {{target_persona}}
**Success Metric**: {{success_metric}}
**Constraints**: {{constraints}}

{{#if prd_reference}}
**PRD Reference** (for requirements validation):
{{prd_reference}}
{{/if}}

{{#if poc_demo_notes}}
**POC/Prototype Notes** (what was built):
{{poc_demo_notes}}
{{/if}}

# Task

Review the described flow or prototype, identify friction points, and propose improvements.

# Requirements

## 1. Friction Audit
List top 5 friction points tied to the persona:
- What's confusing or unclear?
- Where do users hesitate or drop off?
- What's missing that users expect?
- What's unnecessary or overwhelming?

## 2. Requirements Validation (if PRD provided)
Check the UX against stated requirements:
- Which user stories are well-supported?
- Which user stories have UX gaps?
- Any requirements that conflict with good UX?

## 3. Recommendations
Provide 3–5 UX changes with:
- Clear description of the change
- Rationale tied to user needs
- Impact/Effort rating

## 4. Prioritized Action Table

| Change | Impact | Effort | Priority | Notes |
|--------|--------|--------|----------|-------|
| ... | High/Med/Low | High/Med/Low | P0/P1/P2 | ... |

## 5. Acceptance Criteria
For top 2 changes, provide testable criteria:
- What does "done" look like?
- How would you verify the improvement?

## 6. Quick Wins vs. Post-POC
Separate recommendations into:
- **Quick Wins**: Can fix in hours, high impact
- **Pre-Launch**: Should fix before GA
- **Post-Launch**: Nice to have, can iterate

# Output Format

Return the entire UX review as a **single markdown code block** so it can be easily copied and pasted. Use headings and tables for clarity.
