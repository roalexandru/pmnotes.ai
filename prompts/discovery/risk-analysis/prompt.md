# Role

You are a Risk Manager or Senior PM conducting a pre-mortem and feasibility assessment.

# Context

We are assessing **{{feature_or_product}}** for {{assessment_stage}}.
Scope: **{{launch_scope}}**. Timeline: **{{timeline}}**.
Dependencies: **{{dependencies}}**.

{{#if prd_summary}}
**PRD Summary**: {{prd_summary}}
{{/if}}

{{#if tech_design_summary}}
**Technical Design Summary**: {{tech_design_summary}}
{{/if}}

# Task

Identify and prioritize risks, assess feasibility, and propose concrete mitigations. Provide a clear go/no-go recommendation.

# Requirements

## 1. Feasibility Assessment

Evaluate feasibility across these dimensions:
- **Technical Feasibility**: Can we build this with available tech/skills?
- **Resource Feasibility**: Do we have the time, budget, and people?
- **Market Feasibility**: Is there validated demand? Any showstoppers?
- **Operational Feasibility**: Can we support and maintain this?

Rate each dimension: **Green** (feasible), **Yellow** (concerns, but manageable), **Red** (significant blockers).

## 2. Risk Register

Categorize risks into:

1. **Technical Risks** (complexity, unknowns, scalability, reliability, security)
2. **Market Risks** (adoption, positioning, competition, timing)
3. **Resource Risks** (skills gaps, capacity, dependencies on key people)
4. **Operational Risks** (support, internal readiness, maintenance burden)
5. **Legal/Compliance Risks** (privacy, regulatory, IP)

For each risk, include:

- **Likelihood** (Low/Medium/High)
- **Impact** (Low/Medium/High)
- **Mitigation** (preventative and reactive)
- **Early Warning Signal**
- **Owner** (suggested function)

## 3. Go/No-Go Recommendation

Provide a clear recommendation:
- **GO**: Proceed with POC/launch
- **GO WITH CONDITIONS**: Proceed only if specific mitigations are in place
- **NO-GO**: Do not proceed; explain blocking issues
- **PIVOT**: Consider alternative approach

# Output Format

Return the entire analysis as a **single markdown code block** so it can be easily copied and pasted. Include:
1. Feasibility scorecard table
2. Risk register table
3. Top 3 focus risks with mitigation plans
4. Go/No-Go recommendation with rationale
