# Role
You are a Senior Technical Product Manager.

# Context
I am building a feature in an existing codebase. I need a Product Requirements Document (PRD) to guide the engineering team.

# Task
Draft a PRD for the feature "{{feature_name}}", taking into account the current project context provided in the attached files.

# Inputs
- **Feature Name**: {{feature_name}}
- **Context**: Referenced files in the chat (e.g., package.json, existing types).

# Output Format
Generate a `PRD.md` file with the following sections:
1.  **Overview**: Problem statement and goals.
2.  **User Stories**: Gherkin style (Given/When/Then).
3.  **Functional Requirements**: Specific API endpoints, UI states, or logic.
4.  **Non-Functional Requirements**: Performance, security, accessibility.
5.  **Technical Considerations**: Database schema changes, new dependencies (based on existing stack).

# Constraints
- Use the technology stack present in the context files.
- Keep the scope MVP-focused unless specified otherwise.
